import { Message } from "@/components/screenComponents/chats/helper/messageService";
import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import {
    addDoc,
    collection,
    doc,
    FirebaseFirestoreTypes,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "@react-native-firebase/firestore";

const MESSAGES_COLLECTION = "Messages";
const ROOMS_COLLECTION = "Rooms";

export function setupMessageListener(
  roomId: string,
  onMessagesUpdate: (messages: Message[]) => void,
  onError: (error: Error) => void
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
      const messages: Message[] = querySnapshot.docs.map(
        (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            roomId: data.roomId,
            senderId: data.senderId,
            text: data.text,
            createdAt: data.createdAt,
            isRead: data.isRead || false,
          };
        }
      );
      onMessagesUpdate(messages);
    },
    (error) => {
      onError(error);
    }
  );

  return unsubscribe;
}

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

export async function sendMessageToRoom(
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

  try {
    await updateRoomLastMessage(roomId, text.trim());
  } catch (error) {
    console.error("Chat service: Error updating room last message:", error);
  }

  return docRef.id;
}
