import React, { useState } from "react";
import { toast, Bounce } from "react-toastify";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onDeleteSuccess: () => void;
}

const DeleteModal = ({
  isOpen,
  onClose,
  id,
  onDeleteSuccess,
}: DeleteModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const endpoint = "http://localhost:8080/delete-support";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete the ticket");
      }
      onDeleteSuccess();
      onClose();
    } catch (err) {
      toast.error("Error on delete due to: " + err, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setIsDeleting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <>
      <div
        id="popup-modal"
        tabIndex={-1}
        className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/60"
      >
        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-2xl">
          <div className="relative bg-neutral-primary-soft rounded-base shadow-sm p-4 md:p-6">
            <button
              type="button"
              className="cursor-pointer absolute top-3 end-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
              data-modal-hide="popup-modal"
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
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-fg-disabled w-12 h-12"
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
                  d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-6 text-body">
                Are you sure you want to delete this ticket from your account?
              </h3>
              <div className="flex items-center space-x-4 justify-center">
                <button
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className={`text-white border shadow-xs font-medium rounded-2xl text-sm px-4 py-2.5 flex items-center transition-all ${
                    isDeleting
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }`}
                >
                  {isDeleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Yes, I'm sure"
                  )}
                </button>

                <button
                  disabled={isDeleting}
                  onClick={onClose}
                  className="text-body border shadow-xs font-medium rounded-2xl text-sm px-4 py-2.5 cursor-pointer hover:bg-gray-200 disabled:opacity-50"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
