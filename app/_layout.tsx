import { AuthContextProvider } from "@/context/Auth/AuthContext";
import "../global.css"
import { Stack } from 'expo-router';
import 'react-native-reanimated';


export default function RootLayout() {

  return (
    <AuthContextProvider>
      <Stack screenOptions={{
        headerShown:false
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </AuthContextProvider>
  );
}