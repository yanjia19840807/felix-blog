import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useCallback, useState } from 'react';

const appName = Constants?.expoConfig?.extra?.name || '';

export const useNotificationPermissions = () => {
  const [notificationPermissions, setNoficationPermissions] =
    useState<Notifications.PermissionStatus>();

  const requestNotificationPermissions = useCallback(async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    const finalStatus =
      existingStatus === 'granted'
        ? existingStatus
        : (await Notifications.requestPermissionsAsync()).status;
    setNoficationPermissions(finalStatus);

    return finalStatus;
  }, []);

  return {
    notificationPermissions,
    requestNotificationPermissions,
  };
};
