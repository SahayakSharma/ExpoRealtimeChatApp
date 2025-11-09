import { useAuthContext } from "@/context/Auth/AuthContext";
import { Entypo } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function RootProtectedLayout() {

    const { isAuthenticated } = useAuthContext();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)/signIn");
        }
    }, [isAuthenticated])

    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                backgroundColor: '#EFE9E3',
                height: 100,
                paddingTop: 15
            },
            tabBarActiveTintColor: '#000000',
            tabBarLabelStyle: {
                fontSize: 15
            },
            tabBarInactiveTintColor: '#C9B59C',
            headerStyle: {
                backgroundColor: '#EFE9E3',
            }
        }}>
            <Tabs.Screen name="chats/index" options={{
                tabBarLabel: "Messages",
                tabBarIcon: ({ color }) => <Entypo name="chat" size={24} color={color} />,
                headerTitle: () => (
                    <View className="w-full px-2 flex-row justify-between items-center">
                        <Text className="font-semibold text-3xl">Messages</Text>
                        <View className="flex-row gap-5 items-center">
                            <TouchableOpacity onPress={()=>router.push("/(tab)/search")}>
                                <Entypo name="plus" size={30} color={'#000000'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }} />
            <Tabs.Screen name="calls/index" options={{
                tabBarLabel: "Calls",
                tabBarIcon: ({ color }) => <Entypo name="phone" size={24} color={color} />,
                headerTitle: () => (
                    <View className="w-full px-2 flex-row justify-between items-center">
                        <Text className="font-semibold text-3xl">Call Records</Text>
                        <View className="flex-row gap-5 items-center">
                            <TouchableOpacity onPress={()=>router.push("/(tab)/chats")}>
                                <Entypo name="chat" size={24} color={'#000000'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }} />
            <Tabs.Screen name="search/index" options={{
                tabBarLabel: "Search",
                tabBarIcon: ({ color }) => <Entypo name="magnifying-glass" size={24} color={color} />,
                headerTitle: () => (
                    <View className="w-full px-2 flex-row justify-between items-center">
                        <Text className="font-semibold text-3xl">Find Someone</Text>
                        <View className="flex-row gap-5 items-center">
                            <TouchableOpacity onPress={()=>router.push("/(tab)/chats")}>
                                <Entypo name="chat" size={24} color={'#000000'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }} />
            <Tabs.Screen name="settings/index" options={{
                tabBarLabel: "Settings",
                tabBarIcon: ({ color }) => <Entypo name="cog" size={24} color={color} />,
                headerTitle: () => (
                    <View className="w-full px-2 flex-row justify-between items-center">
                        <Text className="font-semibold text-3xl">Settings</Text>
                        <View className="flex-row gap-5 items-center">
                            <TouchableOpacity onPress={()=>router.push("/(tab)/chats")}>
                                <Entypo name="chat" size={24} color={'#000000'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }} />
        </Tabs>
    )
}