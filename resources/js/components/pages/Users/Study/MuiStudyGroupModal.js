import { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/material/Icon';  // Uses the built-in Icon component

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '600px' },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function MuiStudyGroupModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, description });
    setTitle('');
    setDescription('');
    onClose();
  };
   
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-study-group-modal"
      aria-describedby="create-new-study-group-form"
      disableEscapeKeyDown={false}
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Typography variant="h5" component="h2" mb={3}>
          Create New Study Group
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              required
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button 
                variant="outlined" 
                onClick={onClose}
                color="secondary"
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                type="submit"
                disableElevation
              >
                Create Group
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}