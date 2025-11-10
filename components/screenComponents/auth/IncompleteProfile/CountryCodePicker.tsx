import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { COUNTRY_CODES, CountryCode } from "./countryCodeData";

interface CountryCodePickerProps {
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
}

export default function CountryCodePicker({
  selectedCountry,
  onSelectCountry,
}: CountryCodePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRY_CODES;

    const query = searchQuery.toLowerCase();
    return COUNTRY_CODES.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.dialCode.includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectCountry = (country: CountryCode) => {
    onSelectCountry(country);
    setIsModalVisible(false);
    setSearchQuery("");
  };

  const renderCountryItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity
      onPress={() => handleSelectCountry(item)}
      className="flex-row items-center px-6 py-4 border-b border-c3/20 active:bg-c3/20"
      activeOpacity={0.7}
    >
      <Text className="text-2xl mr-3">{item.flag}</Text>
      <View className="flex-1">
        <Text className="text-gray-800 font-medium text-base">{item.name}</Text>
        <Text className="text-gray-500 text-sm">{item.dialCode}</Text>
      </View>
      {selectedCountry.code === item.code && (
        <Ionicons name="checkmark-circle" size={24} color="#C9B59C" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      {/* Country Code Button */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="flex-row items-center bg-white/40 rounded-xl px-3 py-3 border-2 border-c3/50 mr-2 active:bg-white/60"
        activeOpacity={0.7}
      >
        <Text className="text-xl mr-1">{selectedCountry.flag}</Text>
        <Text className="text-gray-800 font-medium text-sm">
          {selectedCountry.dialCode}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#6b7280" className="ml-1" />
      </TouchableOpacity>

      {/* Country Selection Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-c1">
          {/* Modal Header */}
          <View className="bg-white border-b border-c3/30 px-6 pt-12 pb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-800 text-xl font-bold">Select Country</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  setSearchQuery("");
                }}
                className="p-2"
              >
                <Ionicons name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View className="flex-row items-center bg-c2 rounded-xl px-4 py-3 border border-c3/30">
              <Ionicons name="search" size={20} color="#9ca3af" />
              <TextInput
                className="flex-1 ml-3 text-gray-800 text-base"
                placeholder="Search countries..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Country List */}
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item.code}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={10}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Ionicons name="search-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-base">No countries found</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
}
