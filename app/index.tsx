import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function App(){
    return(
        <SafeAreaView className="p-10">
            <Text className="font-bold">
                hi there
            </Text>
        </SafeAreaView>
    )
}