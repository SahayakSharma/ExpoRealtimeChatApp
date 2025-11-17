import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatRoomHeaderProps {
  userName: string;
  userEmail: string;
  profilePicture?: string;
  onBackPress: () => void;
}

export default function ChatRoomHeader({
  userName,
  userEmail,
  profilePicture,
  onBackPress,
}: ChatRoomHeaderProps) {
  const insets = useSafeAreaInsets();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View 
      className="bg-c2 border-b border-c3/30 px-4 pb-3"
    >
      <View className="flex-row items-center">
        {/* Back Button */}
        <TouchableOpacity
          onPress={onBackPress}
          className="mr-3 w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        {/* Profile Picture */}
        <View className="mr-3">
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              className="w-11 h-11 rounded-full"
              contentFit="cover"
            />
          ) : (
            <View className="w-11 h-11 rounded-full bg-c4 items-center justify-center">
              <Text className="text-white text-base font-black">
                {getInitials(userName)}
              </Text>
            </View>
          )}
        </View>

        {/* User Info */}
        <View className="flex-1">
          <Text className="text-gray-900 text-lg font-bold" numberOfLines={1}>
            {userName}
          </Text>
          <Text className="text-gray-600 text-xs" numberOfLines={1}>
            {userEmail}
          </Text>
        </View>

        {/* Optional: More options button */}
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#C9B59C" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
