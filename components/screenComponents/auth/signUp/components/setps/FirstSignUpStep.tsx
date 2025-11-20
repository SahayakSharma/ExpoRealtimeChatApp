import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

export default function FirstSignUpStep({ nextStep }: { nextStep: () => void }) {

    const initialX = useSharedValue(-400);

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
            className="flex-1 px-8 justify-center">
            <Animated.View style={[{flex:1},animatedStyle]}>
                <View className="mb-12">
                    <Text className="text-4xl font-bold text-gray-800 mb-3">
                        Welcome
                    </Text>
                    <Text className="text-lg text-gray-600">
                        Let's start with your email
                    </Text>
                </View>

                <View className="mb-8">
                    <Text className="text-sm font-semibold text-gray-700 mb-3">
                        Email Address
                    </Text>
                    <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center border-2 border-c3/30">
                        <Ionicons name="mail-outline" size={22} color="#6B7280" />
                        <TextInput
                            placeholder="you@example.com"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="flex-1 ml-3 text-base text-gray-800"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-c4 rounded-2xl py-5 items-center shadow-sm"
                    activeOpacity={0.8}
                    onPress={nextStep}
                >
                    <Text className="text-white text-base font-bold">
                        Continue
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity className="mt-6 items-center" activeOpacity={0.7}>
                    <Text className="text-gray-600 text-sm">
                        Already have an account?{" "}
                        <Text className="text-c4 font-semibold">Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}