"use client"

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useBackupTemplates } from '@/components/hooks/useBackupTemplates';

import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useBackups } from "@/components/hooks/useBackups";
import BackupsList from "./BackupsList";
import { filesize } from "filesize";

export default function Page() {

  const [backupTemplates, setBackupTemplates] = useState([
    {
      name: "My Documents"
    },
    {
      name: "Articles"
    }
  ]);
  const [backupTemplate, setBackupTemplate] = useState(null);

  // const [backups, setBackups] = useState([]);
  // const [backupsLoading, setBackupsLoading] = useState(false);

  const {
    templates,
    isLoading: templatesIsLoading,
    // isError,
    mutate: mutateTemplates
  } = useBackupTemplates();

  const {
    data: backups,
    isLoading: backupsIsLoading,
    // isError,
    mutate: mutateBackups
  } = useBackups();

  return (
    <div className="page">

      {/* <Typography sx={{ mb: 5 }}>
        Backups
      </Typography> */}

      <Stack direction="row" spacing={2}>

        <Box
          sx={{ width: '50%' }}
        >

          <Typography sx={{ mb: 1 }}>
            Backup Templates:
          </Typography>

          <Box sx={{ mb: 2 }}>
            {templates.map(template_obj => {
              return (
                <Button
                  key={template_obj.name}
                  variant={template_obj.name == backupTemplate?.name ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={async () => {
                    setBackupTemplate(template_obj)
                  }}
                >
                  {template_obj.name}
                </Button>
              )
            })}
          </Box>

          <Box
            sx={{
              mb: 2
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!backupTemplate}
              onClick={async () => {
                try {
                  const res = await fetch('/api/backups/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ backupTemplate }),
                  });

                  const data = await res.json();

                  if (res.ok) {
                    console.log('Success:', data);
                    mutateBackups()
                    // alert(`Backup folder created: ${data.folder}`);
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
              Create Backup
            </Button>

          </Box>

          <div>

            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                try {
                  const res = await fetch('/api/open-backups', {
                    method: 'GET',
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
              <FindInPageIcon />
              Open Backups
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                try {
                  const res = await fetch('/api/open-backup-templates', {
                    method: 'GET',
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
              <FindInPageIcon />
              Open Templates
            </Button>

          </div>

        </Box>

        <Box
          sx={{
            width: '50%',
            borderLeft: '1px solid white',
            paddingLeft: '1rem'
          }}
        >

          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={async () => {
                mutateBackups()
              }}
            >
              Refresh Backups
            </Button>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={async () => {
                mutateTemplates()
              }}
            >
              Refresh Templates
            </Button>
          </Box>

          {backupsIsLoading &&
            <div>
              <CircularProgress />
              <div>Loading</div>
            </div>
          }

          {backups?.length > 0 ?
            <Box
              sx={{
                mb: 1
              }}
            >

              <Box sx={{ mb: 2 }}>
                {backups?.length} Backups - {filesize(backups?.reduce((acc, b) => acc + b.size, 0))} total!
              </Box>

              <BackupsList />

            </Box>
            :
            <Box
              sx={{
                mb: 1
              }}
            >
              No Backups!
            </Box>
          }

        </Box>

      </Stack>

    </div>
  );
}
