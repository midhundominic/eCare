from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/ml/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'ML server is running'})

@app.route('/api/ml/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        # Add your ML processing logic here
        
        # Dummy response for testing
        result = {
            'prediction': 'test_prediction',
            'confidence': 0.95
        }
        
        return jsonify({'success': True, 'result': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)