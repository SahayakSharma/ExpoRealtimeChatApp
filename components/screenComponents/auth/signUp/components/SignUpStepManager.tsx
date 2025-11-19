import { TextInput,View,TouchableOpacity,Text } from "react-native";


export default function SignUpStepManager({activeStep}:{activeStep:number}) {
    return(
        <View className="flex-1">
            <TextInput className="bg-white p-4 m-4 rounded-lg" placeholder={`Input for Step ${activeStep}`} />
            <TouchableOpacity className="bg-blue-500 p-4 m-4 rounded-lg">
                <Text className="text-white text-center">Button for Step {activeStep}</Text>
            </TouchableOpacity>
        </View>
    )
}