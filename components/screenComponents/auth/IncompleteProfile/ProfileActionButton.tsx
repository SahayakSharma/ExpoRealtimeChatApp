import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ProfileActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
}

export default function ProfileActionButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: ProfileActionButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-c4 active:bg-[#B8A589] shadow-lg";
      case "secondary":
        return "bg-white border-2 border-c3 active:bg-gray-50";
      default:
        return "bg-c4 active:bg-[#B8A589]";
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "secondary":
        return "text-gray-700";
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-xl items-center justify-center ${getVariantStyles()} ${
        disabled || loading ? "opacity-50" : ""
      }`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? "#4b5563" : "white"} />
      ) : (
        <Text className={`font-bold text-base ${getTextStyles()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
