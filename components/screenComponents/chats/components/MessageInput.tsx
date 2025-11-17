import { Entypo, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, TextInput, Keyboard, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {

  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const textInputHeight=useSharedValue<number>(60);

  useEffect(()=>{
    console.log("value as ",isKeyboardVisible, textInputHeight.value)
  },[isKeyboardVisible])

  const handleSend = async () => {
    const trimmedText = text.trim();
    if (!trimmedText || isSending || disabled) return;

    setIsSending(true);
    try {
      await onSend(trimmedText);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  function handleKeyboardShow(){
    setIsKeyboardVisible(true);
    let temp=textInputHeight.value;
    temp+=70
    textInputHeight.value=withSpring(temp,{
      duration:1000
    })
  }
  function handleKeyboardHide(){
    setIsKeyboardVisible(false);
    let temp=textInputHeight.value;
    temp-=70
    textInputHeight.value=withSpring(temp,{
      duration:1000
    })
  }

  useEffect(()=>{
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  },[])

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={10}
    >
      <Animated.View style={{
        height: textInputHeight
      }} className="overflow-hidden px-5">
        <View className="bg-c4 flex-row gap-2 rounded-3xl px-4 items-center" style={{
          height: 60
        }}>
          <Entypo name="magnifying-glass" size={24} color="white" />
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="white"
            multiline
            maxLength={1000}
            style={{
              maxHeight: 100,
              fontSize: 16,
              color: "#ffffff",
            }}
            editable={!disabled && !isSending}
            className="flex-1 text-base"
          />
        </View>

        <View className="flex-row justify-around items-center mt-5">
          <View className="w-[50px] h-[50px] bg-c4 rounded-full flex-row items-center justify-center">
            <Entypo name="attachment" size={24} color="white" />
          </View>
          <View className="w-[50px] h-[50px] bg-c4 rounded-full flex-row items-center justify-center">
            <Entypo name="folder-images" size={24} color="white" />
          </View>
          <View className="w-[50px] h-[50px] bg-c4 rounded-full flex-row items-center justify-center">
            <Entypo name="mic" size={24} color="white" />
          </View>
          <View className="w-[50px] h-[50px] bg-c4 rounded-full flex-row items-center justify-center">
            <Entypo name="paper-plane" size={24} color="white" />
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
