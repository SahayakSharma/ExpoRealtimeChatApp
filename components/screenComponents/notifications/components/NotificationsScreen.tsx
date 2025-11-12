import { FriendRequestStatus } from "@/components/screenComponents/search/helper/friendRequestService";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { getFriendRequests } from "../helper/notificationService";
import FriendRequestCard from "./FriendRequestCard";

export interface FriendRequestNotification {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: FriendRequestStatus;
  createdAt: any;
  type: "incoming" | "outgoing";
}

export default function NotificationsScreen() {
  const { currentUserSession } = useAuthContext();
  const [notifications, setNotifications] = useState<FriendRequestNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!currentUserSession) return;

    try {
      const requests = await getFriendRequests(currentUserSession.uid);
      setNotifications(requests);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  };

  const handleRequestUpdate = () => {
    loadNotifications();
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center mt-20">
          <ActivityIndicator size="large" color="#C9B59C" />
        </View>
      );
    }

    return (
      <View className="items-center justify-center mt-20 px-8">
        <Ionicons name="notifications-off-outline" size={64} color="#C9B59C" />
        <Text className="text-gray-700 text-lg font-semibold mt-4">
          No notifications
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          You're all caught up! Friend requests will appear here
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 px-4 pt-4">
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FriendRequestCard
            notification={item}
            onRequestUpdate={handleRequestUpdate}
          />
        )}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#C9B59C"
            colors={["#C9B59C"]}
          />
        }
      />
    </View>
  );
}
