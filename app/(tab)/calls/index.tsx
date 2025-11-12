import { Ionicons } from "@expo/vector-icons";
import { gradientBackgroundColors } from "@/lib/global/colorTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calls() {
  return (
    <LinearGradient
      colors={gradientBackgroundColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-8">
          {/* Icon Container */}
          <View className="mb-8">
            <View className="relative">
              {/* Outer ring */}
              <View className="w-40 h-40 rounded-full bg-c4/10 items-center justify-center">
                {/* Middle ring */}
                <View className="w-32 h-32 rounded-full bg-c4/20 items-center justify-center">
                  {/* Inner circle */}
                  <View className="w-24 h-24 rounded-full bg-c4 items-center justify-center shadow-lg">
                    <Ionicons name="call" size={48} color="#ffffff" />
                  </View>
                </View>
              </View>
              
              {/* Decorative elements */}
              <View className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-green-500 items-center justify-center border-4 border-c1">
                <Ionicons name="videocam" size={20} color="#ffffff" />
              </View>
              <View className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-c3 items-center justify-center border-4 border-c1">
                <Ionicons name="mic" size={20} color="#ffffff" />
              </View>
            </View>
          </View>

          {/* Text Content */}
          <View className="items-center mb-8">
            <Text className="text-gray-800 text-3xl font-bold mb-3 text-center">
              Coming Soon
            </Text>
            <Text className="text-c4 text-lg font-semibold mb-4 text-center">
              Voice & Video Calls
            </Text>
            <Text className="text-gray-600 text-base text-center leading-6 max-w-sm">
              We're working on bringing you crystal-clear voice and video calling
              features. Stay tuned!
            </Text>
          </View>

          {/* Feature Cards */}
          <View className="w-full max-w-md gap-3">
            <View className="bg-white/60 rounded-2xl p-4 border border-c3/30">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-c4/20 items-center justify-center mr-3">
                  <Ionicons name="call-outline" size={20} color="#C9B59C" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 text-sm font-bold">
                    HD Voice Calls
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    High-quality audio conversations
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white/60 rounded-2xl p-4 border border-c3/30">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                  <Ionicons name="videocam-outline" size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 text-sm font-bold">
                    Video Calling
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Face-to-face conversations
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white/60 rounded-2xl p-4 border border-c3/30">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-c4/20 items-center justify-center mr-3">
                  <Ionicons name="people-outline" size={20} color="#C9B59C" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 text-sm font-bold">
                    Group Calls
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Connect with multiple friends
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bottom Badge */}
          <View className="mt-8">
            <View style={{ backgroundColor: '#F5F0EB' }} className="px-6 py-3 rounded-full border-2 border-c3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#C9B59C" />
                <Text className="text-c4 text-xs font-bold ml-2">
                  FEATURE IN DEVELOPMENT
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}