import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import CountryCodePicker from "./CountryCodePicker";
import { CountryCode, getDefaultCountry, parsePhoneNumber } from "./countryCodeData";

interface PhoneInputFieldProps {
  label: string;
  placeholder: string;
  value: string; // Full phone number with country code
  onChangeText: (fullPhoneNumber: string) => void;
  error?: string;
}

export default function PhoneInputField({
  label,
  placeholder,
  value,
  onChangeText,
  error,
}: PhoneInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Parse existing phone number
  const { dialCode, phoneNumber } = parsePhoneNumber(value);
  
  // Find selected country or default to India
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(() => {
    return (
      require("./countryCodeData").COUNTRY_CODES.find(
        (c: CountryCode) => c.dialCode === dialCode
      ) || getDefaultCountry()
    );
  });

  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber);

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    const fullNumber = `${country.dialCode}${localPhoneNumber}`;
    onChangeText(fullNumber);
  };

  const handlePhoneNumberChange = (text: string) => {
    const cleaned = text.replace(/[^\d\s\-\(\)]/g, "");
    setLocalPhoneNumber(cleaned);
    
    const fullNumber = `${selectedCountry.dialCode}${cleaned}`;
    onChangeText(fullNumber);
  };

  return (
    <View className="w-full mb-5">
      <Text className={`text-sm font-semibold mb-2 ${error ? "text-red-600" : "text-gray-700"}`}>
        {label}
      </Text>
      
      <View className="flex-row">
        {/* Country Code Picker */}
        <CountryCodePicker
          selectedCountry={selectedCountry}
          onSelectCountry={handleCountrySelect}
        />

        {/* Phone Number Input */}
        <View
          className={`flex-1 flex-row items-center bg-white/40 backdrop-blur rounded-xl px-4 border-2 ${
            error
              ? "border-red-400 bg-red-50/40"
              : isFocused
              ? "border-c4 bg-white/60"
              : "border-c3/50"
          }`}
        >
          <Ionicons
            name="call-outline"
            size={20}
            color={error ? "#dc2626" : isFocused ? "#C9B59C" : "#9ca3af"}
            style={{ marginRight: 12 }}
          />
          <TextInput
            className={`flex-1 py-4 text-base ${error ? "text-red-700" : "text-gray-900"}`}
            placeholder={placeholder}
            placeholderTextColor={error ? "#fca5a5" : "#9ca3af"}
            value={localPhoneNumber}
            onChangeText={handlePhoneNumberChange}
            keyboardType="phone-pad"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCapitalize="none"
          />
        </View>
      </View>

      {error && (
        <View className="flex-row items-center mt-1.5 ml-1">
          <Ionicons name="alert-circle" size={12} color="#dc2626" />
          <Text className="text-red-600 text-xs ml-1 flex-1">{error}</Text>
        </View>
      )}
    </View>
  );
}
