import React, { createContext, useContext } from 'react';
import { NotificationArrayResponse } from '@services/types/notification';
import { NotificationApi } from '@services/apis';
import { useAuthContext } from './withAuth';

const NotificationContext = createContext<NotificationArrayResponse>([]);

type NotificationSetter = React.Dispatch<React.SetStateAction<NotificationArrayResponse>>;
const NotificationSetterContext = createContext<NotificationSetter>(undefined);

export function GlobalNotificationsContextProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<NotificationArrayResponse>([]);

  return (
    <NotificationContext.Provider value={notifications}>
      <NotificationSetterContext.Provider value={setNotifications}>{children}</NotificationSetterContext.Provider>
    </NotificationContext.Provider>
  );
}

export const useNotificationsContext = (): NotificationArrayResponse => useContext(NotificationContext);

const useNotificationsSetterContext = (): NotificationSetter => useContext(NotificationSetterContext);

export const useNotifications = (notificationApi: ReturnType<typeof NotificationApi>): NotificationArrayResponse => {
  const user = useAuthContext();
  const notifications = useNotificationsContext();
  const setNotifications = useNotificationsSetterContext();

  React.useEffect(() => {
    (async () => {
      if (notifications.length === 0 && user) {
        const notifications = await notificationApi.getMyNotifications();

        setNotifications(notifications);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return notifications;
};
