import "@mantine/core/styles.css";
import React from "react";
import { Container,Text,Image} from "@mantine/core";
export default function AdvancedTutorialPage() {
    return (
       <Container size="lg" style={{paddingBottom:"50px"}}> {/* Advanced Tutorial Başlangıç */}
                <Container>
                    <h2>How to Use SUMOnet?</h2>
                    <Text>You can install SUMOnet as a python package as well: <b>pip install sumonet</b></Text>
                    <Text> You can clone SUMOnet from: <a href="https://github.com/berkedilekoglu/SUMOnet" target="_blank" rel="noopener noreferrer">
                    <b>github.com/berkedilekoglu/SUMOnet</b>
            </a> </Text>
                </Container> 
                <Container>
                    <h2>1. How to Load Data?</h2>
                    <Text> You can use our experimental data by using Data Class: <br/>
                    - By using <b>Data</b> class - It does not take any input variable and returns our dbPTM data as Train and Test samples and their labels <br/>
                    - Data class gives X_train, X_test as a list of strings (21-mers), so you need to encode them <br/>
                    - <b>y_train and y_test</b> are lists of integers (labels), so you need to convert them to a 2-d array for feeding our model.
                    </Text>
                    <br/>
                    <pre style={{ overflowX:"auto",whiteSpace: "pre-wrap", backgroundColor: '#f2f2f2', padding: '10px' }}>
  <code>
    <span style={{ color: '#0000FF' }}>Python Code:</span> <br/>
    <span style={{ color: '#007F00' }}>from</span> sumonet.utils.data_pipe <span style={{ color: '#007F00' }}>import</span> Data <br/>
    data = Data() <br/>
    X_train, y_train, X_test, y_test = data.load_sumonet_experiment_data()
  </code>
</pre>

                    <br/>
                    <Text>
                    <b>Example for Training sequences:</b> [RTSHLKQCAVKMEVGPQLLLQ, EDSARPGAHAKVKKLFVGGLK, EKEPPGQLQVKAQPQARMTVP, NMMKTSEAKIKHFDGEDYTCI, PVQKHAIPIIKEKRDLMACAQ] <br/> <b>Example for Training labels:</b> [1, 1, 1, 1, 1]
                    </Text>
                </Container>
                <Container>
                    <h2>2. How to Encode?</h2>
                    <Text>
                    <b>Encoding class</b> takes 2 parameters: encoderTypes and scaler. <br/>
                    - encoderTypes is initially defined as blosum62 according to our experiments, but you can use one-hot or nlf also. <br/>
                    - scaler is initially defined as <b>True</b> according to our experiments. It means that data will be passed into min-max scaler. If you want, you can cancel it. <br/>
                    - You can change the encoder type with the set_encoder_type(encoderType) function.
                    </Text>
                    <br/>
                    <pre style={{overflowX:"auto",whiteSpace: "pre-wrap", backgroundColor: '#f2f2f2', padding: '10px', margin: '0' }}>
  <code>
    <span style={{ color: '#007F00' }}>from</span> sumonet.utils.encodings <span style={{ color: '#007F00' }}>import</span> Encoding <br/>
    encoder = Encoding(encoderType=<span style={{ color: '#AA22FF' }}>'one-hot'</span>) <span style={{ color: '#888888' }}>## Encoding(encoderType = 'blosum62', scale = True)</span> <br/>
    X_train_encoded = encoder.encode_data(X_train)
  </code>
</pre>


                </Container>
                <Container>
                        <h2>3. How to Train SUMOnet Model?</h2>
                        <Text>
                        - You can use our architecture with randomly initialized weights. <br/>- You can also use our pre-trained model in two different weights: <br/>
                        1) Model that was trained on the entire data (Train + Test) - This model is in production <br/> 2) Model that was trained only on Training data - If you want to use our test data to avoid information leak. <br/>
                       <b>Important Note:</b> SUMOnet will be initialized with the input shape of blosum62 encoded vectors. <br/> First we need to get 2d array for training
                        </Text>
                        <br/>
                        <pre style={{ overflowX:"auto",whiteSpace: "pre-wrap",backgroundColor: '#f2f2f2', padding: '10px', margin: '0' }}>
  <code>
    <span style={{ color: '#007F00' }}>import</span> numpy <span style={{ color: '#007F00' }}>as</span> np <br/>
    y_train = np.asarray(y_train) <br/>
    y_train = (y_train[:,None] <span style={{ color: '#007F00' }}>==</span> np.arange(2)).<span style={{ color: '#007F00' }}>astype</span>(int)
  </code>
