import ChatRoomScreen from "@/components/screenComponents/chats/components/ChatRoomScreen";
import { useAuthContext } from "@/context/Auth/AuthContext";
import { ChatProvider } from "@/context/Chat/ChatContext";
import { gradientBackgroundColors } from "@/lib/global/colorTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from "react";

export default function ChatRoom() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const { currentUserSession } = useAuthContext();

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: {
          backgroundColor: '#EFE9E3',
        }
      });
    };
  }, [navigation]);

  const {
    roomId,
    otherUserId,
    otherUserName,
    otherUserEmail,
    otherUserProfilePicture,
  } = params;

  const handleBackPress = () => {
    router.back();
  };

  if (!roomId || !otherUserId || !otherUserName || !otherUserEmail || !currentUserSession) {
    return null;
  }

  return (
    <LinearGradient
      colors={gradientBackgroundColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <ChatProvider 
        roomId={roomId as string} 
        currentUserId={currentUserSession.uid}
      >
        <ChatRoomScreen
          roomId={roomId as string}
          otherUserId={otherUserId as string}
          otherUserName={otherUserName as string}
          otherUserEmail={otherUserEmail as string}
          otherUserProfilePicture={otherUserProfilePicture as string | undefined}
          onBackPress={handleBackPress}
        />
      </ChatProvider>
    </LinearGradient>
  );
}
