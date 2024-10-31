// WelcomePage.tsx

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFileContext } from './FileContext';

const WelcomePage: React.FC = () => {
  const [bpmnFile, setBpmnFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { setBpmnFileContent, setCsvFileContent } = useFileContext();

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setFileContent: (content: string | null) => void,
    fileType: 'bpmn' | 'csv'
  ) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      setFile(file);

      // Read the file as text and set it in context
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleNavigateToViewBPMN = () => {
    navigate('/view-bpmn');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Conformance Analysis App
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please upload your BPMN and CSV files to get started.
      </Typography>

      <Paper sx={{ padding: 2, marginBottom: 3, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload BPMN File
        </Typography>
        <TextField
          type="file"
          inputProps={{ accept: '.bpmn' }}
          onChange={(event) => handleFileChange(event, setBpmnFile, setBpmnFileContent, 'bpmn')}
          fullWidth
          variant="outlined"
          helperText={bpmnFile ? `Selected: ${bpmnFile.name}` : "Please upload a .bpmn file"}
        />
      </Paper>

      <Paper sx={{ padding: 2, marginBottom: 4, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload CSV File
        </Typography>
        <TextField
          type="file"
          inputProps={{ accept: '.csv' }}
          onChange={(event) => handleFileChange(event, setCsvFile, setCsvFileContent, 'csv')}
          fullWidth
          variant="outlined"
          helperText={csvFile ? `Selected: ${csvFile.name}` : "Please upload a .csv file"}
        />
      </Paper>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleNavigateToViewBPMN} 
        disabled={!bpmnFile}
        sx={{
          padding: '10px 20px',
          fontSize: '1rem',
          fontWeight: 'bold',
          width: '100%',
          maxWidth: 300,
          backgroundColor: !bpmnFile ? 'grey.400' : 'primary.main',
          '&:hover': {
            backgroundColor: !bpmnFile ? 'grey.400' : 'primary.dark',
          },
        }}
      >
        View BPMN
      </Button>
    </Box>
  );
};

export default WelcomePage;





