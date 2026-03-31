import { useAuth } from '@/features/auth/components/auth-provider';
import { useNotificationPermissions } from '@/hooks/use-notification-permissions';
import { getDeviceId, getProjectId } from '@/utils/common';
import { useQueryClient } from '@tanstack/react-query';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useCreateExpoPushToken } from '../api/use-create-expo-push-token';
import { createFetchExpoPushTokenQuery } from '../api/use-fetch-expo-push-token';
import { useUpdateExpoPushToken } from '../api/use-update-expo-push-token';

const PushNotificationContext = createContext<any>(undefined);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotification = () => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePushNotification must be used within a PushNotificationProvider');
  }
  return context;
};

export const PushNotificationProvider = ({ children }: any) => {
  useEffect(() => console.log('@render PushNotificationProvider'));

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: updateExpoPushToken } = useUpdateExpoPushToken();
  const { mutate: createExpoPushToken } = useCreateExpoPushToken();
  const { requestNotificationPermissions } = useNotificationPermissions();

  const registerPushNotification = React.useCallback(async () => {
    const deviceId = await getDeviceId();

    const pushTokenQuery = await queryClient.fetchQuery(createFetchExpoPushTokenQuery(deviceId));

    if (pushTokenQuery) {
      await updateExpoPushToken({
        documentId: pushTokenQuery.documentId,
        deviceId: pushTokenQuery.deviceId,
        user: user?.id,
      });
    }
  }, [queryClient, updateExpoPushToken, user]);

  const unRegisterPushNotification = React.useCallback(async () => {
    const deviceId = await getDeviceId();
    const pushTokenQuery = await queryClient.fetchQuery(createFetchExpoPushTokenQuery(deviceId));

    updateExpoPushToken({
      documentId: pushTokenQuery.documentId,
      user: null,
    });
  }, [queryClient, updateExpoPushToken]);

  const value = useMemo(
    () => ({
      registerPushNotification,
      unRegisterPushNotification,
    }),
    [registerPushNotification, unRegisterPushNotification],
  );

  useEffect(() => {
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('receive notification', JSON.stringify(notification));
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data.type === 'chat' && user) {
        router.navigate(`/chats/${data.chatId}`);
      }
    });

    const register = async () => {
      if (!Device.isDevice) {
        console.log('must use a physical device for push notifications.');
        return;
      }

      const status = await requestNotificationPermissions();
      if (status !== 'granted') {
        return;
      }

      const deviceId = await getDeviceId();
      const projectId = getProjectId();
      const pushToken: any = await queryClient.fetchQuery(createFetchExpoPushTokenQuery(deviceId));

      let token = null;
      if (!pushToken) {
        try {
          const res = await Notifications.getExpoPushTokenAsync({
            projectId,
          });
          token = res.data;
        } catch (error) {
          console.error(error);
          return;
        }

        await createExpoPushToken({
          deviceId,
          token,
          user: user?.id,
        });
      }
    };

    register();

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [createExpoPushToken, queryClient, requestNotificationPermissions, router, user]);

  return (
    <PushNotificationContext.Provider value={value}>{children}</PushNotificationContext.Provider>
  );
};
