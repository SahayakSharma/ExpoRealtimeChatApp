import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "@react-native-firebase/auth";
import { RelativePathString } from "expo-router";

export interface ISettingsMenuItem{
    title:string;
    iconName:keyof typeof Ionicons.glyphMap;
    navigationPath?:string;
    type:'action' | 'navigation';
    action?:()=>void;
}

export const settingsMenuList: ISettingsMenuItem[] = [
    {
        title:'Account',
        iconName:"person",
        navigationPath:'/settings/account',
        type:'navigation'
    },
    {
        title:'Notifications',
        iconName:"notifications",
        navigationPath:'/settings/notifications',
        type:'navigation'
    },
    {
        title:'Privacy & Security',
        iconName:"lock-closed",
        navigationPath:'/settings/privacy',
        type:'navigation'
    },
    {
        title:'Log Out',
        iconName:"log-out",
        navigationPath:'/settings/logout',
        type:'action',
        action:()=>{getAuth().signOut()}
    }
]