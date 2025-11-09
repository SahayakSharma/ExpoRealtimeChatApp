import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { gradientBackgroundColors } from "@/lib/global/colorTheme";

export default function Search() {

    return (
        <LinearGradient
            colors={gradientBackgroundColors}
            start={{x:0,y:0}}
            end={{x:1,y:1}}
            className="flex-1"
            >
            <SafeAreaView>
                <Text>hi there search</Text>
            </SafeAreaView>
        </LinearGradient>
    )
}