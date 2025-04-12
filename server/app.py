import matplotlib
matplotlib.use('Agg')  # Add this line at the top, before importing pyplot
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, send_from_directory
import numpy as np
import tensorflow as tf
from flask_cors import CORS
import cv2
import torch
import torch.nn as nn
import torch.nn.functional as F
from DrawingClassifier import DrawingClassifier

app = Flask(__name__, static_folder='../client/dist')
# Update CORS to allow both development and production domains
CORS(app, origins=[
    "http://localhost:5173",                                # Development
    "https://drawingclassifier.jonasanders1.com",          # Your subdomain
    "https://www.drawingclassifier.jonasanders1.com",      # www subdomain variant
    "https://jonasanders1.com",                            # Main domain
    "https://www.jonasanders1.com"                         # www main domain
], methods=["GET", "POST", "OPTIONS"], 
   allow_headers=["Content-Type", "Authorization"],
   expose_headers=["Access-Control-Allow-Origin"],
   supports_credentials=True)

# Update classes to match the order used in training
classes = ['airplane', 'bird', 'car', 'cat', 'circle', 
           'dog', 'house', 'square', 'star', 'triangle', 'umbrella']
# Create model instance with correct number of classes
model = DrawingClassifier(num_classes=len(classes))

# Load the state dictionary
# model.load_state_dict(torch.load("./models/drawing-classifier.pth"))
model.load_state_dict(torch.load("./models/best_model_fold_0.pth"))
model.eval()
torch.set_grad_enabled(False)

icon_mapping = {
    'circle': 'circle',
    'square': 'check_box_outline_blank',
    'triangle': 'change_history',
    'cat': 'pets',
    'dog': 'sound_detection_dog_barking',
    'bird': 'raven',
    'airplane': 'flight',
    'car': 'local_taxi',
    'house': 'cottage',
    'star': 'star',
    'umbrella': 'beach_access'
}

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
    
    # Convert numpy array to PyTorch tensor and reshape to (batch_size, channels, height, width)
    # model_input = torch.FloatTensor(image.reshape(1, 1, 28, 28) / 255.0)
    image_array = image / 255.0  # Normalize
    image_tensor = torch.FloatTensor(image_array).unsqueeze(0).unsqueeze(0)
    
    # In your predict route
    image_array = image / 255.0  # Simple normalization

    
    
    # Get predictions
 
    with torch.no_grad():
        output = model(image_tensor)
        probabilities = torch.exp(output)
    
    # Convert to percentages
    percentages = probabilities.numpy()[0] * 100
    
    # Map to class names
    class_names = ['airplane', 'bird', 'car', 'cat', 'circle', 
                   'dog', 'house', 'square', 'star', 'triangle', 'umbrella']
    
    # Create prediction dictionary
    predictions = {class_names[i]: float(percentages[i]) 
                  for i in range(len(class_names))}
    
    # Convert dictionary to list of objects and sort
    prediction_list = [
        {"className": class_name, "percentage": percentage, "image": icon_mapping[class_name.lower()]} 
        for class_name, percentage in predictions.items()
    ]
    prediction_list.sort(key=lambda x: x['percentage'], reverse=True)
    
    for pred in prediction_list:
        print(pred['className'], pred['percentage'])

    return jsonify({"predictions": prediction_list})

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

# Add these new routes to serve the React app
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(debug=True, port=5001)