import { Text, View } from "react-native";
import { Message } from "../helper/messageService";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    
    const date = timestamp.toDate();
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View
      className={`mb-3 px-4 ${
        isOwnMessage ? "items-end" : "items-start"
      }`}
    >
      <View
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
          isOwnMessage
            ? "bg-c4 rounded-br-sm"
            : "bg-white border border-c3/30 rounded-bl-sm"
        }`}
      >
        <Text
          className={`text-base leading-5 ${
            isOwnMessage ? "text-white" : "text-gray-900"
          }`}
        >
          {message.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            isOwnMessage ? "text-white/70" : "text-gray-400"
          }`}
        >
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}
