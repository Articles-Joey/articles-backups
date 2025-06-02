"use client"

import { useSiteStore } from "@/components/stores/useSiteStore";
import { Box, Button, TextField, Typography } from "@mui/material";
import SetupChecklist from "./SetupChecklist";
import { useState } from "react";

export default function Page() {

    const addCount = useSiteStore((state) => state.addCount);
    const count = useSiteStore((state) => state.count);

    const storageLocations = useSiteStore((state) => state.storageLocations);
    const setStorageLocations = useSiteStore((state) => state.setStorageLocations);
    const removeStorageLocation = useSiteStore((state) => state.removeStorageLocation);

    const resetStore = useSiteStore((state) => state.resetStore);

    const [newLocation, setNewLocation] = useState('');

    return (
        <div className="page">

            <SetupChecklist />

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    // addCount()
                    resetStore()
                }}
                sx={{
                    mb: 2
                }}
            >
                Reset Zustand Store
            </Button>

            <Typography sx={{ mb: 5 }}>
                Storage: {count}GB/10GB
            </Typography>

            <Typography sx={{ mb: 1 }}>
                Locations:
            </Typography>

            <Typography sx={{ mb: 1 }}>
                F:\My Documents\Sites\backup
            </Typography>

            {storageLocations.map((location_obj, location_i) => {
                return (
                    <div
                        key={location_obj}
                    >
                        <Typography
                            sx={{ mb: 1 }}
                        >
                            {location_obj}
                        </Typography>
                        <Button
                            color="warning"
                            variant="contained"
                            size="small"
                            sx={{
                                mb: 3
                            }}
                            onClick={() => {
                                removeStorageLocation(location_i)
                            }}
                        >
                            removeStorageLocation
                        </Button>
                    </div>
                )
            })}

            <TextField
                value={newLocation}
                size="small"
                onChange={(e) => {
                    setNewLocation(e.target.value)
                }}
            />

            <Button
                color="primary"
                variant="contained"
                sx={{
                    mb: 3
                }}
                disabled={!newLocation}
                onClick={() => {
                    setNewLocation('')
                    setStorageLocations([
                        ...storageLocations,
                        newLocation
                    ])
                }}
            >
                Add Location
            </Button>

            <Typography sx={{ mb: 2 }}>
                Supported Cloud Backup Providers
            </Typography>

            <div>
                {[
                    {
                        name: 'Articles Media: FS'
                    },
                    {
                        name: 'AWS: S3'
                    },
                    {
                        name: 'Cloudflare: R2'
                    }
                ].map(provider_obj => {
                    return (
                        <Box
                            key={provider_obj.name}
                            sx={{
                                mb: 1
                            }}
                        >
                            <Typography
                                sx={{
                                    mb: 0
                                }}
                            >
                                {provider_obj.name}
                            </Typography>
                            <Typography
                                sx={{
                                    mb: 0,
                                    fontSize: '0.7rem'
                                }}
                            >
                                Not connected
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => {
                                    addCount()
                                }}
                                sx={{
                                    mb: 2
                                }}
                            >
                                Connect
                            </Button>
                        </Box>
                    )
                })}
            </div>

        </div>
    );
}
