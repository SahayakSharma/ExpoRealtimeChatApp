import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import {
  collection,
  doc,
  FirebaseFirestoreTypes,
  getDoc,
  getDocs,
  query,
  where,
} from "@react-native-firebase/firestore";

const ROOMS_COLLECTION = "Rooms";
const USERS_COLLECTION = "Users";

export interface ChatItem {
  roomId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserEmail: string;
  otherUserProfilePicture?: string;
  lastMessage?: string;
  lastMessageTimestamp?: any;
  updatedAt?: any;
}

/**
 * Fetches all chat rooms for a user with enriched participant details
 * @param currentUserId Current user's ID
 * @returns Array of chat items with other user's details
 */
export async function getUserChatsWithDetails(
  currentUserId: string
): Promise<ChatItem[]> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const roomsCollection = collection(db, ROOMS_COLLECTION);

  // Query for all rooms where current user is a participant
  const q = query(
    roomsCollection,
    where("participants", "array-contains", currentUserId)
  );

  const querySnapshot = await getDocs(q);

  // Fetch details for each room
  const chatsPromises = querySnapshot.docs.map(
    async (roomDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
      const roomData = roomDoc.data();
      const participants = roomData.participants as string[];

      // Find the other user's ID
      const otherUserId = participants.find((id) => id !== currentUserId);

      if (!otherUserId) {
        console.warn(`No other user found in room ${roomDoc.id}`);
        return null;
      }

      // Fetch other user's details
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, otherUserId));
      const userData = userDoc.data();

      if (!userData) {
        console.warn(`User data not found for ${otherUserId}`);
        return null;
      }

      const chatItem: ChatItem = {
        roomId: roomDoc.id,
        otherUserId,
        otherUserName: userData.name || "Unknown User",
        otherUserEmail: userData.email || "",
        otherUserProfilePicture: userData.profile_picture,
        lastMessage: roomData.lastMessage,
        lastMessageTimestamp: roomData.lastMessageTimestamp,
        updatedAt: roomData.updatedAt,
      };

      return chatItem;
    }
  );

  const chats = await Promise.all(chatsPromises);

  // Filter out null values and sort by last activity
  const validChats = chats.filter((chat: ChatItem | null): chat is ChatItem => chat !== null);

  // Sort by most recent activity
  validChats.sort((a: ChatItem, b: ChatItem) => {
    const aTime = a.lastMessageTimestamp || a.updatedAt;
    const bTime = b.lastMessageTimestamp || b.updatedAt;

    if (!aTime && !bTime) return 0;
    if (!aTime) return 1;
    if (!bTime) return -1;

    return bTime.toMillis() - aTime.toMillis();
  });

  return validChats;
}
