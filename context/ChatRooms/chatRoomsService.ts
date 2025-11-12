import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "@react-native-firebase/firestore";
import { ChatRoom } from "./types";

const ROOMS_COLLECTION = "Rooms";
const USERS_COLLECTION = "Users";

function shouldShowUnreadBadge(lastMessageSenderId: string | undefined, currentUserId: string): boolean {
  if (!lastMessageSenderId) {
    return false;
  }
  return lastMessageSenderId !== currentUserId;
}

export function setupRoomsListener(
  userId: string,
  onRoomsUpdate: (rooms: ChatRoom[]) => void,
  onError: (error: Error) => void
): () => void {
  const db = FirebaseAppConfig.getInstance().getDb();
  const roomsCollection = collection(db, ROOMS_COLLECTION);

  const q = query(
    roomsCollection,
    where("participants", "array-contains", userId)
  );

  const unsubscribe = onSnapshot(
    q,
    async (querySnapshot) => {
      try {
        const roomsPromises = querySnapshot.docs.map(
          async (roomDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
            const roomData = roomDoc.data();
            const participants = roomData.participants as string[];

            const otherUserId = participants.find((id) => id !== userId);

            if (!otherUserId) {
              console.error(`ChatRooms listener: No other user found in room ${roomDoc.id}`);
              return null;
            }

            const userDoc = await getDoc(doc(db, USERS_COLLECTION, otherUserId));
            const userData = userDoc.data();

            if (!userData) {
              console.error(`ChatRooms listener: User data not found for ${otherUserId}`);
              return null;
            }

            const chatRoom: ChatRoom = {
              roomId: roomDoc.id,
              otherUserId,
              otherUserName: userData.name || "Unknown User",
              otherUserEmail: userData.email || "",
              otherUserProfilePicture: userData.profile_picture,
              lastMessage: roomData.lastMessage,
              lastMessageTimestamp: roomData.lastMessageTimestamp || null,
              lastMessageSenderId: roomData.lastMessageSenderId,
              hasUnreadMessage: shouldShowUnreadBadge(roomData.lastMessageSenderId, userId),
              updatedAt: roomData.updatedAt || null,
            };

            return chatRoom;
          }
        );

        const rooms = await Promise.all(roomsPromises);
        const validRooms = rooms.filter((room: ChatRoom | null): room is ChatRoom => room !== null);

        const sortedRooms = validRooms.sort((a: ChatRoom, b: ChatRoom) => {
          const aTime = a.lastMessageTimestamp || a.updatedAt;
          const bTime = b.lastMessageTimestamp || b.updatedAt;

          if (!aTime && !bTime) return 0;
          if (!aTime) return 1;
          if (!bTime) return -1;

          return bTime.toMillis() - aTime.toMillis();
        });

        onRoomsUpdate(sortedRooms);
      } catch (error) {
        console.error("ChatRooms listener: Error processing rooms:", error);
        onError(error as Error);
      }
    },
    (error) => {
      console.error("ChatRooms listener: Snapshot error:", error);
      onError(error);
    }
  );

  return unsubscribe;
}

export async function markRoomAsRead(roomId: string, userId: string): Promise<void> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);

  try {
    const roomDoc = await getDoc(roomRef);
    
    if (!roomDoc.exists()) {
      console.error("ChatRooms service: Room not found:", roomId);
      return;
    }

    const roomData = roomDoc.data();
    
    if (!roomData) {
      return;
    }

    const lastMessageSenderId = roomData.lastMessageSenderId;

    if (lastMessageSenderId && lastMessageSenderId !== userId) {
      await updateDoc(roomRef, {
        lastMessageSenderId: null,
      });
    }
  } catch (error) {
    console.error("ChatRooms service: Error marking room as read:", error);
    throw error;
  }
}
