import { _REQUEST, _REQ_METHOD } from './index';

/**
 * App Usage Information APIs
 */
// Notification APIs
export const getNotificationsApi = (user_id = 0) => _REQUEST(`notifications/${user_id}`, _REQ_METHOD.GET, {user_id});

export const createNotificationApi = (data) => _REQUEST('notifications', _REQ_METHOD.POST, data);

export const updateNotificationApi = (id, data) => _REQUEST(`notifications/${id}`, _REQ_METHOD.PUT, data);

export const deleteNotificationApi = (id) => _REQUEST(`notifications/${id}`, _REQ_METHOD.DELETE);

export const clearNotificationApi = () => _REQUEST('notifications/clear', _REQ_METHOD.POST);
export const markAsReadApi = (id) => _REQUEST(`notifications/${id}/mark-as-read`, _REQ_METHOD.PUT);
export const markAllAsReadApi = () => _REQUEST('notifications/mark-all-as-read', _REQ_METHOD.PUT);
export const markAsUnreadApi = (id) => _REQUEST(`notifications/${id}/mark-as-unread`, _REQ_METHOD.PUT);