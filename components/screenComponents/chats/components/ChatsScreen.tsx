import { useAuthContext } from "@/context/Auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { ChatItem, getUserChatsWithDetails } from "../helper/chatService";
import ChatListItem from "./ChatListItem";

export default function ChatsScreen() {
  const { currentUserSession } = useAuthContext();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    if (!currentUserSession) return;

    try {
      const chatsList = await getUserChatsWithDetails(currentUserSession.uid);
      setChats(chatsList);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadChats();
    setIsRefreshing(false);
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
        data={chats}
        keyExtractor={(item) => item.roomId}
        renderItem={({ item }) => <ChatListItem chat={item} />}
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
