import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
import joblib
import os

class ExerciseRecommender:
    def __init__(self):
        self.data = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'data', 'exercise_recommendations.csv'))
        
        # Load trained model and scaler
        models_dir = os.path.join(os.path.dirname(__file__), '..', 'trained_models')
        model_path = os.path.join(models_dir, 'exercise_recommender_model.joblib')
        scaler_path = os.path.join(models_dir, 'exercise_recommender_scaler.joblib')
        
        if os.path.exists(model_path) and os.path.exists(scaler_path):
            self.model = joblib.load(model_path)
            self.scaler = joblib.load(scaler_path)
        else:
            print("Trained model not found. Using default model.")
            self.model = KNeighborsClassifier(n_neighbors=3)
            self.scaler = StandardScaler()
            self._prepare_data()

    def _prepare_data(self):
        # Convert blood sugar ranges to numeric values
        self.data['blood_sugar_min'] = self.data['blood_sugar_range'].apply(
            lambda x: float(x.replace('>', '').split('-')[0]) if isinstance(x, str) else float(x)
        )
        
        # Convert blood pressure ranges to numeric values
        self.data['bp_systolic'] = self.data['bp_range'].apply(
            lambda x: float(x.split('/')[0].replace('>', '')) if isinstance(x, str) and '>' in x 
            else float(x.split('/')[0]) if isinstance(x, str) and 'normal' not in x.lower() 
            else 120
        )
        
        # Convert oxygen level ranges to numeric values
        self.data['oxygen_min'] = self.data['oxygen_level_range'].apply(
            lambda x: float(x.replace('>', '').replace('<', '')) if isinstance(x, str) else float(x)
        )

        # Prepare features for training
        features = ['blood_sugar_min', 'bp_systolic', 'oxygen_min']
        self.X = self.data[features]
        self.y = self.data['health_condition']

        # Scale features
        self.X_scaled = self.scaler.fit_transform(self.X)
        
        # Train the model
        self.model.fit(self.X_scaled, self.y)

    def get_recommendations(self, blood_sugar, systolic_bp, oxygen_level):
        # Prepare input data
        input_data = np.array([[blood_sugar, systolic_bp, oxygen_level]])
        input_scaled = self.scaler.transform(input_data)
        
        # Predict health condition
        predicted_condition = self.model.predict(input_scaled)[0]
        
        # Get exercise recommendations for predicted condition
        recommendations = self.data[self.data['health_condition'] == predicted_condition].iloc[0]
        
        return {
            'health_condition': predicted_condition,
            'exercise_plan': {
                'type': recommendations['exercise_type'],
                'intensity': recommendations['intensity'],
                'duration': recommendations['duration'],
                'frequency': recommendations['frequency'],
                'precautions': recommendations['precautions']
            }
        }