import { gradientBackgroundColors } from "@/lib/global/colorTheme";
import { LinearGradient } from "expo-linear-gradient";
import SettingsHome from "@/components/screenComponents/settings/SettingsHome";

export default function Settings(){
    
        return (
            <LinearGradient
                colors={gradientBackgroundColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-1"
            >
                <SettingsHome />
            </LinearGradient>
        )
}