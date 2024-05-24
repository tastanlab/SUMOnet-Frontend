import "@mantine/core/styles.css";
import React from "react";
import { Container,Text,Image} from "@mantine/core";
export default function BeginnerTutorialPage() {
    return (
       <Container size="lg">  
          <Container>
            <h2>How to Utilize Website?</h2>
            <Text>You can get results from the website by entering the inputs 3 different ways: Using UniProtID, Protein Sequence and Upload FASTA or txt file.</Text>
            <Text> <b style={{ fontSize: "20px" }}>1) UniProtID:</b> If you want to enter your input as UniProtID you need to select UniProtID Prediction choice from the dropdown menu. You will see
              the following page: </Text>
              <Image 
          src="/uniProtIDPrediction.png"
          alt="Output"   
          radius="md"
          fit="contain"
          height="300px"
          />
          <br/>
          <Text>You need to enter UniProtID but entering Lysine Position is optional. Additionally, you can adjust threshold value as you wish so that it only shows
            the results with the Sumoylation probability more than the threshold value.
          </Text>
          <Text> <b style={{ fontSize: "20px" }}>1.1) Without Lysine Position:</b> If you don't provide Lysine position result with
            the all possible Lysine positions will be given as following:</Text>
            <br/>
            <Image 
          src="/exampleOutput1.png"
          alt="Output"   
          radius="md"
          fit="contain"
          height="300px"
          />
          <br/>
          <Text> <b style={{ fontSize: "20px" }}>1.2) With multiple UniProtIDs:</b> Additionally you can provide more than 1 UniProtID to get the results of all of them. Here is how you can do it: </Text>
          <Image 
          src="/UniprotIdMulti.png"
          alt="Output"   
          radius="md"
          fit="contain"
          height="300px"
          />
          <br/>
          <Text>The results for both UniProtIDs will be given as following: </Text>
          <Image 
          src="/UniprotIdMulti1.png"
          alt="Output"   
          height="300px"
          width="600px"
          />
          <Image 
          src="/UniprotIdMulti2.png"
          alt="Output"   
          height="300px"
          width="600px"
          />
          <br/> <br/>
          <Text><b style={{ fontSize: "20px" }}>1.3) With Lysine Position:</b> If you provide Lysine Position, only the results with specific Lysine position you have provided will be shown like following:</Text>
          <Image 
          src="/exampleOutput2.png"
          alt="Output"   
          radius="md"
          fit="contain"
          height="300px"
          />
          <Text> <b style={{ fontSize: "20px" }}>2) Protein Sequence:</b> The second way for entering input is using protein sequence. If you want to use this option you need to select 
            Protein Sequence Prediction choice from the dropdown menu. You will see the following page:
          </Text>
          <br/>
          <Image 
          src="/proteinSequence.png"
          alt="Output"   
          radius="md"
          fit="contain"
          height="300px"
          />
          <Text>You can use sample protein sequence to try, or you can use your own protein sequence to make predictions.</Text> <br/>
          <Text> <b style={{ fontSize: "20px" }}>3) FASTA:</b> The last option for entering option is using FASTA or txt file to make predictions.</Text>
          <Text>If you want to use this you need to select Fasta File Prediction from the dropdown menu. You will see the following page:</Text>
          <br/>
          <Image 
          src="/FastaFile.png"
          alt="Output"   
          radius="md"
          fit="contain"
          height="300px"
          />
          </Container>
          <Text> You can use sample FASTA File to try, or you can use your own FASTA or txt file to make predictions.</Text>
       </Container>
    );
  }
  