import { useChatRooms } from "@/context/ChatRooms/ChatRoomsContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import ChatListItem from "./ChatListItem";

export default function ChatsScreen() {
  const { rooms, isLoading, refreshRooms } = useChatRooms();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshRooms();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="items-center justify-center mt-32">
          <ActivityIndicator size="large" color="#C9B59C" />
          <Text className="text-gray-500 text-sm mt-4">Loading chats...</Text>
        </View>
      );
    }

    return (
      <View className="items-center justify-center mt-32 px-8">
        <View className="w-32 h-32 rounded-full bg-c4/10 items-center justify-center mb-6">
          <Ionicons name="chatbubbles-outline" size={64} color="#C9B59C" />
        </View>
        <Text className="text-gray-800 text-xl font-bold mb-2">
          No Chats Yet
        </Text>
        <Text className="text-gray-500 text-base text-center leading-6">
          Start a conversation by adding friends and accepting friend requests
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.roomId}
        renderItem={({ item, index }) => <ChatListItem chat={item} index={index} />}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 8 }}
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
