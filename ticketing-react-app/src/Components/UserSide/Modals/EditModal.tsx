import React, { useState } from "react";
import { toast } from "react-toastify";
import { DEFAULT_TOAST_OPTIONS } from "../../../Contants/toastConstant";
import { APIEndpoints } from "../../../Contants/routes";
import type { ModalProps } from "../../../Contants/interfaceConstants";
import { Methods } from "../../../Contants/constants";

const EditModal = ({
  isOpen,
  onClose,
  description,
  id,
  onUpdateSuccess,
}: ModalProps) => {
  const [value, setValue] = useState(description);
  const [isUpdating, setIsUpdating] = useState(false);

  const saveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const endpoint = APIEndpoints.UpdateTicketEndpoint;
      const res = await fetch(endpoint, {
        method: Methods.POST  ,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id,
          description: value,
        }),
      });

      if (!res.ok) {
        toast.error("Failed to update the ticket", DEFAULT_TOAST_OPTIONS);
        return;
      }
      onUpdateSuccess?.(value);
      onClose();
    } catch {
      toast.error("Error on updating", DEFAULT_TOAST_OPTIONS);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        id="crud-modal"
        tabIndex={-1}
        aria-hidden="false"
        className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/60"
      >
        <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-2xl">
          <div className="relative bg-neutral-primary-soft rounded-base shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">
                Edit your ticket
              </h3>
              <button
                type="button"
                className="cursor-pointer text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                data-modal-hide="crud-modal"
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
                <span className="sr-only" onClick={onClose}>
                  Close modal
                </span>
              </button>
            </div>

            <form onSubmit={saveChanges}>
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Edit Description
                  </label>
                  <textarea
                    id="description"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
                    placeholder="Edit your ticket description here"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className={`${isUpdating ? "cursor-not-allowed bg-gray-400 text-black rounded-2xl border font-medium text-sm px-4 py-2.5" : "inline-flex items-center rounded-2xl text-green-800 hover:bg-green-300 hover:font-bold border shadow-xs font-medium text-sm px-4 py-2.5"}`}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
                <button
                  data-modal-hide="crud-modal"
                  type="button"
                  onClick={onClose}
                  className="text-body cursor-pointer text-red-800 border hover:bg-red-300 hover:font-bold shadow-xs font-medium rounded-base text-sm px-4 py-2.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModal;
