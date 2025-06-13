
export const _CALL_TYPE = {
    video: 0,
    audio: 1,
}
export const _CALL_STATUS = {
    DEFAULT: -1,
    OUTGOING: 0,
    INCOMMING: 1,
    RECEIVING: 2,
    CALLING: 3,
}
export const _MSG_TYPE = {
    location: 'location',
    photo: 'photo',
    video: 'video',
    spotify: 'spotify',
    audio: 'audio',
    meetingLink: 'meetingLink',
    file: 'file',
    text: 'text',
    system: 'system',
    meeting: 'meeting',
    calling: 'calling',
}

export const API = {
    GETLIST: 'api/getUsersList',
    GETSUPPORTROOMLIST: 'api/getSupportRoomList',
    GETMESSAGE: 'api/getMessages',
    GETROOMINFO: 'api/getRoomInfo',
    ADDROOM: 'api/addNewRoom',
    UPLOAD: 'api/upload',
    ADDGROUP: 'api/addNewGroup',
    ADDMEMBER: 'api/addMemberGroup',
}

export const SOCKET_EVENTS = {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    RECEIVE_MESSAGE: 'receive-message',
    SEND_MESSAGE: 'send-message',
    CALL_OFFER: 'offer',
    CALL_RECEIVE: 'receive',
    CALL_DECLINE: 'decline',
    SIGNAL: 'signal',
    MUTE_DEVICE: 'mute-device',
    CALLING_TIMER: 'calling-timer',
    LAST_MESSAGE: 'last-message',
    READMESSAGE: 'read-message',
    UNREADMESSAGE: 'unread-messages',
    DELETE_MESSAGE: 'delete-messages',
    ON_MUTE_ROOMS: 'mute-rooms',
    MUTE_ROOM: 'mute-room',
    ON_REFRESH_LIST: 'refresh-chat',
    CALL_MISSED: 'call-missed',
}

export const _PAGE_TYPES = {
    ROOMS: 0,
    CONTACTS: 1,
}

export const NEW_ROOM_ID = 'NEW-ROOM'

const VIDEO_EXTS = [
    ".webm",
    ".mpg", ".mp2", ".mpeg", ".mpe", ".mpv",
    ".ogg",
    ".mp4", ".m4p", ".m4v",
    ".avi", ".wmv",
    ".mov", ".qt",
    ".flv", ".swf",
];
const IMAGE_EXTS = [
    ".jpg", ".jpeg", ".png", '.svg', '.webp', '.gif'
]
const AUDIO_EXTS = [
    ".m4a", ".flac", ".mp3", '.mp4', '.wav', '.wma', '.aac'
]

const OTHER_EXTS = [
    ...VIDEO_EXTS,
    ...IMAGE_EXTS,
    ...AUDIO_EXTS,
    '.doc', '.docx', '.html', '.htm', '.odt', '.pdf', '.xls', '.xlsx', '.ods', '.ppt', '.pptx', '.txt',
    '.zip', '.rar', '.7z', '.exe'
];
export const FILE_TYPES = {
    VIDEO: {
        type: _MSG_TYPE.video,
        accept: 'video/*',
        exts: VIDEO_EXTS,
    },
    IMAGE: {
        type: _MSG_TYPE.photo,
        accept: 'image/*',
        exts: IMAGE_EXTS,
    },
    AUDIO: {
        type: _MSG_TYPE.audio,
        accept: 'audio/*',
        exts: AUDIO_EXTS,
    },
    FILES: {
        type: _MSG_TYPE.file,
        accept: '*/*',
        exts: OTHER_EXTS
    }
}