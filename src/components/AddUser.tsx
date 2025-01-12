import React from "react";
import Modal from "./Modal";
import { useFormik } from "formik";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  uid: string;
  name: string;
  nic: string;
  contactNo1: string;
  contactNo2: string;
  subscription: string;
  address: string;
}

const AddUser = ({ isModalOpen, onClose }: Props) => {
  const handleCloseModal = () => {
    formik.resetForm();
    onClose();
  };

  // Initial form values
  const initialValues: FormValues = {
    uid: "",
    name: "",
    nic: "",
    contactNo1: "",
    contactNo2: "",
    subscription: "",
    address: "",
  };

  // Submit handler
  const onSubmit = (values: FormValues) => {
    console.log("Form Submitted", values);
    formik.resetForm(); // Reset the form after submission
    onClose(); // Close the modal after submission
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
    validate: (values) => {
      const errors: Partial<FormValues> = {};

      if (!values.uid) {
        errors.uid = "Reference No is required";
      }
      if (!values.name) {
        errors.name = "Name is required";
      }
      if (!values.nic) {
        errors.nic = "NIC is required";
      }
      if (!values.contactNo1) {
        errors.contactNo1 = "At least one contact number is required";
      }

      return errors;
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New User">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              name="referenceNo"
              placeholder="Reference No"
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
              name="nic"
              placeholder="NIC"
              className={`input input-bordered w-full ${
                errors.nic && touched.nic ? "input-error" : ""
              }`}
              onChange={handleChange}
              value={values.nic}
              onBlur={handleBlur}
            />
            {errors.nic && touched.nic && (
              <span className="text-error text-sm">{errors.nic}</span>
            )}
          </div>
          <div className="flex gap-5">
            <div>
              <input
                type="text"
                name="contactNo1"
                placeholder="Contact No 1"
                className={`input input-bordered w-full ${
                  errors.contactNo1 && touched.contactNo1 ? "input-error" : ""
                }`}
                onChange={handleChange}
                value={values.contactNo1}
                onBlur={handleBlur}
              />
              {errors.contactNo1 && touched.contactNo1 && (
                <span className="text-error text-sm">{errors.contactNo1}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                name="contactNo2"
                placeholder="Contact No 2"
                className="input input-bordered w-full"
                onChange={handleChange}
                value={values.contactNo2}
                onBlur={handleBlur}
              />
            </div>
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
  );
};

export default AddUser;
