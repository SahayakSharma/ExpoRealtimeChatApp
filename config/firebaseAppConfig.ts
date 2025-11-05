
import { getFirestore, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export class FirebaseAppConfig{
    
    private static instance: FirebaseAppConfig;
    private db:FirebaseFirestoreTypes.Module;

    public static getInstance(): FirebaseAppConfig{
        if(!this.instance){
            this.instance = new FirebaseAppConfig();
        }
        return this.instance;
    }

    private constructor(){
        this.db=getFirestore();
    }

    public getDb(): FirebaseFirestoreTypes.Module{
        return this.db;
    }
}