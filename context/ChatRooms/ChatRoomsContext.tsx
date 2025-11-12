import React, { createContext, useContext, useEffect, useState } from 'react';
import { setupRoomsListener } from './chatRoomsService';
import { ChatRoomsContextState, ChatRoomsContextValue, ChatRoomsProviderProps } from './types';

const ChatRoomsContext = createContext<ChatRoomsContextValue | undefined>(undefined);

export const ChatRoomsProvider: React.FC<ChatRoomsProviderProps> = ({ 
  userId, 
  children 
}) => {
  const [state, setState] = useState<ChatRoomsContextState>({
    rooms: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'User ID is required',
      }));
      return;
    }

    const handleRoomsUpdate = (rooms: ChatRoomsContextState['rooms']) => {
      setState({
        rooms,
        isLoading: false,
        error: null,
      });
    };

    const handleError = (error: Error) => {
      console.error('ChatRooms context error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load chat rooms',
      }));
    };

    const unsubscribe = setupRoomsListener(
      userId,
      handleRoomsUpdate,
      handleError
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  const refreshRooms = (): void => {
    setState(prev => ({
      ...prev,
      isLoading: true,
    }));
  };

  const clearError = (): void => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  const contextValue: ChatRoomsContextValue = {
    ...state,
    refreshRooms,
    clearError,
  };

  return (
    <ChatRoomsContext.Provider value={contextValue}>
      {children}
    </ChatRoomsContext.Provider>
  );
};

export const useChatRooms = (): ChatRoomsContextValue => {
  const context = useContext(ChatRoomsContext);
  
  if (context === undefined) {
    throw new Error('useChatRooms must be used within a ChatRoomsProvider');
  }
  
  return context;
};
