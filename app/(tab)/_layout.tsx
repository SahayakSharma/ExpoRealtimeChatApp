import { useAuthContext } from "@/context/Auth/AuthContext";
import { NotificationProvider, useNotifications } from "@/context/Notification/NotificationContext";
import { Entypo } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

function NotificationTabIcon({ color }: { color: string }) {
    const { unreadCount } = useNotifications();

    return (
        <View>
            <Entypo name="bell" size={24} color={color} />
            {unreadCount > 0 && (
                <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: '#ef4444',
                    borderRadius: 9,
                    minWidth: 18,
                    height: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 4,
                }}>
                    <Text style={{
                        color: '#ffffff',
                        fontSize: 10,
                        fontWeight: 'bold',
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                </View>
            )}
        </View>
    );
}

function TabsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                backgroundColor: '#EFE9E3',
                height: 100,
                paddingTop: 15,
                paddingHorizontal:10
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
            <Tabs.Screen name="chats" options={{
                tabBarLabel: "Messages",
                tabBarIcon: ({ color }) => <Entypo name="chat" size={24} color={color} />,
                headerShown:false
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
            <Tabs.Screen name="notifications/index" options={{
                tabBarLabel: "Notifications",
                tabBarIcon: ({ color }) => <NotificationTabIcon color={color} />,
                headerTitle: () => (
                    <View className="w-full px-2 flex-row justify-between items-center">
                        <Text className="font-semibold text-3xl">Notifications</Text>
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
    );
}

export default function RootProtectedLayout() {

    const { isAuthenticated, currentUserSession } = useAuthContext();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/(auth)/signIn");
        }
    }, [isAuthenticated])

    if (!currentUserSession) {
        return null;
    }

    return (
        <NotificationProvider userId={currentUserSession.uid}>
            <TabsLayout />
        </NotificationProvider>
    )
}