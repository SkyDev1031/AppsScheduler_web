import path from 'path';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SimplePeer from 'simple-peer';
import Calling from "./components/Calling";
import { NEW_ROOM_ID, _CALL_STATUS, _MSG_TYPE, _PAGE_TYPES } from "./config";
import "./index.css";
import { checkMediaDevice, NotificationPermission, parseForNotify, showNotification, SocketManager } from "./utils";

export { default as ChatComponent } from "./components";
export const ChatContext = createContext({});

export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider = ({ children, user, server_url, client_id, client_secret }) => {

    const socketManager = useRef(new SocketManager(client_id, client_secret, server_url)).current;

    const [conversations, setConversations] = useState([]);
    const [supportRooms, setSupportRooms] = useState([]);
    const [messages, setMessages] = useState([])
    const [roomId, setRoomId] = useState(null)
    const [newRoom, setNewRoom] = useState(null)
    const [lastMessages, setLastMessages] = useState({})
    const [unreadMessages, setUnreadMessages] = useState({})
    const [editMessage, setEditMessage] = useState(null)
    const [visibleGroupModal, setVisibleGroupModal] = useState(false)
    const [curPage, setCurPage] = useState(_PAGE_TYPES.ROOMS) //0: ROOMS ,1: CONTACTS
    const [currentUser, setCurrentUser] = useState()
    const user_id = currentUser?.id || 0
    const [newMessage, setNewMessage] = useState(null)
    const [downloadingStatus, setDownloadingStatus] = useState({})

    useEffect(() => {
        if (!server_url) {
            console.warn("You have to provide server_url")
        }
        if (!client_id || !client_secret) {
            console.warn("You have to provide the client_id and client_secret")
        }
        if (!user) {
            console.warn("You have to provide the user")
        }
        NotificationPermission();
    }, [])

    const location = useLocation();


    const onDownload = async (item, index) => {
        const { data: { uri }, id, text } = item;

        try {
            const downloadLink = document.createElement('a');
            const url = new URL(uri);
            var download_url = `${url.origin}/download${url.pathname}`;

            downloadLink.download = text;
            document.body.appendChild(downloadLink);

            const xhr = new XMLHttpRequest();
            xhr.open('GET', download_url, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                if (xhr.status === 200) {
                    downloadLink.href = URL.createObjectURL(xhr.response)
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    setDownloadingStatus(prev => ({ ...prev, [id]: {} }))
                }
            };
            xhr.onerror = () => {
                console.log('Error occurred while downloading the file');
                setDownloadingStatus(prev => ({ ...prev, [id]: { download: false, error: true } }))
            };
            xhr.onprogress = (event) => {
                const progress = Math.round((event.loaded / event.total) * 100) / 100;
                setDownloadingStatus(prev => ({ ...prev, [id]: { download: true, loading: progress } }))
            };
            xhr.send();
        } catch (error) {
            console.log(error);
            setDownloadingStatus(prev => ({ ...prev, [id]: { download: false, error: true } }))
        }
    };
    useEffect(() => {
        setCurrentUser(user);
    }, [user])

    const onLastMessage = (message) => {
        setLastMessages(prev => ({ ...prev, [message.roomid]: message }))
    }
    const onUnreadMessage = ({ userid, roomid, count }) => {
        if (userid != user_id) return;
        setUnreadMessages(prev => ({ ...prev, [roomid]: count }))
    }
    const refreshChatList = () => {
        socketManager.getChatList(user_id)
            .then(list => {
                if (!list) list = [];
                list = list.map(item => ({ ...item, avatar: item.image }))
                setConversations(list)
            })
            .catch(err => setConversations([]))
    }
    const refreshSupportRoomList = () => {
        socketManager.getSupportRoomList()
            .then(list => {
                if (!list) list = [];
                // const newVal = list.map((item) => Object.assign({}, item))
                supportRooms.splice(0, supportRooms.length, ...list);
                // list = list.map(item => ({ ...item, avatar: item.image }))
                setSupportRooms(supportRooms);
            })
            .catch(err => setSupportRooms([]))
    }
    useEffect(() => {
        if (!currentUser) return;
        const tmp_user = { id: currentUser.id, name: currentUser.ScreenName }
        socketManager.connect(tmp_user);
        socketManager.onMessage(msg => setNewMessage(msg))
        socketManager.onLastMessage(onLastMessage);
        socketManager.onUnreadMessage(onUnreadMessage);
        socketManager.onMuteRooms(setMutedRooms);
        socketManager.onRefreshChatList(refreshChatList);
        socketManager.emitLastMessage(user_id);
        socketManager.emitMuteRooms(user_id)
        refreshChatList();
        return () => {
            socketManager.off();
        }
    }, [currentUser])

    // calling--------------


    const notifyMessage = (title, message, roomid, icon) => {
        const action = () => {
            if (window.closed) {
                window.open(`${location.origin}/user/chat`)
            } else {
                window.focus()
                setRoomId(roomid);
            }
        }
        if (document.hidden || roomid != roomId) {
            showNotification(title, message, action, icon)
        }
    }
    const fullPath = (path) => `${server_url}${path}`;

    const parseMessage = (msg) => {
        if (!msg) return null;
        const mine = msg.sender == user_id;
        msg = {
            ...msg,
            title: mine ? '' : msg.user?.name,
            avatar: mine ? '' : (msg.user?.avatar || '1'),
            position: mine ? 'right' : 'left',

            // forwarded: true,
            // replyButton: true,
            editButton: mine && msg.type == 'text',
            removeButton: mine,
            // status: ['sent', 'waiting', 'received', 'read'][Math.floor(Math.random() * 5)]
        }

        switch (msg.type) {
            case _MSG_TYPE.photo:
                msg.text = '';
                msg.data = { uri: fullPath(msg.data) };
                break;
            case _MSG_TYPE.video:
                msg.text = '';
                msg.data = {
                    videoURL: fullPath(msg.data),
                    status: {
                        click: true,
                        loading: 0.5,
                        download: true,
                    },
                };
                break;
            case _MSG_TYPE.audio:
                msg.text = '';
                msg.data = { audioURL: fullPath(msg.data), }
                break;
            case _MSG_TYPE.file:
                msg.data = {
                    uri: fullPath(msg.data),
                    status: { click: false, loading: 0, },
                }
                break;
            case _MSG_TYPE.system:
                if (!mine && msg.text == 'Call declined') {
                    msg.text += ` by ${msg.user?.name || 'User'}`;
                }
                break;
            case _MSG_TYPE.calling:
                msg = null
                break;
            default:
                break;
        }
        return msg;
    }
    useEffect(() => {
        if (!newMessage) return;
        const sameIndex = messages.findIndex(item => item.id == newMessage.id)
        if (!newMessage.delete) {
            const msg = parseForNotify(newMessage);

            const muted = mutedRooms?.[newMessage.roomid];

            if (msg && !muted && sameIndex < 0 && newMessage.sender != user_id) {
                notifyMessage(msg.title, msg.text, newMessage.roomid, msg.icon)
            }
        }
        if (!roomId || roomId != newMessage.roomid) return;

        setMessages(prev => {
            var tmp_msg = [...prev];
            if (newMessage.delete) {
                tmp_msg.splice(sameIndex, 1);
            } else {
                const parseMsg = parseMessage(newMessage);
                if (parseMsg) {
                    if (sameIndex >= 0) {
                        tmp_msg[sameIndex] = parseMsg;
                    } else {
                        tmp_msg = [...tmp_msg, parseMsg];
                    }
                }
            }
            tmp_msg = tmp_msg.reduce((unique, o) => {
                if (!unique.some(obj => obj.id === o.id)) {
                    unique.push(o);
                }
                return unique;
            }, []);
            return tmp_msg;
        })
        setNewMessage(null)
    }, [roomId, newMessage, user_id])
    useEffect(() => {
        setMessages([]);
        if (!user_id || !roomId || roomId == NEW_ROOM_ID) return
        socketManager.getMessages(roomId)
            .then(list => {
                if (!list) list = [];
                list = list.map(item => parseMessage(item)).filter(item => item)
                setMessages(list)
            })
            .catch(err => setMessages([]))
    }, [user_id, roomId])

    useEffect(() => {
        if (!roomId || !user_id) return;
        socketManager.emitReadMessage(user_id, roomId);

        var readMsgTimer = setInterval(() => {
            socketManager.emitReadMessage(user_id, roomId);
        }, 1000);
        return () => {
            clearInterval(readMsgTimer);
            readMsgTimer = null;
        }
    }, [roomId, user_id])

    const addNewRoom = async () => {
        var roomid = roomId;
        if (roomId === NEW_ROOM_ID) {
            const res = await socketManager.setNewRoom(newRoom, user_id).catch(console.error);

            if (res?.success) {
                roomid = res.roomid;
                setRoomId(roomid)
                setNewRoom(null)
                setCurPage(_PAGE_TYPES.ROOMS)
                refreshChatList();
                if (res?.exits) {
                    console.log('Chat room already exits')
                }
            } else {
                alert(res?.message || 'Something went wrong');
                return null;
            }
        }
        return roomid
    }

    const sendMessage = async (message) => {
        const roomid = await addNewRoom();
        if (!roomid) return;
        var message = { ...message, roomid, sender: user_id }
        socketManager.sendMessage(message)
    }
    const uploadFile = async (file) => {
        if (!file) return false;
        const filename = `${(new Date()).getTime()}${path.extname(file.name)}`;
        var formdata = new FormData();
        formdata.append('path', roomId);
        formdata.append('filename', filename);
        formdata.append('file', file);
        const res = await socketManager.uploadFile(formdata).catch(console.error);
        if (res.error) {
            alert(res.message);
            return null
        }
        return res;
    }
    const deleteMessage = (item, index) => {
        socketManager.emitDeleteMessage(roomId, item.id)
    }
    const onMuteRoom = (item, index) => {
        const muted = mutedRooms?.[item.id];
        socketManager.emitMuteRoom(item.id, user_id, !muted)
    }
    const onCreateGroup = async (image, name, members, product_id=null, isgroup=false) => {

        members = [user_id, ...members];
        const res = await socketManager.addNewGroup(image, name, members, product_id).catch(console.error);

        setVisibleGroupModal(false);
        if (res?.success) {
            var roomid = res.roomid;
            setRoomId(roomid)
            setCurPage(_PAGE_TYPES.ROOMS)
            refreshChatList();
        } else {
            alert(res?.message || 'Something went wrong');
            return null;
        }
    }
    const onAddGroup = async (room_id) => {
        const res = await socketManager.addMemberGroup(user_id, room_id).catch(console.error);
        // return true;
    }


    // CALLING -------------------------------------

    const defConfig = {
        status: _CALL_STATUS.DEFAULT,

        camera_available: true,
        mic_available: true,

        camera_enabled: true,
        mic_enabled: true,

        roomid: '',
        callerid: 0,
        caller: {},

        callingid: null
    }

    const [callConfig, setCallConfig] = useState(defConfig)
    const peersRef = useRef([]);
    const [myStream, setMyStream] = useState();
    const [peerStreams, setPeerStreams] = useState([])

    const [curCameraId, setCurCameraId] = useState(null)
    const [cameraDevices, setCameraDevices] = useState([])
    const [callingTimer, setCallingTimer] = useState('00:00')
    const [mutedRooms, setMutedRooms] = useState([])
    const [cameraUnMuted, setCameraUnMuted] = useState({})
    const [micUnMuted, setMicUnMuted] = useState({})

    const updateCallConfig = (item) => setCallConfig(prev => ({ ...prev, ...item }));
    const onDecline = ({ roomid }) => {
        setCallConfig(defConfig);
    }
    const onCallMissed = ({ roomid }) => {
        setCallConfig(defConfig);
    }
    useEffect(() => {
        socketManager.onOffer(onOffer);
        socketManager.onDecline(onDecline);
        socketManager.onCallMissed(onCallMissed);
        socketManager.onReceived(onReceived);
        socketManager.onMuteDevice(onMuteDevice);
        socketManager.onCallingTimer(onCallingTimer);

        return () => {
            socketManager.off();
        }
    }, [])

    const onCallingTimer = ({ time, str_time }) => {
        setCallingTimer(str_time);
    }
    useEffect(() => {
        if (callConfig.status != _CALL_STATUS.DEFAULT) declineCall();
        // {pathname: '/user/dashboard', search: '', hash: '', state: null, key: 'default'}
        setCallConfig(defConfig);
    }, [location]);

    useEffect(() => {
        const body = document.getElementsByTagName("body");
        if (!body) return;
        if (callConfig.status == _CALL_STATUS.INCOMMING)
            body[0].classList.add("rp-body-add")
        else
            body[0].classList.remove("rp-body-add")
    }, [callConfig.status])

    useEffect(() => {
        if (callConfig.status !== _CALL_STATUS.CALLING) return;
        if (!callConfig.roomid || !myStream) return;

        socketManager.emitJoinRoom(callConfig.roomid, user_id);
        socketManager.onAllUsers((users) => {
            const peers = [];
            users.forEach((userID) => {
                const peer = createPeer(userID, user_id, myStream);
                peersRef.current.push({ peerID: userID, peer });
                peers.push({ peerID: userID, peer });
            });
            setPeerStreams(peers);
        });
        socketManager.onNewCaller((payload) => {
            const peer = addPeer(payload.signal, payload.callerID, myStream);
            const peerObj = { peer, peerID: payload.callerID, };
            peersRef.current.push(peerObj);
            setPeerStreams((users) => [...users, peerObj]);
        });

        socketManager.onEndCall((id) => {
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) {
                peerObj.peer.destroy();
            }
            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current = peers;
            setPeerStreams(peers);
        });

        socketManager.onReturningSignal((payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
        });

        return () => {
            socketManager.offCalling();
        }
    }, [callConfig.status, callConfig.roomid, myStream])


    function createPeer(userToSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream,
            config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },

        });
        peer.on("signal", (signal) => {
            socketManager.emitSendingSignal({ userToSignal, callerID, signal, });
        });
        return peer;
    }
    function addPeer(incomingSignal, callerID, stream) {
        const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
            config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
        });
        peer.on("signal", (signal) => socketManager.emitReturningSignal({ signal, callerID, userid: user_id }));
        peer.signal(incomingSignal);
        return peer;
    }

    useEffect(() => {
        if (!curCameraId || !user_id) return;
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: curCameraId
            },
            audio: callConfig.mic_enabled
        }).then(stream => {
            if (myStream) {
                const prevTrack = myStream.getVideoTracks()[0];
                const newTrack = stream.getVideoTracks()[0];
                myStream.removeTrack(prevTrack);
                myStream.addTrack(newTrack);

                // var screenVideoTrack = myStream.getVideoTracks()[0];
                // videoSender.replaceTrack(screenVideoTrack);

                // console.log(myStream.replaceTrack)
                // myStream.getTracks().forEach(track => {
                //     console.log(track.replaceTrack)
                // });

            } else {
                setMyStream(stream)
            }
        }).catch(err => {
            declineCall(user_id);
            alert(err)
        });
    }, [curCameraId, user_id])

    useEffect(() => {
        if (callConfig.status != _CALL_STATUS.OUTGOING && callConfig.status != _CALL_STATUS.RECEIVING)
            return;

        const checkDevice = async () => {
            const { camera, mic } = await checkMediaDevice()
            updateCallConfig({ camera_available: camera, mic_available: mic })

            var devices = await navigator.mediaDevices.enumerateDevices().catch(console.error);

            devices = devices
                .filter(item => item.kind === 'videoinput')
                .map(item => ({ deviceId: item.deviceId, label: item.label }))

            setCameraDevices(devices);
            setCurCameraId(devices[0].deviceId)

            if (callConfig.status == _CALL_STATUS.OUTGOING) {
                socketManager.callOffer(roomId, user_id, callConfig.camera_enabled, callConfig.mic_enabled)
            } else if (callConfig.status == _CALL_STATUS.RECEIVING) {
                socketManager.receiveCall(callConfig.roomid, user_id, callConfig.callingid, callConfig.camera_enabled, callConfig.mic_enabled);
                updateCallConfig({ status: _CALL_STATUS.CALLING });
            }
        }
        checkDevice();
    }, [callConfig.status]);
    useEffect(() => {
        if (callConfig.status == _CALL_STATUS.DEFAULT && myStream) {
            myStream.getTracks().forEach(track => track.stop());
            setMyStream(null);
            setPeerStreams([])
            setCameraUnMuted({})
            setMicUnMuted({})
            setCurCameraId(null)
            peersRef.current = [];
        }
    }, [callConfig.status, myStream]);
    const startCall = async (room, video = false) => {
        const roomid = await addNewRoom();
        if (!roomid) return;
        updateCallConfig({ status: _CALL_STATUS.OUTGOING, roomid, caller: room, callerid: user_id, camera_enabled: video, mic_enabled: true });
    }

    const onOffer = ({ roomid, callerid, callingid, user, camera_enabled, mic_enabled }) => {
        if (callerid == user_id) return;
        setCameraUnMuted(prev => {
            prev[callerid] = camera_enabled;
            return prev;
        })
        setMicUnMuted(prev => {
            prev[callerid] = mic_enabled;
            return prev;
        })
        notifyMessage("Incoming Call", `${user?.name || 'Someone'} calling you.`, roomid);
        updateCallConfig({ status: _CALL_STATUS.INCOMMING, callerid, roomid, caller: user, callingid });
    }

    const receiveCall = (video = false) => {
        updateCallConfig({ status: _CALL_STATUS.RECEIVING, camera_enabled: video, mic_enabled: true })
    }
    const declineCall = () => {
        setCallConfig({ status: _CALL_STATUS.DEFAULT });
        socketManager.declineCall(callConfig.roomid || roomId, user_id);
    }

    const onReceived = ({ roomid, receiverid, user, camera_enabled, mic_enabled }) => {
        setCameraUnMuted(prev => {
            prev[receiverid] = camera_enabled;
            return prev;
        })
        setMicUnMuted(prev => {
            prev[receiverid] = mic_enabled;
            return prev;
        })
        updateCallConfig({ status: _CALL_STATUS.CALLING, roomid });
    }

    const muteCamera = () => {
        if (!myStream) return;
        myStream.getTracks()
            .forEach(function (track) {
                if (track.kind === "video") {
                    track.enabled = !track.enabled;
                    updateCallConfig({ camera_enabled: track.enabled })
                    console.log(callConfig.roomid, 0, user_id, track.enabled)
                    socketManager.muteDevice(callConfig.roomid, 0, user_id, track.enabled)
                }
            });
    }
    const muteMic = () => {
        if (!myStream) return;
        myStream.getTracks()
            .forEach(function (track) {
                if (track.kind === "audio") {
                    track.enabled = !track.enabled;
                    updateCallConfig({ mic_enabled: track.enabled })
                    console.log(callConfig.roomid, 1, user_id, track.enabled)
                    socketManager.muteDevice(callConfig.roomid, 1, user_id, track.enabled)
                }
            });
    }

    const onMuteDevice = ({ roomid, type, userid, muted }) => {
        console.log("on mute", { roomid, type, userid, muted })
        if (type == 0) setCameraUnMuted(prev => ({ ...prev, [userid]: muted }))
        else setMicUnMuted(prev => ({ ...prev, [userid]: muted }))
    }

    return (
        <ChatContext.Provider
            value={{
                socketManager,
                callConfig,
                peerStreams, stream: myStream,
                conversations, messages, supportRooms,
                roomId, setRoomId, newRoom, setNewRoom,
                receiveCall, declineCall, startCall, sendMessage, uploadFile,
                curPage, setCurPage, lastMessages, unreadMessages,
                downloadingStatus, onDownload,
                editMessage, setEditMessage, deleteMessage,
                mutedRooms, onMuteRoom, onCreateGroup, refreshChatList,
                visibleGroupModal, setVisibleGroupModal, onAddGroup, refreshSupportRoomList
            }}>
            <Calling
                callConfig={callConfig}
                receiveCall={receiveCall} declineCall={declineCall}
                stream={myStream} peerStreams={peerStreams}
                muteCamera={muteCamera} muteMic={muteMic}
                curCameraId={curCameraId} cameraDevices={cameraDevices} updatecurCamera={setCurCameraId}
                callingTimer={callingTimer}
                cameraUnMuted={cameraUnMuted}
                micUnMuted={micUnMuted}
            />
            {children}
        </ChatContext.Provider>
    )
};