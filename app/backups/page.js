"use client"

import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { useBackupTemplates } from '@/components/hooks/useBackupTemplates';

import FindInPageIcon from '@mui/icons-material/FindInPage';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useBackups } from "@/components/hooks/useBackups";
import BackupsList from "./BackupsList";
import { filesize } from "filesize";
import { useSiteStore } from "@/components/stores/useSiteStore";
import { useInstallLocation } from "@/components/hooks/useInstallLocation";

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

  const [downloadLocation, setDownloadLocation] = useState(null);

  // const [backups, setBackups] = useState([]);
  // const [backupsLoading, setBackupsLoading] = useState(false);

  const storageLocations = useSiteStore((state) => state.storageLocations);

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

  const {
    data: installLocation,
    // isLoading: backupsIsLoading,
    // mutate: mutateBackups,
  } = useInstallLocation();

  return (
    <div className="page no-padding">

      {/* <Typography sx={{ mb: 5 }}>
        Backups
      </Typography> */}

      <Stack direction="row" spacing={0}>

        <Box
          sx={{
            width: '50%',
            p: 1
          }}
        >

          <Typography sx={{ mb: 1 }}>
            Backup Templates:
          </Typography>

          <Box sx={{ mb: 2 }}>
            {templates?.map(template_obj => {
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

          <Typography sx={{ mb: 1 }}>
            Download Location:
          </Typography>

          <Box sx={{ mb: 2 }}>

            <Button
              variant={downloadLocation == installLocation ? 'contained' : 'outlined'}
              color="primary"
              onClick={async () => {
                setDownloadLocation(installLocation)
              }}
            >
              {installLocation}
            </Button>

            {storageLocations?.map(template_obj => {
              return (
                <Button
                  key={template_obj}
                  variant={template_obj == downloadLocation ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={async () => {
                    setDownloadLocation(template_obj)
                  }}
                >
                  {template_obj}
                </Button>
              )
            })}

          </Box>

          <Typography sx={{ mb: 1 }}>
            Compression Options
          </Typography>

          <Box sx={{ mb: 2 }}>

            <Button
              variant={'outlined'}
              color="primary"
              onClick={async () => {

              }}
            >
              None
            </Button>
            <Button
              variant={'outlined'}
              color="primary"
              onClick={async () => {

              }}
            >
              ZIP
            </Button>
            {/* <Button
              variant={'outlined'}
              color="primary"
              onClick={async () => {
                
              }}
            >
              GZ
            </Button> */}

          </Box>

          <Typography sx={{ mb: 0 }}>
            Encryption Options
          </Typography>

          <Typography sx={{ mb: 1, fontSize: '0.8rem' }}>
            Setup encryption options in the settings
          </Typography>

          <Box sx={{ mb: 2 }}>

            <Button
              variant={'outlined'}
              color="primary"
              onClick={async () => {

              }}
            >
              None
            </Button>

            <Button
              variant={'outlined'}
              color="primary"
              onClick={async () => {

              }}
            >
              VeraCrypt
            </Button>

          </Box>

          <Typography sx={{ mb: 0 }}>
            Cloud Upload
          </Typography>

           <Typography sx={{ mb: 1, fontSize: '0.8rem' }}>
            Upload the finished backup to a cloud provider?
          </Typography>

          <Box sx={{ mb: 2 }}>

            <Button
              variant={'outlined'}
              color="primary"
              onClick={async () => {

              }}
            >
              None
            </Button>

            <Button
              variant={'outlined'}
              color="primary"
              onClick={async () => {

              }}
            >
              S3
            </Button>

          </Box>

          <Box
            sx={{
              mb: 2,
              mt: 4
            }}
          >
            <Button
              variant="contained"
              color="primary"
              disabled={!backupTemplate || !downloadLocation}
              onClick={async () => {
                try {
                  const res = await fetch('/api/backups/create', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      backupTemplate,
                      downloadLocation
                    }),
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

        </Box>

        <Box
          sx={{
            width: '50%',
            borderLeft: '1px solid white',
            paddingLeft: '1rem',
            height: 'calc(100vh - 50px)',
            overflow: 'auto'
          }}
        >

          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >

            <Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
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
                size="small"
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
            </Box>

            <Box>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={async () => {
                  mutateBackups()
                }}
              >
                <RefreshIcon />
                {/* <span>Refresh</span> */}
                <span>Backups</span>
              </Button>

              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={async () => {
                  mutateTemplates()
                }}
              >
                <RefreshIcon />
                {/* <span>Refresh</span> */}
                <span>Templates</span>
              </Button>
            </Box>

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
