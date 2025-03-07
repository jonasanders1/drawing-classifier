import matplotlib
matplotlib.use('Agg')  # Add this line at the top, before importing pyplot
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from flask_cors import CORS
import cv2
import torch
import torch.nn as nn

app = Flask(__name__)
CORS(app, resources={
    r"/predict": {
        "origins": ["http://localhost:5173"],  # Your React dev server
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

# List of classes
classes = ['circle', 'square', 'triangle', 'cat', 'dog', 'bird', 'airplane', 'car', 'house', 'star']

# Load the trained model
model = torch.load("./models/drawing-classifier.pth")
model.eval()  # Set the model to evaluation mode


def plot_prediction(pixels):
    # Reshape the pixels to 28x28
    image = pixels.reshape(28, 28)
    
    # Create figure with white background
    plt.figure(figsize=(5, 5), facecolor='white')
    
    # Display the image
    plt.imshow(image, cmap='gray')
    plt.axis('off')
    
    # Save and show the plot
    plt.savefig('prediction.png', bbox_inches='tight', pad_inches=0, facecolor='white')
    plt.close()


@app.route("/predict", methods=["POST"])
def predict():
    # Get pixel data from the request and display it
    data = request.json
    pixels = np.array(data["pixels"], dtype=np.uint8)
    width = data["width"]
    height = data["height"]
    predictions = data["predictions"]
    
    # Reshape to original image dimensions (RGBA format)
    pixels = pixels.reshape(height, width, 4)
    
    # Save original drawing
    plt.figure(figsize=(5, 5), facecolor='white')
    plt.imshow(pixels[:, :, :3])
    plt.axis('off')
    plt.savefig('original_drawing.png', bbox_inches='tight', pad_inches=0, facecolor='white')
    plt.close()
    
    # Process the image
    image = extract_and_resize(pixels)
    
    # Save processed image
    plt.figure(figsize=(5, 5), facecolor='white')
    plt.imshow(image, cmap='gray')
    plt.axis('off')
    plt.savefig('processed_drawing.png', bbox_inches='tight', pad_inches=0, facecolor='white')
    plt.close()
    
    # Convert numpy array to PyTorch tensor
    model_input = torch.FloatTensor(image.reshape(1, 28, 28, 1) / 255.0)
    
    # Get predictions
    with torch.no_grad():
        prediction_scores = model(model_input)
        prediction_scores = torch.softmax(prediction_scores, dim=1)
        prediction_scores = prediction_scores[0].numpy()
    
    # Update predictions list with new scores
    for i, pred in enumerate(predictions):
        pred['percentage'] = float(prediction_scores[i] * 100)
    
    # Sort predictions by percentage in descending order
    predictions.sort(key=lambda x: x['percentage'], reverse=True)
    
    for pred in predictions:
        print(pred['className'], pred['percentage'])
    
    return jsonify({
        "message": "Predictions updated",
        "predictions": predictions
    })

def extract_and_resize(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
    # No need to invert here since we want white drawing on black background
    drawing = gray
    # Find bounding box of drawing
    coords = cv2.findNonZero(drawing)
    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        # Crop to the drawing
        cropped = drawing[y:y+h, x:x+w]
        
        # Calculate padding (e.g. 20% of the larger dimension)
        padding = int(max(w, h) * 0.2)
        
        # New size with padding
        padded_size = max(w, h) + (padding * 2)
        
        # Create black square with padding
        square = np.zeros((padded_size, padded_size), dtype=np.uint8)
        
        # Calculate offsets including padding
        x_offset = (padded_size - w) // 2
        y_offset = (padded_size - h) // 2
        
        # Place the cropped image in the center of the padded square
        square[y_offset:y_offset+h, x_offset:x_offset+w] = cropped
        
        # Final resize
        resized = cv2.resize(square, (28, 28), interpolation=cv2.INTER_AREA)
        return resized
    else:
        # Return black image if no drawing found
        return np.zeros((28, 28), dtype=np.uint8)




if __name__ == "__main__":
    app.run(debug=True)