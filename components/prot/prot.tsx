'use client'
import { TableSort } from '../table/TableSort';

import React, { useState } from 'react';
import { Button, Container, Title, Text, Flex, Loader,Modal ,TextInput, Table, Space, Group, Alert, Slider} from '@mantine/core';
import axios from 'axios';

// Function to generate CSV content from table data
function generateCSV(predictionsData) {
  // Header row
  let csvContent = 'UniProt ID, Lysine Position, Prediction\n';
  
  // Data rows
  predictionsData.forEach(prediction => {
    csvContent += `${prediction.uniprot_id}, ${prediction.lysine_position}, ${prediction.prediction}\n`;
  });

  return csvContent;
}

function Prot() {
  const [uniProtID, setUniProtID] = useState<string>('');
  const [lysine, setLysine] = useState<string>("");
  const [thresholdValue, setThresholdValue] = useState<number>(0.5);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [predictionsData, setPredictionsData] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState(''); // State to store the error message
  const [showError, setShowError] = useState(false);
  const [warningMsg, setWarningMsg] = useState(''); // State to store the error message
  const [showWarning, setShowWarning] = useState(false);
  
  
  const handleLoadSampleUniprot = () => {
    setUniProtID('O00566');
  };

  const handleLoadSampleLysine = () => {
    setLysine("20");
  };

   // Function to handle downloading the table data as CSV
   const handleDownloadCSV = () => {
    // Generate CSV content
    const csvContent = generateCSV(predictionsData);
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    // Create a temporary anchor element
    const a = document.createElement('a');
    // Set the URL as the anchor's href
    a.href = url;
    // Set the filename for the download
    a.download = 'predictions.csv';
    // Simulate a click on the anchor to trigger the download
    a.click();
    // Cleanup
    URL.revokeObjectURL(url);
  };
  const marks = [
    { value: 0, label: '0' },
    { value: 0.5, label: '0.5' },
    { value: 1, label: '1' }
  ];

  const handleSubmit = async (event) => {
    setPredictionsData(null);
    setShowError(false);
    setShowWarning(false);
    event.preventDefault();
    
    setIsLoading(true);
    setIsSubmitted(true); // Set handleSubmit to true when the form is submitted
    console.log(lysine);

    try {
      let response ={};
      if(lysine ===""){
         response = await axios.post(
          "http://127.0.0.1:8000/uniprot-prediction/",
          {
            uniprot_id: uniProtID,
            threshold: thresholdValue
          }
          
        );
      }
      else{
         response = await axios.post(
          "http://127.0.0.1:8000/uniprot-prediction/",
          {
            uniprot_id: uniProtID,
            lysine_position: parseInt(lysine, 10),
            threshold: thresholdValue
            
          }
          
        );
      }


      const predictions = response.data.data;
      setPredictionsData(predictions);
      const Invalid_Ids = response.data.invalid_idS;
      //console.log(threshold);
      //console.log(Invalid_Ids);
      //console.log(predictions);
      if(Invalid_Ids.length != 0)
        {
          const message = "You entered invalid Uniprot ID(s). Invalid Uniprot ID(s): " + Invalid_Ids;
          setWarningMsg(message); 
          setShowWarning(true);
        }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.error); // Extract the error message from the response
        setShowError(true); // Show the error modal
      } else {
        console.error("Error uploading file:", error);
      }
    }
    finally{
   
      setIsLoading(false); // Set loading state back to false when finished
    }
    
  };
  return (
    <Container>
    <Flex justify="space-between">
      {/* Left Half: Form Elements */}
      <Flex direction={'column'} style={{ width: '50%', paddingRight: '40px' }}>
        <form onSubmit={handleSubmit}>
          <Title order={1} size="h1" style={{ marginBottom: '20px' }}>
            Predict with UniprotID
          </Title>

          <Flex justify="space-between" align="center" style={{ marginBottom: '20px' }}>
            <TextInput
              variant="filled"
              size="md"
              radius="lg"
              withAsterisk
              label="Uniprot ID"
              description="Please enter UniProtID."
              placeholder="O00566"
              value={uniProtID}
              onChange={(event) => setUniProtID(event.currentTarget.value)}
              style={{ width: '75%' }}
            />
            <div style={{ textAlign: 'right', paddingTop:'42px' }}>
              <Text component="a" style={{ cursor: 'pointer', color: 'blue'}} onClick={handleLoadSampleUniprot}>
                Load Sample
              </Text>
            </div>
          </Flex>
          

      

          <Flex justify="space-between" align="center" style={{ marginBottom: '20px' }}>
            <TextInput
              variant="filled"
              size="md"
              radius="lg"
              label="Lysine Position"
              description="Please enter the Lysine Position."
              placeholder="20"
              value={lysine}
              onChange={(event) => setLysine(event.currentTarget.value)}
              style={{ width: '75%' }}
            />
            <div style={{ textAlign: 'right',paddingTop:'42px' }}>
              <Text component="a" style={{ cursor: 'pointer', color: 'blue'}} onClick={handleLoadSampleLysine}>
                Load Sample
              </Text>
            </div>
          </Flex>
              <Text fw={500}> Threshold Value</Text>
              <Text c="dimmed" size="sm" >Please choose the threshold value. </Text>
              <Space h="xs" />
              <Slider 
                defaultValue={0.5} 
                marks={marks} 
                max={1} 
                step={0.1} 
                size={"md"}
                style={{ width: '75%' }}
                value={thresholdValue} onChange={setThresholdValue}
                 />
              <Space h="sm" />
        


         
          <Flex direction={'row'} justify="left" style={{ marginTop: '30px' }}>
            <Button type="submit" size="lg" style={{ width: '50%' }} radius="md" variant="gradient" color='blue'>
              {isLoading ? <Loader color="white" size={24} /> : 'Submit'}
            </Button>
          </Flex>
        </form>
      </Flex>

      {/* Right Half: Text or Additional Content */}
      <Flex direction={'column'} justify="center" style={{ width: '50%', paddingLeft: '40px' }}>
        <p style={{ marginBottom: '20px' }}>You can enter Uniprot ID and Lysine position to get results. 
        You have to enter at least one valid Uniprot ID to get result. 
        If you want to see the result for the specific Lysine position, you have to enter valid Lysine position for given Uniprot ID. 
        Besides, you can arrange threshold value from slider. Results with a Sumoylation probability equal to or greater than the selected threshold will be listed. </p>
      </Flex>
    </Flex>
    <Space h="xl" />
    <Space h="xl" />

    {/* Error Alert */}
    {showError && (
      <Alert color="red" withCloseButton onClose={() => setShowError(false)} title="Error!">
        {errorMsg}
      </Alert>
      
    )}
      <Space h="xl" />
      {showWarning && (
      <Alert color="yellow" withCloseButton onClose={() => setShowWarning(false)} title="Warning!">
        {warningMsg}
      </Alert>
      
    )}
    <Space h="xl" />
    {/* Display predictions data if available */}
    <Container>
      {!isLoading && isSubmitted ? <TableSort predictions={predictionsData}/> : null}
    </Container>
  </Container>
);

};


export default Prot;
