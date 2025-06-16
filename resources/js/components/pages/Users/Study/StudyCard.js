import React from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faUserPlus,
  faTrashAlt,
  faUsers,
  faUserMinus
} from '@fortawesome/free-solid-svg-icons';

const StudyCard = ({
  study,
  onInviteClick,
  onDeleteStudyClick,
  onViewStudyClick,
  onShowParticipants
}) => {
  const participantsCount = study.participants?.length || 0;
  const invitationsCount = study.invitations?.length || 0;
  const totalParticipants = participantsCount + invitationsCount;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ p: 2 }}>
      <Grid item xs={4}>
        <Typography variant="subtitle1" fontWeight="medium">
          {study.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {study.content?.substring(0, 50)}{study.content?.length > 50 ? '...' : ''}
        </Typography>
      </Grid>
      
      <Grid item xs={2}>
        <Tooltip title="Click to view participants">
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1}
            onClick={() => onShowParticipants(study)}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { 
                textDecoration: 'underline',
                color: 'primary.main'
              }
            }}
          >
            <FontAwesomeIcon icon={faUsers} size="sm" style={{ opacity: 0.7 }} />
            <Typography>{totalParticipants}</Typography>
          </Box>
        </Tooltip>
      </Grid>
      
      <Grid item xs={3}>
        <Typography variant="body2">
          {formatDate(study.created_at)}
        </Typography>
      </Grid>
      
      <Grid item xs={3} textAlign="right">
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Tooltip title="View Study">
            <IconButton 
              size="small" 
              onClick={() => onViewStudyClick(study.id)}
              color="primary"
            >
              <FontAwesomeIcon icon={faEye} fontSize="inherit" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Invite Participants">
            <IconButton 
              size="small" 
              onClick={() => onInviteClick(study.id)}
              color="secondary"
            >
              <FontAwesomeIcon icon={faUserPlus} fontSize="inherit" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Cancel Participants">
            <IconButton 
              size="small" 
              onClick={() => onShowParticipants(study)}
              color="secondary"
            >
              <FontAwesomeIcon icon={faUserMinus} fontSize="inherit" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Delete Study">
            <IconButton 
              size="small" 
              onClick={() => onDeleteStudyClick(study.id)}
              color="error"
            >
              <FontAwesomeIcon icon={faTrashAlt} fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StudyCard;