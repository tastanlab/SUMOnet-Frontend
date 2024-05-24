'use client'
import React, { useState } from 'react';
import { Button, Container, Flex ,Loader,Space,Textarea, Title,Alert, Text} from '@mantine/core';
import { createTheme, rem } from '@mantine/core';
import axios from 'axios';
import TableSort from '../table/TableSort';

const theme = createTheme({
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto Mono, monospace',
    sizes: {
      h1: { fontSize: rem(25) },
    },
  },
});
function ProtSeq() {
  const [proteinSequence, setProteinSequence] = useState<string>('');
  const [predictionsData, setPredictionsData] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // [1 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState(''); // State to store the error message
  const [showError, setShowError] = useState(false); 
  const [warningMsg, setWarningMsg] = useState(''); // State to store the error message
  const [showWarning, setShowWarning] = useState(false);

  const handleLoadSample = () => {
    setProteinSequence(">sp|O00566|MPP10_HUMAN U3 small nucleolar ribonucleoprotein protein MPP10 OS=Homo sapiens OX=9606 GN=MPHOSPH10 PE=1 SV=2\r\nMAPQVWRRRTLERCLTEVGKATGRPECFLTIQEGLASKFTSLTKVLYDFNKILENGRIHG\r\nSPLQKLVIENFDDEQIWQQLELQNEPILQYFQNAVSETINDEDISLLPESEEQEREEDGS\r\nEIEADDKEDLEDLEEEEVSDMGNDDPEMGERAENSSKSDLRKSPVFSDEDSDLDFDISKL\r\nEQQSKVQNKGQGKPREKSIVDDKFFKLSEMEAYLENIEKEEERKDDNDEEEEDIDFFEDI\r\nDSDEDEGGLFGSKKLKSGKSSRNLKYKDFFDPVESDEDITNVHDDELDSNKEDDEIAEEE\r\nAEELSISETDEDDDLQENEDNKQHKESLKRVTFALPDDAETEDTGVLNVKKNSDEVKSSF\r\nEKRQEKMNEKIASLEKELLEKKPWQLQGEVTAQKRPENSLLEETLHFDHAVRMAPVITEE\r\nTTLQLEDIIKQRIRDQAWDDVVRKEKPKEDAYEYKKRLTLDHEKSKLSLAEIYEQEYIKL\r\nNQQKTAEEENPEHVEIQKMMDSLFLKLDALSNFHFIPKPPVPEIKVVSNLPAITMEEVAP\r\nVSVSDAALLAPEEIKEKNKAGDIKTAAEKTATDKKRERRKKKYQKRMKIKEKEKRRKLLE\r\nKSSVDQAGKYSKTVASEKLKQLTKTGKASFIKDEGKDKALKSSQAFFSKLQDQVKMQIND\r\nAKKTEKKKKKRQDISVHKLKL\r\n\r\n>sp|Q9UER7|DAXX_HUMAN Death domain-associated protein 6 OS=Homo sapiens OX=9606 GN=DAXX PE=1 SV=2\r\nMATANSIIVLDDDDEDEAAAQPGPSHPLPNAASPGAEAPSSSEPHGARGSSSSGGKKCYK\r\nLENEKLFEEFLELCKMQTADHPEVVPFLYNRQQRAHSLFLASAEFCNILSRVLSRARSRP\r\nAKLYVYINELCTVLKAHSAKKKLNLAPAATTSNEPSGNNPPTHLSLDPTNAENTASQSPR\r\nTRGSRRQIQRLEQLLALYVAEIRRLQEKELDLSELDDPDSAYLQEARLKRKLIRLFGRLC\r\nELKDCSSLTGRVIEQRIPYRGTRYPEVNRRIERLINKPGPDTFPDYGDVLRAVEKAAARH\r\nSLGLPRQQLQLMAQDAFRDVGIRLQERRHLDLIYNFGCHLTDDYRPGVDPALSDPVLARR\r\nLRENRSLAMSRLDEVISKYAMLQDKSEEGERKKRRARLQGTSSHSADTPEASLDSGEGPS\r\nGMASQGCPSASRAETDDEDDEESDEEEEEEEEEEEEEATDSEEEEDLEQMQEGQEDDEEE\r\nDEEEEAAAGKDGDKSPMSSLQISNEKNLEPGKQISRSSGEQQNKGRIVSPSLLSEEPLAP\r\nSSIDAESNGEQPEELTLEEESPVSQLFELEIEALPLDTPSSVETDISSSRKQSEEPFTTV\r\nLENGAGMVSSTSFNGGVSPHNWGDSGPPCKKSRKEKKQTGSGPLGNSYVERQRSVHEKNG\r\nKKICTLPSPPSPLASLAPVADSSTRVDSPSHGLVTSSLCIPSPARLSQTPHSQPPRPGTC\r\nKTSVATQCDPEEIIVLSDSD\r\n\r\n\r\n");
  };

  const handleSubmit = async (event) => {
    setPredictionsData(null);
    setShowError(false);
    event.preventDefault();
    setIsLoading(true);
    setIsSubmitted(true); // Set handleSubmit to true when the form is submitted
    setShowWarning(false);
    console.log("Sending data:", { protein_seq: proteinSequence });
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/protein-sequence-prediction/",
        {
          protein_seq: proteinSequence,
        }
      );
  
      const predictions = response.data.data;
      setPredictionsData(predictions);
      console.log(response.data);

      if (response.data.errors.length > 0){
        const errorMessages = response.data.errors.map((error) => error.error).join(", ");
        const ids = response.data.errors.map((error) => error.ids).join(", ");
        setWarningMsg(`Errors: ${errorMessages}. IDs: ${ids}`);
        setShowWarning(true);
      }

    } catch (error) {
      console.error("Error submitting protein sequence:", error);
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
    <Container size="lg">
      <form>
        <Flex direction="column" gap="md">
          <Title order={1} size="h1" style={{ marginBottom: '20px' }}>Predict with Protein Sequence</Title>
          <Flex align="center" style={{ width: '100%' }}>  
            <Textarea
              size='md'
              variant='filled'
              label="Protein Sequence"
              radius="sm"
              description="You may enter multiple or a single sequence in fasta format. SUMOnet will scan for all Lysine positions."
              placeholder=">sp|O00566|MPP10_HUMAN U3 small nucleolar ribonucleoprotein protein MPP10 OS=Homo sapiens OX=9606 GN=MPHOSPH10 PE=1 SV=2\r\nMAPQVWRR..."
              withAsterisk
              autosize
              value={proteinSequence}
              onChange={(event) => setProteinSequence(event.currentTarget.value)}
              style={{
                flexGrow: 1,  // Allow textarea to grow filling the space
                
              }}
            />
            <div style={{ textAlign: 'right',paddingTop:'42px' }}>
            <Text component="a" style={{ 
                cursor: 'pointer', 
                color: 'blue', 
                marginLeft: '20px',  // Spacing between the textarea and the text
              }} onClick={handleLoadSample}>
              Load Sample
            </Text>
            </div>
          </Flex>
          <Button type="submit" size="lg" style={{ width: '25%' }} radius="md" variant="gradient" color='blue'  onClick={handleSubmit}>
            {isLoading ? <Loader color="white" size={24} /> : 'Submit'}
          </Button>
        </Flex>
      </form>
      <Space h="xl" />
      <Space h="xl" />

      {showWarning && (
      <Alert color="yellow" withCloseButton onClose={() => setShowWarning(false)} title="Warning!">
        {warningMsg}
      </Alert>)}
      <Space h="xl" />
      {/* Display predictions data if available */}
      {!isLoading && isSubmitted && predictionsData && !showError && <TableSort predictions={predictionsData}/>}
  
      {/* Error Alert */}
      {showError && (
        <Alert color="red" withCloseButton onClose={() => setShowError(false)} title="Error!">
          {errorMsg}
        </Alert>
      )}
    </Container>
  );
  
}

export default ProtSeq;