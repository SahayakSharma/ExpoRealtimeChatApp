import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import { FirebaseAuthTypes, onAuthStateChanged, getAuth } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore"
import { createContext, useContext, useState, useEffect } from "react";
import CustomSplashScreen from "@/components/customSplashScreen";
import { getUserDetailsRecord, setUserDetailsRecord } from "./Helper/userDetailsHelperFunction";


interface IAuthContext {
    isAuthenticated: boolean;
    currentUserSession: FirebaseAuthTypes.User | null;
    currentUserDetails: FirebaseFirestoreTypes.DocumentData | undefined;
}


const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    currentUserSession: null,
    currentUserDetails: undefined
});


export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUserSession, setCurrentUserSession] = useState<FirebaseAuthTypes.User | null>(null);
    const [currentUserDetails, setCurrentUserDetails] = useState<FirebaseFirestoreTypes.DocumentData | undefined>();
    const [loading, setLoading] = useState<boolean>(true);

    const instance = FirebaseAppConfig.getInstance();

    async function populateUserDetailsOnUserSwitch() {
        try {
            const userRec = await getUserDetailsRecord(currentUserSession!.uid, instance.getDb());
            if (userRec.exists()) { setCurrentUserDetails(userRec.data()); }
            else {
                const payload=await createUserRecord();
                setCurrentUserDetails(payload);
            }
        }
        catch (err) { console.log("Error fetching user details:", err); }
    }

    async function createUserRecord():Promise<FirebaseFirestoreTypes.DocumentData> {
        const payload = {
            name: currentUserSession!.displayName || 'No Name',
            email: currentUserSession!.email || 'No Email',
            createdAt: FirebaseFirestoreTypes.Timestamp.now()
        };
        await setUserDetailsRecord(currentUserSession!.uid, payload, instance.getDb());
        return payload
    }

    useEffect(() => {
        const instance = FirebaseAppConfig.getInstance();
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            setLoading(true);
            if (user) {
                await populateUserDetailsOnUserSwitch();
                setIsAuthenticated(true);
                setCurrentUserSession(user);
            } else {
                setIsAuthenticated(false);
                setCurrentUserSession(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [])

    return (
        loading ? <CustomSplashScreen /> :
            <AuthContext.Provider value={{
                isAuthenticated,
                currentUserSession,
                currentUserDetails
            }}>
                {children}
            </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}