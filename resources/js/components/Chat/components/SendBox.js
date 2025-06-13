import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import React, { useRef, useEffect, useState } from 'react';
import { FaFile, FaImage, FaMicrophone, FaTimes, FaVideo } from 'react-icons/fa';
import { FiSend, FiSmile } from 'react-icons/fi';
import { FILE_TYPES, _MSG_TYPE } from '../config';
import CustomInput from './CustomInput';
import path from "path";

export default function SendBox({ sendMessage, uploadFile, editMessage, setEditMessage }) {
    const [text, setText] = useState('')

    const [visibleEmoji, setVisibleEmoji] = useState(false)
    const msgInputRef = useRef()
    const videoPicker = useRef(null)
    const filePicker = useRef(null)
    const imagePicker = useRef(null)
    const audioPicker = useRef(null)

    useEffect(() => {
        setText(editMessage?.text || '');
        if (msgInputRef.current) msgInputRef.current.normalFocus()
    }, [editMessage])

    useEffect(() => {
        if (!text) setEditMessage(null)
    }, [text])

    const send = () => {
        var msg = text.trim();
        if (!msg) return;
        setText('')
        const message = {
            ...(editMessage || {}),
            type: _MSG_TYPE.text,
            text: msg,
        };
        setEditMessage(null)
        sendMessage(message);
    }
    const onchangeFile = async (e, { type, exts }) => {
        const files = e.target.files;
        if (files.length <= 0) return;
        const file = files[0]
        const ext = path.extname(file.name);
        if (!exts.includes(ext)) {
            alert(`Not allowed ${ext} file format`);
            return;
        }
        const res = await uploadFile(file)
        if (!res) return;

        const message = {
            type,
            title: res.name,
            data: res.path,
            text: file.name
        };
        sendMessage(message);
    }

    const handleEmojiSelect = (e) => {
        msgInputRef.current.appendText(e.native)
    }
    const onCancelEdit = () => {
        if (typeof setEditMessage == 'function') setEditMessage(null)
    }
    return (
        <div className="compose">
            <input ref={videoPicker} type="file" accept={FILE_TYPES.VIDEO.accept} style={{ display: 'none' }} onChange={(e) => onchangeFile(e, FILE_TYPES.VIDEO)} />
            <input ref={filePicker} type="file" accept={FILE_TYPES.FILES.accept} style={{ display: 'none' }} onChange={(e) => onchangeFile(e, FILE_TYPES.FILES)} />
            <input ref={imagePicker} type="file" accept={FILE_TYPES.IMAGE.accept} style={{ display: 'none' }} onChange={(e) => onchangeFile(e, FILE_TYPES.IMAGE)} />
            <input ref={audioPicker} type="file" accept={FILE_TYPES.AUDIO.accept} style={{ display: 'none' }} onChange={(e) => onchangeFile(e, FILE_TYPES.AUDIO)} />

            <CustomInput
                ref={msgInputRef}
                type="text"
                className='reset-style'
                value={text}
                onChange={setText}
                onEnter={send}
                editing={!!editMessage}
                onCancelEdit={onCancelEdit}
                placeholder="Type a message here..."
            />
            {!!text ?
                <div className='btn-icon send-button' onClick={send}>
                    <span>Send</span>
                    <FiSend className='font-icon' key="send" />
                </div>
                :
                <>
                    <div className='btn-icon' onClick={() => videoPicker.current.click()}>
                        <FaVideo />
                    </div>
                    <div className='btn-icon' onClick={() => filePicker.current.click()}>
                        <FaFile />
                    </div>
                    <div className='btn-icon' onClick={() => imagePicker.current.click()}>
                        <FaImage />
                    </div>
                    <div className='btn-icon' onClick={() => audioPicker.current.click()}>
                        <FaMicrophone />
                    </div>
                </>
            }
            <div className='btn-icon' onClick={() => {
                msgInputRef.current.focus();
                setTimeout(() => setVisibleEmoji(!visibleEmoji), 100)
            }} ><FiSmile /></div>

            <div className='emoji-container'>
                {visibleEmoji &&
                    <span className='emoji-modal'>
                        <Picker
                            data={data}
                            perLine={10}
                            // set={'google'}
                            previewPosition={'none'}
                            onClickOutside={e => {
                                setVisibleEmoji(false)
                                msgInputRef.current.focus();
                            }}
                            skin={1}
                            onEmojiSelect={handleEmojiSelect}
                        />
                    </span>
                }
            </div>
        </div>
    )
}