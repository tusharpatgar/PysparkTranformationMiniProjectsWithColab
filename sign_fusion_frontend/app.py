from flask import Flask, jsonify, request
import numpy as np
from keras.api.models import load_model  # Correct import for Keras
from PIL import Image
import io

app = Flask(__name__)

# Load your model (ensure the model file path is correct)
model = load_model('cnn8grps_rad1_model.h5')

# Endpoint to handle predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if the request contains an image
        if 'image' not in request.files:
            return jsonify({"error": "No image part"}), 400
        
        # Get the image from the request
        img_file = request.files['image']
        
        # Convert the image to a PIL Image
        img = Image.open(img_file)
        
        # Resize the image to the input size required by your model (e.g., 224x224)
        img = img.resize((224, 224))
        
        # Convert image to numpy array and normalize it
        img_array = np.array(img) / 255.0  # Normalize to range [0, 1]
        
        # Handle grayscale images (convert to 3-channel RGB)
        if img_array.ndim == 2:  # Grayscale image has only 2 dimensions
            img_array = np.stack([img_array] * 3, axis=-1)  # Convert to RGB by stacking
        
        # Ensure the image has the shape (1, 224, 224, 3) for batch prediction
        img_array = np.expand_dims(img_array, axis=0)

        # Make a prediction
        prediction = model.predict(img_array)

        # Assuming the model returns probabilities for classification
        # If it's a classification model, you can use np.argmax to get the class with the highest probability
        predicted_class = np.argmax(prediction, axis=1).tolist()

        # Return prediction as JSON (return the class index or probabilities)
        return jsonify({"prediction": predicted_class})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route for health check to ensure server is running
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Server is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
