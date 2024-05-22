'use client';
import { useState } from 'react';
import { Button, Container,Alert, FileInput, Flex, Loader, Space, Title, Modal, Text } from '@mantine/core';
import { IconFile } from '@tabler/icons-react';
import TableSort from '../table/TableSort';
import axios from 'axios';

function FastaFile() {
  const icon = <IconFile style={{ width: 25, height: 25 }} />;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [predictionsData, setPredictionsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadSample, setIsLoadSample] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // State to store the error message
  const [showError, setShowError] = useState(false); // State to control error pop-up
  const [warningMsg, setWarningMsg] = useState(''); // State to store the error message
  const [showWarning, setShowWarning] = useState(false);

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleFileChange = (file) => {
    setFile(file);
    setPredictionsData([])
    setPredictionsData(null);
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
    setShowWarning(false);
    setShowError(false);
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("http://127.0.0.1:8000/fasta-file-prediction/", formData);
        setPredictionsData(response.data.data);
        setIsSubmitted(true); // Set submitted to true only on successful data fetch
        console.log(response.data);
        setShowWarning(false);
        if (response.data.errors.length > 0){
          const errorMessages = response.data.errors.map((error) => error.error).join(", ");
          const ids = response.data.errors.map((error) => error.ids).join(", ");
          setWarningMsg(`Errors: ${errorMessages}. IDs: ${ids}`);
          setShowWarning(true);
        }
      
      } catch (error: any) {
        setErrorMsg(error.response?.data.error || "An unexpected error occurred");
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    }
    else {
      setErrorMsg("Please upload a file before submitting.");
      setShowError(true);
    }
  };

  const handleLoadSample = () => {
    const content = ">sp|O00566|MPP10_HUMAN U3 small nucleolar ribonucleoprotein protein MPP10 OS=Homo sapiens OX=9606 GN=MPHOSPH10 PE=1 SV=2\r\nMAPQVWRRRTLERCLTEVGKATGRPECFLTIQEGLASKFTSLTKVLYDFNKILENGRIHG\r\nSPLQKLVIENFDDEQIWQQLELQNEPILQYFQNAVSETINDEDISLLPESEEQEREEDGS\r\nEIEADDKEDLEDLEEEEVSDMGNDDPEMGERAENSSKSDLRKSPVFSDEDSDLDFDISKL\r\nEQQSKVQNKGQGKPREKSIVDDKFFKLSEMEAYLENIEKEEERKDDNDEEEEDIDFFEDI\r\nDSDEDEGGLFGSKKLKSGKSSRNLKYKDFFDPVESDEDITNVHDDELDSNKEDDEIAEEE\r\nAEELSISETDEDDDLQENEDNKQHKESLKRVTFALPDDAETEDTGVLNVKKNSDEVKSSF\r\nEKRQEKMNEKIASLEKELLEKKPWQLQGEVTAQKRPENSLLEETLHFDHAVRMAPVITEE\r\nTTLQLEDIIKQRIRDQAWDDVVRKEKPKEDAYEYKKRLTLDHEKSKLSLAEIYEQEYIKL\r\nNQQKTAEEENPEHVEIQKMMDSLFLKLDALSNFHFIPKPPVPEIKVVSNLPAITMEEVAP\r\nVSVSDAALLAPEEIKEKNKAGDIKTAAEKTATDKKRERRKKKYQKRMKIKEKEKRRKLLE\r\nKSSVDQAGKYSKTVASEKLKQLTKTGKASFIKDEGKDKALKSSQAFFSKLQDQVKMQIND\r\nAKKTEKKKKKRQDISVHKLKL\r\n\r\n>sp|Q9UER7|DAXX_HUMAN Death domain-associated protein 6 OS=Homo sapiens OX=9606 GN=DAXX PE=1 SV=2\r\nMATANSIIVLDDDDEDEAAAQPGPSHPLPNAASPGAEAPSSSEPHGARGSSSSGGKKCYK\r\nLENEKLFEEFLELCKMQTADHPEVVPFLYNRQQRAHSLFLASAEFCNILSRVLSRARSRP\r\nAKLYVYINELCTVLKAHSAKKKLNLAPAATTSNEPSGNNPPTHLSLDPTNAENTASQSPR\r\nTRGSRRQIQRLEQLLALYVAEIRRLQEKELDLSELDDPDSAYLQEARLKRKLIRLFGRLC\r\nELKDCSSLTGRVIEQRIPYRGTRYPEVNRRIERLINKPGPDTFPDYGDVLRAVEKAAARH\r\nSLGLPRQQLQLMAQDAFRDVGIRLQERRHLDLIYNFGCHLTDDYRPGVDPALSDPVLARR\r\nLRENRSLAMSRLDEVISKYAMLQDKSEEGERKKRRARLQGTSSHSADTPEASLDSGEGPS\r\nGMASQGCPSASRAETDDEDDEESDEEEEEEEEEEEEEATDSEEEEDLEQMQEGQEDDEEE\r\nDEEEEAAAGKDGDKSPMSSLQISNEKNLEPGKQISRSSGEQQNKGRIVSPSLLSEEPLAP\r\nSSIDAESNGEQPEELTLEEESPVSQLFELEIEALPLDTPSSVETDISSSRKQSEEPFTTV\r\nLENGAGMVSSTSFNGGVSPHNWGDSGPPCKKSRKEKKQTGSGPLGNSYVERQRSVHEKNG\r\nKKICTLPSPPSPLASLAPVADSSTRVDSPSHGLVTSSLCIPSPARLSQTPHSQPPRPGTC\r\nKTSVATQCDPEEIIVLSDSD\r\n\r\n\r\n";

    const filename = "sample.fasta";
    const contentType = "text/plain";

    const blob = new Blob([content], { type: contentType });
    const file = new File([blob], filename, { type: contentType });
    setIsLoadSample(true);
    setFile(file);
  };

  return (
    <Container>
      <form>
        <Flex direction="column" gap="md">
          <Title order={1} size="h1" style={{ marginBottom: '20px' }}>
            Predict with Fasta File
          </Title>
          <Flex align="center" justify="space-between" style={{ width: '100%' }}>
            <FileInput
              onChange={handleFileChange}
              w="85%"
              leftSection={icon}
              clearable
              label="File Upload"
              variant="filled"
              size="xl"
              radius="md"
              required
              withAsterisk
              description="Please upload a file in .fasta or .txt format."
              placeholder="Tab here to upload file."
              value={file}
            />
            <div style={{ textAlign: 'right',paddingTop:'50px' }}>
              <Text component="a" style={{ cursor: 'pointer', color: 'blue'}} onClick={handleLoadSample}>
                Load Sample
              </Text>
            </div>
          </Flex>
          <Button
            type="submit"
            size="lg"
            style={{ width: '25%' }}
            radius="md"
            variant="gradient"
            color="blue"
            onClick={handleUpload}
          >
            {isLoading ? <Loader color="white" size={24} /> : 'Submit'}
          </Button>
        </Flex>
      </form>
      <Space h="xl" />
      <Space h="xl" />

      {showWarning && (
        <Alert color="yellow" withCloseButton onClose={() => setShowWarning(false)} title="Warning!">
          {warningMsg}
        </Alert>
      )}
      <Space h="xl" />

      {isLoading ? null : isSubmitted && predictionsData && !showError ? (
        <TableSort predictions={predictionsData} />
      ) : null}
      {showError && (
        <Alert color="red" withCloseButton onClose={() => setShowError(false)} title="Error!">
          {errorMsg}
        </Alert>
      )}
    </Container>
  );
  
}

export default FastaFile;