# import torch.nn as nn
# import torch.nn.functional as F

# # Define the CNN architecture
# class DrawingClassifier(nn.Module):
#     def __init__(self, num_classes=11):
#         super(DrawingClassifier, self).__init__()
        
#         # First Convolutional Block
#         self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
#         self.bn1 = nn.BatchNorm2d(32)
        
#         # Second Convolutional Block
#         self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
#         self.bn2 = nn.BatchNorm2d(64)
        
#         # Third Convolutional Block
#         self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
#         self.bn3 = nn.BatchNorm2d(128)
        
#         # Pooling layer
#         self.pool = nn.MaxPool2d(2, 2)
        
#         # Fully connected layers
#         self.fc1 = nn.Linear(128 * 3 * 3, 512)
#         self.fc2 = nn.Linear(512, num_classes)
        
#         # Dropout for regularization
#         self.dropout = nn.Dropout(0.5)

#     def forward(self, x):
#         # First block
#         x = self.pool(F.relu(self.bn1(self.conv1(x))))
        
#         # Second block
#         x = self.pool(F.relu(self.bn2(self.conv2(x))))
        
#         # Third block
#         x = self.pool(F.relu(self.bn3(self.conv3(x))))
        
#         # Flatten
#         x = x.view(-1, 128 * 3 * 3)
        
#         # Fully connected layers
#         x = self.dropout(F.relu(self.fc1(x)))
#         x = self.fc2(x)
        
#         return F.log_softmax(x, dim=1)
    
    
    
import torch.nn as nn
import torch.nn.functional as F 

class DrawingClassifier(nn.Module):
    def __init__(self, num_classes=11):
        super(DrawingClassifier, self).__init__()
        
        # Increased initial channels and more conv layers
        self.conv1 = nn.Conv2d(1, 64, kernel_size=3, padding=1)
        self.bn1 = nn.BatchNorm2d(64, momentum=0.1)
        
        self.conv2 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn2 = nn.BatchNorm2d(128)
        
        self.conv3 = nn.Conv2d(128, 256, kernel_size=3, padding=1)
        self.bn3 = nn.BatchNorm2d(256)
        
        self.conv4 = nn.Conv2d(256, 256, kernel_size=3, padding=1)
        self.bn4 = nn.BatchNorm2d(256)
        
        # Pooling layers
        self.pool = nn.MaxPool2d(2, 2)
        self.adaptive_pool = nn.AdaptiveAvgPool2d((1, 1))  # Global average pooling
        
        # Fully connected layers
        self.fc1 = nn.Linear(256, 512)
        self.fc2 = nn.Linear(512, num_classes)
        
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = self.pool(F.relu(self.bn1(self.conv1(x))))
        x = self.pool(F.relu(self.bn2(self.conv2(x))))
        x = self.pool(F.relu(self.bn3(self.conv3(x))))
        x = F.relu(self.bn4(self.conv4(x)))
        
        x = self.adaptive_pool(x)
        x = x.view(-1, 256)
        
        x = self.dropout(F.relu(self.fc1(x)))
        x = self.fc2(x)
        
        return F.log_softmax(x, dim=1)