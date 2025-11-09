import { useAuthContext } from "@/context/Auth/AuthContext";
import { Redirect } from "expo-router";

export default function App(){

    const {isAuthenticated} = useAuthContext();

    return isAuthenticated ? <Redirect href="/(tab)/chats"/> : <Redirect href="/(auth)/signIn"/>
}