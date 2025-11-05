import { doc, FirebaseFirestoreTypes,getDoc, setDoc } from "@react-native-firebase/firestore";

export async function getUserDetailsRecord(userId: string,dbInstance:FirebaseFirestoreTypes.Module):Promise<FirebaseFirestoreTypes.DocumentSnapshot>{
    const docRef=doc(dbInstance,'Users',userId);
    return getDoc(docRef);
}

export async function setUserDetailsRecord(userId: string, userDetails: FirebaseFirestoreTypes.DocumentData, dbInstance: FirebaseFirestoreTypes.Module): Promise<void> {
    const docRef = doc(dbInstance, 'Users', userId);
    return setDoc(docRef, userDetails);
}