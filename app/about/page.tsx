import "@mantine/core/styles.css";
import React from "react";
import { Container,Text,Image} from "@mantine/core";
export default function AboutPage() {
    return (
       <Container  size="lg" style={{paddingBottom:"50px" }}>
            <Container >
            <h2> What is SUMOnet?</h2>
            <Text>The SUMOnet project aims to improve the user experience, user interface, and overall performance of a web application dedicated to
  predicting potential protein chains resulting from the SUMOylation process, which is implicated in genetic-based diseases such as
Alzheimer's, cancer, and diabetes. The third version of SUMOnet (SUMOnet-3) is deployed in this website.<br/> SUMOnet takes 3 different input types: First, the user can enter the UniprotID of the protein and the lysine position (optionally)
Another input type is entering the protein sequence that needs to be evaluated. Lastly, user can enter the input as FASTA format. <br/>
After analyzed by machine learning model, SUMOnet gives the output as Protein ID, Peptide Sequence, Lysine Position, Sumoylation Probability and the Predicted Label.
 </Text>
 <br/>
 <div>
          <Image 
          src="/exampleOutput1.png"
          alt="Output"   
          radius="md"
          fit="contain"
          />
        <p style={{ textAlign: 'center', marginTop: '10px', color: "red" }}>
          Example Output of SUMOnet
            </p>
          </div>
            </Container>
            <Container>
          <div>
          <Image 
          src="/SUMOnet3Architecture.png"
          alt="SUMOnet3"   
          radius="md"
          fit="contain"
          />
        <p style={{ textAlign: 'center', marginTop: '10px', color: "red" }}>
          Architecture of SUMOnet3
            </p>
          </div>
            <div>
          <h3>Performance of SUMOnet3:</h3>
          <Text>
         SUMOnets prediction performance is compared with the well-known machine learning models.
        All three SUMOnets outperform the models in the literature and the trained XGBoost model.
        Among the three architectures, SUMOnet-3 is the one that achieves the best scores. The F1-Score of SUMOnet-3 is 0.66, which is 5% more than XGBoost classifier.
        MCC, ROC-AUC and AUPR scores of SUMOnet-3 are 0.57, 0.87 and 0.76, respectively. These correspond to an improvement of approximately 3% over the XGBoost classifier.
        It is concluded that we can attain the best predictor by using SUMOnet-3. The models were also compared using the Receiver operating characteristic (ROC)
        and precision-recall (PR) curves. As shown in below SUMOnet-3 is the best overall predictor across different false positive rates.
          </Text>
            </div>
            <br/>
            <div>
          <Image 
          src="/performanceComparison.png"
          alt="SUMOnet3-Performance"   
          radius="md"
          fit="contain"
          />
        <p style={{ textAlign: 'center', marginTop: '10px', color: "red" }}>
          Performance of SUMOnet3
            </p>
          </div>
          </Container>
          <Container>
            <h3>Performance in Hard Case:</h3>
            <Text>
            The hard test set includes target sequences that lack SUMO motifs but are SUMOylated and sequences that are not SUMOylated but contain a SUMOylation motif.
            These are the specific examples that would challenge predictors.
            Image below shows the comparison of ROC curves for various methods. SUMOnet models perform the best compared to both XGBoost and previous methods.
            SUMOnet-3, which relies on CNN and biGRU, is the best performer among all. 
            This result demonstrates that the deep learning model can go beyond learning simple linear motifs.
            </Text>
            <br/>
            <div>
          <Image 
          src="/hardCasePerformance.png"
          alt="SUMOnet3-HardCasePerformance"   
          radius="md"
          fit="contain"
          width={"400px"}
          height={"400px"}
          />
        <p style={{ textAlign: 'center', marginTop: '10px', color: "red" }}>
          Performance of SUMOnet3 in Hard Test Examples
            </p>
          </div>
          </Container>
        <Container>
            <h2>Citation:</h2>
            <Text>
            If you use SUMOnet in your work please cite us: <br/>
            <a href="https://www.biorxiv.org/content/10.1101/2023.08.25.554749v1" target="_blank" rel="noopener noreferrer">
            Dilekoglu, B., Tascioglu O.,: Sumonet: Deep sequential prediction of sumoylation sites. bioRxiv (2023).
            </a>
          </Text>
          <h2>Website Developers:</h2>
          
            
                  <Text>Alper Mert - <a href="mailto:alpermert@sabanciuniv.edu">alpermert@sabanciuniv.edu</a></Text>
        
                  <Text>Bülent Emin Üstün - <a href="mailto:eustun@sabanciuniv.edu">eustun@sabanciuniv.edu</a> </Text>
              
                  <Text>Mehmet Eren Karabulut - <a href="mailto:mkarabulut@sabanciuniv.edu">mkarabulut@sabanciuniv.edu</a></Text>
             
                  <Text>Şevki Aybars Türel - <a href="mailto:aturel@example.com">aturel@sabanciuniv.edu</a></Text>
              
          

        </Container>
       </Container> 
    );
  }
  