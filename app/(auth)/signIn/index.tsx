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
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "./helper/signInFunctions";
import { signInWithGoogle } from "./helper/signInFunctions";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState<String | null>(null);

  async function handleSignIn(method: 'emailPassword' | 'google' | 'apple') {
    try {
      if (method === 'emailPassword') {
        await signInWithEmailAndPassword(email, password);
      }
      else if (method === 'google') {
        await signInWithGoogle();
      }
    }
    catch (error) {
      setSignInError(error instanceof Error ? error.message : String(error));
    }
  }
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
            colors={["#1e3a8a", "#3b82f6", "#60a5fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="pt-12 pb-16 px-6 rounded-b-[40px]"
          >
            <View className="items-center">
              <View className="bg-white/20 p-4 rounded-3xl mb-4">
                <Text className="text-5xl">💬</Text>
              </View>
              <Text className="text-white text-4xl font-bold mb-2">
                Welcome Back
              </Text>
              <Text className="text-blue-100 text-base text-center">
                Sign in to continue your conversations
              </Text>
            </View>
          </LinearGradient>

          <View className="flex-1 px-6 -mt-8">

            <View className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-800">

              <View className="mb-6">
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
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="lock-closed-outline"
                />
              </View>
              {
                signInError && <Text className="text-red-500 font-semibold text-sm text-right">
                  {signInError}
                </Text>
              }
              <TouchableOpacity
                className="self-end mb-6"
                activeOpacity={0.7}
              >
                <Text className="text-blue-400 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <CustomButton
                title="Sign In"
                onPress={() => handleSignIn('emailPassword')}
                variant="primary"
              />

              <View className="flex-row items-center my-6">
                <View className="flex-1 h-[1px] bg-gray-700" />
                <Text className="text-gray-500 mx-4 text-sm">
                  Or continue with
                </Text>
                <View className="flex-1 h-[1px] bg-gray-700" />
              </View>

              <View className="flex-row gap-3 mb-4">
                <SocialButton
                  icon="logo-google"
                  title="Google"
                  onPress={() => handleSignIn('google')}
                  iconColor="#EA4335"
                />
                <SocialButton
                  icon="logo-apple"
                  title="Apple"
                  onPress={() => { }}
                  iconColor="#fff"
                />
              </View>
            </View>

            <View className="flex-row justify-center items-center mt-8 mb-6">
              <Text className="text-gray-400 text-base">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(auth)/signUp')}>
                <Text className="text-blue-400 font-semibold text-base">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}