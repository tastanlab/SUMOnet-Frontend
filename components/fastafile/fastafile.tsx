'use client';
import { useState } from 'react';
import { Button, Container,Alert, FileInput, Flex, Loader, Space, Title, Modal } from '@mantine/core';
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
    setShowError(false);
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("http://127.0.0.1:8000/fasta-file-prediction/", formData);
        setPredictionsData(response.data.data);
        setIsSubmitted(true); // Set submitted to true only on successful data fetch
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
        <Flex direction="column" gap="50">
        <Title order={1} size="h1" style={{ marginBottom: '20px' }}>  {/* Added space below title */}
            Predict with Fasta File
          </Title>
          <FileInput
            onChange={handleFileChange}
            w="98%"
            leftSection={icon}
            clearable
            label="File Upload"
            variant="filled"
            size="xl"
            radius="md"
            required
            withAsterisk
            description="Please upload a file in fasta or txt format."
            placeholder="Tab here to upload file."
            value={file}
          />
          <Flex direction="row" gap="56%">
            <Button
              type="submit"
              size="md"
              w="195px"
              radius="md"
              variant="gradient"
              color="blue"
              onClick={handleUpload}
            >
              {isLoading ? <Loader color="white" size={24} /> : 'Submit'}
            </Button>
            <Button
              type="button"
              onClick={handleLoadSample}
              size="md"
              w="195px"
            
              radius="md"
              variant="gradient"
              color="blue"
            >
              Load Sample
            </Button>
          </Flex>
        </Flex>
      </form>
      <Space h="xl" />
      <Space h="xl" />

      <Container>
        {isLoading ? null : isSubmitted && predictionsData ? (
          <TableSort predictions={predictionsData} />
        ) : null}
      </Container>

      {/* Error Alert */}
      {showError && (
        <Alert color="red" withCloseButton onClose={() => setShowError(false)} title="Error!">
          {errorMsg}
        </Alert>
      )}
    </Container>
  );
}

export default FastaFile;