import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: CustomButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-blue-600 active:bg-blue-700";
      case "secondary":
        return "bg-gray-700 active:bg-gray-800";
      case "outline":
        return "bg-transparent border-2 border-gray-600 active:border-gray-500";
      default:
        return "bg-blue-600 active:bg-blue-700";
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case "outline":
        return "text-gray-300";
      default:
        return "text-white";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-2xl items-center justify-center ${getVariantStyles()} ${
        disabled || loading ? "opacity-50" : ""
      }`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={`font-semibold text-base ${getTextStyles()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
