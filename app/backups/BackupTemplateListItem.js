import { useEffect, useState } from "react";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { parse, format, isValid } from 'date-fns';

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

    }, [backupTemplate, templates, setBackupTemplate])

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
                                            folderPath: `${backupTemplate.fullPath}`
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
                        Backup Schedule:
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        {[
                            { label: 'None', value: 'None' },
                            { label: 'Every Day', value: 'Daily' },
                            { label: 'Every Week', value: 'Weekly' },
                            { label: 'Every Month', value: 'Monthly' },
                            { label: 'Custom', value: 'Custom' },
                        ].map(obj => {
                            return (
                                <Button
                                    key={obj.label}
                                    size="small"
                                    variant={
                                        (backupTemplate?.schedule_frequency === obj.value) ||
                                            (obj.value === 'None' && !backupTemplate?.schedule_frequency)
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    onClick={async () => {
                                        try {
                                            const res = await fetch(`/api/templates/edit`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    fileName: `${backupTemplate?.name}.json`,
                                                    locations: backupTemplate?.locations || [],
                                                    schedule_frequency: obj.value === 'None' ? false : obj.value
                                                })
                                            });
                                            const data = await res.json();
                                            if (res.ok) {
                                                setBackupTemplate({ ...backupTemplate, schedule_frequency: obj.value === 'None' ? false : obj.value });
                                                mutateTemplates();
                                            } else {
                                                alert('Error: ' + data.error);
                                            }
                                        } catch (err) {
                                            alert('Unexpected error: ' + err.message);
                                        }
                                    }}
                                >
                                    {obj.label}
                                </Button>
                            )
                        })}
                    </Box>

                    {/* Time Picker for backup time */}
                    <Typography sx={{ mb: 1 }}>
                        Backup Time:
                    </Typography>
                    <div>
                        <TimePicker
                            label="Backup Time"
                            value={backupTemplate?.schedule_time ? parse(backupTemplate.schedule_time, 'HH:mm', new Date()) : null}
                            onChange={async (newValue) => {
                                if (!newValue || !isValid(newValue)) return;
                                const newTime = format(newValue, 'HH:mm');
                                try {
                                    const res = await fetch(`/api/templates/edit`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            fileName: `${backupTemplate?.name}.json`,
                                            schedule_time: newTime
                                        })
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        setBackupTemplate({ ...backupTemplate, schedule_time: newTime });
                                        mutateTemplates();
                                    } else {
                                        alert('Error: ' + data.error);
                                    }
                                } catch (err) {
                                    alert('Unexpected error: ' + err.message);
                                }
                            }}
                            // ampm={false}
                            sx={{ mb: 0, width: 180 }}
                        />
                    </div>
                    <Typography sx={{ mb: 2, display: 'block' }} variant="caption" color="textSecondary">
                        Defaults to 12:00 AM if not set.
                    </Typography>
                    
                    {/* Fallback text field for time (optional, can be removed) */}
                    {/* <TextField
                        type="time"
                        size="small"
                        value={backupTemplate?.schedule_time || ""}
                        onChange={async (e) => {
                            const newTime = e.target.value;
                            try {
                                const res = await fetch(`/api/templates/edit`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        fileName: `${backupTemplate?.name}.json`,
                                        schedule_time: newTime
                                    })
                                });
                                const data = await res.json();
                                if (res.ok) {
                                    setBackupTemplate({ ...backupTemplate, schedule_time: newTime });
                                    mutateTemplates();
                                } else {
                                    alert('Error: ' + data.error);
                                }
                            } catch (err) {
                                alert('Unexpected error: ' + err.message);
                            }
                        }}
                        sx={{ mb: 2, width: 150 }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 300 }}
                    /> */}

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