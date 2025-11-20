import { useEffect, useState } from "react";
import { SignUpSteps, swipeDirection } from "../utils/types";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderActiveStepBar from "./HeaderActiveStepBar";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { runOnJS, scheduleOnRN } from "react-native-worklets";
import SignUpStepManager from "./SignUpStepManager";





export default function SignUpContainer() {
    const [currentStep, setCurrentStep] = useState<SignUpSteps>(1);
    const [direction,setDirection]=useState<swipeDirection>(swipeDirection.NEXT);
    const currentStepShared = useSharedValue(1);
    function handleIncrementStep() {
        setDirection(swipeDirection.NEXT);
        if (currentStep < 3) {
            setCurrentStep((prevStep) => (prevStep + 1) as SignUpSteps);
        }
    }

    function handleDecrementStep() {
        setDirection(swipeDirection.PREVIOUS);
        if (currentStep > 1) {
            setCurrentStep((prevStep) => (prevStep - 1) as SignUpSteps);
        }
    }

    const panGesture = Gesture.Pan().onEnd((event) => {
        if (event.translationX > 50) {
            runOnJS(handleDecrementStep)();
        }
        else if (event.translationX < -50) {
            runOnJS(handleIncrementStep)();
        }
    })
    
    return (
        <GestureHandlerRootView className="flex-1">
            <SafeAreaView className="flex-1" edges={['top']}>
                <HeaderActiveStepBar activeState={currentStep} direction={direction}/>
                <GestureDetector gesture={panGesture}>
                    <View className="flex-1" collapsable={false}>
                        <SignUpStepManager activeStep={currentStep} nextStep={handleIncrementStep} prevStep={handleDecrementStep}/>
                    </View>
                </GestureDetector>
            </SafeAreaView>
        </GestureHandlerRootView>
    )
}