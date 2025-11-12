import { useNotifications } from "@/context/Notification/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import FriendRequestCard from "./FriendRequestCard";

export default function NotificationsScreen() {
  const { notifications, isLoading } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
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
          <FriendRequestCard notification={item} />
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
