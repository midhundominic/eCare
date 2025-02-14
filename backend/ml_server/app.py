from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from models.prescription_analyzer import PrescriptionAnalyzer
from werkzeug.utils import secure_filename

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize prescription analyzer
prescription_analyzer = PrescriptionAnalyzer()

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/ml/analyze-prescription', methods=['POST'])
def analyze_prescription():
    try:
        if 'prescription' not in request.files:
            return jsonify({'success': False, 'error': 'No file uploaded'}), 400
            
        file = request.files['prescription']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Extract text from prescription
            extracted_text = prescription_analyzer.extract_text(filepath)
            
            # Analyze prescription
            analysis_result = prescription_analyzer.analyze_prescription(extracted_text)
            
            # Clean up uploaded file
            os.remove(filepath)
            
            return jsonify({
                'success': True,
                'result': {
                    'extracted_text': extracted_text,
                    'analysis': analysis_result
                }
            })
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    port = int(os.getenv('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)