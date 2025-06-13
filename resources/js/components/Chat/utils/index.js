import { _MSG_TYPE } from "../config";

export { default as SocketManager } from "./socketManager"

export const NotificationPermission = () => {
    if (!("Notification" in window)) {
        console.log("Browser does not support desktop notification");
    } else {
        Notification.requestPermission().then(console.log).catch(console.error);
    }
}
export const showNotification = (title, message, action = () => { }, icon = false) => {
    if (!Notification.permission) {
        console.log("Notification blocked");
        return;
    }
    var options = {
        body: message,
        icon: icon || '/favicon.ico',
        dir: 'ltr',
    };
    const notification = new Notification(title, options)
    notification.onclick = action
}
export const checkMediaDevice = async () => {
    const video = await navigator.mediaDevices.getUserMedia({ video: true }).catch(console.error)
    const audio = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(console.error)
    if (video) video.getTracks().forEach(track => track.stop());
    if (audio) audio.getTracks().forEach(track => track.stop());
    return { camera: !!video, mic: !!audio }
}
export const parseForNotify = (msg) => {
    const user_name = msg.user?.name
    const title = user_name
    const icon = msg.user.avatar
    const text = msg.type == _MSG_TYPE.photo ? 'Image'
        : msg.type == _MSG_TYPE.video ? 'Video'
            : msg.type == _MSG_TYPE.audio ? 'Audio'
                : msg.type == _MSG_TYPE.file ? 'File'
                    : msg.text;
    if (msg.type == _MSG_TYPE.calling) return null;
    return { title, icon, text };
}
export const getTitle = (name) => {
    if (!name) return "";
    name = name.split(" ");
    if (name.length < 2) {
        name = name[0];
        return name.slice(0, 2).toUpperCase();
    }
    return `${name[0][0]}${name[1][0]}`.toUpperCase();
}