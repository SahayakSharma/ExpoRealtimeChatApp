import { useAuthContext } from "@/context/Auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { checkFriendRequestStatus, FriendRequestStatus, sendFriendRequest } from "../helper/friendRequestService";
import { UserSearchResult } from "./SearchScreen";

interface UserSearchCardProps {
  user: UserSearchResult;
}

export default function UserSearchCard({ user }: UserSearchCardProps) {
  const { currentUserSession } = useAuthContext();
  const [requestStatus, setRequestStatus] = useState<{
    hasSentRequest: boolean;
    hasReceivedRequest: boolean;
    status?: FriendRequestStatus;
  } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkRequestStatus();
  }, []);

  const checkRequestStatus = async () => {
    if (!currentUserSession) return;
    
    try {
      const status = await checkFriendRequestStatus(currentUserSession.uid, user.uid);
      setRequestStatus(status);
    } catch (error) {
      console.error("Error checking friend request status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!currentUserSession) return;

    setIsSending(true);
    try {
      await sendFriendRequest(currentUserSession.uid, user.uid);
      Alert.alert("Success", `Friend request sent to ${user.name}`);
      await checkRequestStatus();
    } catch (error: any) {
      console.error("Error sending friend request:", error);
      Alert.alert("Error", error.message || "Failed to send friend request");
    } finally {
      setIsSending(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" color="#C9B59C" />;
    }

    if (isSending) {
      return <ActivityIndicator size="small" color="#ffffff" />;
    }

    if (requestStatus?.hasSentRequest) {
      if (requestStatus.status === FriendRequestStatus.PENDING) {
        return (
          <>
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text className="text-gray-600 text-xs font-semibold ml-1.5">Pending</Text>
          </>
        );
      }
      if (requestStatus.status === FriendRequestStatus.ACCEPTED) {
        return (
          <>
            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
            <Text className="text-green-600 text-xs font-semibold ml-1.5">Friends</Text>
          </>
        );
      }
    }

    if (requestStatus?.hasReceivedRequest) {
      return (
        <>
          <Ionicons name="mail-unread-outline" size={14} color="#C9B59C" />
          <Text className="text-c4 text-xs font-semibold ml-1.5">Respond</Text>
        </>
      );
    }

    return (
      <>
        <Ionicons name="person-add" size={14} color="#ffffff" />
        <Text className="text-white text-xs font-semibold ml-1.5">Add</Text>
      </>
    );
  };

  const isButtonDisabled = () => {
    return (
      isLoading ||
      isSending ||
      (requestStatus?.hasSentRequest && requestStatus.status !== FriendRequestStatus.REJECTED) ||
      currentUserSession?.uid === user.uid
    );
  };

  const getButtonStyle = () => {
    if (requestStatus?.hasSentRequest) {
      return "bg-gray-100 border-2 border-gray-300";
    }
    if (requestStatus?.hasReceivedRequest) {
      return "bg-c4/20 border-2 border-c4";
    }
    return "bg-c4 shadow-sm";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View className="flex-row items-center bg-white/60 rounded-2xl p-4 mb-3 border border-c3/30">
      <View className="w-14 h-14 rounded-full bg-c4/30 items-center justify-center mr-3">
        <Text className="text-c4 text-lg font-bold">
          {getInitials(user.name)}
        </Text>
      </View>

      <View className="flex-1 mr-3">
        <Text className="text-gray-900 text-base font-semibold mb-1">
          {user.name}
        </Text>
        <View className="flex-row items-center">
          <Ionicons name="mail-outline" size={12} color="#6b7280" />
          <Text className="text-gray-600 text-sm ml-1" numberOfLines={1}>
            {user.email}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSendFriendRequest}
        disabled={isButtonDisabled()}
        className={`flex-row items-center justify-center px-3 py-2 rounded-lg ${getButtonStyle()} ${
          isButtonDisabled() ? "opacity-60" : ""
        }`}
        activeOpacity={0.7}
      >
        {getButtonContent()}
      </TouchableOpacity>
    </View>
  );
}
