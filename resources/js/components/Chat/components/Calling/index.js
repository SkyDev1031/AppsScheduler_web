import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp, FaCheck, FaMicrophone, FaMicrophoneSlash, FaPhone, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { IMAGES } from '../../assets';
import { _CALL_STATUS } from "../../config";
import Avatar from "../Avatar";
import "./style.css";


const Video = ({ peer }) => {
    const ref = useRef();
    const [stream, setStream] = useState(null)
    useEffect(() => {
        if (!peer) return
        peer.on("stream", stream => {
            console.log("on steam")
            setStream(stream)
        });
    }, []);
    useEffect(() => {
        if (!ref.current || !stream) return;
        ref.current.srcObject = stream
    }, [stream, ref.current])

    return <video ref={ref} className={'client-video'} autoPlay />
};


export default function index({
    callConfig = {}, receiveCall = () => { }, declineCall = () => { },
    peerStreams, stream,
    callingTimer,
    muteCamera = () => { }, muteMic = () => { },
    curCameraId, cameraDevices, updatecurCamera = () => { },
    cameraUnMuted = {}, micUnMuted = {}
}) {
    const [cameraswitcher, setCameraswitcher] = useState(false)
    const myVideoRef = useRef();

    useEffect(() => {
        if (!myVideoRef.current) return;
        console.log(stream)
        myVideoRef.current.srcObject = stream;
    }, [stream, myVideoRef.current]);


    const { status = _CALL_STATUS.DEFAULT, caller = {} } = callConfig;
    const renderIncomingCall = () => {
        return (
            <div className='rp-incomming'>
                <Avatar src={caller.avatar} title={caller.name} type={'circle'} size={'small'} />
                <div className='rp-incomming-text'>
                    <p>{caller.name}</p>
                    <div>Incoming Call...</div>
                </div>
                <div>
                    <span className='rp-calling-action'>
                        <FaVideo size={20} onClick={() => receiveCall(true)} />
                    </span>
                    <span className='rp-calling-action'>
                        <FaPhone size={20} onClick={() => receiveCall(false)} />
                    </span>
                    <span className='rp-calling-action rp-decline'>
                        <FaPhone size={20} onClick={declineCall} />
                    </span>
                </div>
            </div>
        )
    }
    const renderCall = () => {
        return (
            <div className='rp-outgoing'>
                <div className='rp-outgoing-header'>
                    <Avatar src={caller.avatar} title={caller.name} type={'circle'} size={'small'} />
                    <div className='rp-outgoing-text'>
                        <p>{caller?.name}</p>
                        <div>{status === _CALL_STATUS.OUTGOING ? "Calling..." : callingTimer}</div>
                    </div>
                </div>
                <div className={`rp-outgoing-container clients-video-${peerStreams?.length || 0}`}>
                    {peerStreams?.length > 0 ?
                        peerStreams.map((item, index) => {
                            return (
                                <div className={`video-item ${item?.peerID && cameraUnMuted[item.peerID] ? 'show-video' : 'hide-video'}`}>
                                    <Video key={index} {...item} className />
                                    <>
                                        <img src={IMAGES.calling_bg} className='rp-outgoing-background' />
                                        <div className={classNames('rp-outgoing-user', { 'rp-calling': status === _CALL_STATUS.OUTGOING })}>
                                            <Avatar src={caller.avatar} title={caller.name} type={'circle'} size={'xxlarge'} />
                                        </div>
                                    </>
                                </div>
                            )
                        })
                        :
                        <>
                            <img src={IMAGES.calling_bg} className='rp-outgoing-background' />
                            <div className={classNames('rp-outgoing-user', { 'rp-calling': status === _CALL_STATUS.OUTGOING })}>
                                <Avatar src={caller.avatar} title={caller.name} type={'circle'} size={'xxlarge'} />
                            </div>
                        </>
                    }
                    {callConfig.camera_enabled && <video ref={myVideoRef} className={'my-video'} autoPlay muted="muted" />}
                </div>
                <div className='rp-outgoing-footer'>
                    <div className='rp-outgoing-actions'>
                        <span className='rp-calling-action' onClick={muteMic}  >
                            {callConfig.mic_enabled ?
                                <FaMicrophone size={20} />
                                :
                                <FaMicrophoneSlash size={20} />
                            }
                        </span>
                        <span className='rp-calling-action' onClick={() => {
                            if (cameraswitcher) setCameraswitcher(false);
                            else muteCamera();
                        }}>
                            {callConfig.camera_enabled ?
                                <FaVideo size={20} />
                                :
                                <FaVideoSlash size={20} />
                            }
                        </span>
                        <span className={classNames('rp-calling-action', 'rp-camera-action', 'no-back')}
                            onClick={() => setCameraswitcher(!cameraswitcher)}>
                            {cameraswitcher ?
                                <FaAngleDown size={20} />
                                :
                                <FaAngleUp size={20} />
                            }
                            {cameraswitcher &&
                                <div className='rp-camera-container'>
                                    {cameraDevices.map((item, index) => (
                                        <div className={classNames('rp-camera-item')}
                                            onClick={() => {
                                                setCameraswitcher(false);
                                                updatecurCamera(item.deviceId);
                                            }}>
                                            <div>{item.label}</div>
                                            {curCameraId == item.deviceId && <FaCheck size={14} />}
                                        </div>
                                    ))}
                                </div>
                            }
                        </span>
                    </div>
                    <span className='rp-calling-action rp-decline'>
                        <FaPhone size={20} onClick={declineCall} />
                    </span>
                </div>
            </div >
        )
    }

    switch (status) {
        case _CALL_STATUS.INCOMMING:
            return renderIncomingCall()
        case _CALL_STATUS.OUTGOING:
        case _CALL_STATUS.CALLING:
        case _CALL_STATUS.RECEIVING:
            return renderCall()
        case _CALL_STATUS.DEFAULT:
        default:
            return <></>
    }
}
