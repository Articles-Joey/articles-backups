"use client"

import { useSiteStore } from "@/components/stores/useSiteStore";
import { Box, Button, Typography } from "@mui/material";
import SetupChecklist from "./SetupChecklist";

export default function Page() {

    const addCount = useSiteStore((state) => state.addCount);
    const count = useSiteStore((state) => state.count);

    const resetStore = useSiteStore((state) => state.resetStore);

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

            <Button
                color="primary"
                variant="contained"
                sx={{
                    mb: 3
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
