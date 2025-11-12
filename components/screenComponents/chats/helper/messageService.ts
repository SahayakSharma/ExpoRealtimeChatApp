import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import {
  addDoc,
  collection,
  doc,
  FirebaseFirestoreTypes,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "@react-native-firebase/firestore";

const MESSAGES_COLLECTION = "Messages";
const ROOMS_COLLECTION = "Rooms";

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: any;
  isRead?: boolean;
}

/**
 * Sends a new message to a chat room
 * @param roomId Room ID
 * @param senderId Sender's user ID
 * @param text Message text
 * @returns Message ID
 */
export async function sendMessage(
  roomId: string,
  senderId: string,
  text: string
): Promise<string> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const messagesCollection = collection(db, MESSAGES_COLLECTION);

  const messageData = {
    roomId,
    senderId,
    text: text.trim(),
    createdAt: serverTimestamp(),
    isRead: false,
  };

  const docRef = await addDoc(messagesCollection, messageData);

  // Update room's last message
  await updateRoomLastMessage(roomId, text.trim());

  return docRef.id;
}

/**
 * Updates the room's last message and timestamp
 * @param roomId Room ID
 * @param lastMessage Last message text
 */
async function updateRoomLastMessage(
  roomId: string,
  lastMessage: string
): Promise<void> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const roomRef = doc(db, ROOMS_COLLECTION, roomId);

  await updateDoc(roomRef, {
    lastMessage,
    lastMessageTimestamp: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Subscribes to messages in a room with real-time updates
 * @param roomId Room ID
 * @param callback Callback function to handle messages
 * @returns Unsubscribe function
 */
export function subscribeToMessages(
  roomId: string,
  callback: (messages: Message[]) => void
): () => void {
  const db = FirebaseAppConfig.getInstance().getDb();
  const messagesCollection = collection(db, MESSAGES_COLLECTION);

  const q = query(
    messagesCollection,
    where("roomId", "==", roomId),
    orderBy("createdAt", "asc")
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          roomId: data.roomId,
          senderId: data.senderId,
          text: data.text,
          createdAt: data.createdAt,
          isRead: data.isRead,
        });
      });
      callback(messages);
    },
    (error) => {
      console.error("Error subscribing to messages:", error);
    }
  );

  return unsubscribe;
}

/**
 * Fetches messages for a room (one-time fetch, not real-time)
 * @param roomId Room ID
 * @returns Array of messages
 */
export async function getMessages(roomId: string): Promise<Message[]> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const messagesCollection = collection(db, MESSAGES_COLLECTION);

  const q = query(
    messagesCollection,
    where("roomId", "==", roomId),
    orderBy("createdAt", "asc")
  );

  const querySnapshot = await getDocs(q);
  const messages: Message[] = [];

  querySnapshot.forEach((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
    const data = doc.data();
    messages.push({
      id: doc.id,
      roomId: data.roomId,
      senderId: data.senderId,
      text: data.text,
      createdAt: data.createdAt,
      isRead: data.isRead,
    });
  });

  return messages;
}
