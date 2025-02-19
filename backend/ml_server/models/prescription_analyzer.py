import pytesseract
from PIL import Image
import cv2
import numpy as np
from transformers import AutoTokenizer, AutoModelForTokenClassification
import requests
from dotenv import load_dotenv
import os
import torch
import torch.nn as nn
import easyocr
import logging
import re

load_dotenv()

# Define character list for CRNN model
char_list = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?()-/: '

class CRNN(nn.Module):
    def __init__(self, num_chars, rnn_hidden=256):
        super(CRNN, self).__init__()
        
        # CNN for feature extraction
        self.cnn = nn.Sequential(
            # First layer
            nn.Conv2d(1, 64, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Second layer
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            # Third layer
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            
            # Fourth layer
            nn.Conv2d(256, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=(2,1)),
            
            # Fifth layer
            nn.Conv2d(256, 512, kernel_size=3, padding=1),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True),
            
            # Sixth layer
            nn.Conv2d(512, 512, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=(2,1)),
            
            # Seventh layer
            nn.Conv2d(512, 512, kernel_size=2),
            nn.BatchNorm2d(512),
            nn.ReLU(inplace=True)
        )
        
        # RNN for sequence modeling
        self.rnn1 = nn.LSTM(512, rnn_hidden, bidirectional=True, batch_first=True)
        self.rnn2 = nn.LSTM(2*rnn_hidden, rnn_hidden, bidirectional=True, batch_first=True)
        
        # Prediction layer
        self.predictor = nn.Linear(2*rnn_hidden, num_chars)

    def forward(self, x):
        # CNN feature extraction
        conv = self.cnn(x)
        
        # Prepare for RNN
        batch, channel, height, width = conv.size()
        conv = conv.view(batch, channel * height, width)
        conv = conv.permute(0, 2, 1)
        
        # RNN sequence modeling
        rnn1_out, _ = self.rnn1(conv)
        rnn2_out, _ = self.rnn2(rnn1_out)
        
        # Get prediction
        output = self.predictor(rnn2_out)
        
        return output

