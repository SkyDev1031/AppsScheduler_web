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
import { useGlobalContext } from "../../../contexts";


export default function InviteModal({ open, onClose, study, onInvited }) {
    const [participants, setParticipants] = useState([]);
    const [invitingId, setInvitingId] = useState(null);
    const { setLoading } = useGlobalContext();
    useEffect(() => {
        if (open) {
            setLoading(true)
            getParticipantsApi().then((res) => {
                if (Array.isArray(res.data)) {
                    setParticipants(res.data);
                } else {
                    console.error('Unexpected participant response:', res.data);
                    setParticipants([]);
                }
            }).catch((err) => {
                console.error('Failed to fetch participants:', err);
                setParticipants([]);
            }).finally(() => {
                setLoading(false);
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
                                            disabled={invitingId === p.id || (p.studies || []).some(s => s.invitationStatus === 'approved')}
                                            sx={{ minWidth: 100 }}
                                        >
                                            {(p.studies || []).some(s => s.invitationStatus === 'approved')
                                                ? 'Invited'
                                                : (invitingId === p.id ? 'Inviting...' : 'Invite')}
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <FontAwesomeIcon icon={faUser} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" flexDirection="column">
                                                <Typography variant="body1" fontWeight="bold">
                                                    {p.fullName || p.userID}
                                                </Typography>
                                                {p.studies && p.studies.length > 0 && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {p.studies.map(s => (
                                                            <span key={s.studyGroup}>
                                                                {s.studyGroup} [{s.invitationStatus}]
                                                            </span>
                                                        )).reduce((prev, curr) => [prev, ', ', curr])}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
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
