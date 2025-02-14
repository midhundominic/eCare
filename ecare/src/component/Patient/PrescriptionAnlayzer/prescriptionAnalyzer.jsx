import React, { useState } from 'react';
import { analyzePrescription } from '../../../services/mlServices';
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
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleAnalyze = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await analyzePrescription(selectedFile);
            setAnalysis(result.result);
        } catch (err) {
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
                    
                    <div className={styles.reesult}>
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