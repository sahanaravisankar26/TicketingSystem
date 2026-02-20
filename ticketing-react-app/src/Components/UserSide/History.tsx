import React, { useEffect, useState } from "react";
import EditModal from "./Modals/EditModal";
import DeleteModal from "./Modals/DeleteModal";
import { CiTimer } from "react-icons/ci";
import { MdDone } from "react-icons/md";
import { FaTrash, FaPen } from "react-icons/fa";
import ResolvedModal from "./Modals/ResolvedModal";
import { toast } from "react-toastify";
import { IoSearchSharp } from "react-icons/io5";
import { EventSourcePolyfill } from "event-source-polyfill";
import { DEFAULT_TOAST_OPTIONS } from "../../Contants/toastConstant";

interface Ticket {
  id: string;
  email: string;
  issue: string;
  description: string;
  message: string;
  state: string;
}

const History = ({ email }: { email: string }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    const endpoint = `http://localhost:8080/fetch-history?email=${encodeURIComponent(email)}`;
    const eventSource = new EventSourcePolyfill(endpoint, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { action, ticket } = data;
        setTickets((prev) => {
          if (!ticket.id) return prev;
          if (action === "CREATE") {
            const duplicate = prev.find((t) => t.id === ticket.id);
            if (duplicate) return prev;
            return [ticket, ...prev];
          } else if (action === "UPDATE") {
            return prev.map((t) => (t.id === ticket.id ? ticket : t));
          }
          return prev;
        });
      } catch (err) {
        toast.error("Parse error:" + err, DEFAULT_TOAST_OPTIONS);
      }
    };

    eventSource.onopen = () => {
      setLoadingState(false);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoadingState(false);
    };

    return () => {
      eventSource.close();
    };
  }, [email]); // Only re-runs if the email actually changes

  // const getHistory = () => {
  // removed async since sse is even based
  // This was not sse - sse only woks wit get unfortunately
  // try {
  // const endpoint = "http://localhost:8080/fetch-history";
  // const res = await fetch(endpoint, {
  //   method: "POST", // Changed from GET to POST
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ email }), // Send the current user's email
  // });

  // if (!res.ok) throw new Error("Can't fetch tickets...");
  // const data = await res.json();
  // setTickets(data || []);
  // } catch (err) {
  //   console.error(err);
  // } finally {
  //   setLoadingState(false);
  // }
  // };

  const handleUpdate = (newDesc: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicketId ? { ...t, description: newDesc } : t,
      ),
    );
  };

  const refreshAfterDelete = (deletedId: string) => {
    setTickets((prev) => prev.filter((t) => t.id != deletedId));
  };

  if (loadingState)
    return <div className="text-center mt-10">Loading history...</div>;
  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 p-4">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800">
          Support History
        </h2>

        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center">No history found.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) =>
              ticket.state === "Pending..." ? (
                <div
                  key={ticket.id}
                  className="bg-white p-5 rounded-xl shadow-sm border-4 border-red-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 underline">
                      {ticket.issue}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {new Date(Number(ticket.id)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-gray-600 text-sm">
                      {ticket.description.length < 30
                        ? ticket.description
                        : ticket.description.slice(0, 27) + "..."}
                    </p>
                    <div className="flex flex-row mr-2">
                      <FaPen
                        onClick={() => {
                          setIsModalOpen(true);
                          setSelectedTicketId(ticket.id);
                        }}
                        className="cursor-pointer text-gray-800 text-xl rounded-sm mr-2 hover:text-red-600"
                      />
                      <FaTrash
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setSelectedTicketId(ticket.id);
                        }}
                        className="cursor-pointer text-gray-800 text-xl rounded-sm hover:text-red-600"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400 mt-1 italic">
                      Ref: {ticket.id}
                    </p>
                    <p className="text-xs text-yellow-600 mt-1 italic bg-gray-300 rounded-lg p-0.5">
                      <CiTimer className="inline text-sm font-bold" />{" "}
                      {ticket.state}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  key={ticket.id}
                  className="bg-white p-5 rounded-xl shadow-sm border-4 border-green-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 underline">
                      {ticket.issue}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {new Date(Number(ticket.id)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <p>
                      <span className="font-bold">
                        Resolved by Admin. Message:{" "}
                      </span>
                      {ticket.message.length < 100
                        ? ticket.message
                        : ticket.message.slice(0, 97) + "..."}
                    </p>
                    <div className="flex items-center justify-between">
                      <IoSearchSharp
                        className="hover:cursor-pointer text-2xl rounded-2xl mr-2"
                        onClick={() => {
                          setViewModal(true);
                          setSelectedTicketId(ticket.id);
                        }}
                      />
                      <FaTrash
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setSelectedTicketId(ticket.id);
                        }}
                        className="cursor-pointer text-gray-800 text-xl rounded-sm hover:text-red-600 h-[19.5px]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-gray-400 mt-1 italic">
                      Ref: {ticket.id}
                    </p>
                    <p className="text-xs text-green-600 mt-1 italic bg-gray-300 rounded-lg p-0.5">
                      <MdDone className="inline text-sm font-bold" />{" "}
                      {ticket.state}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <EditModal
          key={selectedTicketId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          description={
            tickets.find((ticket) => ticket.id === selectedTicketId)
              ?.description || ""
          }
          id={selectedTicketId}
          onUpdateSuccess={handleUpdate}
        />
        <DeleteModal
          key={selectedTicketId}
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          id={selectedTicketId}
          onDeleteSuccess={() =>
            selectedTicketId && refreshAfterDelete(selectedTicketId)
          }
        />

        <ResolvedModal
          key={selectedTicketId}
          isOpen={viewModal}
          onClose={() => setViewModal(false)}
          message={
            tickets.find((t) => t.id === selectedTicketId)?.message || ""
          }
        />
      </div>
    </>
  );
};

export default History;
