import { Message } from "@/components/screenComponents/chats/helper/messageService";

export interface ChatContextState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextValue extends ChatContextState {
  sendMessage: (text: string) => Promise<void>;
  clearError: () => void;
}

export interface ChatProviderProps {
  roomId: string;
  currentUserId: string;
  children: React.ReactNode;
}
