// import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
// import { FaArrowLeft, FaInfoCircle, FaPhone, FaPlusCircle, FaVideo } from 'react-icons/fa';
// import { useNavigate } from "react-router-dom";
// import { useChatContext } from '..';
// import { IMAGES } from '../assets';
// import { NEW_ROOM_ID, _PAGE_TYPES } from '../config';
// import ChatItem from './ChatItem';
// import ChatList from './ChatList/index';
// import MessageList from './MessageList';
// import NewGroupModal from './NewGroupModal';
// import SendBox from './SendBox';
// import Toolbar from './Toolbar';

// const ChatComponent = forwardRef(function (props, ref) {

//     const {
//         conversations, messages,
//         roomId, setRoomId, newRoom, setNewRoom,
//         startCall, sendMessage, uploadFile,
//         curPage, setCurPage, lastMessages, unreadMessages,
//         downloadingStatus, onDownload,
//         editMessage, setEditMessage, deleteMessage,
//         mutedRooms, onMuteRoom, onCreateGroup,
//         visibleGroupModal, setVisibleGroupModal
//     } = useChatContext()
//     const navigate = useNavigate();

//     const [roomsQuery, setRoomsQuery] = useState('')
//     const [contacts, setContacts] = useState([])

//     const messageListRef = useRef(null)

//     const updateContacts = (data) => setContacts(data || []);

//     useImperativeHandle(ref, () => ({ updateContacts }));

//     useEffect(() => {
//         setNewRoom(null)
//     }, [curPage])

//     const getData = () => {
//         const isContacts = curPage == _PAGE_TYPES.CONTACTS;
//         var data = (isContacts ? contacts : conversations)
//             .filter(item => item.name?.toLowerCase().includes(roomsQuery.toLowerCase()))
//             .map(item => {
//                 const { id, name } = item;
//                 if (isContacts) return { ...item, title: name };
//                 const lastMessage = lastMessages?.[id];
//                 const unreadMessage = unreadMessages?.[id];
//                 const muted = mutedRooms?.[id] || false;
//                 return {
//                     ...item, title: name, unread: unreadMessage || 0,
//                     subtitle: lastMessage?.message || '',
//                     className: roomId == id ? 'active' : '',
//                     date: lastMessage?.date || '',

//                     showMute: true,
//                     muted,
//                     // statusColor: '#0f0',
//                 }
//             })
//         return data;
//     }

//     const getMessages = () => {
//         var data = messages
//             .map(item => {
//                 if (item.type == 'file') {
//                     item.data = {
//                         ...item.data,
//                         status: {
//                             click: false,
//                             loading: 0,
//                             ...downloadingStatus?.[item.id]
//                         }
//                     }
//                 }
//                 return item;
//             });
//         return data;
//     }

//     const goBack = () => navigate(-1);

//     const callingRoom = newRoom || conversations?.find(item => item.id == roomId);
//     const members_num = callingRoom?.members?.length || 0;

//     return (
//         <div className="messenger">
//             <div className="sidebar">
//                 <div className="conversation-list">
//                     <Toolbar
//                         title={<img src={IMAGES.messenger_logo} alt={'logo'} className="logo" />}
//                         leftItems={[
//                             <FaArrowLeft key={'left'} className='font-icon' onClick={() => {
//                                 if (curPage === _PAGE_TYPES.ROOMS) return goBack();
//                                 setCurPage(_PAGE_TYPES.ROOMS);
//                             }} />
//                         ]}
//                         rightItems={curPage === _PAGE_TYPES.ROOMS ? [
//                             <FaPlusCircle key={'circle'} className='font-icon' onClick={() => {
//                                 setCurPage(_PAGE_TYPES.CONTACTS)
//                             }} />
//                         ] : []}
//                     />
//                     <div className="conversation-search">
//                         <input
//                             type="search"
//                             value={roomsQuery}
//                             onChange={e => setRoomsQuery(e.target.value)}
//                             className="reset-style conversation-search-input"
//                             placeholder="Search Messages"
//                         />
//                     </div>
//                     <div className='scrollable list-container'>
//                         {curPage == _PAGE_TYPES.CONTACTS &&
//                             <ChatItem
//                                 title={'New Group'}
//                                 avatar={IMAGES.ic_group}
//                                 className={'rm-new-group'}
//                                 onClick={() => setVisibleGroupModal(true)}
//                             />
//                         }
//                         <ChatList
//                             dataSource={getData()}
//                             onClick={(item) => {
//                                 if (curPage === _PAGE_TYPES.CONTACTS) {
//                                     setRoomId(NEW_ROOM_ID);
//                                     setNewRoom(item)
//                                 } else {
//                                     setNewRoom(null)
//                                     setRoomId(item.id)
//                                 }
//                             }}
//                             onClickMute={onMuteRoom}
//                         />
//                     </div>
//                 </div>
//             </div>
//             <div className="message-list">
//                 <Toolbar
//                     title={`${callingRoom?.name || ''} ${members_num > 2 ? `(${members_num} members)` : ''}`}
//                     rightItems={[
//                         <FaInfoCircle className='toolbar-actions' key={'info'} />,
//                         <FaVideo className='toolbar-actions' key={'video'} onClick={() => startCall(callingRoom, true)} />,
//                         <FaPhone className='toolbar-actions' key={'phone'} onClick={() => startCall(callingRoom)} />
//                     ]}
//                 />
//                 <MessageList
//                     referance={messageListRef}
//                     className='messages'
//                     // lockable={true}
//                     // toBottomHeight={"100%"}
//                     onDownload={onDownload}
//                     dataSource={getMessages()}
//                     onRemoveMessageClick={deleteMessage}
//                     onEditClick={item => setEditMessage(item)}
//                 />
//                 <SendBox
//                     editMessage={editMessage}
//                     setEditMessage={setEditMessage}
//                     sendMessage={sendMessage}
//                     uploadFile={uploadFile} />
//                 {!roomId &&
//                     <div className='chat-overlay'>
//                         <img src={IMAGES.messenger_logo} alt={'logo'} />
//                     </div>
//                 }
//             </div>
//             <NewGroupModal
//                 contacts={contacts}
//                 uploadFile={uploadFile}
//                 visible={visibleGroupModal}
//                 setVisible={setVisibleGroupModal}
//                 onCreateGroup={onCreateGroup} />
//         </div>
//     )
// });
// export default ChatComponent;