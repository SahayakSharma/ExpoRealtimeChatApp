import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Message } from '../../components/screenComponents/chats/helper/messageService';
import { sendMessageToRoom, setupMessageListener } from './chatService';
import { ChatContextState, ChatContextValue } from './types';

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  roomId: string;
  currentUserId: string;
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ 
  roomId, 
  currentUserId, 
  children 
}) => {
  const [state, setState] = useState<ChatContextState>({
    messages: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!roomId) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Room ID is required',
      }));
      return;
    }

    const handleMessagesUpdate = (messages: Message[]) => {
      setState({
        messages,
        isLoading: false,
        error: null,
      });
    };

    const handleError = (error: Error) => {
      console.error('Chat listener error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load messages',
      }));
    };

    const unsubscribe = setupMessageListener(
      roomId,
      handleMessagesUpdate,
      handleError
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [roomId]);

  const sendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) {
      throw new Error('Message cannot be empty');
    }

    try {
      await sendMessageToRoom(roomId, currentUserId, text);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to send message';
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      
      throw error;
    }
  };

  const clearError = (): void => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  const contextValue: ChatContextValue = {
    ...state,
    sendMessage,
    clearError,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  
  return context;
};
