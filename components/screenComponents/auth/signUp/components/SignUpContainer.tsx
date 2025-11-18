import { useEffect, useState } from "react";
import { SignUpSteps } from "../utils/types";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderActiveStepBar from "./HeaderActiveStepBar";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { runOnJS, scheduleOnRN } from "react-native-worklets";





export default function SignUpContainer() {
    const [currentStep, setCurrentStep] = useState<SignUpSteps>(1);
    const currentStepShared = useSharedValue(1);
    function handleIncrementStep() {
        if (currentStep < 3) {
            setCurrentStep((prevStep) => (prevStep + 1) as SignUpSteps);
        }
    }

    function handleDecrementStep() {
        if (currentStep > 1) {
            setCurrentStep((prevStep) => (prevStep - 1) as SignUpSteps);
        }
    }

    const panGesture = Gesture.Pan().onEnd((event) => {
        if (event.translationX > 1) {
            runOnJS(handleIncrementStep)();
        }
        else {
            runOnJS(handleDecrementStep)();
        }
    })

    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView>
                <HeaderActiveStepBar activeState={currentStep} />
                <GestureDetector gesture={panGesture}>
                    <Text className="text-white text-center mt-10 text-lg">Current Step: {currentStep}</Text>
                </GestureDetector>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}