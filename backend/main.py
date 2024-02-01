import flask
from flask import request
import json
from flask_cors import CORS

from tensorflow.keras.models import load_model
import numpy as np
import cv2

model = load_model('model_save/custom_train_test_plain2')  # Provide the path to your saved model
# Define a function to preprocess images
def preprocess_image(image):
    # Resize the image to match the input size of the model
    image = cv2.resize(image, (180, 180))
    # Convert image to array and normalize
    image = image.astype('float32') / 255.0
    # Add batch dimension
    image = np.expand_dims(image, axis=0)
    return image

# Define a function to make predictions on a single image
def predict_single_image(image):
    # Preprocess the image
    image = preprocess_image(image)
    # Make prediction
    prediction = model.predict(image)
    # Get the predicted class label
    predicted_class = np.argmax(prediction)
    return predicted_class

app = flask.Flask(__name__)
CORS(app)
port = 5000
@app.route('/', methods=['GET'])
def home():
    print("API is working")
    return "<h1>API is working</h1>"

@app.route('/predict', methods=['POST'])
def predict():
    print("API is working")
    if request.method == 'POST':
        file = request.files['file']
        file.save('image.jpg')
        image = cv2.imread('image.jpg')
        predicted_class = predict_single_image(image)
        print("++++++++++++++++++++++++++++++")
        print(predicted_class)
        print("++++++++++++++++++++++++++++++")
        return str(predicted_class)

app.run(port=port, debug=True)
