import { Stack } from "expo-router";

export default function RootAuthLayout(){
    return(
        <Stack screenOptions={{
            headerShown:false
        }}>
            <Stack.Screen name="(auth)/signIn/index" options={{headerShown:false}}/>
        </Stack>
    )
}