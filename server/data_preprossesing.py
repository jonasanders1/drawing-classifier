import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical

# List of classes
classes = ['circle', 'square', 'triangle', 'cat', 'dog', 'bird', 'airplane', 'car', 'house', 'star']

# Initialize lists to store data and labels
data = []
labels = []

# Load data for each class
for i, class_name in enumerate(classes):
    # Load the .npy file
    class_data = np.load(f'./npy_files/{class_name}.npy')
    
    # Reshape and normalize the data
    class_data = class_data.reshape(-1, 28, 28, 1) / 255.0
    
    # Append the data and labels
    data.append(class_data)
    labels.append(np.full(len(class_data), i))  # Assign label i to this class

# Combine all data and labels
data = np.concatenate(data)
labels = np.concatenate(labels)

# Shuffle the data and labels
indices = np.arange(len(data))
np.random.shuffle(indices)
data = data[indices]
labels = labels[indices]

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.2, random_state=42)

# One-hot encode the labels
num_classes = 10
y_train_one_hot = to_categorical(y_train, num_classes)
y_test_one_hot = to_categorical(y_test, num_classes)

# Verify the shapes
print(f"Training data shape: {X_train.shape}")
print(f"Training labels shape: {y_train_one_hot.shape}")
print(f"Testing data shape: {X_test.shape}")
print(f"Testing labels shape: {y_test_one_hot.shape}")

# Add this at the end of the file after all the processing
np.save('preprocessed_data/X_train.npy', X_train)
np.save('preprocessed_data/y_train_one_hot.npy', y_train_one_hot)
np.save('preprocessed_data/X_test.npy', X_test)
np.save('preprocessed_data/y_test_one_hot.npy', y_test_one_hot)