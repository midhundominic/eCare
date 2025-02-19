import React, { useState } from 'react';
// import { analyzePrescription } from '../../../services/mlServices';
import {analyzePrescription} from '../../../services/prescriptionRecognitionServices';
import PageTitle from '../../Common/PageTitle';
import styles from './prescriptionAnalyzer.module.css';

const PrescriptionAnalyzer = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('File size too large. Please upload an image less than 5MB.');
                return;
            }
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
            setError(null);
            setAnalysis(null);
        }
    };

    const handleAnalyze = async () => {
        try {
            if (!selectedFile) {
                setError('Please select a file first');
                return;
            }

            setLoading(true);
            setError(null);
            console.log('Uploading file:', selectedFile); // Add this for debugging
            const result = await analyzePrescription(selectedFile);
            setAnalysis(result.result);
        } catch (err) {
            console.error('Analysis error:', err); // Add this for debugging
            setError(err.message || 'Error analyzing prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.body}>
            <PageTitle>Prescription Analyzer</PageTitle>
            
            <div className={styles.uploader}>
                <input className={styles.inputFile}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    
                />
                
                {preview && (
                    <div className={styles.bodyPreview}>
                        <img
                            src={preview}
                            alt="Prescription preview"
                            className={styles.preview}
                        />
                    </div>
                )}
                
                <button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || loading}
                    className={styles.button}
                >
                    {loading ? 'Analyzing...' : 'Analyze Prescription'}
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            {analysis && (
                <div className={styles.bodyResult}>
                    <h3 className={styles.h3}>Analysis Results:</h3>
                    
                    <div className={styles.result}>
                        <h4 className={styles.h4}>Medications:</h4>
                        <ul className={styles.medications}>
                            {analysis.analysis.medications.map((med, index) => (
                                <li key={index}>{med}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h4 className={styles.h4}>Dosages:</h4>
                        <ul className={styles.dosage}>
                            {analysis.analysis.dosages.map((dosage, index) => (
                                <li key={index}>{dosage}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h4 className={styles.h4}>Frequencies:</h4>
                        <ul className={styles.frequencies}>
                            {analysis.analysis.frequencies.map((freq, index) => (
                                <li key={index}>{freq}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.diagnoses}>
                        <h4 className={styles.h4}>Diagnoses:</h4>
                        <ul className={styles.diagnosesResult}>
                            {analysis.analysis.diagnoses.map((diagnosis, index) => (
                                <li key={index}>{diagnosis}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className={styles.h4}>Extracted Text:</h4>
                        <pre className={styles.extracted_text}>
                            {analysis.extracted_text}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrescriptionAnalyzer;