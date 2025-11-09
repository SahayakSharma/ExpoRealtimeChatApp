import { useAuthContext } from "@/context/Auth/AuthContext";
import { Entypo } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";

export default function RootProtectedLayout() {

    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)/signIn");
        }
    }, [isAuthenticated])

    return (
        <Tabs>
            <Tabs.Screen name="chats/index" options={{
                tabBarLabel: "Messages",
                tabBarIcon: () => <Entypo name="chat" size={24} color="black" />
            }} />
            <Tabs.Screen name="calls/index" options={{
                tabBarLabel: "Calls",
                tabBarIcon: () => <Entypo name="phone" size={24} color="black" />
            }} />
        </Tabs>
    )
}