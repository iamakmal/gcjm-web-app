import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState, useMemo } from "react";
import Modal from "./Modal";
import { useAddPayment, useGetPaymentsOfUser, useSearchUserByIdOrRefNo } from "@/api/areaApi";
import Select from "react-select";
import { MONTHS, MonthOption, formatLocalDateTime, PAYMENT_STATUSES } from "@/utils/commonUtils";
import { PaymentType, UserType } from "@/types/types";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
}

const CentralizedPayment = ({ isModalOpen, onClose }: Props) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [paidAt, setPaidAt] = useState<string>(formatLocalDateTime(new Date()));
  const [status, setStatus] = useState<string>("completed");

  // Search user by ID or RefNo
  const { data: userData, isLoading: isUserLoading, error: userError } = 
    useSearchUserByIdOrRefNo(customerId);
  
  // Get payments for the user
  const { data: paymentData } = useGetPaymentsOfUser(userData?.uid || "");

  const { mutate: addPayment, isPending } = useAddPayment(
    () => {
      setToastMessage("Payment added successfully!");
      // Reset form
      setCustomerId("");
      setSelectedMonth("");
      setAmount(0);
      setPaidAt(formatLocalDateTime(new Date()));
      setTimeout(() => {
        setToastMessage(null);
      }, 2000);
    },
    () => {
      setToastMessage("Failed to add payment. Please try again.");
    }
  );

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  // Get non-paid months for selected year
  const nonPaidMonths = useMemo(() => {
    if (!paymentData || !selectedYear || !userData) return MONTHS;

    // Get all months that have been paid for the selected year
    const paidMonths = new Set<string>();
    paymentData.forEach((payment: PaymentType) => {
      if (payment.year === selectedYear) {
        payment.month.forEach((month) => paidMonths.add(month));
      }
    });

    // Return only months that haven't been paid
    return MONTHS.filter((month) => !paidMonths.has(month.value));
  }, [paymentData, selectedYear, userData]);

  const handleCloseModal = () => {
    setCustomerId("");
    setSelectedMonth("");
    setAmount(0);
    setPaidAt(formatLocalDateTime(new Date()));
    setStatus("completed");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      setToastMessage("Please enter customer ID");
      return;
    }

    if (!userData) {
      setToastMessage("Customer not found. Please check the ID.");
      return;
    }

    if (!selectedMonth) {
      setToastMessage("Please select a month");
      return;
    }

    if (!amount || amount <= 0) {
      setToastMessage("Please enter a valid amount");
      return;
    }

    // Check if month is already paid
    const isAlreadyPaid = paymentData?.some(
      (payment: PaymentType) =>
        payment.year === selectedYear &&
        payment.month.includes(selectedMonth)
    );

    if (isAlreadyPaid) {
      setToastMessage("This month is already paid. Please select a non-paid month.");
      return;
    }

    const payment: PaymentType = {
      userId: userData.uid,
      areaId: userData.areaCode,
      amount: amount,
      month: [selectedMonth],
      year: selectedYear,
      paidAt: Timestamp.fromDate(new Date(paidAt)),
      status: status,
    };

    addPayment(payment);
  };

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      {toastMessage && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`text-white alert ${
              toastMessage.includes("successfully")
                ? "alert-success"
                : "alert-error"
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Centralized Payment"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer ID Input */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Customer ID / Reference No</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter Customer ID or Ref No"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value.trim())}
              required
            />
            {isUserLoading && customerId && (
              <div className="flex items-center gap-2 mt-2">
                <span className="loading loading-spinner loading-sm"></span>
                <span className="text-sm text-gray-500">Searching customer...</span>
              </div>
            )}
            {userError && customerId && (
              <div className="alert alert-error mt-2 py-2">
                <span className="text-sm">Customer not found. Please check the ID.</span>
              </div>
            )}
            {userData && (
              <div className="alert alert-success mt-2 py-2">
                <div className="text-sm">
                  <p className="font-semibold">Customer Found:</p>
                  <p>Name: {userData.name}</p>
                  <p>Ref No: {userData.refNo} | Area: {userData.areaCode}</p>
                </div>
              </div>
            )}
          </div>

          {/* Year and Month Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Year</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value));
                  setSelectedMonth(""); // Reset month when year changes
                }}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Month (Non-paid only)</span>
              </label>
              <Select<MonthOption>
                options={nonPaidMonths}
                placeholder="Select Month"
                classNamePrefix="select"
                value={
                  selectedMonth
                    ? nonPaidMonths.find((m) => m.value === selectedMonth)
                    : null
                }
                onChange={(selected) => setSelectedMonth(selected?.value || "")}
                isDisabled={!userData || nonPaidMonths.length === 0}
              />
              {userData && nonPaidMonths.length === 0 && (
                <p className="text-sm text-warning mt-1">
                  All months for {selectedYear} are already paid
                </p>
              )}
              {userData && nonPaidMonths.length > 0 && (
                <p className="text-sm text-info mt-1">
                  {nonPaidMonths.length} month(s) available for payment
                </p>
              )}
            </div>
          </div>

          {/* Amount and Payment Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">Amount</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Enter Amount"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text font-semibold">Payment Date</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Status</span>
            </label>
            <Select
              options={PAYMENT_STATUSES}
              placeholder="Select Status"
              classNamePrefix="react-select"
              value={
                status
                  ? PAYMENT_STATUSES.find((opt) => opt.value === status)
                  : null
              }
              onChange={(selected) => setStatus(selected?.value || "")}
            />
          </div>

          {/* Payment Summary */}
          {userData && selectedMonth && amount > 0 && (
            <div className="card bg-base-200 p-4">
              <h3 className="font-semibold mb-2">Payment Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Customer:</span> {userData.name} ({userData.refNo})</p>
                <p><span className="font-medium">Period:</span> {MONTHS.find(m => m.value === selectedMonth)?.label} {selectedYear}</p>
                <p><span className="font-medium">Amount:</span> Rs. {amount.toLocaleString()}</p>
                <p><span className="font-medium">Status:</span> {PAYMENT_STATUSES.find(s => s.value === status)?.label}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={handleCloseModal}
              className="btn btn-ghost w-full sm:w-auto"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={isPending || !userData || !selectedMonth || amount <= 0}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : (
                "Submit Payment"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CentralizedPayment;

