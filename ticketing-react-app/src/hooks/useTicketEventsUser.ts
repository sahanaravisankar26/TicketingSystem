import { useEffect, useMemo, useState } from "react";
import type { Ticket } from "../Contants/interfaceConstants";
import { EventSourcePolyfill } from "event-source-polyfill";
import { CRUD } from "../Contants/constants";

export const useTicketEventsUser = (endpoint: string) => {
  const [tickets, setTickets] = useState<Record<string, Ticket>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const eventSource = new EventSourcePolyfill(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    eventSource.onmessage = (event) => {
      const { action, ticket } = JSON.parse(event.data);
      
      setTickets((prev) => {
        if (action === CRUD.Delete) {
          const newState = { ...prev };
          delete newState[ticket.id];
          return newState;
        }
        // Create or Update: instant assignment
        return { ...prev, [ticket.id]: ticket };
      });
    };

    eventSource.onopen = () => setLoading(false);
    eventSource.onerror = () => {
      eventSource.close();
      setLoading(false);
    };

    return () => eventSource.close();
  }, [endpoint]);

  // Memoize the array conversion to prevent unnecessary re-renders
  const ticketList = useMemo(() => 
    Object.values(tickets).sort((a, b) => b.id.localeCompare(a.id)), 
  [tickets]);

  return { tickets: ticketList, loading, setTickets };
};