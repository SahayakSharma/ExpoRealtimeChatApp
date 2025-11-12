import { FriendRequestStatus } from "@/components/screenComponents/search/helper/friendRequestService";
import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import { createRoom } from "@/lib/services/roomService";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "@react-native-firebase/firestore";
import { FriendRequestNotification } from "@/context/Notification/types";

const FRIEND_REQUESTS_COLLECTION = "FriendRequests";
const USERS_COLLECTION = "Users";

export async function getFriendRequests(
  userId: string
): Promise<FriendRequestNotification[]> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const friendRequestsCollection = collection(db, FRIEND_REQUESTS_COLLECTION);

  const incomingQuery = query(
    friendRequestsCollection,
    where("receiverId", "==", userId),
    where("status", "in", [FriendRequestStatus.PENDING, FriendRequestStatus.ACCEPTED, FriendRequestStatus.REJECTED])
  );

  const outgoingQuery = query(
    friendRequestsCollection,
    where("senderId", "==", userId),
    where("status", "in", [FriendRequestStatus.PENDING, FriendRequestStatus.ACCEPTED, FriendRequestStatus.REJECTED])
  );

  const [incomingSnapshot, outgoingSnapshot] = await Promise.all([
    getDocs(incomingQuery),
    getDocs(outgoingQuery),
  ]);

  const incomingRequests = await Promise.all(
    incomingSnapshot.docs.map(
      async (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = docSnapshot.data();
        const senderId = data.senderId;

        const senderDoc = await getDoc(doc(db, USERS_COLLECTION, senderId));
        const senderData = senderDoc.data();

        return {
          id: docSnapshot.id,
          userId: senderId,
          userName: senderData?.name || "Unknown User",
          userEmail: senderData?.email || "",
          status: data.status,
          createdAt: data.createdAt,
          type: "incoming" as const,
        };
      }
    )
  );

  const outgoingRequests = await Promise.all(
    outgoingSnapshot.docs.map(
      async (docSnapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
        const data = docSnapshot.data();
        const receiverId = data.receiverId;

        const receiverDoc = await getDoc(doc(db, USERS_COLLECTION, receiverId));
        const receiverData = receiverDoc.data();

        return {
          id: docSnapshot.id,
          userId: receiverId,
          userName: receiverData?.name || "Unknown User",
          userEmail: receiverData?.email || "",
          status: data.status,
          createdAt: data.createdAt,
          type: "outgoing" as const,
        };
      }
    )
  );

  const allNotifications = [...incomingRequests, ...outgoingRequests];

  return allNotifications.sort(
    (a: FriendRequestNotification, b: FriendRequestNotification) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    }
  );
}

export async function updateFriendRequestStatus(
  requestId: string,
  status: FriendRequestStatus
): Promise<void> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const requestRef = doc(db, FRIEND_REQUESTS_COLLECTION, requestId);

  // Get the friend request details
  const requestDoc = await getDoc(requestRef);
  
  if (!requestDoc.exists()) {
    throw new Error("Friend request not found");
  }

  const requestData = requestDoc.data();
  
  if (!requestData) {
    throw new Error("Friend request data is invalid");
  }

  const senderId = requestData.senderId;
  const receiverId = requestData.receiverId;

  // Update the friend request status
  await updateDoc(requestRef, {
    status,
    updatedAt: serverTimestamp(),
  });

  // If accepted, create a chat room between the users
  if (status === FriendRequestStatus.ACCEPTED) {
    try {
      const roomId = await createRoom(senderId, receiverId);
      console.log(`Chat room created: ${roomId} for users ${senderId} and ${receiverId}`);
    } catch (error) {
      console.error("Error creating chat room:", error);
      // Don't throw error - friend request is still accepted even if room creation fails
    }
  }
}
