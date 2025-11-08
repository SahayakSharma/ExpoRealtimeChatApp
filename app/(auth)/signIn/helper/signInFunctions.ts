import { FirebaseAuthTypes, getAuth, signInWithCredential,GoogleAuthProvider } from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
})

export async function signInWithEmailAndPassword(email: string, password: string):Promise<FirebaseAuthTypes.UserCredential> {
    const auth = getAuth();
    return auth.signInWithEmailAndPassword(email, password);
}

export async function signInWithGoogle():Promise<FirebaseAuthTypes.UserCredential>{
    const auth = getAuth();
    return googleSignInFlow();
}

async function googleSignInFlow() {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult = await GoogleSignin.signIn();
  const idToken = signInResult.data?.idToken;
  const googleCredential = GoogleAuthProvider.credential(signInResult.data?.idToken);
  return signInWithCredential(getAuth(), googleCredential);
}