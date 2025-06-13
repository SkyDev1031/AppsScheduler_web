import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiArrowLeft, FiArrowRight, FiCamera, FiX } from 'react-icons/fi';
import ChatList from '../ChatList';
import "./style.css";

export default function NewGroupModal({
    contacts, visible, setVisible, onCreateGroup,
    uploadFile
}) {

    if (!visible) return <></>

    const [curPage, setCurPage] = useState(0) // 0, 1
    const [image, setImage] = useState(null)
    const [name, setName] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const imagePicker = useRef(null)
    const [query, setQuery] = useState('')
    const [selectedUsers, setSelectedUsers] = useState({})
    const members = Object.keys(selectedUsers).filter(user => selectedUsers[user])

    const onBack = () => {
        if (curPage == 0) onClose();
        else setCurPage(0)
    }
    const onClose = () => {
        if (typeof setVisible === 'function') setVisible(false);
    }
    const onAvatar = () => {
        imagePicker.current.click();
    }
    const onRemoveAvatar = () => {
        setImage(null)
        setImageUrl(null)
    }
    const onNext = () => {
        if (!name) return;
        setCurPage(1);
    }
    const onchangeFile = (e) => {
        const files = e.target.files;
        if (files?.length > 0) {
            setImage(files[0]);
            setImageUrl(URL.createObjectURL(files[0]))
        }
    }
    const onDone = async () => {
        const members = Object.keys(selectedUsers).filter(user => selectedUsers[user])
        if (members.length <= 0) return
        var image_url = '';
        if (image) {
            const res = await uploadFile(image);
            image_url = res?.path || '';
        }
        onCreateGroup(image_url, name, members);
    }
    const getData = () => {
        var data = contacts
            .filter(item => item.name?.toLowerCase().includes(query.toLowerCase()))
            .map(item => {
                return {
                    ...item,
                    title: item.name,
                    className: selectedUsers[item.id] ? 'active' : '',
                }
            });
        return data;
    }

    return (
        <div className='dialog-background'>
            <input ref={imagePicker} type="file" accept=".jpg, .jpeg, .png" style={{ display: 'none' }} onChange={onchangeFile} />
            <div className='dialog-container'>
                <div className='dialog-header'>
                    <div className='dialog-title'>{curPage == 0 ? `New Group Chat` : `Create New Group`}</div>
                    {curPage == 1 && <div className='go-back' onClick={onBack}><FiArrowLeft size={28} /></div>}
                    <div className='close' onClick={onClose}><FiX size={28} /></div>
                </div>
                <div className='dialog-sub-header'>
                    {curPage == 0 ?

                        <div className='avatar' onClick={onAvatar}>
                            {image ?
                                <img src={imageUrl} alt={'avatar'} />
                                :
                                <FiCamera size={50} />
                            }
                            {!!image &&
                                <div className='close' onClick={onRemoveAvatar}>
                                    <FaRegTimesCircle size={28} />
                                </div>
                            }
                        </div>
                        :
                        <div className="conversation-search">
                            <input
                                type="search"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="reset-style conversation-search-input"
                                placeholder="Search User"
                            />
                        </div>
                    }
                </div>

                <div className='dialog-body'>
                    {curPage == 0 ?
                        <>
                            <input className='name-input' placeholder='Group name' value={name} onChange={e => setName(e.target.value)} />
                            <div className={classNames('arrow-next', { 'arrow-disabled': !name.trim() })} onClick={onNext}>
                                <FiArrowRight size={34} />
                            </div>
                        </>
                        :
                        <>
                            <div className='scrollable'>
                                <ChatList
                                    dataSource={getData()}
                                    onClick={(item) => setSelectedUsers(prev => ({ ...prev, [item.id]: !(prev[item.id] || false) }))}
                                />
                            </div>
                        </>
                    }
                </div>
                {curPage == 1 &&
                    <div className='dialog-footer'>
                        <div className={classNames('done-action', { 'arrow-disabled': !(members.length > 0) })} onClick={onDone}>Done</div>
                    </div>
                }
            </div>
        </div >
    )
}
