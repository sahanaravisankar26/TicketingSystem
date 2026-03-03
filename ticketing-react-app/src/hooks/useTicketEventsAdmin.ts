import { useEffect, useMemo, useState } from "react";
import { CRUD } from "../Contants/constants";
import type { Ticket } from "../Contants/interfaceConstants";

export const useTicketEventsAdmin = (endpoint: string) => {
  // Use an Object/Record instead of an Array
  const [tickets, setTickets] = useState<Record<string, Ticket>>({});

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      const { action, ticket } = JSON.parse(event.data);

      setTickets((prev) => {
        if (action === CRUD.Delete) {
          const newState = { ...prev };
          delete newState[ticket.id];
          return newState;
        }

        // Instant update: No iteration, no .map(), no .find()
        // This handles both Create and Update
        return {
          ...prev,
          [ticket.id]: ticket,
        };
      });
    };

    return () => eventSource.close();
  }, [endpoint]);

  // Convert to array only when RENDERING (or use the object directly)
  const ticketList = useMemo(() => Object.values(tickets), [tickets]);
  // Sort them by ID or Date here if needed, since Objects don't guarantee order
  const sortedList = useMemo(() => ticketList.sort((a, b) => b.id.localeCompare(a.id)), [ticketList]);

  return { tickets: sortedList, setTickets };
};
