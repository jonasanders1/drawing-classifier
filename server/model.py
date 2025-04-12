import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt
import numpy as np

# Load the preprocessed data
X_train = np.load('preprocessed_data/X_train.npy')
y_train_one_hot = np.load('preprocessed_data/y_train_one_hot.npy')
X_test = np.load('preprocessed_data/X_test.npy')
y_test_one_hot = np.load('preprocessed_data/y_test_one_hot.npy')

def create_cnn_model(input_shape, num_classes):
    model = models.Sequential([
        # Convolutional layers
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        
        # Fully connected layers
        layers.Flatten(),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),  # Dropout for regularization
        layers.Dense(num_classes, activation='softmax')  # Output layer
    ])
    return model

# Create the model
input_shape = (28, 28, 1)  # Input image shape (28x28 grayscale)
num_classes = 10  # Number of classes
model = create_cnn_model(input_shape, num_classes)

# Compile the model
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Print the model summary
model.summary()


# Train the model
history = model.fit(
    X_train, y_train_one_hot,
    epochs=20,  # Number of epochs
    batch_size=64,  # Batch size
    validation_data=(X_test, y_test_one_hot),
    verbose=1
)

# Evaluate the model
test_loss, test_accuracy = model.evaluate(X_test, y_test_one_hot, verbose=0)
print(f"Test Accuracy: {test_accuracy * 100:.2f}%")




# Plot training & validation accuracy values
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend(['Train', 'Validation'], loc='upper left')
plt.show()

# Plot training & validation loss values
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend(['Train', 'Validation'], loc='upper left')
plt.show()

model.save('my_cnn_model.keras')