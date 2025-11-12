import { FriendRequestStatus } from "@/components/screenComponents/search/helper/friendRequestService";
import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import { createRoom } from "@/lib/services/roomService";
import {
    collection,
    doc,
    FirebaseFirestoreTypes,
    getDoc,
    onSnapshot,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "@react-native-firebase/firestore";
import { FriendRequestNotification } from "./types";

const FRIEND_REQUESTS_COLLECTION = "FriendRequests";
const USERS_COLLECTION = "Users";

export function setupNotificationListener(
  userId: string,
  onNotificationsUpdate: (notifications: FriendRequestNotification[]) => void,
  onError: (error: Error) => void
): () => void {
  const db = FirebaseAppConfig.getInstance().getDb();
  const friendRequestsCollection = collection(db, FRIEND_REQUESTS_COLLECTION);

  const incomingQuery = query(
    friendRequestsCollection,
    where("receiverId", "==", userId),
    where("status", "in", [
      FriendRequestStatus.PENDING,
      FriendRequestStatus.ACCEPTED,
      FriendRequestStatus.REJECTED,
    ])
  );

  const outgoingQuery = query(
    friendRequestsCollection,
    where("senderId", "==", userId),
    where("status", "in", [
      FriendRequestStatus.PENDING,
      FriendRequestStatus.ACCEPTED,
      FriendRequestStatus.REJECTED,
    ])
  );

  let incomingNotifications: FriendRequestNotification[] = [];
  let outgoingNotifications: FriendRequestNotification[] = [];
  let incomingUnsubscribed = false;
  let outgoingUnsubscribed = false;

  const mergeAndUpdate = () => {
    if (!incomingUnsubscribed && !outgoingUnsubscribed) {
      const allNotifications = [...incomingNotifications, ...outgoingNotifications];
      const sorted = allNotifications.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      onNotificationsUpdate(sorted);
    }
  };

  const unsubscribeIncoming = onSnapshot(
    incomingQuery,
    async (querySnapshot) => {
      try {
        const requests = await Promise.all(
          querySnapshot.docs.map(
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
                createdAt: data.createdAt || null,
                type: "incoming" as const,
              };
            }
          )
        );
        incomingNotifications = requests;
        mergeAndUpdate();
      } catch (error) {
        console.error("Error processing incoming notifications:", error);
        onError(error as Error);
      }
    },
    (error) => {
      console.error("Incoming notifications listener error:", error);
      onError(error);
    }
  );

  const unsubscribeOutgoing = onSnapshot(
    outgoingQuery,
    async (querySnapshot) => {
      try {
        const requests = await Promise.all(
          querySnapshot.docs.map(
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
                createdAt: data.createdAt || null,
                type: "outgoing" as const,
              };
            }
          )
        );
        outgoingNotifications = requests;
        mergeAndUpdate();
      } catch (error) {
        console.error("Error processing outgoing notifications:", error);
        onError(error as Error);
      }
    },
    (error) => {
      console.error("Outgoing notifications listener error:", error);
      onError(error);
    }
  );

  return () => {
    incomingUnsubscribed = true;
    outgoingUnsubscribed = true;
    unsubscribeIncoming();
    unsubscribeOutgoing();
  };
}

export async function acceptFriendRequest(
  requestId: string
): Promise<void> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const requestRef = doc(db, FRIEND_REQUESTS_COLLECTION, requestId);

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

  await updateDoc(requestRef, {
    status: FriendRequestStatus.ACCEPTED,
    updatedAt: serverTimestamp(),
  });

  try {
    const roomId = await createRoom(senderId, receiverId);
    console.log(`Chat room created: ${roomId} for users ${senderId} and ${receiverId}`);
  } catch (error) {
    console.error("Error creating chat room:", error);
  }
}

export async function rejectFriendRequest(
  requestId: string
): Promise<void> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const requestRef = doc(db, FRIEND_REQUESTS_COLLECTION, requestId);

  await updateDoc(requestRef, {
    status: FriendRequestStatus.REJECTED,
    updatedAt: serverTimestamp(),
  });
}
