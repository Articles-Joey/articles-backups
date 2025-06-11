"use client"

import { useSiteStore } from "@/components/stores/useSiteStore";
import { Box, Button, TextField, Typography, Modal, Container, Tabs, Tab } from "@mui/material";
import SetupChecklist from "./SetupChecklist";
import { useState } from "react";
import { useInstallLocation } from "@/components/hooks/useInstallLocation";
import useAwsVersion from "@/components/hooks/useAwsVersion";

export default function Page() {

    const addCount = useSiteStore((state) => state.addCount);
    // const count = useSiteStore((state) => state.count);

    const storageLocations = useSiteStore((state) => state.storageLocations);
    const setStorageLocations = useSiteStore((state) => state.setStorageLocations);
    const removeStorageLocation = useSiteStore((state) => state.removeStorageLocation);

    const resetStore = useSiteStore((state) => state.resetStore);

    const awsUploadLocation = useSiteStore((state) => state.awsUploadLocation);
    const setAwsUploadLocation = useSiteStore((state) => state.setAwsUploadLocation);

    const [newLocation, setNewLocation] = useState('');
    const [confirmRemove, setConfirmRemove] = useState({ open: false, index: null });

    const {
        version: installLocation,
    } = useInstallLocation();

    const { version: awsVersion, isLoading: awsVersionLoading } = useAwsVersion();
    // Example: add more provider connection logic as needed
    const cloudProviders = [
        { name: 'Articles Media: FS', connected: false },
        { name: 'AWS: S3', connected: awsVersion },
        { name: 'Cloudflare: R2', connected: false },
    ];

    const [tab, setTab] = useState(0);
    const tabList = [
        { label: "General" },
        { label: "Locations" },
        { label: "Cloud Providers" },
    ];

    return (
        <div className="page">
            <Container>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
                    {tabList.map((t, i) => (
                        <Tab key={t.label} label={t.label} />
                    ))}
                </Tabs>
                {tab === 0 && (
                    <>
                        <SetupChecklist />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { resetStore() }}
                            sx={{ mb: 2 }}
                        >
                            Reset Zustand Store
                        </Button>
                        <Typography sx={{ mb: 5 }}>
                            Storage: 0GB/10GB
                        </Typography>
                    </>
                )}
                {tab === 1 && (
                    <>
                        <Typography sx={{ mb: 1 }}>Backup Locations:</Typography>
                        <Box>
                            <Typography sx={{ mb: 1 }}>{installLocation}</Typography>
                            <Button color="warning" variant="contained" size="small" sx={{ mb: 3 }} disabled>
                                Not removable (install location)
                            </Button>
                        </Box>
                        {storageLocations.map((location_obj, location_i) => (
                            <div key={location_obj}>
                                <Typography sx={{ mb: 1 }}>{location_obj}</Typography>
                                <Button color="warning" variant="contained" size="small" sx={{ mb: 3 }} onClick={() => setConfirmRemove({ open: true, index: location_i })}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Modal
                            open={confirmRemove.open}
                            onClose={() => setConfirmRemove({ open: false, index: null })}
                            aria-labelledby="remove-location-modal-title"
                            aria-describedby="remove-location-modal-desc"
                        >
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, minWidth: 300 }}>
                                <Typography id="remove-location-modal-title" variant="h6" sx={{ mb: 2 }}>Remove Storage Location</Typography>
                                <Typography id="remove-location-modal-desc" sx={{ mb: 2 }}>Are you sure you want to remove this storage location?</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button onClick={() => setConfirmRemove({ open: false, index: null })} variant="outlined">Cancel</Button>
                                    <Button color="error" variant="contained" onClick={() => { removeStorageLocation(confirmRemove.index); setConfirmRemove({ open: false, index: null }); }}>Remove</Button>
                                </Box>
                            </Box>
                        </Modal>
                        <TextField value={newLocation} size="small" onChange={(e) => setNewLocation(e.target.value)} />
                        <Button color="primary" variant="contained" sx={{ mb: 3 }} disabled={!newLocation || !/^([a-zA-Z]:\\)/.test(newLocation)} onClick={() => { setNewLocation(''); setStorageLocations([...storageLocations, newLocation]); }}>
                            Add Location
                        </Button>
                    </>
                )}
                {tab === 2 && (
                    <>
                        <Typography sx={{ mb: 2 }}>Supported Cloud Backup Providers</Typography>
                        <div>
                            {cloudProviders.map(provider_obj => (
                                <Box key={provider_obj.name} sx={{ mb: 1 }}>
                                    <Typography sx={{ mb: 0 }}>{provider_obj.name}</Typography>
                                    <Typography sx={{ mb: 0, fontSize: '0.7rem', color: provider_obj.connected ? 'success.main' : 'error.main' }}>
                                        {provider_obj.connected ? 'Connected' : 'Not connected'}
                                    </Typography>
                                    <Button variant="contained" size="small" color="primary" onClick={() => { }} sx={{ mb: 2 }} disabled={provider_obj.connected}>
                                        {provider_obj.connected ? 'Connected' : 'Connect'}
                                    </Button>
                                    {provider_obj.name === 'AWS: S3' && (
                                        <>
                                            <Typography sx={{ mb: 0, fontSize: '0.7rem', color: provider_obj.connected ? 'success.main' : 'error.main' }}>
                                                {awsVersion}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <TextField label="AWS Upload Location (S3 URI)" size="small" fullWidth value={awsUploadLocation} onChange={e => setAwsUploadLocation(e.target.value)} sx={{ mb: 1 }} />
                                            </Box>
                                        </>
                                    )}
                                </Box>
                            ))}
                        </div>
                    </>
                )}
            </Container>
        </div>
    );
}
