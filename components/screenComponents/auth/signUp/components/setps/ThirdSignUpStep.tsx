import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

export default function ThirdSignUpStep({ lastActiveStep, previousStep }: { lastActiveStep: number, previousStep: () => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const initialX = useSharedValue(400);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{
                translateX: initialX.value
            }]
        }
    })

    useEffect(() => {
        initialX.value = withSpring(0, {
            duration: 1000
        })
    }, [])

    return (
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1 px-8 justify-center"
            keyboardVerticalOffset={Platform.OS === "android" ? 90 : 0}
        >
            <Animated.View style={[animatedStyle]}>
                <View className="mb-12">
                    <Text className="text-4xl font-bold text-gray-800 mb-3">
                        Secure your account
                    </Text>
                    <Text className="text-lg text-gray-600">
                        Create a strong password
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-3">
                        Password
                    </Text>
                    <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center border-2 border-c3/30">
                        <Ionicons name="lock-closed-outline" size={22} color="#6B7280" />
                        <TextInput
                            placeholder="Enter password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            className="flex-1 ml-3 text-base text-gray-800"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={22}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-8">
                    <Text className="text-sm font-semibold text-gray-700 mb-3">
                        Confirm Password
                    </Text>
                    <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center border-2 border-c3/30">
                        <Ionicons name="lock-closed-outline" size={22} color="#6B7280" />
                        <TextInput
                            placeholder="Confirm password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            className="flex-1 ml-3 text-base text-gray-800"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Ionicons
                                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                                size={22}
                                color="#6B7280"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-c4 rounded-2xl py-5 items-center shadow-sm"
                    activeOpacity={0.8}
                >
                    <Text className="text-white text-base font-bold">
                        Create Account
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="mt-6 items-center"
                    activeOpacity={0.7}
                    onPress={previousStep}
                >
                    <Text className="text-gray-600 text-sm">
                        <Ionicons name="arrow-back" size={14} color="#6B7280" />{" "}
                        <Text className="text-c4 font-semibold">Go back</Text>
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}