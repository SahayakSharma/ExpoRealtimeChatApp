import NotificationsScreen from "@/components/screenComponents/notifications/components/NotificationsScreen";
import { gradientBackgroundColors } from "@/lib/global/colorTheme";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
    return (
        <LinearGradient
            colors={gradientBackgroundColors}
            start={{x:0,y:0}}
            end={{x:1,y:1}}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <NotificationsScreen />
            </SafeAreaView>
        </LinearGradient>
    );
}
