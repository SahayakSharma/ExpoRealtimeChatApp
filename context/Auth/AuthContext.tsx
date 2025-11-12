import CustomSplashScreen from "@/components/customSplashScreen";
import IncompleteProfileScreen from "@/components/screenComponents/auth/IncompleteProfileScreen";
import { FirebaseAppConfig } from "@/config/firebaseAppConfig";
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes, serverTimestamp } from "@react-native-firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserDetailsRecord, setUserDetailsRecord } from "./Helper/userDetailsHelperFunction";


interface IAuthContext {
    isAuthenticated: boolean;
    currentUserSession: FirebaseAuthTypes.User | null;
    currentUserDetails: FirebaseFirestoreTypes.DocumentData | undefined;
    isProfileComplete: boolean;
    refreshUserDetails: () => Promise<void>;
}

function checkProfileCompletion(
    userDetails: FirebaseFirestoreTypes.DocumentData | undefined,
    authUser: FirebaseAuthTypes.User | null
): {
    isComplete: boolean;
    missingFields: string[];
    availableAuthData: Record<string, string>;
} {
    const availableAuthData: Record<string, string> = {};
    
    if (authUser) {
        if (authUser.displayName) availableAuthData.name = authUser.displayName;
        if (authUser.email) availableAuthData.email = authUser.email;
        if (authUser.phoneNumber) availableAuthData.phone_number = authUser.phoneNumber;
    }

    if (!userDetails) {
        const requiredFields = ['name', 'email', 'phone_number'];
        const missingFields = requiredFields.filter(field => !availableAuthData[field]);
        
        return { 
            isComplete: missingFields.length === 0, 
            missingFields,
            availableAuthData
        };
    }

    const requiredFields = ['name', 'email', 'phone_number'];
    const missingFields: string[] = [];

    for (const field of requiredFields) {
        const hasInFirestore = userDetails[field] && userDetails[field] !== null && userDetails[field] !== '';
        const hasInAuth = availableAuthData[field] !== undefined;
        
        if (!hasInFirestore && !hasInAuth) {
            missingFields.push(field);
        }
    }

    return {
        isComplete: missingFields.length === 0,
        missingFields,
        availableAuthData
    };
}


const AuthContext = createContext<IAuthContext>({
    isAuthenticated: false,
    currentUserSession: null,
    currentUserDetails: undefined,
    isProfileComplete: false,
    refreshUserDetails: async () => {}
});


export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUserSession, setCurrentUserSession] = useState<FirebaseAuthTypes.User | null>(null);
    const [currentUserDetails, setCurrentUserDetails] = useState<FirebaseFirestoreTypes.DocumentData | undefined>();
    const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const instance = FirebaseAppConfig.getInstance();

    async function refreshUserDetails() {
        if (!currentUserSession) return;
        
        try {
            const userRec = await getUserDetailsRecord(currentUserSession.uid, instance.getDb());
            
            if (userRec.exists()) {
                const userData = userRec.data();
                setCurrentUserDetails(userData);
                
                const { isComplete } = checkProfileCompletion(userData, currentUserSession);
                setIsProfileComplete(isComplete);
            }
        } catch (err) {
            console.log("Error refreshing user details:", err);
        }
    }

    async function populateUserDetailsOnUserSwitch(uid:string) {
        try {
            const userRec = await getUserDetailsRecord(uid, instance.getDb());
            let userData;
            
            if (userRec.exists()) { 
                userData = userRec.data();
                setCurrentUserDetails(userData); 
            } else {
                const payload = await createUserRecord(uid);
                userData = payload;
                setCurrentUserDetails(payload);
            }
            
            const { isComplete } = checkProfileCompletion(userData, currentUserSession);
            setIsProfileComplete(isComplete);
        }
        catch (err) { 
            console.log("Error fetching user details:", err);
            setIsProfileComplete(false);
        }
    }

    async function createUserRecord(uid:string):Promise<FirebaseFirestoreTypes.DocumentData> {
        const payload = {
            name: currentUserSession?.displayName || null,
            email: currentUserSession?.email || null,
            phone_number: currentUserSession?.phoneNumber || null,
            createdAt: serverTimestamp()
        };
        await setUserDetailsRecord(uid, payload, instance.getDb());
        return payload
    }

    useEffect(() => {
        const instance = FirebaseAppConfig.getInstance();
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            setLoading(true);
            if (user) {
                setCurrentUserSession(user);
                setIsAuthenticated(true);
                await populateUserDetailsOnUserSwitch(user.uid);
            } else {
                setIsAuthenticated(false);
                setCurrentUserSession(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [])

    const { missingFields, availableAuthData } = checkProfileCompletion(currentUserDetails, currentUserSession);

    return (
        loading ? <CustomSplashScreen /> :
            <AuthContext.Provider value={{
                isAuthenticated,
                currentUserSession,
                currentUserDetails,
                isProfileComplete,
                refreshUserDetails
            }}>
                {isAuthenticated && !isProfileComplete && currentUserSession ? (
                    <IncompleteProfileScreen 
                        missingFields={missingFields}
                        userId={currentUserSession!.uid}
                        onProfileUpdated={refreshUserDetails}
                        availableAuthData={availableAuthData}
                    />
                ) : (
                    children
                )}
            </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}