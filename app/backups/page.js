"use client"

import { Box, Button, Card, CircularProgress, Stack, TextField, Tooltip, Typography, Modal } from "@mui/material";
import { useEffect, useState, useMemo } from "react";

import { useBackupTemplates } from '@/components/hooks/useBackupTemplates';

import FindInPageIcon from '@mui/icons-material/FindInPage';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useBackups } from "@/components/hooks/useBackups";
import BackupsList from "./BackupsList";
import { filesize } from "filesize";
import { useSiteStore } from "@/components/stores/useSiteStore";
import { useInstallLocation } from "@/components/hooks/useInstallLocation";

import "@/styles/pages/backups.scss";
import { Add, Delete, Settings } from "@mui/icons-material";
import BackupTemplateListItem from "./BackupTemplateListItem";
import NewBackupTemplate from "./NewBackupTemplateListItem";

export default function Page() {

  // const [backupTemplates, setBackupTemplates] = useState([
  //   {
  //     name: "My Documents"
  //   },
  //   {
  //     name: "Articles"
  //   }
  // ]);

  const [backupTemplate, setBackupTemplate] = useState(null);
  const [editBackupTemplate, setEditBackupTemplate] = useState(null);

  const [newBackupTemplate, setNewBackupTemplate] = useState('');

  const [downloadLocation, setDownloadLocation] = useState(null);

  // const [backups, setBackups] = useState([]);
  // const [backupsLoading, setBackupsLoading] = useState(false);

  const storageLocations = useSiteStore((state) => state.storageLocations);

  const [compressionOptions, setCompressionOptions] = useState({
    type: false
  });

  const [encryptionOptions, setEncryptionOptions] = useState({
    type: false
  });

  const [cloudOptions, setCloudOptions] = useState({
    type: false
  });

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

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filtered backups based on searchValue and favorite toggle
  const filteredBackups = useMemo(() => {
    let result = backups;
    if (searchValue) {
      const lower = searchValue.toLowerCase();
      result = result?.filter(b =>
        (b.name && b.name.toLowerCase().includes(lower)) ||
        (b.directPath && b.directPath.toLowerCase().includes(lower))
      );
    }
    if (showFavoritesOnly) {
      result = result?.filter(b => b.favorite);
    }
    return result;
  }, [backups, searchValue, showFavoritesOnly]);

  return (
    <div className="page no-padding backups-page">

      {/* <Typography sx={{ mb: 5 }}>
        Backups
      </Typography> */}

      <Stack direction="row" spacing={0}>

        <Box
          sx={{
            width: '50%',
            p: 1,
            height: 'calc(100vh - 50px)',
            overflow: 'auto',
          }}
        >

          <Typography sx={{ mb: 1 }}>
            Backup Templates:
          </Typography>

          <Box sx={{ mb: 2 }}>

            <Button
              // key={template_obj.name}
              sx={{
                mr: 2
              }}
              variant={newBackupTemplate !== false ? 'contained' : 'outlined'}
              color="primary"
              onClick={async () => {
                newBackupTemplate !== false ?
                  setNewBackupTemplate(false)
                  :
                  setNewBackupTemplate('')
              }}
            >
              <Add />
            </Button>

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

          {newBackupTemplate !== false &&
            <NewBackupTemplate
              setNewBackupTemplate={setNewBackupTemplate}
            />

          }

          {backupTemplate &&
            <BackupTemplateListItem
              backupTemplate={backupTemplate}
              setBackupTemplate={setBackupTemplate}
            />
          }

          {/* Backup Schedule Frequency Selection */}
          {backupTemplate && (
            <>
              <Typography sx={{ mb: 1 }}>
                Backup Schedule:
              </Typography>
              <Box sx={{ mb: 2 }}>
                {['Daily', 'Weekly', 'Monthly', 'Custom'].map(option => (
                  <Button
                    key={option}
                    variant={backupTemplate.schedule_frequency === option ? 'contained' : 'outlined'}
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/templates/edit', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            fileName: backupTemplate.name + '.json',
                            locations: backupTemplate.locations || [],
                            schedule_frequency: option
                          })
                        });
                        if (res.ok) {
                          // Update local state to reflect new schedule_frequency
                          setBackupTemplate({ ...backupTemplate, schedule_frequency: option });
                        } else {
                          const data = await res.json();
                          alert('Error: ' + data.error);
                        }
                      } catch (err) {
                        alert('Unexpected error: ' + err.message);
                      }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </Box>
            </>
          )}

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
              variant={!compressionOptions?.type ? 'contained' : 'outlined'}
              color="primary"
              onClick={async () => {
                setCompressionOptions({
                  ...compressionOptions,
                  type: false
                })
              }}
            >
              None
            </Button>
            <Button
              variant={compressionOptions?.type == "ZIP" ? 'contained' : 'outlined'}
              color="primary"
              onClick={async () => {
                setCompressionOptions({
                  ...compressionOptions,
                  type: "ZIP"
                })
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
              Crypto.js
            </Button>

            <Button
              variant={'outlined'}
              color="primary"
              disabled
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
            borderLeft: '1px solid gray',
            // paddingLeft: '1rem',
            height: 'calc(100vh - 50px)',
            overflow: 'auto',
            position: 'relative'
          }}
        >

          <Box
            sx={{
              // mb: 5,
              display: 'flex',
              justifyContent: 'space-between'
            }}
            className="floating-backups-toolbar"
          >

            <Box

            >

              <Tooltip title="Open Backups">
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
                  {/* Backups */}
                </Button>
              </Tooltip>

              <Tooltip title="Open Templates">
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
                  {/* Templates */}
                </Button>
              </Tooltip>

            </Box>

            <Box>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => setSearchModalOpen(true)}
              >
                Search & Filters
              </Button>
            </Box>

            <Box>

              <Tooltip title="Refresh Backups">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={async () => {
                    mutateBackups()
                  }}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>

              <Tooltip title="Refresh Templates">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={async () => {
                    mutateTemplates()
                  }}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
            </Box>

          </Box>

          <Modal
            open={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            aria-labelledby="search-modal-title"
            aria-describedby="search-modal-desc"
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              minWidth: 300
            }}>
              <Typography id="search-modal-title" variant="h6" sx={{ mb: 2 }}>
                Search Backups
              </Typography>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Button
                  variant={showFavoritesOnly ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setShowFavoritesOnly(v => !v)}
                  sx={{ minWidth: 120, width: '100%' }}
                >
                  {showFavoritesOnly ? 'Showing Favorites' : 'Show Favorites Only'}
                </Button>
              </Box>
              <TextField
                fullWidth
                label="Search"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
              />
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button onClick={() => setSearchModalOpen(false)} variant="contained">Close</Button>
              </Box>
            </Box>
          </Modal>

          {backupsIsLoading &&
            <Box mt={8} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
              <CircularProgress sx={{ mr: 2 }} />
              <div>Loading</div>
            </Box>
          }

          {!backupsIsLoading && <>
            {filteredBackups?.length > 0 ?
              <Box
                sx={{
                  mb: 1,
                  mt: 6
                }}
              >

                {/* <Box sx={{ mb: 2 }}>
                  {backups?.length} Backups - {filesize(backups?.reduce((acc, b) => acc + b.size, 0))} total!
                </Box> */}

                <BackupsList backups={filteredBackups} />

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
          </>}

        </Box>

      </Stack>

    </div>
  );
}