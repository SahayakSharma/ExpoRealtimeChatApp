import NotificationsScreen from "@/components/screenComponents/notifications/components/NotificationsScreen";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { NotificationProvider } from "@/context/Notification/NotificationContext";
import { gradientBackgroundColors } from "@/lib/global/colorTheme";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
    const { currentUserSession } = useAuthContext();

    if (!currentUserSession) {
        return null;
    }

    return (
        <LinearGradient
            colors={gradientBackgroundColors}
            start={{x:0,y:0}}
            end={{x:1,y:1}}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <NotificationProvider userId={currentUserSession.uid}>
                    <NotificationsScreen />
                </NotificationProvider>
            </SafeAreaView>
        </LinearGradient>
    );
}
