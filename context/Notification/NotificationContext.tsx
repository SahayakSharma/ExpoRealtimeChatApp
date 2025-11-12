import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { acceptFriendRequest, rejectFriendRequest, setupNotificationListener } from './notificationService';
import { NotificationContextState, NotificationContextValue, NotificationProviderProps } from './types';

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ 
  userId, 
  children 
}) => {
  const [state, setState] = useState<NotificationContextState>({
    notifications: [],
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

    const handleNotificationsUpdate = (notifications: NotificationContextState['notifications']) => {
      setState({
        notifications,
        isLoading: false,
        error: null,
      });
    };

    const handleError = (error: Error) => {
      console.error('Notification listener error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to load notifications',
      }));
    };

    const unsubscribe = setupNotificationListener(
      userId,
      handleNotificationsUpdate,
      handleError
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  const acceptRequest = async (requestId: string, userName: string): Promise<void> => {
    try {
      await acceptFriendRequest(requestId);
      Alert.alert("Success", `You are now friends with ${userName}`);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to accept friend request';
      
      console.error("Error accepting friend request:", error);
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      
      Alert.alert("Error", errorMessage);
      throw error;
    }
  };

  const rejectRequest = async (requestId: string): Promise<void> => {
    try {
      await rejectFriendRequest(requestId);
      Alert.alert("Request Declined", "Friend request has been declined");
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to decline friend request';
      
      console.error("Error rejecting friend request:", error);
      
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      
      Alert.alert("Error", errorMessage);
      throw error;
    }
  };

  const clearError = (): void => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  const contextValue: NotificationContextValue = {
    ...state,
    acceptRequest,
    rejectRequest,
    clearError,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};
