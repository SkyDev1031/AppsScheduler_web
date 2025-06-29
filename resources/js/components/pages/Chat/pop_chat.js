import React from 'react';
import { useRef } from 'react';
import { default as ChatComponent } from "../../Chat/components/popuppage";
import { useEffect } from 'react';
import { getAllContacts } from '../../api/OriginAPI.js';
import "../../Chat/popup.css";

export default function Chat(props) {
    const chatRef = useRef(null)
    useEffect(() => {
        if (!chatRef) return;
        getContacts()
    }, [chatRef])
    const getContacts = async () => {
        var contacts = await getAllContacts().catch(console.error);
        if (!contacts) return alert("Something went wrong.");
        contacts = contacts.data || [];
        contacts = contacts.map(item => ({ ...item, name: item.ScreenName }));
        // // contacts [{avatar:url, name:''}]
        chatRef.current?.updateContacts(contacts);

    }

    return (
        <ChatComponent ref={chatRef} />
    )
}