import React, { useState } from "react";
import { toast, Bounce } from "react-toastify";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  issue: string;
  id: string | null;
  onResolveSuccess: () => void;
}

const AdminModal = ({
  isOpen,
  onClose,
  description,
  issue,
  id,
  onResolveSuccess,
}: AdminModalProps) => {
  const [state, setState] = useState("Pending..."); // state
  const [value, setValue] = useState(""); // message
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    const resolved = "Resolved";
    setState(resolved);
    try {
      const endpoint = "http://localhost:8080/admin-updates";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          message: value,
          state: resolved,
        }),
      });

      if (!res.ok) {
        setState("Pending...");
        throw new Error("Failed to update the ticket");
      }

      onResolveSuccess();
      onClose();
    } catch (err) {
      toast.error("Error in resolving the ticket due to: " + err, {
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
      setIsSubmitting(false);
    }
  };

  if (!isOpen || state === "Resolved") return null;

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
                Ticket Raised
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
                <span className="font-bold">User Issue: </span>
                {issue}
              </p>
              <p className="leading-relaxed text-body">
                <span className="font-bold">User Describes As: </span>
                {description}
              </p>
            </div>
            <div className="border-t border-default items-center space-x-4 pt-4 md:pt-5">
              <label
                htmlFor="message"
                className="block mb-2.5 text-sm font-bold text-heading"
              >
                Solution
              </label>
              <textarea
                id="message"
                className="bg-neutral-secondary-medium border border-default-medium focus:border-2 text-heading focus:border-red-500 outline-none text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
                placeholder="Write your solution here..."
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
            </div>
            <div className="flex items-center border-t border-default space-x-4 pt-4 md:pt-5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  onClose();
                  handleUpdate();
                }}
                className={`${!isSubmitting ? "text-green-700 bg-brand border hover:bg-green-200 rounded-2xl bg-green-100 shadow-xs text-sm px-4 py-2.5" : "cursor-not-allowed bg-gray-400 text-black rounded-2xl border font-medium text-sm px-4 py-2.5"}`}
              >
                {isSubmitting ? "Marking..." : "Mark as Resolved"}
              </button>
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

export default AdminModal;
