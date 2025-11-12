import { FriendRequestStatus } from "@/components/screenComponents/search/helper/friendRequestService";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export interface FriendRequestNotification {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: FriendRequestStatus;
  createdAt: FirebaseFirestoreTypes.Timestamp | null;
  type: "incoming" | "outgoing";
}

export interface NotificationContextState {
  notifications: FriendRequestNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationContextValue extends NotificationContextState {
  acceptRequest: (requestId: string, userName: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  markAsViewed: () => void;
  clearError: () => void;
}

export interface NotificationProviderProps {
  userId: string;
  children: React.ReactNode;
}
