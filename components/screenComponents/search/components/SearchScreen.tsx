import { useAuthContext } from "@/context/Auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { searchUsersByEmail } from "../helper/searchService";
import { useDebounce } from "../helper/useDebounce";
import UserSearchCard from "./UserSearchCard";

export interface UserSearchResult {
  uid: string;
  name: string;
  email: string;
  phone_number?: string;
  profile_picture?: string;
}

export default function SearchScreen() {
  const { currentUserSession } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchUsersByEmail(query.trim());
      const filteredResults = results.filter(
        (user) => user.uid !== currentUserSession?.uid
      );
      setSearchResults(filteredResults);
      setHasSearched(true);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  useDebounce(() => performSearch(searchQuery), 500, [searchQuery]);

  const renderEmptyState = () => {
    if (isSearching) return null;

    if (!hasSearched) {
      return (
        <View className="items-center justify-center mt-20">
          <Ionicons name="search-outline" size={64} color="#C9B59C" />
          <Text className="text-gray-500 text-base mt-4 text-center px-8">
            Search for users by their email address
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View className="items-center justify-center mt-20">
          <Ionicons name="person-remove-outline" size={64} color="#C9B59C" />
          <Text className="text-gray-700 text-lg font-semibold mt-4">
            No users found
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center px-8">
            Try searching with a different email
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View className="flex-1 px-4 pt-4">
      <View className="mb-4">
        <View
          className={`flex-row items-center bg-white/40 rounded-xl px-4 py-3 border-2 ${
            searchQuery ? "border-c4 bg-white/60" : "border-c3/50"
          }`}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={searchQuery ? "#C9B59C" : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search by email..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isSearching && (
            <ActivityIndicator size="small" color="#C9B59C" className="ml-2" />
          )}
          {searchQuery && !isSearching && (
            <Ionicons
              name="close-circle"
              size={20}
              color="#9ca3af"
              onPress={() => setSearchQuery("")}
            />
          )}
        </View>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => <UserSearchCard user={item} />}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
