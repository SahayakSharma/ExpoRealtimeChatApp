import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

export default function SecondSignUpStep({ lastActiveStep, nextStep, previousStep }: { lastActiveStep: number, nextStep: () => void, previousStep: () => void }) {

    const initialX = useSharedValue(lastActiveStep === 1 ? 400 : -400);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform:[{
                translateX:initialX.value
            }]
        }
    })
    useEffect(() => {
        initialX.value = withSpring(0,{
            duration:1000
        })
    }, [])

    return (
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1 px-8 justify-center"
        >
            <Animated.View style={[animatedStyle]}>
                <View className="mb-12">
                    <Text className="text-4xl font-bold text-gray-800 mb-3">
                        Nice to meet you
                    </Text>
                    <Text className="text-lg text-gray-600">
                        What should we call you?
                    </Text>
                </View>

                <View className="mb-8">
                    <Text className="text-sm font-semibold text-gray-700 mb-3">
                        Full Name
                    </Text>
                    <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center border-2 border-c3/30">
                        <Ionicons name="person-outline" size={22} color="#6B7280" />
                        <TextInput
                            placeholder="John Doe"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="words"
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