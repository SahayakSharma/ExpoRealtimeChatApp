import { FriendRequestStatus } from "@/components/screenComponents/search/helper/friendRequestService";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { updateFriendRequestStatus } from "../helper/notificationService";
import { FriendRequestNotification } from "./NotificationsScreen";

interface FriendRequestCardProps {
  notification: FriendRequestNotification;
  onRequestUpdate: () => void;
}

export default function FriendRequestCard({
  notification,
  onRequestUpdate,
}: FriendRequestCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const isIncoming = notification.type === "incoming";

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await updateFriendRequestStatus(notification.id, FriendRequestStatus.ACCEPTED);
      Alert.alert("Success", `You are now friends with ${notification.userName}`);
      onRequestUpdate();
    } catch (error) {
      console.error("Error accepting friend request:", error);
      Alert.alert("Error", "Failed to accept friend request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await updateFriendRequestStatus(notification.id, FriendRequestStatus.REJECTED);
      Alert.alert("Request Declined", "Friend request has been declined");
      onRequestUpdate();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      Alert.alert("Error", "Failed to decline friend request");
    } finally {
      setIsProcessing(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderActionButtons = () => {
    if (notification.status === FriendRequestStatus.ACCEPTED) {
      return (
        <View className="bg-green-100 px-4 py-3 rounded-xl border border-green-400">
          <View className="flex-row items-center justify-center">
            <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
            <Text className="text-green-700 text-sm font-bold ml-2">Friends Connected</Text>
          </View>
        </View>
      );
    }

    if (notification.status === FriendRequestStatus.REJECTED) {
      return (
        <View className="bg-gray-200 px-4 py-3 rounded-xl border border-gray-400">
          <View className="flex-row items-center justify-center">
            <Ionicons name="close-circle" size={18} color="#64748b" />
            <Text className="text-gray-600 text-sm font-bold ml-2">Request Declined</Text>
          </View>
        </View>
      );
    }

    if (!isIncoming) {
      return (
        <View style={{ backgroundColor: '#F5F0EB' }} className="px-4 py-3 rounded-xl border-2 border-c3">
          <View className="flex-row items-center justify-center">
            <Ionicons name="time-outline" size={18} color="#C9B59C" />
            <Text className="text-c4 text-sm font-bold ml-2">Awaiting Response</Text>
          </View>
        </View>
      );
    }

    return (
      <View className="flex-row gap-2.5">
        <TouchableOpacity
          onPress={handleAccept}
          disabled={isProcessing}
          style={{ backgroundColor: '#10b981' }}
          className="flex-1 py-3.5 rounded-xl active:opacity-80"
          activeOpacity={0.8}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
              <Text className="text-white text-sm font-bold ml-1.5">Accept</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReject}
          disabled={isProcessing}
          style={{ backgroundColor: '#9ca3af' }}
          className="flex-1 py-3.5 rounded-xl active:opacity-80"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="close-circle-outline" size={20} color="#ffffff" />
            <Text className="text-white text-sm font-bold ml-1.5">Decline</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <View
      className={`rounded-2xl mb-4 overflow-hidden shadow-sm ${
        isIncoming
          ? "bg-green-50/80"
          : "bg-white"
      }`}
      style={{
        borderLeftWidth: isIncoming ? 4 : 0,
        borderRightWidth: isIncoming ? 0 : 4,
        borderLeftColor: isIncoming ? "#10b981" : undefined,
        borderRightColor: isIncoming ? undefined : "#C9B59C",
      }}
    >
      <View className="p-4">
        {/* Header with type badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View
            style={{ backgroundColor: isIncoming ? '#dcfce7' : '#F5F0EB' }}
            className="flex-row items-center px-3 py-1.5 rounded-full"
          >
            <Ionicons
              name={isIncoming ? "arrow-down-circle" : "arrow-up-circle"}
              size={16}
              color={isIncoming ? "#10b981" : "#C9B59C"}
            />
            <Text
              className={`ml-1.5 text-xs font-bold ${
                isIncoming ? "text-green-700" : "text-c4"
              }`}
            >
              {isIncoming ? "INCOMING REQUEST" : "SENT REQUEST"}
            </Text>
          </View>
          <Text className="text-gray-400 text-xs font-medium">
            {formatDate(notification.createdAt)}
          </Text>
        </View>

        {/* User info section */}
        <View className="flex-row items-center mb-4">
          <View className="relative">
            <View
              className={`w-14 h-14 rounded-full items-center justify-center ${
                isIncoming ? "bg-green-500" : "bg-c4"
              }`}
            >
              <Text className="text-white text-lg font-black">
                {getInitials(notification.userName)}
              </Text>
            </View>
            <View
              className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full items-center justify-center border-2 ${
                isIncoming
                  ? "bg-green-600 border-green-50"
                  : "bg-c3 border-c1"
              }`}
            >
              <Ionicons
                name="person"
                size={10}
                color="#ffffff"
              />
            </View>
          </View>

          <View className="flex-1 ml-3">
            <Text className="text-gray-900 text-base font-bold mb-0.5" numberOfLines={1}>
              {notification.userName}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={12} color="#9ca3af" />
              <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
                {notification.userEmail}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        {renderActionButtons()}
      </View>
    </View>
  );
}
