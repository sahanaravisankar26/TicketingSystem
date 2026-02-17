import React from "react";

interface ResolvedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const ResolvedModal = ({ isOpen, onClose, message }: ResolvedModalProps) => {
  if (!isOpen) return null;
  return (
    <>
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="false"
        className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/60"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-2xl">
          <div className="relative bg-neutral-primary-soft rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">
                Ticket Response
              </h3>
              <button
                type="button"
                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                data-modal-hide="static-modal"
                onClick={onClose}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="space-y-4 md:space-y-6 py-4 md:py-6">
              <p className="leading-relaxed text-body">
                <span className="font-bold">Admin Response: </span>
                {message}
              </p>
            </div>
            <div className="flex items-center space-x-4 pt-2 md:pt-3">
              <button
                type="button"
                onClick={onClose}
                className="text-red-700 bg-brand border hover:bg-red-200 rounded-2xl bg-red-100 shadow-xs text-sm px-4 py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResolvedModal;
