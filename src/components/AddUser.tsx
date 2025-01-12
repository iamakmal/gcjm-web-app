import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { useFormik } from "formik";
import { useCreateUser } from "@/api/areaApi";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
  areaCode: string;
}

interface FormValues {
  uid: string;
  refNo: string;
  name: string;
  NIC: string;
  contactNo: string;
  subscription: string;
  address: string;
}

const AddUser = ({ isModalOpen, onClose, areaCode }: Props) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timeout = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toastMessage]);

  const showSuccessToast = () => setToastMessage("User Created Successfully!");
  const showErrorToast = () => setToastMessage("Oops, something went wrong!");

  const handleCloseModal = () => {
    formik.resetForm();
    onClose();
  };

  // Initial form values
  const initialValues: FormValues = {
    uid: "",
    refNo: "",
    name: "",
    NIC: "",
    contactNo: "",
    subscription: "",
    address: "",
  };

  const { mutate: createUser } = useCreateUser(
    showSuccessToast,
    showErrorToast
  );

  const onSubmit = (values: FormValues) => {
    createUser({
      ...values,
      areaCode: areaCode,
      areaId: areaCode,
    });
    formik.resetForm();
    onClose();
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      const errors: Partial<FormValues> = {};

      if (!values.refNo) {
        errors.refNo = "Reference No is required";
      }
      if (!values.uid) {
        errors.uid = "UID is required";
      }
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.NIC) {
        errors.NIC = "NIC is required";
      }
      if (!values.contactNo) {
        errors.contactNo = "Contact number is required";
      }

      return errors;
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <>
      {toastMessage && (
        <div className="toast toast-bottom toast-end">
          <div
            className={`text-white alert ${
              toastMessage.includes("Successfully")
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
        title="Add New User"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div>
              <input
                type="text"
                name="refNo"
                placeholder="Reference No"
                className={`input input-bordered w-full ${
                  errors.refNo && touched.refNo ? "input-error" : ""
                }`}
                onChange={handleChange}
                value={values.refNo}
                onBlur={handleBlur}
              />
              {errors.refNo && touched.refNo && (
                <span className="text-error text-sm">{errors.refNo}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                name="uid"
                placeholder="UID"
                className={`input input-bordered w-full ${
                  errors.uid && touched.uid ? "input-error" : ""
                }`}
                onChange={handleChange}
                value={values.uid}
                onBlur={handleBlur}
              />
              {errors.uid && touched.uid && (
                <span className="text-error text-sm">{errors.uid}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className={`input input-bordered w-full ${
                  errors.name && touched.name ? "input-error" : ""
                }`}
                onChange={handleChange}
                value={values.name}
                onBlur={handleBlur}
              />
              {errors.name && touched.name && (
                <span className="text-error text-sm">{errors.name}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                name="NIC"
                placeholder="NIC"
                className={`input input-bordered w-full ${
                  errors.NIC && touched.NIC ? "input-error" : ""
                }`}
                onChange={handleChange}
                value={values.NIC}
                onBlur={handleBlur}
              />
              {errors.NIC && touched.NIC && (
                <span className="text-error text-sm">{errors.NIC}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                name="contactNo"
                placeholder="Contact No"
                className={`input input-bordered w-full ${
                  errors.contactNo && touched.contactNo ? "input-error" : ""
                }`}
                onChange={handleChange}
                value={values.contactNo}
                onBlur={handleBlur}
              />
              {errors.contactNo && touched.contactNo && (
                <span className="text-error text-sm">{errors.contactNo}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                name="subscription"
                placeholder="Subscription"
                className="input input-bordered w-full"
                onChange={handleChange}
                value={values.subscription}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <textarea
                name="address"
                className="textarea textarea-bordered w-full"
                placeholder="Address"
                onChange={handleChange}
                value={values.address}
                onBlur={handleBlur}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn bg-main text-white mb-2"
              disabled={formik.isSubmitting}
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddUser;
