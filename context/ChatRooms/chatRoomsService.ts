import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    onSnapshot,
    query,
    where,
} from "@react-native-firebase/firestore";
import { ChatRoom } from "./types";

const ROOMS_COLLECTION = "Rooms";
const USERS_COLLECTION = "Users";

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
