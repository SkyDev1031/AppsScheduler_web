import io from 'socket.io-client';
import { API, SOCKET_EVENTS } from '../config';

class SocketManager {
    constructor(client_id, client_secret, server_address) {
        if (SocketManager._instance) return SocketManager._instance
        SocketManager._instance = this;
        this.client_id = client_id
        this.client_secret = client_secret;
        this.server_address = server_address;
        this.socket = io(server_address, { autoConnect: true, forceNew: true });
    }
    connect(user) {
        this.socket.on('connect', () => {
            this.socket.emit(SOCKET_EVENTS.CONNECTED, {
                user,
                client_id: this.client_id,
                client_secret: this.client_secret
            })
            this.socket.on(SOCKET_EVENTS.DISCONNECTED, () => {
            })
        })
    }
    async getChatList(user_id) {
        const res = await fetch(`${this.server_address}/${API.GETLIST}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: JSON.stringify({ user_id })
        });
        return await res.json();
    }
    async getSupportRoomList() {
        const res = await fetch(`${this.server_address}/${API.GETSUPPORTROOMLIST}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: JSON.stringify({})
        });
        return await res.json();
    }
    async getRoomInfo(roomId) {
        const res = await fetch(`${this.server_address}/${API.GETROOMINFO}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: JSON.stringify({roomId})
        });
        return await res.json();
    }
    async getMessages(roomid) {
        const res = await fetch(`${this.server_address}/${API.GETMESSAGE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: JSON.stringify({ roomid })
        });
        return await res.json();
    }
    async setNewRoom(room, userid) {
        const res = await fetch(`${this.server_address}/${API.ADDROOM}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: JSON.stringify({ room, userid })
        });
        return await res.json();
    }
    async addNewGroup(image, name, members, product_id=null) {
        const res = await fetch(`${this.server_address}/${API.ADDGROUP}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: JSON.stringify({ image, name, members, product_id })
        });
        return await res.json();
    }
    async addMemberGroup(user_id, room_id) {
        const res = await fetch(`${this.server_address}/${API.ADDMEMBER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: JSON.stringify({ user_id, room_id })
        });
        return await res.json();
    }
    async uploadFile(formdata) {
        const res = await fetch(`${this.server_address}/${API.UPLOAD}`, {
            method: 'POST',
            headers: {
                'client_id': this.client_id,
                'client_secret': this.client_secret,
            },
            body: formdata
        });
        return await res.json();
    }
    onMessage(callback) {
        this.socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
    }

    sendMessage(message) {
        this.socket.emit(SOCKET_EVENTS.SEND_MESSAGE, message);
    }

    onLastMessage(callback) {
        this.socket.on(SOCKET_EVENTS.LAST_MESSAGE, callback)
    }
    onUnreadMessage(callback) {
        this.socket.on(SOCKET_EVENTS.UNREADMESSAGE, callback)
    }
    emitUnreadMessages(userid, roomid) {
        this.socket.emit(SOCKET_EVENTS.UNREADMESSAGE, { userid, roomid })
    }
    emitReadMessage(userid, roomid) {
        this.socket.emit(SOCKET_EVENTS.READMESSAGE, { userid, roomid })
    }
    emitDeleteMessage(roomid, messageid) {
        this.socket.emit(SOCKET_EVENTS.DELETE_MESSAGE, { roomid, messageid })
    }
    emitMuteRoom(roomid, userid, mute) {
        this.socket.emit(SOCKET_EVENTS.MUTE_ROOM, { roomid, userid, mute })
    }
    emitMuteRooms(userid) {
        this.socket.emit(SOCKET_EVENTS.ON_MUTE_ROOMS, { userid })
    }
    onMuteRooms(callback) {
        this.socket.on(SOCKET_EVENTS.ON_MUTE_ROOMS, callback)
    }
    onRefreshChatList(callback) {
        this.socket.on(SOCKET_EVENTS.ON_REFRESH_LIST, callback)
    }
    off() {
        this.socket.off('connect')
        Object.values(SOCKET_EVENTS).map(item => this.socket.off(item))
    }
    emitLastMessage(user_id) {
        this.socket.emit(SOCKET_EVENTS.LAST_MESSAGE, { user_id })
    }


    callOffer(roomid, callerid, camera_enabled, mic_enabled) {
        this.socket.emit(SOCKET_EVENTS.CALL_OFFER, { roomid, callerid, camera_enabled, mic_enabled })
    }

    onOffer(callback) {
        this.socket.on(SOCKET_EVENTS.CALL_OFFER, callback);
    }

    onReceived(callback) {
        this.socket.on(SOCKET_EVENTS.CALL_RECEIVE, callback)
    }
    receiveCall(roomid, receiverid, callingid, camera_enabled, mic_enabled) {
        this.socket.emit(SOCKET_EVENTS.CALL_RECEIVE, { roomid, receiverid, callingid, camera_enabled, mic_enabled })
    }

    emitJoinRoom(roomid, userid) {
        this.socket.emit('join room', roomid, userid);
    }
    emitSendingSignal(data) {
        this.socket.emit('sending signal', data);
    }
    emitReturningSignal(data) {
        this.socket.emit('returning signal', data);
    }
    onReturningSignal(callback) {
        this.socket.on('returning signal', callback);
    }
    onEndCall(callback) {
        this.socket.on('user left', callback);
    }
    onNewCaller(callback) {
        this.socket.on('user joined', callback);
    }
    onAllUsers(callback) {
        this.socket.on('all users', callback);
    }
    offCalling() {
        this.socket.off('all users');
        this.socket.off('user joined');
        this.socket.off('user left');
        this.socket.off('returning signal');
    }

    onDecline(callback) {
        this.socket.on(SOCKET_EVENTS.CALL_DECLINE, callback)
    }
    declineCall(roomid, userid) {
        this.socket.emit(SOCKET_EVENTS.CALL_DECLINE, { roomid, userid })
    }
    muteDevice(roomid, type, userid, muted) {
        this.socket.emit(SOCKET_EVENTS.MUTE_DEVICE, { roomid, type, userid, muted })
    }
    onMuteDevice(callback) {
        this.socket.on(SOCKET_EVENTS.MUTE_DEVICE, callback)
    }
    onCallingTimer(callback) {
        this.socket.on(SOCKET_EVENTS.CALLING_TIMER, callback)
    }
    onCallMissed(callback) {
        this.socket.on(SOCKET_EVENTS.CALL_MISSED, callback)
    }
    get id() {
        return this.socket.id
    }
}
export default SocketManager;