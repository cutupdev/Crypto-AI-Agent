import React, { useState } from 'react';
import {
    ThemeProvider,
    createTheme,
    Container,
    Typography,
    Box,
    Grid,
    Button,
    TextField,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert
} from '@mui/material';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import Web3Modal from 'web3modal';
import { requestAPI } from '../api';
import config from '../config';

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

const CreditPurchase = () => {
    const [credits, setCredits] = useState(0);
    const [mayoAmount, setMayoAmount] = useState(0);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const creditOptions = [
        { credits: 1000, mayo: 1 },
        { credits: 5000, mayo: 4.5 },
        { credits: 10000, mayo: 8.5 },
        { credits: 50000, mayo: 40 }
    ];

    const handleCreditSelection = (option) => {
        setCredits(option.credits);
        setMayoAmount(option.mayo);
    };

    const handlePurchase = async () => {
        try {
            // const web3Modal = new Web3Modal();
            // const connection = await web3Modal.connect();
            // const provider = new BrowserProvider(connection);
            // const signer = await provider.getSigner();
            const urlObj = new URL(`${config.apiUrl}/api/credit/add`);
            urlObj.searchParams.append('amount', credits);

            await requestAPI(
                urlObj,
                'POST',
                null,
                true
            );
            // Implement MAYO token purchase logic
            // Example: Call smart contract method to purchase credits

            setSnackbarMessage(`Successfully purchased ${credits} credits!`);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage('Purchase Failed: ' + error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Box sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <Typography variant="h4" gutterBottom>
                        Buy Credits with $MAYO
                    </Typography>

                    <Grid container spacing={3}>
                        {creditOptions.map((option, index) => (
                            <Grid item xs={12} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        cursor: 'pointer',
                                        border: credits === option.credits ? '2px solid #1976d2' : '1px solid #ddd'
                                    }}
                                    onClick={() => handleCreditSelection(option)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" align="center">
                                            {option.credits} Credits
                                        </Typography>
                                        <Typography variant="body2" align="center">
                                            {option.mayo} $MAYO
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 3, width: '100%', maxWidth: 400 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handlePurchase}
                            disabled={credits === 0}
                        >
                            Purchase {credits} Credits
                        </Button>
                    </Box>

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

export default CreditPurchase;