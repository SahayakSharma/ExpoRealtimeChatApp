import { Stack } from "expo-router";


export default function RootProtectedLayout(){
    return(
        <Stack>
            <Stack.Screen name="(tab)/home/index" options={{headerShown:false}}/>
        </Stack>
    )
}