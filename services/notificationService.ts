
export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        // Browser does not support desktop notification
        return;
    }

    if (Notification.permission !== "denied") {
        await Notification.requestPermission();
    }
};

export const sendNotification = (title: string, body: string) => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
        new Notification(title, { body });
    }
};
