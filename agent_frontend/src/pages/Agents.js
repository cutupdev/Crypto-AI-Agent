import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    List,
    ListItem,
    ListItemText,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { requestAPI } from '../api';
import config from '../config';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    // Fetch agents when component mounts
    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const data = await requestAPI(`${config.apiUrl}/api/agent/all`, 'GET', null, true);

            if (data.agents) {
                setAgents(data.agents);
            } else {
                setAgents([]);
            }
        } catch (error) {
            console.error('Error fetching agents:', error);
            setAgents([]);
        }
    };

    const handleStopAgent = async (agent) => {
        setSelectedAgent(agent);
        setOpenDialog(true);
    };

    const handleConfirmStop = async () => {
        try {
            // Add your API call to stop the agent here
            await requestAPI(`${config.apiUrl}/api/agent/${selectedAgent.token}`, 'DELETE', null, true);

            // Refresh the agents list
            fetchAgents();

            // Close the dialog
            setOpenDialog(false);
            setSelectedAgent(null);
        } catch (error) {
            console.error('Error stopping agent:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedAgent(null);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Running Agents
            </Typography>

            <Paper elevation={3}>
                <List>
                    {agents.map((agent) => (
                        <ListItem
                            key={agent.token}
                            divider
                            // secondaryAction={
                            //     <Button
                            //         variant="contained"
                            //         color="error"
                            //         onClick={() => handleStopAgent(agent)}
                            //     >
                            //         Stop Agent
                            //     </Button>
                            // }
                        >
                            <ListItemText
                                primary={`Token: ${agent.token}`}
                                secondary={`Type: ${agent.type}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Stop Agent</DialogTitle>
                <DialogContent>
                    Are you sure you want to stop this agent?
                    {selectedAgent && (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Token: {selectedAgent.token}
                            <br />
                            Type: {selectedAgent.type}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmStop} color="error" variant="contained">
                        Stop Agent
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Agents;