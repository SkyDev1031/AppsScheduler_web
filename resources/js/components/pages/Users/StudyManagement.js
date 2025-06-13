import { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  DialogActions,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MuiStudyGroupModal from './MuiStudyGroupModal';
import InviteModal from './InviteModal';
import StudyCard from './StudyCard';
import { useGlobalContext } from "../../contexts";
import {
  createStudy,
  getStudies,
  cancelInviteParticipant,
  deleteStudy
} from '../../api/StudyAPI';
import { toast_error, toast_success } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser } from '@fortawesome/free-solid-svg-icons';

export default function StudyManagement() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [studies, setStudies] = useState([]);
  const { setLoading, confirmDialog, user } = useGlobalContext();
  const navigate = useNavigate();

  const fetchStudies = async () => {
    setLoading(true);
    try {
      const res = await getStudies(user.id);
      const data = res.data;
      if (Array.isArray(data)) {
        setStudies(data);
      } else if (data && Array.isArray(data.studies)) {
        setStudies(data.studies);
      } else {
        setStudies([]);
        toast_error('Unexpected response from server');
      }
    } catch (err) {
      toast_error('Failed to fetch studies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const handleCreateStudyGroup = async (formData) => {
    try {
      const response = await createStudy(formData);
      const newStudy = response.data?.study;
      if (newStudy) {
        setStudies(prev => [newStudy, ...prev]);
      } else {
        fetchStudies();
      }
      toast_success('Study group created successfully!');
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to create study:', error);
      toast_error('Failed to create study group');
    }
  };

  const handleShowParticipants = (study) => {
    setSelectedStudy(study);
    setParticipantsModalOpen(true);
  };

  const handleInviteClick = (studyId) => {
    setSelectedStudy(studies.find(s => s.id === studyId));
    setInviteModalOpen(true);
  };

  const handleCancelInvite = async (participantId) => {
    setParticipantsModalOpen(false); // <-- hide modal

    // Delay slightly to allow modal to close fully before showing confirmDialog
    setTimeout(async () => {
      const isDelete = await confirmDialog('Are you sure you want to cancel this invitation?');
      if (!isDelete) {
        setParticipantsModalOpen(true); // reopen if cancelled
        return;
      }

      setLoading(true);
      try {
        await cancelInviteParticipant({
          study_id: selectedStudy.id,
          participant_id: participantId,
        });

        fetchStudies();
        toast_success('Invitation cancelled successfully');
      } catch (err) {
        console.error(err);
        toast_error('Failed to cancel invitation');
      } finally {
        setLoading(false);
      }
    }, 200); // slight delay (can be 100–300ms)
  };


  const handleDeleteStudy = async (studyId) => {
    setLoading(true);
    try {
      await deleteStudy(studyId);
      setStudies(prev => prev.filter(study => study.id !== studyId));
      toast_success("Study Group deleted successfully");
    } catch (err) {
      toast_error("Something went wrong while deleting study group");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudy = (studyId) => {
    navigate(`/user/study/view/${studyId}`);
  };

  return (
    <Paper sx={{
      p: 3,
      mx: 'auto',
      maxWidth: 1200,
      backgroundColor: 'background.paper'
    }}>
      <Box sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 3,
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Study Groups Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={fetchStudies}
              startIcon={<i className="fas fa-sync-alt" />}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setModalOpen(true)}
              startIcon={<i className="fas fa-plus" />}
            >
              New Study Group
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2} sx={{
          mb: 1,
          px: 2,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 1
        }}>
          <Grid item xs={4}>
            <Typography variant="subtitle2" fontWeight="bold">STUDY NAME</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" fontWeight="bold">PARTICIPANTS</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" fontWeight="bold">CREATED</Typography>
          </Grid>
          <Grid item xs={3} textAlign="right">
            <Typography variant="subtitle2" fontWeight="bold">ACTIONS</Typography>
          </Grid>
        </Grid>

        {studies.length === 0 ? (
          <Box sx={{
            p: 4,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: 'action.hover'
          }}>
            <Typography variant="body1" color="text.secondary">
              No study groups found. Create your first study group to get started.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
            {studies.map((study, index) => (
              <Box key={study.id} sx={{
                borderBottom: index !== studies.length - 1 ? 1 : 0,
                borderColor: 'divider'
              }}>
                <StudyCard
                  study={study}
                  onInviteClick={handleInviteClick}
                  onDeleteStudyClick={handleDeleteStudy}
                  onViewStudyClick={handleViewStudy}
                  onShowParticipants={() => handleShowParticipants(study)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Participants Modal */}
      <Dialog
        open={participantsModalOpen}
        onClose={() => setParticipantsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Participants for {selectedStudy?.title}
            </Typography>
            <IconButton onClick={() => setParticipantsModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <List disablePadding>
            {selectedStudy?.invitations?.length ? (
              selectedStudy.invitations.map((invitation, idx) => (
                <div key={invitation.id}>
                  <ListItem
                    secondaryAction={
                      <Button
                        onClick={() => handleCancelInvite(invitation.participant.id)}
                        variant="contained"
                        size="small"
                        color="primary"
                        sx={{ minWidth: 100 }}
                      >
                        {'Cancel'}
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <FontAwesomeIcon icon={faUser} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={invitation.participant.userID || "undefined"}
                      secondary={
                        <Typography component="span" variant="body2">
                          <Chip
                            label={invitation.study_status}
                            className={
                              invitation.study_status === 'Approved'
                                ? 'badge-success'
                                : invitation.study_status === 'Declined'
                                  ? 'badge-danger'
                                  : 'badge-warning'
                            }
                            size="small"
                            variant="outlined"
                          />
                        </Typography>
                      }
                    />

                  </ListItem>
                  {idx < selectedStudy.invitations.length - 1 && (
                    <Divider component="li" />
                  )}
                </div>
              ))
            ) : (
              <Typography sx={{ mt: 2 }}>
                No participants or pending invitations.
              </Typography>
            )}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setParticipantsModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <MuiStudyGroupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateStudyGroup}
      />

      <InviteModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        study={selectedStudy}
        onInvited={() => {
          fetchStudies();
          setInviteModalOpen(false);
        }}
      />
    </Paper>
  );
}