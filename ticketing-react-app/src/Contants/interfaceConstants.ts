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
  description?: string;
  issue?: string;
  id: string | null;
  onSuccess?: () => void;
  onUpdateSuccess?: (newDesc: string) => void;
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: { email: string; password: string };
  error?: string;
}

export interface AdminModalResponse {
  message: string;
  state: string;
  error?: string;
}

export interface EditModalUserResponse {
  id: string;
  description: string;
  error?: string;
}

export interface UserTicketSubmit {
  id: string;
  description: string;
  message: string;
  state: string;
}
