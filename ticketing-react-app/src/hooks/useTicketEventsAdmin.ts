import { useEffect, useState } from "react";
import { CRUD } from "../Contants/constants";
import type { Ticket } from "../Contants/interfaceConstants";

export const useTicketEventsAdmin = (endpoint: string) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onopen = () => setLoadingState(false);

    eventSource.onmessage = (event) => {
      const { action, ticket } = JSON.parse(event.data);
      setTickets((prev) => {
        switch (action) {
          case CRUD.Create:
            return prev.find(t => t.id === ticket.id) ? prev : [ticket, ...prev];
          case CRUD.Delete:
            return prev.filter(t => t.id !== ticket.id);
          case CRUD.Update:
            return prev.map(t => t.id === ticket.id ? { ...t, ...ticket } : t);
          default:
            return prev;
        }
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
      setLoadingState(false);
    };

    return () => eventSource.close();
  }, [endpoint]);

  return { tickets, setTickets, loadingState };
};