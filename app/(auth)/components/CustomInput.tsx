import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

interface CustomInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export default function CustomInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  icon,
  error,
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="w-full mb-4">
      <Text className="text-gray-300 text-sm font-medium mb-2 ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-gray-800/50 rounded-2xl px-4 border-2 ${
          isFocused
            ? "border-blue-500"
            : error
            ? "border-red-500"
            : "border-gray-700"
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? "#3b82f6" : "#9ca3af"}
            style={{ marginRight: 12 }}
          />
        )}
        <TextInput
          className="flex-1 py-4 text-white text-base"
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="p-2"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9ca3af"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
