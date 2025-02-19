import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import os

def create_handwriting_model():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 1)),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(len(char_list), activation='softmax')
    ])
    return model

def train_model(model, train_data, validation_data):
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    history = model.fit(
        train_data,
        validation_data=validation_data,
        epochs=50,
        batch_size=32
    )
    
    return history

# Save the model
model.save('models/handwriting_recognition_model.h5')