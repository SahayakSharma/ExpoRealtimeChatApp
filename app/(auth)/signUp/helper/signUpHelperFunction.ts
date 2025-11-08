import { getAuth,FirebaseAuthTypes } from "@react-native-firebase/auth";

export async function createAccountWithEmailAndPassword(email: string, password: string):Promise<FirebaseAuthTypes.UserCredential> {
    const auth = getAuth();
    return auth.createUserWithEmailAndPassword(email, password);
}