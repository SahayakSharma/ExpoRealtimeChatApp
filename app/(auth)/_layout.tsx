import { Stack } from "expo-router";

export default function RootAuthLayout(){
    return(
        <Stack>
            <Stack.Screen name="(auth)/signIn/index"/>
        </Stack>
    )
}