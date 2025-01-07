import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: Props) => {
  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        {/* Modal Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">{title}</h3>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="py-4">{children}</div>

        {/* Modal Footer */}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
