import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface ChatRoom {
  roomId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserEmail: string;
  otherUserProfilePicture?: string;
  lastMessage?: string;
  lastMessageTimestamp?: FirebaseFirestoreTypes.Timestamp | null;
  lastMessageSenderId?: string;
  hasUnreadMessage?: boolean;
  updatedAt?: FirebaseFirestoreTypes.Timestamp | null;
}

export interface ChatRoomsContextState {
  rooms: ChatRoom[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatRoomsContextValue extends ChatRoomsContextState {
  refreshRooms: () => void;
  clearError: () => void;
}

export interface ChatRoomsProviderProps {
  userId: string;
  children: React.ReactNode;
}
