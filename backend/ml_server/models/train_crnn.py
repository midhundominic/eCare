import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import cv2
import numpy as np
import os
from prescription_analyzer import CRNN, char_list

def pad_sequence(seq, max_length=50):
    """Pad sequence to max_length"""
    if len(seq) > max_length:
        return seq[:max_length]
    return torch.cat([seq, torch.zeros(max_length - len(seq), dtype=torch.long)])

class PrescriptionDataset(Dataset):
    def __init__(self, image_dir, labels_file, max_length=50):
        self.image_dir = image_dir
        self.samples = []
        self.max_length = max_length
        
        # Read labels file
        with open(labels_file, 'r') as f:
            for line in f:
                image_name, text = line.strip().split(',')
                self.samples.append((image_name, text))
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        image_name, text = self.samples[idx]
        
        # Load and preprocess image
        image_path = os.path.join(self.image_dir, image_name)
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        image = cv2.resize(image, (100, 32))
        image = image / 255.0
        image = torch.FloatTensor(image).unsqueeze(0)
        
        # Convert text to indices and pad
        target = torch.LongTensor([char_list.find(c) for c in text])
        target = pad_sequence(target, self.max_length)
        target_length = torch.IntTensor([len(text)])
        
        return image, target, target_length

def collate_fn(batch):
    """Custom collate function to handle variable length sequences"""
    images, targets, target_lengths = zip(*batch)
    images = torch.stack(images, 0)
    targets = torch.stack(targets, 0)
    target_lengths = torch.stack(target_lengths, 0)
    return images, targets, target_lengths

def train_crnn():
    # Initialize model
    model = CRNN(num_chars=len(char_list))
    
    # Check if CUDA is available
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)
    
    # Define loss function and optimizer
    criterion = nn.CTCLoss(zero_infinity=True)
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Create data directories if they don't exist
    os.makedirs('data/train_images', exist_ok=True)
    
    # Check if dataset exists
    if not os.path.exists('data/train_labels.txt'):
        print("Error: Training data not found.")
        return
    
    # Load dataset
    try:
        train_dataset = PrescriptionDataset(
            image_dir='data/train_images',
            labels_file='data/train_labels.txt'
        )
        train_loader = DataLoader(
            train_dataset, 
            batch_size=32, 
            shuffle=True,
            collate_fn=collate_fn
        )
    except Exception as e:
        print(f"Error loading dataset: {str(e)}")
        return
    
    # Training loop
    num_epochs = 50
    for epoch in range(num_epochs):
        model.train()
        total_loss = 0
        
        for batch_idx, (images, targets, target_lengths) in enumerate(train_loader):
            # Move data to device
            images = images.to(device)
            targets = targets.to(device)
            target_lengths = target_lengths.to(device)
            
            optimizer.zero_grad()
            
            # Forward pass
            outputs = model(images)
            
            # Prepare for CTC loss
            batch_size = outputs.size(0)
            input_lengths = torch.full(size=(batch_size,), fill_value=outputs.size(1), dtype=torch.long)
            
            # Calculate loss
            outputs = outputs.log_softmax(2)
            loss = criterion(outputs.permute(1, 0, 2), targets, input_lengths, target_lengths)
            
            # Backward pass
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
            
            if batch_idx % 10 == 0:
                print(f'Epoch: {epoch}, Batch: {batch_idx}, Loss: {loss.item():.4f}')
        
        avg_loss = total_loss / len(train_loader)
        print(f'Epoch {epoch}: Average Loss = {avg_loss:.4f}')
        
        # Save model after each epoch
        torch.save(model.state_dict(), 'models/crnn_model.pth')
        print(f"Model saved after epoch {epoch}")

if __name__ == '__main__':
    os.makedirs('models', exist_ok=True)
    train_crnn() 