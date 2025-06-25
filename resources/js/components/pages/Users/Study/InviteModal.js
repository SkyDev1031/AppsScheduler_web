import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    Typography,
    Divider,
    IconButton,
    DialogActions,
    Box
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes } from '@fortawesome/free-solid-svg-icons';
import { inviteParticipant } from '../../../api/StudyAPI';
import { getParticipantsApi } from '../../../api/ParticipantAPI';
import { toast_error, toast_success } from '../../../utils';

export default function InviteModal({ open, onClose, study, onInvited }) {
    const [participants, setParticipants] = useState([]);
    const [invitingId, setInvitingId] = useState(null);

    useEffect(() => {
        if (open) {
            getParticipantsApi().then((res) => {
                let rawList = [];

                if (Array.isArray(res.data)) {
                    rawList = res.data;
                } else if (res.data && Array.isArray(res.data.participants)) {
                    rawList = res.data.participants;
                } else {
                    console.error('Unexpected participant response:', res.data);
                }

                // ✅ Filter only 'Active' participants
                const activeParticipants = rawList.filter(p => p.status === 'Active');
                setParticipants(activeParticipants);
            }).catch((err) => {
                console.error('Failed to fetch participants:', err);
                setParticipants([]);
            });
        }
    }, [open]);

    const handleInvite = async (participantId, status) => {
        if (status !== 'Active') {
            toast_error('Only active participants can be invited');
            return;
        }
        setInvitingId(participantId);
        try {
            const res = await inviteParticipant({ study_id: study.id, participant_id: participantId });
            if (res?.status === 'success' || res?.status === 'duplicate') {
                toast_success(res?.message || 'Invitation sent');
                onInvited(res?.invite?.participant || null);
                onClose();
            } else {
                toast_error(res?.message || 'Failed to invite participant');
            }
        } catch (error) {
            console.error('Invite error:', error);
            toast_error('An error occurred while inviting the participant. Please try again later.');
        } finally {
            setInvitingId(null);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Invite Participants to {study?.title}</Typography>
                    <IconButton onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {participants.length === 0 ? (
                    <Typography sx={{ mt: 2 }}>No participants available to invite.</Typography>
                ) : (
                    <List disablePadding>
                        {participants.map((p, idx) => (
                            <div key={p.id}>
                                <ListItem
                                    secondaryAction={
                                        <Button
                                            onClick={() => handleInvite(p.id, p.status)}
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            disabled={invitingId === p.id}
                                            sx={{ minWidth: 100 }}
                                        >
                                            {invitingId === p.id ? 'Inviting...' : 'Invite'}
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FontAwesomeIcon icon={faUser} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={p.fullName || p.userID}
                                        // secondary={`Status: ${p.status}`}
                                    />
                                </ListItem>
                                {idx < participants.length - 1 && <Divider component="li" />}
                            </div>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}