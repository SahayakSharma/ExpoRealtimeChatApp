import { useAuthContext } from "@/context/Auth/AuthContext";
import { Redirect } from "expo-router";

export default function App(){

    const {isAuthenticated} = useAuthContext();

    return isAuthenticated ? <Redirect href="/(tab)/home"/> : <Redirect href="/(auth)/signIn"/>
}