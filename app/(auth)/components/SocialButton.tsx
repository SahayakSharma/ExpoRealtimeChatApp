import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SocialButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  iconColor?: string;
}

export default function SocialButton({
  icon,
  title,
  onPress,
  iconColor = "#fff",
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 bg-gray-800/50 border-2 border-gray-700 rounded-2xl py-3 px-4 active:bg-gray-700/50"
      activeOpacity={0.8}
    >
      <View className="flex-row gap-2 items-center justify-center">
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text className="text-gray-300 font-medium text-sm">{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
