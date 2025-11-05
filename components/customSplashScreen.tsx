import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CustomSplashScreen() {
    return (
        <SafeAreaView className="flex-1 items-center justify-center">
            <Image source={require("../assets/images/splash-icon.png")} className="w-[300px] h-[300px] rounded-full animate-bounce" />
        </SafeAreaView>
    )
}