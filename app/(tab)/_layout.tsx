import { useAuthContext } from "@/context/Auth/AuthContext";
import { Stack, router } from "expo-router";
import { useEffect } from "react";

export default function RootProtectedLayout() {

    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)/signIn");
        }
    }, [isAuthenticated])

    return (
        <Stack>
            <Stack.Screen name="(tab)/home/index" options={{ headerShown: false }} />
        </Stack>
    )
}