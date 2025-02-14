import pytesseract
from PIL import Image
import cv2
import numpy as np
from transformers import pipeline
import re

class PrescriptionAnalyzer:
    def __init__(self):
        # Initialize NLP pipeline for medical entity recognition
        self.ner_pipeline = pipeline("ner", model="samrawal/bert-base-uncased_clinical-ner")
        
    def preprocess_image(self, image):
        # Convert to numpy array if image is PIL
        if isinstance(image, Image.Image):
            image = np.array(image)
            
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding
        _, threshold = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Noise removal
        denoised = cv2.medianBlur(threshold, 3)
        
        return denoised
    
    def extract_text(self, image_path):
        # Read image
        image = Image.open(image_path)
        
        # Preprocess image
        processed_image = self.preprocess_image(image)
        
        # Extract text using Tesseract
        text = pytesseract.image_to_string(processed_image)
        
        return text
    
    def analyze_prescription(self, text):
        # Extract medications using NER
        entities = self.ner_pipeline(text)
        
        medications = []
        dosages = []
        diagnoses = []
        
        for entity in entities:
            if entity['entity'] == 'MEDICATION':
                medications.append(entity['word'])
            elif entity['entity'] == 'DOSAGE':
                dosages.append(entity['word'])
            elif entity['entity'] == 'DIAGNOSIS':
                diagnoses.append(entity['word'])
                
        # Extract additional information using regex
        frequency_pattern = r'\b\d+\s*times?\s*(daily|per\s*day)\b'
        frequencies = re.findall(frequency_pattern, text, re.IGNORECASE)
        
        return {
            'medications': medications,
            'dosages': dosages,
            'diagnoses': diagnoses,
            'frequencies': frequencies
        } 