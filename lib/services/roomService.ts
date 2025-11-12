import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import {
  addDoc,
  collection,
  FirebaseFirestoreTypes,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "@react-native-firebase/firestore";

const ROOMS_COLLECTION = "Rooms";

export interface Room {
  participants: string[]; // Array of user IDs
  createdAt: any;
  updatedAt: any;
  lastMessage?: string;
  lastMessageTimestamp?: any;
}

/**
 * Creates a new chat room between two users
 * @param userId1 First user ID
 * @param userId2 Second user ID
 * @returns Room ID
 */
export async function createRoom(
  userId1: string,
  userId2: string
): Promise<string> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const roomsCollection = collection(db, ROOMS_COLLECTION);

  // Check if room already exists between these users
  const existingRoom = await findRoomBetweenUsers(userId1, userId2);
  if (existingRoom) {
    console.log("Room already exists:", existingRoom);
    return existingRoom;
  }

  // Create new room with both users as participants
  const roomData: Room = {
    participants: [userId1, userId2].sort(), // Sort for consistent ordering
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(roomsCollection, roomData);
  console.log("New room created:", docRef.id);
  return docRef.id;
}

/**
 * Finds an existing room between two users
 * @param userId1 First user ID
 * @param userId2 Second user ID
 * @returns Room ID if found, null otherwise
 */
export async function findRoomBetweenUsers(
  userId1: string,
  userId2: string
): Promise<string | null> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const roomsCollection = collection(db, ROOMS_COLLECTION);

  // Query for rooms where both users are participants
  const q = query(
    roomsCollection,
    where("participants", "array-contains", userId1)
  );

  const querySnapshot = await getDocs(q);

  // Filter to find room with both users
  for (const doc of querySnapshot.docs as FirebaseFirestoreTypes.QueryDocumentSnapshot[]) {
    const data = doc.data();
    if (
      data.participants.includes(userId1) &&
      data.participants.includes(userId2)
    ) {
      return doc.id;
    }
  }

  return null;
}

/**
 * Gets all rooms for a specific user
 * @param userId User ID
 * @returns Array of room IDs
 */
export async function getUserRooms(userId: string): Promise<string[]> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const roomsCollection = collection(db, ROOMS_COLLECTION);

  const q = query(
    roomsCollection,
    where("participants", "array-contains", userId)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => doc.id);
}
