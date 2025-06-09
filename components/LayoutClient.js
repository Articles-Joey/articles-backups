'use client';

import { Button, createTheme, Dialog, DialogActions, DialogContent, DialogTitle, GlobalStyles, ThemeProvider, Typography } from "@mui/material";
import { useSiteStore } from "./stores/useSiteStore";
import { useState } from "react";

export default function LayoutClient({ children }) {

    const termsOfUseAccepted = useSiteStore((state) => state.termsOfUseAccepted);

    const setTermsOfUseAccepted = useSiteStore((state) => state.setTermsOfUseAccepted);

    const [showDetails, setShowDetails] = useState(true);

    const darkMode = useSiteStore((state) => state.darkMode);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#f9edcd', // Replace with your custom primary color
            },
            mode: 'dark',
            color: '#fff',
            // primary: {
            //     main: '#90caf9',
            // },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        '&.Mui-disabled': {
                            backgroundColor: 'rgb(58 58 58 / 42%)', // Set your disabled background color
                            color: '#666666',           // Optional: change disabled text color
                        },
                    },
                },
            },
        },
    });

    const lightTheme = createTheme({
        palette: {
            primary: {
                main: '#000', // Replace with your custom primary color
            },
            mode: 'light',
            color: '#000',
            // primary: {
            //     main: '#90caf9',
            // },
            background: {
                default: '#fff',
                paper: '#f2f2f2',
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        '&.Mui-disabled': {
                            backgroundColor: 'rgb(58 58 58 / 42%)', // Set your disabled background color
                            color: '#666666',           // Optional: change disabled text color
                        },
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider
            theme={darkMode ? theme : lightTheme}
        >

            <GlobalStyles
                styles={(theme) => ({
                    html: {
                        backgroundColor: theme.palette.background.default,
                    },
                    body: {
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.color,
                        margin: 0,
                        padding: 0,
                    },
                })}
            />

            {!termsOfUseAccepted &&
                <Dialog
                    open={!termsOfUseAccepted}
                    onClose={() => { }}
                >
                    <DialogTitle>Terms of Use</DialogTitle>
                    <DialogContent>
                        <Typography
                            variant="body2"
                        >
                            Text
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setTermsOfUseAccepted(true)}>Accept</Button>
                    </DialogActions>
                </Dialog>
            }

            {children}

        </ThemeProvider >
    )
}