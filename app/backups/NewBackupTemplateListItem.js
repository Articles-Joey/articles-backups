import { useBackupTemplates } from "@/components/hooks/useBackupTemplates";
import { Box, Button, Card, TextField } from "@mui/material";
import { useState } from "react";

export default function NewBackupTemplate({
  setNewBackupTemplate
}) {

  const [newBackupTemplateLocal, setNewBackupTemplateLocal] = useState('');

  const {
    // templates,
    // isLoading: templatesIsLoading,
    // isError,
    mutate: mutateTemplates
  } = useBackupTemplates();

  return (
    <div>
      <Box sx={{
        mb: 3
      }}>

        <Card sx={{ mt: 1, p: 1, display: 'flex' }}>

          <TextField
            value={newBackupTemplateLocal}
            size="small"
            onChange={(e) => setNewBackupTemplateLocal(e.target.value)}
          />

          <Button
            size="small"
            variant="outlined"
            onClick={async () => {
              try {
                const res = await fetch(`/api/templates/create`, {
                  method: 'POST',
                  body: JSON.stringify({
                    name: newBackupTemplateLocal
                  })
                });

                const data = await res.json();

                if (res.ok) {
                  console.log('Success:', data);
                  setNewBackupTemplateLocal('')
                  mutateTemplates()
                  setNewBackupTemplate(false)
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
    </div>
  )
}