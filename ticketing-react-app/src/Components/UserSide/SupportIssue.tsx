import React, { useState } from "react";
import { toast, Bounce } from "react-toastify";

const SupportIssue = ({ email }: { email: string }) => {
  const [issue, setIssue] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");

    const endpoint = "http://localhost:8080/submit-issue";

    try {
      const result = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          email,
          issue,
          description: details,
          message: "",
          state: "Pending...",
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        toast.error(data.error || "Something went wrong", {
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
        setIsSubmitting(false);
        return;
      }

      // Clear the form on success
      setIssue("");
      setDetails("");
      setSuccessMessage(data.message || "Issue submitted successfully!");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (err) {
      toast.error(
        "Failed to submit issue due to " + err + ". Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {successMessage && (
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-base">
          {successMessage}
        </div>
      )}
      <form
        className="max-w-sm mx-auto space-y-4 mt-8 border p-3 rounded-lg shadow-2xl flex flex-col justify-center"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-2xl font-bold text-heading md:text-3xl lg:text-5xl">
          Submit{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-red-800 to-red-500">
            Your Issue
          </span>{" "}
          Here
        </h3>

        <div>
          <label
            htmlFor="issue"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Issue
          </label>
          <input
            type="text"
            id="issue"
            className="bg-neutral-secondary-medium border border-default-medium outline-none focus:border-red-500 focus:border-2 text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
            placeholder="Enter your issue"
            required
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block mb-2.5 text-sm font-medium text-heading"
          >
            Explain your issues in detail
          </label>
          <textarea
            id="message"
            className="bg-neutral-secondary-medium border border-default-medium focus:border-2 text-heading focus:border-red-500 outline-none text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
            placeholder="Write your issues here..."
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            disabled={isSubmitting}
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-white bg-linear-to-r from-red-400 via-red-500 to-red-600 hover:bg-linear-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 rounded-2xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </>
  );
};

export default SupportIssue;
