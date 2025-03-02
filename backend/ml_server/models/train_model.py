import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

def extract_numeric_value(value, is_blood_pressure=False):
    """Extract numeric value from string ranges."""
    if pd.isna(value):
        return 120 if is_blood_pressure else 98  # Default values
    
    value = str(value)
    
    # Handle blood pressure values (e.g., "130/80")
    if '/' in value:
        systolic = value.split('/')[0]
        systolic = systolic.replace('>', '').replace('<', '')
        return float(systolic)
    
    # Handle ranges with '>'
    if '>' in value:
        return float(value.replace('>', ''))
    # Handle ranges with '<'
    elif '<' in value:
        return float(value.replace('<', ''))
    # Handle ranges with '-'
    elif '-' in value:
        low, high = map(float, value.split('-'))
        return (low + high) / 2  # Take average of range
    else:
        try:
            return float(value)
        except ValueError:
            return 120 if is_blood_pressure else 98  # Default values

def train_exercise_model():
    print("Starting model training...")
    
    # Load the dataset
    data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'exercise_recommendations.csv')
    data = pd.read_csv(data_path)
    
    # Prepare features
    print("\nExtracting numeric values from ranges...")
    data['blood_sugar_min'] = data['blood_sugar_range'].apply(lambda x: extract_numeric_value(x))
    data['bp_systolic'] = data['bp_range'].apply(lambda x: extract_numeric_value(x, is_blood_pressure=True))
    data['oxygen_min'] = data['oxygen_level_range'].apply(lambda x: extract_numeric_value(x))

    # Print some examples of the conversion
    print("\nSample conversions:")
    for i in range(min(5, len(data))):
        print(f"Original BP: {data['bp_range'].iloc[i]} -> Systolic: {data['bp_systolic'].iloc[i]}")
        print(f"Original Blood Sugar: {data['blood_sugar_range'].iloc[i]} -> Value: {data['blood_sugar_min'].iloc[i]}")
        print(f"Original Oxygen: {data['oxygen_level_range'].iloc[i]} -> Value: {data['oxygen_min'].iloc[i]}")
        print(f"Health Condition: {data['health_condition'].iloc[i]}")
        print("---")

    # Prepare features and target
    features = ['blood_sugar_min', 'bp_systolic', 'oxygen_min']
    X = data[features]
    y = data['health_condition']

    # Print feature values for verification
    print("\nFeature values after preprocessing:")
    print(X.head())
    print("\nTarget values:")
    print(y.head())
    
    print("\nTotal samples:", len(data))
    print("Unique health conditions:", y.nunique())
    print("\nHealth condition distribution:")
    print(y.value_counts())

    # Split the data with a larger test size to ensure at least one sample per class
    test_size = max(0.4, 10/len(data))  # Ensure at least 10 samples in test set
    print(f"\nUsing test_size = {test_size:.2f}")
    
    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42, stratify=y
        )
    except ValueError:
        print("\nWarning: Could not perform stratified split. Falling back to random split.")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=42
        )

    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train the model with adjusted n_neighbors
    n_neighbors = min(3, len(X_train) // 2)  # Ensure n_neighbors doesn't exceed half of training samples
    print(f"\nUsing n_neighbors = {n_neighbors}")
    
    model = KNeighborsClassifier(n_neighbors=n_neighbors)
    model.fit(X_train_scaled, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy:.2f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save the model and scaler
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'trained_models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'exercise_recommender_model.joblib')
    scaler_path = os.path.join(models_dir, 'exercise_recommender_scaler.joblib')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    # Save the original data for reference
    data.to_csv(os.path.join(models_dir, 'training_data.csv'), index=False)
    
    print(f"\nModel saved to: {model_path}")
    print(f"Scaler saved to: {scaler_path}")
    print(f"Training data saved to: {os.path.join(models_dir, 'training_data.csv')}")

if __name__ == "__main__":
    train_exercise_model() 