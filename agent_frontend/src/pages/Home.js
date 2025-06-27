import React, { useEffect, useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Avatar,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { useNavigate } from 'react-router-dom';
import { Divider } from "@mui/material";
import { motion } from "framer-motion";
import config from '../config';
import { requestAPI } from '../api';

// Styled component for file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const Home = ({ setAuth }) => {
  const [userCredit, setUserCredit] = useState(null);
  const [userName, setUserName] = useState('');

  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvartarUrl] = useState('');
  const [interactType, setInteractType] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [botToken, setBotToken] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [availableVoices, setAvailableVoices] = useState([]);

  const [agentDetails, setAgentDetails] = useState({
    whoAmI: '',
    projectDetails: '',
    interactionStyle: ''
  });

  useEffect(() => {
    const fetchUserCredit = async () => {
      try {
        const data = await requestAPI(`${config.apiUrl}/api/credit`, 'GET', null, true);
        setUserCredit(data.credit);
        setUserName(data.username || 'User');
      } catch (error) {
        console.error('Failed to fetch user credit', error);
        setSnackbarMessage('Failed to fetch user credit');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    };
    const fetchVoices = async () => {
      try {
        const data = await requestAPI(`${config.apiUrl}/api/voices`, 'GET', null, true);
        setAvailableVoices(data.voices);
      } catch (error) {
        console.error('Failed to fetch voices', error);
      }
    };
    fetchUserCredit();
    fetchVoices();
  }, []);

  const navigate = useNavigate();

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const data = await requestAPI(`${config.apiUrl}/api/upload-image`, 'POST', formData, true, false, null);

        if (data.valid) {
          setAvatar(URL.createObjectURL(file));
          setSnackbarMessage('Successfully uploaded');
          setSnackbarSeverity('success');
          setAvartarUrl(data.url);
        } else {
          setAvatar(null);
          setSnackbarMessage('Cannot find face');
          setSnackbarSeverity('error');
          setAvartarUrl('');
        }
      } catch (error) {
        setAvatar(null);
        setSnackbarMessage('Error uploading image');
        setSnackbarSeverity('error');
        setAvartarUrl('');
      }

      setOpenSnackbar(true);
    }
  };

  const handleBuyCredits = async () => {
    navigate('/purchase-credits');
    // try {
    //   //   const web3Modal = new Web3Modal();
    //   //   const connection = await web3Modal.connect();
    //   //   const provider = new ethers.providers.Web3Provider(connection);
    //   //   const signer = provider.getSigner();

    //   // Implement MAYO token purchase logic here
    //   setSnackbarMessage('Credits Purchased Successfully!');
    //   setSnackbarSeverity('success');
    //   setOpenSnackbar(true);
    // } catch (error) {
    //   setSnackbarMessage('Purchase Failed: ' + error.message);
    //   setSnackbarSeverity('error');
    //   setOpenSnackbar(true);
    // }
  };

  const handleManageAgents = async () => {
    navigate('/agents');
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCreateAgent = async () => {
    if ((interactType === 'voice-video' || interactType === 'text-video') && !avatar) {
      setSnackbarMessage('Please upload an avatar for the agent');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    if (!interactType || !botToken) {
      setSnackbarMessage('Interaction Type and Bot token are required!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    try {
      const urlObj = new URL(`${config.apiUrl}/api/agent`);
      urlObj.searchParams.append('interaction_type', interactType);
      urlObj.searchParams.append('token', botToken);
      urlObj.searchParams.append('avatar_url', avatarUrl);
      urlObj.searchParams.append('voice_id', selectedVoice);
      urlObj.searchParams.append('who_am_I', agentDetails.whoAmI);
      urlObj.searchParams.append('project_details', agentDetails.projectDetails);
      urlObj.searchParams.append('interaction_style', agentDetails.interactionStyle);

      const data = await requestAPI(urlObj, 'POST', null, true);
      setSnackbarMessage(data.message || "Agent created successfully");
    } catch (error) {
      setSnackbarMessage("Failed to create an agent");
    }
    setOpenSnackbar(true);
  };

  const handleAgentDetailChange = (e) => {
    const { name, value } = e.target;
    setAgentDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogOut = () => {
    setAuth(false);
    localStorage.removeItem('token');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            Welcome, {userName}
          </Typography>
          <Typography variant="subtitle1" component="div">
            Available Credits: {userCredit !== null ? userCredit : '—'}
          </Typography>

          <Box component="form" sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>

              {/* Interaction Type */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Interaction Type</InputLabel>
                  <Select
                    value={interactType}
                    label="Interaction Type"
                    onChange={(e) => setInteractType(e.target.value)}
                  >
                    <MenuItem value="text-text">Text to Text</MenuItem>
                    <MenuItem value="text-video">Text to Video</MenuItem>
                    <MenuItem value="voice-video">Voice to Video</MenuItem>
                    <MenuItem value="text-voice">Text to Voice</MenuItem>
                    <MenuItem value="voice-voice">Voice to Voice</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Avatar Upload */}
              {(interactType && (interactType === 'text-video' || interactType === 'voice-video')) &&
                <Grid item xs={12}>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    Upload Avatar
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                  </Button>
                  {avatar && (
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 2
                    }}>
                      <Avatar
                        src={avatar}
                        sx={{ width: 100, height: 100 }}
                      />
                    </Box>
                  )}
                </Grid>}

              {/* Select Voices */}
              {(interactType && (interactType !== 'text-text')) &&
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Voice</InputLabel>
                    <Select
                      value={selectedVoice}
                      label="Voice"
                      onChange={(e) => setSelectedVoice(e.target.value)}
                    >
                      {availableVoices.map((voice, index) => (
                        <MenuItem key={index} value={voice.voice_id}>{voice.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>}

              {/* Bot Token */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bot Token"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Container
                  sx={{
                    padding: '0 !important',
                    marginTop: 1,
                    maxWidth: '100% !important',
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      padding: 1,
                      marginTop: 1,
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        marginBottom: 1,
                        textAlign: 'left'
                      }}
                    >
                      Agent Details
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        fullWidth
                        name="whoAmI"
                        label="Who am I?"
                        variant="outlined"
                        value={agentDetails.whoAmI}
                        onChange={handleAgentDetailChange}
                        multiline
                        rows={3}
                      />

                      <TextField
                        fullWidth
                        name="projectDetails"
                        label="Project Details"
                        variant="outlined"
                        value={agentDetails.projectDetails}
                        onChange={handleAgentDetailChange}
                        multiline
                        rows={3}
                      />

                      <TextField
                        fullWidth
                        name="interactionStyle"
                        label="Style of Interaction"
                        variant="outlined"
                        value={agentDetails.interactionStyle}
                        onChange={handleAgentDetailChange}
                        multiline
                        rows={3}
                      />
                    </Box>
                  </Paper>
                </Container>
              </Grid>

              {/* Buy Credits Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={handleBuyCredits}
                >
                  Buy Credits with $MAYO
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="contained"
                  fullWidth
                  onClick={handleCreateAgent}
                >
                  Create Agent
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="contained"
                  fullWidth
                  onClick={handleManageAgents}
                >
                  Manage Agents
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="contained"
                  fullWidth
                  onClick={() => handleLogOut()}
                >
                  Log out
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Snackbar for Notifications */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Home;