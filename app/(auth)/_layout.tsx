import { useAuthContext } from "@/context/Auth/AuthContext";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { router } from "expo-router";
export default function RootAuthLayout(){
    const {isAuthenticated} = useAuthContext();

    useEffect(()=>{
        if(isAuthenticated){
            router.replace("/(tab)/chats");
        }
    },[isAuthenticated])
    
    return(
        <Stack screenOptions={{
            headerShown:false
        }}>
            <Stack.Screen name="signIn/index" options={{headerShown:false}}/>
        </Stack>
    )
}