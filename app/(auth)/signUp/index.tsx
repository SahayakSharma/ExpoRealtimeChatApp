import SignUpContainer from "@/components/screenComponents/auth/signUp/components/SignUpContainer";
import { gradientBackgroundColors } from "@/lib/global/colorTheme";
import { LinearGradient } from "expo-linear-gradient";


export default function SignUpPage() {

  return (
    <LinearGradient
      colors={gradientBackgroundColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SignUpContainer/>
    </LinearGradient>
  )
}