export interface Ticket {
  id: string;
  email: string;
  issue: string;
  description: string;
  message: string;
  state: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
  issue?: string;
  id: string | null;
  onSuccess?: () => void;
  onUpdateSuccess?: (newDesc: string) => void;
}

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  onSuccess: () => void;
}
