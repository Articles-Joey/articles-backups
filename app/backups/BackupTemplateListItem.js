import { useEffect, useState } from "react";

const { useBackupTemplates } = require("@/components/hooks/useBackupTemplates");
const { Delete } = require("@mui/icons-material");
const { Box, Typography, Button, TextField, Card } = require("@mui/material");

export default function BackupTemplateListItem({
    backupTemplate,
    setBackupTemplate
}) {

    const [newBackupTemplateLocation, setNewBackupTemplateLocation] = useState('');

    const {
        templates,
        // isLoading: templatesIsLoading,
        // isError,
        mutate: mutateTemplates
    } = useBackupTemplates();

    useEffect(() => {

        if (backupTemplate && templates) {
            setBackupTemplate(templates.find(obj => obj.name == backupTemplate?.name))
        }

    }, [backupTemplate, templates])

    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div>
            <Box sx={{
                mb: 3
            }}>

                <Typography sx={{ mb: 1 }}>
                    Templates Details:
                </Typography>

                <Box sx={{ ml: 2 }}>

                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>

                        <Typography sx={{ mr: 2 }}>
                            Name: {backupTemplate?.name}
                        </Typography>

                        <Button
                            size="small"
                            color="primary"
                            sx={{
                                mr: 2
                            }}
                            onClick={async () => {
                                try {
                                    const res = await fetch(`/api/open-folder`, {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            folderPath: `${backupTemplate?.name}.json`
                                        })
                                    });

                                    const data = await res.json();

                                    if (res.ok) {
                                        console.log('Success:', data);
                                    } else {
                                        console.error('Error:', data.error);
                                        alert(`Error: ${data.error}`);
                                    }
                                } catch (err) {
                                    console.error('Unexpected error:', err);
                                    alert('An unexpected error occurred.');
                                }
                            }}
                        >
                            Open
                        </Button>

                        <Button
                            size="small"
                            color="error"
                            sx={{

                            }}
                            onClick={async () => {

                                if (window.confirm('Delete the template?')) {

                                    try {
                                        const res = await fetch(`/api/templates/delete`, {
                                            method: 'POST',
                                            body: JSON.stringify({
                                                fileName: `${backupTemplate?.name}.json`
                                            })
                                        });

                                        const data = await res.json();

                                        if (res.ok) {
                                            console.log('Success:', data);
                                            setBackupTemplate(false)
                                            setNewBackupTemplateLocation('')
                                            mutateTemplates()
                                        } else {
                                            console.error('Error:', data.error);
                                            alert(`Error: ${data.error}`);
                                        }
                                    } catch (err) {
                                        console.error('Unexpected error:', err);
                                        alert('An unexpected error occurred.');
                                    }

                                }

                                // return

                            }}
                        >
                            Delete
                        </Button>

                    </Box>

                    <Typography sx={{ mb: 1 }}>
                        Backup Locations:
                    </Typography>

                    <Box sx={{ ml: 2 }}>
                        {backupTemplate?.locations?.length ?
                            <div>
                                {backupTemplate?.locations?.map(location => {
                                    return (
                                        <Box
                                            key={location}
                                            sx={{ mb: 2 }}
                                        >

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    mr: 1
                                                }}
                                                onClick={async () => {

                                                    const newLocations = backupTemplate?.locations?.filter(obj => {
                                                        return obj !== location
                                                    })

                                                    try {
                                                        const res = await fetch(`/api/templates/edit`, {
                                                            method: 'POST',
                                                            body: JSON.stringify({
                                                                fileName: `${backupTemplate?.name}.json`,
                                                                locations: newLocations
                                                            })
                                                        });

                                                        const data = await res.json();

                                                        if (res.ok) {
                                                            console.log('Success:', data);
                                                            // setBackupTemplate(false)
                                                            setNewBackupTemplateLocation('')
                                                            mutateTemplates()
                                                        } else {
                                                            console.error('Error:', data.error);
                                                            alert(`Error: ${data.error}`);
                                                        }
                                                    } catch (err) {
                                                        console.error('Unexpected error:', err);
                                                        alert('An unexpected error occurred.');
                                                    }
                                                }}
                                            >
                                                <Delete />
                                            </Button>

                                            {location}

                                        </Box>
                                    )
                                })}
                            </div>
                            :
                            'None'
                        }
                    </Box>

                    <Card sx={{ mt: 1, p: 1, display: 'flex' }}>

                        <TextField
                            size="small"
                            value={newBackupTemplateLocation}
                            onChange={(e) => setNewBackupTemplateLocation(e.target.value)}
                        />

                        <Button
                            size="small"
                            variant="outlined"
                            disabled={!newBackupTemplateLocation}
                            onClick={async () => {
                                try {
                                    const res = await fetch(`/api/templates/edit`, {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            fileName: `${backupTemplate?.name}.json`,
                                            locations: [
                                                ...backupTemplate?.locations,
                                                newBackupTemplateLocation
                                            ]
                                        })
                                    });

                                    const data = await res.json();

                                    if (res.ok) {
                                        console.log('Success:', data);
                                        // setBackupTemplate(false)
                                        setNewBackupTemplateLocation('')
                                        mutateTemplates()
                                    } else {
                                        console.error('Error:', data.error);
                                        alert(`Error: ${data.error}`);
                                    }
                                } catch (err) {
                                    console.error('Unexpected error:', err);
                                    alert('An unexpected error occurred.');
                                }
                            }}
                        >
                            Add
                        </Button>

                    </Card>

                </Box>
            </Box>
        </div>
    )
}