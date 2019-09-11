import React from "react";
import ReactDOM from "react-dom";
import * as ml5 from "ml5";

import "./styles.css";

class App extends React.Component {
  state = {
    predictions: [], // Set the empty array predictions state
    image: null
  };

  setPredictions = pred => {
    console.log(pred);
    // Set the prediction state with the model predictions
    this.setState({
      predictions: pred
    });
  };

  classifyImg = () => {
    // Initialize the Image Classifier method with MobileNet
    const classifier = ml5.imageClassifier("MobileNet", modelLoaded);
    // When the model is loaded
    function modelLoaded() {
      console.log("Model Loaded!");
    }
    // Put the image to classify inside a variable
    const image = document.getElementById("image");

    console.log({ image });
    // Make a prediction with a selected image
    classifier
      .predict(image, 5, function(err, results) {
        // Return the results
        return results;
      })
      .then(results => {
        // Set the predictions in the state
        this.setPredictions(results);
      });
  };

  componentDidMount() {
    // once the component has mount, start the classification
    this.classifyImg();
  }

  onChange = e => {
    e.preventDefault();
    const file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState(
        {
          image: reader.result
        },
        () => {
          this.classifyImg();
        }
      );
    };
    reader.readAsDataURL(file);
  };

  render() {
    // First set the predictions to a default value while loading
    let predictions = <div className="loader" />;
    // Map over the predictions and return each prediction with probability
    if (this.state.predictions.length > 0) {
      predictions = this.state.predictions.map((pred, i) => {
        let { label, confidence } = pred;
        // round the probability with 2 decimal
        confidence = Math.floor(confidence * 10000) / 100 + "%";
        return (
          <div key={i + ""}>
            {i + 1}. Prediction: {label} at {confidence}{" "}
          </div>
        );
      });
    }

    return (
      <div className="App">
        <h1>Image classification with ML5.js</h1>
        <input type="file" name="image" onChange={this.onChange} />
        {this.state.image && (
          <>
            <img src={this.state.image} id="image" width="400" alt="" />
            {predictions}
          </>
        )}
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
