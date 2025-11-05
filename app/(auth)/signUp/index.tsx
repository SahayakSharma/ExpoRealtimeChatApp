import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import SocialButton from "../components/SocialButton";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LinearGradient
            colors={["#7c3aed", "#a855f7", "#c084fc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="pt-12 pb-16 px-6 rounded-b-[40px]"
          >
            <View className="items-center">
              <View className="bg-white/20 p-4 rounded-3xl mb-4">
                <Text className="text-5xl">🚀</Text>
              </View>
              <Text className="text-white text-4xl font-bold mb-2">
                Create Account
              </Text>
              <Text className="text-purple-100 text-base text-center">
                Join us and start chatting instantly
              </Text>
            </View>
          </LinearGradient>

          <View className="flex-1 px-6 -mt-8">
            <View className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800">
    \
              <View className="mb-6">
                <CustomInput
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  icon="person-outline"
                />

                <CustomInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  icon="mail-outline"
                />

                <CustomInput
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="lock-closed-outline"
                />

                <CustomInput
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  icon="lock-closed-outline"
                />
              </View>

              <View className="flex-row items-start mb-6">
                <View className="w-5 h-5 rounded-md border-2 border-gray-600 mr-3 mt-0.5" />
                <Text className="flex-1 text-gray-400 text-sm">
                  I agree to the{" "}
                  <Text className="text-purple-400 font-medium">
                    Terms of Service
                  </Text>{" "}
                  and{" "}
                  <Text className="text-purple-400 font-medium">
                    Privacy Policy
                  </Text>
                </Text>
              </View>

              <CustomButton
                title="Create Account"
                onPress={() => {}}
                variant="primary"
              />

              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-gray-700" />
                <Text className="text-gray-500 mx-4 text-sm">
                  Or sign up with
                </Text>
                <View className="flex-1 h-[1px] bg-gray-700" />
              </View>

              <View className="flex-row gap-3 mb-4">
                <SocialButton
                  icon="logo-google"
                  title="Google"
                  onPress={() => {}}
                  iconColor="#EA4335"
                />
                <SocialButton
                  icon="logo-apple"
                  title="Apple"
                  onPress={() => {}}
                  iconColor="#fff"
                />
              </View>
            </View>

            <View className="flex-row justify-center items-center mt-8 mb-6">
              <Text className="text-gray-400 text-base">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-purple-400 font-semibold text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
