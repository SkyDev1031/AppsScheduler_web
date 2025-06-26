import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getStudiesWithParticipants } from '../../../api/StudyAPI';
import { sendNotificationApi } from '../../../api/ParticipantAPI';
import { useGlobalContext } from "../../../contexts/index.js";
import { toast_success, toast_error } from '../../../utils/index.js';
import { _ERROR_CODES } from '../../../config/index.js';

const SendToParticipants = () => {
    const [participantsTree, setParticipantsTree] = useState([]);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationContent, setNotificationContent] = useState('');
    const { setLoading, confirmDialog } = useGlobalContext();

    useEffect(() => {
        fetchParticipantsTree();
    }, []);

    const fetchParticipantsTree = async () => {
        setLoading(true);
        try {
            const res = await getStudiesWithParticipants();
            if (res && res.data) {
                const treeData = res.data.map(study => ({
                    value: study.studyGroup,
                    label: study.studyGroup,
                    children: study.participants.map(p => ({
                        value: p.id,
                        label: p.userID
                    }))
                }));
                setParticipantsTree(treeData);
                setExpanded(treeData.map(study => study.value));
            } else {
                setParticipantsTree([]);
                setExpanded([]);
            }
        } catch (err) {
            toast_error(err, _ERROR_CODES.NETWORK_ERROR);
            setParticipantsTree([]);
            setExpanded([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!notificationTitle || !notificationContent) {
            toast_error('Please fill in both title and content', _ERROR_CODES.VALIDATION_ERROR);
            return;
        }

        const confirmed = await confirmDialog('Send', 'Are you sure you want to send this notification?');
        if (!confirmed) return;

        setLoading(true);
        try {
            await Promise.all(
                checked.map(participantId => sendNotificationApi(participantId, notificationTitle, notificationContent))
            );
            toast_success('Notification sent successfully');
            setChecked([]);
            setNotificationTitle('');
            setNotificationContent('');
        } catch (err) {
            toast_error(err, _ERROR_CODES.NETWORK_ERROR);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <h3>Send Notification to Participants</h3>

            <div className="mb-3">
                <label htmlFor="title">Title</label>
                <InputText
                    id="title"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    className="w-full"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="content">Content</label>
                <InputTextarea
                    id="content"
                    value={notificationContent}
                    onChange={(e) => setNotificationContent(e.target.value)}
                    rows={4}
                    autoResize
                    className="w-full"
                />
            </div>

            <div className="mb-3">
                {participantsTree.length > 0 ? (
                    <CheckboxTree
                        nodes={participantsTree}
                        checked={checked}
                        expanded={expanded}
                        onCheck={setChecked}
                        onExpand={setExpanded}
                        icons={{
                            check: <i className="bi bi-check-square-fill text-primary" />,
                            uncheck: <i className="bi bi-square" />,
                            halfCheck: <i className="bi bi-dash-square-fill text-primary" />,
                            expandClose: <i className="bi bi-chevron-right" />,
                            expandOpen: <i className="bi bi-chevron-down" />,
                            leaf: <i className="bi bi-person-fill" />
                        }}
                    />
                ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <p className="text-muted">No participants available.</p>
                    </div>
                )}
            </div>

            <Button
                label="Send Notification"
                icon="pi pi-send"
                onClick={handleSend}
                disabled={checked.length === 0}
            />
        </div>
    );
};

export default SendToParticipants;
