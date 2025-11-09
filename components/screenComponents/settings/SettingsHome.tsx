import { settingsMenuList } from "@/lib/settings/settingsInfo";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsListItem from "./SettingsListItem";

export default function SettingsHome(){
    return(
        <SafeAreaView className="px-5">
            <FlatList 
                data={settingsMenuList}
                renderItem={({item})=><SettingsListItem item={item}/>}
            />
        </SafeAreaView>
    )
}