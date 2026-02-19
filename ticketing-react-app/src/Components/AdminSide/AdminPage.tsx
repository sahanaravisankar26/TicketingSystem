import React, { useState, useEffect } from "react";
import AdminModal from "../UserSide/Modals/AdminModal";
import { IoSearchSharp } from "react-icons/io5";

interface Ticket {
  id: string;
  email: string;
  issue: string;
  description: string;
  message: string;
  state: string;
}

const AdminPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingState, setLoadingState] = useState(true);
  const [ticketSelected, setTicketSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const refreshAfterResolve = (resolvedId: string) => {
    setTickets((prev) => prev.filter((t) => t.id != resolvedId));
  };

  // const getHistory = async () => {
  //   try {
  //     const endpoint = "http://localhost:8080/fetch-all-tickets";
  //     const res = await fetch(endpoint, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (!res.ok) throw new Error("Can't fetch tickets...");
  //     const data = await res.json();
  //     setTickets(data || []);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoadingState(false);
  //   }
  // };

  // useEffect(() => {
  //   const endpoint = `http://localhost:8080/fetch-all-tickets`;
  //   const eventSource = new EventSource(endpoint);

  //   eventSource.onmessage = (event) => {
  //     try {
  //       const newTicket = JSON.parse(event.data);
  //       setTickets((prev) => [newTicket, ...prev]);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   eventSource.onopen = () => {
  //     setLoadingState(false);
  //   };

  //   eventSource.onerror = () => {
  //     eventSource.close();
  //     setLoadingState(false);
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:8080/fetch-all-tickets",
    );

    eventSource.onopen = () => {
      setLoadingState(false);
    };

    eventSource.onmessage = (event) => {
      const { action, ticket } = JSON.parse(event.data);
      setTickets((prev) => {
        if (action === "CREATE") {
          const duplicate = prev.find((t) => t.id === ticket.id);
          if (duplicate) return prev;
          return [ticket, ...prev];
        } else if (action === "DELETE") {
          return prev.filter((t) => t.id !== ticket.id);
        } else if (action === "UPDATE") {
          return prev.map((t) =>
            t.id === ticket.id ? { ...t, ...ticket } : t,
          );
        }
        return prev;
      });
    };

    return () => eventSource.close();
  }, []);

  if (loadingState)
    return <div className="text-center mt-10">Loading history...</div>;
  return (
    <>
      <div className="max-w-4xl mx-auto mt-8 p-4">
        <h2 className="text-2xl text-center font-bold mb-6 text-gray-800">
          Tickets Raised
        </h2>

        {tickets.length === 0 ? (
          <p className="text-gray-500 text-center">
            No Tickets Raised [Yet :)]
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map(
              (ticket) =>
                ticket.state === "Pending..." && (
                  <>
                    <div
                      key={ticket.id}
                      className="bg-white p-5 rounded-xl shadow-sm border-4 border-red-600 hover:cursor-pointer hover:bg-red-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800">
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
                        <span className="text-sm text-gray-700 mt-1">
                          {ticket.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-xs text-gray-400 mt-1 italic">
                          Ref: {ticket.id}
                        </p>
                        <IoSearchSharp
                          className="hover:cursor-pointer text-2xl rounded-2xl"
                          onClick={() => {
                            setModalOpen(true);
                            setTicketSelected(ticket.id);
                          }}
                        />
                      </div>
                    </div>
                  </>
                ),
            )}
          </div>
        )}
      </div>
      {modalOpen && (
        <AdminModal
          key={ticketSelected}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          description={
            tickets.find((ticket) => ticket.id === ticketSelected)
              ?.description || ""
          }
          issue={
            tickets.find((ticket) => ticket.id === ticketSelected)?.issue || ""
          }
          id={ticketSelected}
          onResolveSuccess={() =>
            ticketSelected && refreshAfterResolve(ticketSelected)
          }
        />
      )}
    </>
  );
};

export default AdminPage;
