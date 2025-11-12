import { ChatRoom } from "@/context/ChatRooms/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

interface ChatListItemProps {
  chat: ChatRoom;
  index: number;
}

export default function ChatListItem({ chat, index }: ChatListItemProps) {
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handlePress = () => {
    router.push({
      pathname: "/(tab)/chats/[roomId]",
      params: {
        roomId: chat.roomId,
        otherUserId: chat.otherUserId,
        otherUserName: chat.otherUserName,
        otherUserEmail: chat.otherUserEmail,
        otherUserProfilePicture: chat.otherUserProfilePicture || "",
      },
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(300)}
      layout={Layout.springify().damping(15).stiffness(100)}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className="bg-white mx-4 mb-2 rounded-2xl p-4 border border-c3/20"
      >
      <View className="flex-row items-center">
        {/* Profile Picture / Avatar */}
        <View className="mr-3">
          {chat.otherUserProfilePicture ? (
            <Image
              source={{ uri: chat.otherUserProfilePicture }}
              className="w-14 h-14 rounded-full"
              contentFit="cover"
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-c4 items-center justify-center">
              <Text className="text-white text-lg font-black">
                {getInitials(chat.otherUserName)}
              </Text>
            </View>
          )}
        </View>

        {/* Chat Info */}
        <View className="flex-1 mr-2">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-gray-900 text-base font-bold flex-1" numberOfLines={1}>
              {chat.otherUserName}
            </Text>
            <Text className="text-gray-400 text-xs ml-2">
              {formatTimestamp(chat.lastMessageTimestamp || chat.updatedAt)}
            </Text>
          </View>

          {chat.lastMessage ? (
            <Text className="text-gray-600 text-sm" numberOfLines={1}>
              {chat.lastMessage}
            </Text>
          ) : (
            <Text className="text-gray-400 text-sm italic">
              No messages yet
            </Text>
          )}
        </View>

        {/* Unread Badge & Chevron Icon */}
        <View className="flex-row items-center gap-2">
          {chat.hasUnreadMessage && (
            <View className="w-[20px] h-[20px] rounded-full bg-g1 flex-row items-center justify-center">
              <Text className="font-bold" style={{color:'white'}}>{`!`}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#C9B59C" />
        </View>
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
}
