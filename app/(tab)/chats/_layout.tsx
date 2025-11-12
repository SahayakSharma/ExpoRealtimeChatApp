import { useAuthContext } from "@/context/Auth/AuthContext";
import { ChatRoomsProvider } from "@/context/ChatRooms/ChatRoomsContext";
import { Entypo } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ChatsLayout() {
    const { currentUserSession } = useAuthContext();

    if (!currentUserSession) {
        return null;
    }

    return (
        <ChatRoomsProvider userId={currentUserSession.uid}>
            <Stack
                screenOptions={{
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="index" options={{
                    headerShown: true,
                    headerTitle: () => (
                        <View className="w-full px-2 flex-row justify-between items-center">
                            <Text className="font-semibold text-3xl">Messages</Text>
                            <View className="flex-row gap-5 items-center">
                                <TouchableOpacity onPress={() => router.push("/(tab)/search")}>
                                    <Entypo name="plus" size={30} color={'#000000'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }} />
                <Stack.Screen name="[roomId]" options={{
                    headerShown:false
                }}/>
            </Stack>
        </ChatRoomsProvider>
    );
}
