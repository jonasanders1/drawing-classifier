from PIL import Image
import numpy as np
import tensorflow as tf

# Load the trained model
model = tf.keras.models.load_model('drawing_classifier_cnn.h5')


# Load the test image
image_path = './house.png'  # Replace with the path to your test image
image = Image.open(image_path)

# Resize to 28x28 and convert to grayscale
image = image.resize((28, 28)).convert('L')

# Convert to numpy array and normalize
image_array = np.array(image) / 255.0

# Reshape to match the model's input shape (1, 28, 28, 1)
image_array = image_array.reshape(1, 28, 28, 1)


# Make a prediction
predictions = model.predict(image_array)

# Get the predicted class
predicted_class_index = np.argmax(predictions)
class_names = ['circle', 'square', 'triangle', 'cat', 'dog', 'bird', 'airplane', 'car', 'house', 'star']
predicted_class = class_names[predicted_class_index]

print(f"Predicted Class: {predicted_class}")

import matplotlib.pyplot as plt

# Display the test image
plt.imshow(image_array.reshape(28, 28), cmap='gray')
plt.title(f"Predicted: {predicted_class}")
plt.axis('off')
plt.show()