</pre>

                        <Text>Now we can train randomly initialized SUMOnet model</Text>
                        <br/>
                        <pre style={{overflowX:"auto",whiteSpace: "pre-wrap", backgroundColor: '#f2f2f2', padding: '10px', margin: '0' }}>
  <code>
    <span style={{ color: '#007F00' }}>from</span> sumonet.model.architecture <span style={{ color: '#007F00' }}>import</span> SUMOnet <br/>
    model = SUMOnet(input_shape = X_train_encoded.shape[1:]) <span style={{ color: '#888888' }}></span> <br/>
    model.compile(loss=<span style={{ color: '#AA22FF' }}>'categorical_crossentropy'</span>, optimizer=<span style={{ color: '#AA22FF' }}>'Adam'</span>, metrics=[<span style={{ color: '#AA22FF' }}>'accuracy'</span>]) <br/>
    model.fit(X_train_encoded, y_train, epochs=3)
  </code>
</pre>

                        <br/>
                        <Text>
                        - You can use pre-trained models <br/>- You can also use our pre-trained model in two different weights: <br/> 1) Model that was trained on the entire data (Train + Test) - This model is in production.<br/> 2) Model that was trained only on Training data - If you want to use our test data to avoid information leak.
                        </Text>
                        <pre style={{ overflowX:"auto",whiteSpace: "pre-wrap", backgroundColor: '#f2f2f2', padding: '10px', margin: '0' }}>
  <code>
    <span style={{ color: '#007F00' }}>from</span> sumonet.model.architecture <span style={{ color: '#007F00' }}>import</span> SUMOnet <br/>
    SUMOnet3_model = SUMOnet() <br/>
    SUMOnet3_model.load_weights() <br/>
    <span style={{ color: '#888888' }}></span>
  </code>
</pre>

                        <Text>Now we can make predictions</Text>
                        <br/>
                        <pre style={{overflowX:"auto",whiteSpace: "pre-wrap", backgroundColor: '#f2f2f2', padding: '10px', margin: '0' }}>
  <code>
    encoder = Encoding(encoderType=<span style={{ color: '#AA22FF' }}>'blosum62'</span>) <span style={{ color: '#888888' }}>## Firstly we need to encode our test data</span> <br/>
    X_test_encoded = encoder.encode_data(X_test) <br/>
    y_preds = SUMOnet3_model.predict(X_test_encoded)
  </code>
</pre>

                    </Container>
                    <Container>
                        <h2>4. How to Evaluate Results?</h2>
                        <Text>
                        Evaluate functions are organized according to our evaluation set-up so you can use them directly in comparisons<br/>evaluate function takes 3 arguments: <br/>- y_test: Gold labels should be in 1-d, so if yours is 2-d like ours, use argmax(-1). <br/>- y_pred: Predictions are already in a 2-d vector format.<br/>- String or array that includes metrics.
                        </Text>
                        <br/>
                        <pre style={{overflowX:"auto",whiteSpace: "pre-wrap", backgroundColor: '#f2f2f2', padding: '10px', margin: '0' }}>
  <code>
    y_test = np.asarray(y_test) <span style={{ color: '#888888' }}>#Convert list of integers to 2d array</span> <br/>
    y_test = (y_test[:,None] <span style={{ color: '#007F00' }}>==</span> np.arange(2)).<span style={{ color: '#007F00' }}>astype</span>(int) <br/>
    f1_score = evaluate(y_test.argmax(-1), y_preds, <span style={{ color: '#AA22FF' }}>'f1'</span>) <br/>
    mcc = evaluate(y_test.argmax(-1), y_preds, <span style={{ color: '#AA22FF' }}>'mcc'</span>) <br/>
    roc = evaluate(y_test.argmax(-1), y_preds, <span style={{ color: '#AA22FF' }}>'roc'</span>) <br/>
    aupr = evaluate(y_test.argmax(-1), y_preds, <span style={{ color: '#AA22FF' }}>'aupr'</span>)
  </code>
</pre>

                        <Text>You can calculate all results at once. This calculation outputs a dictionary.</Text>
                        <pre style={{overflowX:"auto",whiteSpace: "pre-wrap", backgroundColor: '#f2f2f2', padding: '10px', margin: '0' }}>
  <code>
    evaluate(y_test.argmax(-1), y_preds, [<span style={{ color: '#AA22FF' }}>'f1'</span>, <span style={{ color: '#AA22FF' }}>'mcc'</span>, <span style={{ color: '#AA22FF' }}>'roc'</span>, <span style={{ color: '#AA22FF' }}>'aupr'</span>])
  </code>
</pre>

                        <Text>
                        Output will look like this:<br/> 'aupr': 0.7598319565641193, 'f1': 0.6580921757770631, 'mcc': 0.5694399870602478, 'roc': 0.8713018549625735
                        </Text>
                    </Container>
       </Container> 
        );
  }
  