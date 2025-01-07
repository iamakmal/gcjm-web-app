import React from "react";
import Modal from "./Modal";

interface Props {
  isModalOpen: boolean;
  onClose: () => void;
}

const AddUser = ({ isModalOpen, onClose }: Props) => {
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New User">
      <p>Hello World</p>
    </Modal>
  );
};

export default AddUser;
