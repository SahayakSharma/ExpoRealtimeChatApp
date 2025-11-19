import { View } from "react-native";
import { SignUpSteps, swipeDirection } from "../utils/types";
import Animated from "react-native-reanimated";
import AnimatedDash from "./AnimatedDash";

export default function HeaderActiveStepBar({activeState,direction}:{activeState:SignUpSteps,direction:swipeDirection}) {
    return(
        <View className="flex-row justify-center items-center gap-2 py-5">
            <AnimatedDash value={1} activeValue={activeState} direction={direction} />
            <AnimatedDash value={2} activeValue={activeState} direction={direction} />
            <AnimatedDash value={3} activeValue={activeState} direction={direction} />
        </View>
    )
}