class PrescriptionAnalyzer:
    def __init__(self):
        # Initialize OCR readers
        self.easyocr_reader = easyocr.Reader(['en'])
        self.char_list = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?()-/: '
        
        # Configure logging
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)

    def preprocess_image(self, image_path):
        """Preprocess image for better OCR results"""
        try:
            # Read image
            image = cv2.imread(image_path)
            if image is None:
                raise Exception("Could not read image")

            # Get image dimensions and resize for better OCR
            height, width = image.shape[:2]
            target_height = 2000  # Increased resolution
            ratio = target_height / height
            new_width = int(width * ratio)
            image = cv2.resize(image, (new_width, target_height))

            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Apply different preprocessing techniques
            preprocessed_images = {
                'original': image,
                'gray': gray,
                # Binary threshold with different values
                'binary_otsu': cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1],
                'binary_inv': cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)[1],
                # Adaptive thresholding
                'adaptive_mean': cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 11, 2),
                'adaptive_gaussian': cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2),
                # Denoising
                'denoised': cv2.fastNlMeansDenoising(gray),
                # Additional preprocessing
                'sharpened': cv2.filter2D(gray, -1, np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]]))
            }
            
            return preprocessed_images
            
        except Exception as e:
            self.logger.error(f"Error in image preprocessing: {str(e)}")
            raise

    def extract_text(self, image_path):
        """Extract text from image using multiple OCR methods"""
        try:
            self.logger.info(f"Starting text extraction for {image_path}")
            
            # Preprocess image
            images = self.preprocess_image(image_path)
            
            # Store all extracted texts with confidence scores
            extracted_texts = []
            
            # 1. Try EasyOCR with different thresholds
            try:
                self.logger.debug("Attempting EasyOCR")
                easyocr_result = self.easyocr_reader.readtext(images['original'])
                
                # Process results with different confidence thresholds
                for threshold in [0.3, 0.5, 0.7]:
                    text = ' '.join([text[1] for text in easyocr_result if text[2] > threshold])
                    if text.strip():
                        self.logger.debug(f"EasyOCR result (threshold {threshold}): {text}")
                        extracted_texts.append(text)
            except Exception as e:
                self.logger.error(f"EasyOCR error: {str(e)}")

            # 2. Try Tesseract with different configurations
            tesseract_configs = [
                '--oem 3 --psm 6',  # Assume uniform block of text
                '--oem 3 --psm 3',  # Fully automatic page segmentation
                '--oem 3 --psm 4',  # Assume single column of text
                '--oem 3 --psm 1'   # Automatic page segmentation with OSD
            ]
            
            for config in tesseract_configs:
                for img_type, img in images.items():
                    try:
                        self.logger.debug(f"Attempting Tesseract with {img_type} image and config: {config}")
                        text = pytesseract.image_to_string(
                            img, 
                            config=f"{config} -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-. mg"
                        )
                        if text.strip():
                            self.logger.debug(f"Tesseract result ({img_type}, {config}): {text}")
                            extracted_texts.append(text)
                    except Exception as e:
                        self.logger.error(f"Tesseract error with {img_type}: {str(e)}")

            # Combine and process results
            if not extracted_texts:
                self.logger.error("No text extracted from any method")
                return ""

            combined_text = self.post_process_text('\n'.join(extracted_texts))
            self.logger.info(f"Final extracted text: {combined_text}")
            
            return combined_text

        except Exception as e:
            self.logger.error(f"Error in text extraction: {str(e)}")
            return ""

    def post_process_text(self, text):
        """Post-process extracted text"""
        try:
            # Split into lines and normalize
            lines = text.lower().split('\n')
            processed_lines = []
            
            for line in lines:
                # Clean the line
                line = line.strip()
                if not line:
                    continue
                
                # Normalize common OCR mistakes
                replacements = {
                    '|': '1',
                    'o': '0',
                    'mg.': 'mg',
                    'mgs': 'mg',
                    'paracetomol': 'paracetamol',
                    'paracetamol': 'paracetamol',
                    'parcetamol': 'paracetamol',
                    '1-o-1': '1-0-1',
                    '1-0-i': '1-0-1',
                    'i-0-1': '1-0-1',
                    'i-o-i': '1-0-1'
                }
                
                for old, new in replacements.items():
                    line = line.replace(old, new)
                
                # Remove extra spaces
                line = ' '.join(line.split())
                
                # Only keep relevant lines
                keywords = ['paracetamol', 'mg', '-0-', '500']
                if any(keyword in line for keyword in keywords):
                    processed_lines.append(line)
            
            return '\n'.join(processed_lines)
            
        except Exception as e:
            self.logger.error(f"Error in post-processing: {str(e)}")
            return text

    def analyze_prescription(self, text):
        """Analyze the extracted text to identify prescription elements"""
        try:
            self.logger.info(f"Analyzing text: {text}")
            
            entities = {
                'medications': [],
                'dosages': [],
                'frequencies': [],
                'diagnoses': [],
                'instructions': []
            }
            
            # Process each line
            for line in text.lower().split('\n'):
                words = line.split()
                
                # Extract medication names
                med_keywords = ['paracetamol', 'parcetamol', 'paracetomol']
                if any(keyword in line for keyword in med_keywords):
                    med = next(word for word in words if any(keyword in word for keyword in med_keywords))
                    if med not in entities['medications']:
                        entities['medications'].append(med)
                
                # Extract dosages
                dosage_pattern = r'\d+\s*mg'
                dosages = re.findall(dosage_pattern, line)
                entities['dosages'].extend([d for d in dosages if d not in entities['dosages']])
                
                # Extract frequencies
                freq_patterns = [r'\d+\s*-\s*0\s*-\s*\d+', r'\d+\s*-\s*\d+\s*-\s*\d+']
                for pattern in freq_patterns:
                    frequencies = re.findall(pattern, line)
                    entities['frequencies'].extend([f for f in frequencies if f not in entities['frequencies']])
            
            self.logger.info(f"Analysis results: {entities}")
            return entities
            
        except Exception as e:
            self.logger.error(f"Error in prescription analysis: {str(e)}")
            return {
                'medications': [],
                'dosages': [],
                'frequencies': [],
                'diagnoses': [],
                'instructions': []
            }

    def get_medicine_details(self, medicine_name):
        try:
            # Clean medicine name
            medicine_name = medicine_name.strip()
            if not medicine_name or medicine_name in ['[CLS]', '[SEP]', '[PAD]']:
                return None

            # Get RxNorm details
            rxnav_response = requests.get(
                f"{self.RXNAV_API_BASE}/drugs",
                params={"name": medicine_name}
            )
            
            if rxnav_response.status_code == 200:
                rxnav_data = rxnav_response.json()
                if 'drugGroup' in rxnav_data and 'conceptGroup' in rxnav_data['drugGroup']:
                    return {
                        "name": medicine_name,
                        "details": self.get_drug_details(rxnav_data)
                    }
            
            return None
            
        except Exception as e:
            print(f"Error getting medicine details: {str(e)}")
            return None

    def get_drug_details(self, rxnav_data):
        try:
            concept_group = rxnav_data['drugGroup']['conceptGroup'][0]
            concept_properties = concept_group.get('conceptProperties', [{}])[0]
            
            return {
                "rxcui": concept_properties.get('rxcui', ''),
                "name": concept_properties.get('name', ''),
                "synonym": concept_properties.get('synonym', ''),
                "tty": concept_properties.get('tty', '')
            }
            
        except Exception as e:
            print(f"Error getting drug details: {str(e)}")
            return {}

    def get_drug_interactions(self, rxcui):
        """
        Get drug interactions from RxNav API
        """
        try:
            interaction_response = requests.get(
                f"{self.RXNAV_API_BASE}/interaction/interaction.json",
                params={"rxcui": rxcui}
            )
            
            if interaction_response.status_code == 200:
                data = interaction_response.json()
                if 'interactionTypeGroup' in data:
                    interactions = []
                    for group in data['interactionTypeGroup']:
                        for interaction in group['interactionType']:
                            interactions.append({
                                'drug': interaction['interactionPair'][0]['interactionConcept'][1]['minConceptItem']['name'],
                                'severity': interaction['severity'],
                                'description': interaction['description']
                            })
                    return interactions
            return []
            
        except Exception as e:
            print(f"Error fetching drug interactions: {str(e)}")
            return []

    def segment_prescription(self, image):
        # Implement line segmentation
        horizontal = np.copy(image)
        vertical = np.copy(image)
        
        # Detect horizontal lines
        horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 1))
        horizontal = cv2.erode(horizontal, horizontal_kernel)
        horizontal = cv2.dilate(horizontal, horizontal_kernel)
        
        # Detect vertical lines
        vertical_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, 50))
        vertical = cv2.erode(vertical, vertical_kernel)
        vertical = cv2.dilate(vertical, vertical_kernel)
        
        # Combine to find cells
        cells = cv2.addWeighted(horizontal, 0.5, vertical, 0.5, 0)
        
        return cells
    
    def recognize_handwriting(self, image):
        # Implement custom handwriting recognition
        # This would use the trained handwriting model
        return self.handwriting_model.predict(image)
    
    def enrich_analysis_results(self, entities):
        # Add additional information and formatting
        return {
            'medications': [{
                'name': med['name'],
                'details': med['details'],
                'usage': med['usage'],
                'warnings': med['warnings']
            } for med in entities['medications']],
            'dosages': entities['dosages'],
            'diagnoses': entities['diagnoses'],
            'frequencies': entities['frequencies'],
            'instructions': entities['instructions']
        } 

    def decode_prediction(self, prediction):
        """Convert model prediction to text"""
        text = ''
        for p in prediction:
            if p < len(self.char_list):
                text += self.char_list[p]
        return text 