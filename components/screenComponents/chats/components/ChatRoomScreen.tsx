import { useAuthContext } from "@/context/Auth/AuthContext";
import { useChat } from "@/context/Chat/ChatContext";
import { useRef } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Message } from "../helper/messageService";
import ChatRoomHeader from "./ChatRoomHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface ChatRoomScreenProps {
  roomId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserEmail: string;
  otherUserProfilePicture?: string;
  onBackPress: () => void;
}

export default function ChatRoomScreen({
  roomId,
  otherUserId,
  otherUserName,
  otherUserEmail,
  otherUserProfilePicture,
  onBackPress,
}: ChatRoomScreenProps) {
  const { currentUserSession } = useAuthContext();
  const { messages, isLoading, error, sendMessage: sendMessageToRoom } = useChat();
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = async (text: string) => {
    if (!currentUserSession) return;

    try {
      await sendMessageToRoom(text);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === currentUserSession?.uid;
    return <MessageBubble message={item} isOwnMessage={isOwnMessage} />;
  };

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-sm">Loading messages...</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-gray-400 text-base text-center">
          No messages yet. Start the conversation!
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-c1"
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1 bg-c2" edges={["bottom"]}>
        <ChatRoomHeader
          userName={otherUserName}
          userEmail={otherUserEmail}
          profilePicture={otherUserProfilePicture}
          onBackPress={onBackPress}
        />

        {error && (
          <View className="bg-red-100 border border-red-400 px-4 py-2 mx-4 mt-2 rounded">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        )}

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 16,
            paddingBottom: 8,
          }}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
          inverted={false}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />

        <MessageInput onSend={handleSendMessage} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
