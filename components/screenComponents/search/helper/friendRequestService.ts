import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "@react-native-firebase/firestore";

const FRIEND_REQUESTS_COLLECTION = "FriendRequests";

export enum FriendRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected"
}

export interface FriendRequest {
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: any;
  updatedAt: any;
}

export async function sendFriendRequest(
  senderId: string,
  receiverId: string
): Promise<void> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const friendRequestsCollection = collection(db, FRIEND_REQUESTS_COLLECTION);

  const existingRequestQuery = query(
    friendRequestsCollection,
    where("senderId", "==", senderId),
    where("receiverId", "==", receiverId)
  );
  const existingRequest = await getDocs(existingRequestQuery);

  if (!existingRequest.empty) {
    throw new Error("Friend request already sent");
  }

  const reverseRequestQuery = query(
    friendRequestsCollection,
    where("senderId", "==", receiverId),
    where("receiverId", "==", senderId)
  );
  const reverseRequest = await getDocs(reverseRequestQuery);

  if (!reverseRequest.empty) {
    throw new Error("This user has already sent you a friend request");
  }

  await addDoc(friendRequestsCollection, {
    senderId,
    receiverId,
    status: FriendRequestStatus.PENDING,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function checkFriendRequestStatus(
  currentUserId: string,
  otherUserId: string
): Promise<{
  hasSentRequest: boolean;
  hasReceivedRequest: boolean;
  status?: FriendRequestStatus;
}> {
  const db = FirebaseAppConfig.getInstance().getDb();
  const friendRequestsCollection = collection(db, FRIEND_REQUESTS_COLLECTION);

  const sentRequestQuery = query(
    friendRequestsCollection,
    where("senderId", "==", currentUserId),
    where("receiverId", "==", otherUserId)
  );
  const sentRequest = await getDocs(sentRequestQuery);

  if (!sentRequest.empty) {
    return {
      hasSentRequest: true,
      hasReceivedRequest: false,
      status: sentRequest.docs[0].data().status,
    };
  }

  const receivedRequestQuery = query(
    friendRequestsCollection,
    where("senderId", "==", otherUserId),
    where("receiverId", "==", currentUserId)
  );
  const receivedRequest = await getDocs(receivedRequestQuery);

  if (!receivedRequest.empty) {
    return {
      hasSentRequest: false,
      hasReceivedRequest: true,
      status: receivedRequest.docs[0].data().status,
    };
  }

  return {
    hasSentRequest: false,
    hasReceivedRequest: false,
  };
}
