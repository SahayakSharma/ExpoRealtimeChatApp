// ---------------------line number 14 needs action in future ---------------------

import { ISettingsMenuItem } from "@/lib/settings/settingsInfo";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";

export default function SettingsListItem({item}: {item: ISettingsMenuItem}){
    return(
        <TouchableOpacity className="w-full px-10 py-5 bg-c2 mb-5 rounded-xl flex-row gap-5 items-center" activeOpacity={0.6} onPress={()=>{
            if(item.type==='action' && item.action){
                item.action()
            }
            else if(item.type==='navigation' && item.navigationPath){
                //navigation logic left for implementation when all routes are created
            }
        }}>
            <Ionicons name={item.iconName} size={24} color={'#C9B59C'}/>
            <Text className="font-semibold text-xl text-black text-c4">{item.title}</Text>
        </TouchableOpacity>
    )
}