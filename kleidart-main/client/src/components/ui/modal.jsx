import React from "react";
import { createPortal } from "react-dom";

function Modal({ children, onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative bg-white rounded-lg shadow-lg lg:w-[80%] md:w-[85%] w-[90%] lg:h-auto min-h-[130px] max-w-md lg:p-4 md:p-4 p-4 text-sm md:text-base"
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        {/* Modal Content */}
        {children}
      </div>
    </div>,
    document.body // Render into the body element
  );
}

export default Modal;
