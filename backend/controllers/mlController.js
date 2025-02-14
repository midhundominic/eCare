const axios = require('axios');
const FormData = require('form-data');

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'http://localhost:5002/api/ml';

const mlController = {
    analyzePrescription: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No prescription image uploaded' 
                });
            }

            const formData = new FormData();
            formData.append('prescription', req.file.buffer, {
                filename: req.file.originalname,
                contentType: req.file.mimetype
            });

            const response = await axios.post(
                `${ML_SERVER_URL}/analyze-prescription`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders()
                    }
                }
            );

            res.json(response.data);
        } catch (error) {
            console.error('Error analyzing prescription:', error);
            res.status(500).json({
                success: false,
                message: 'Error analyzing prescription',
                error: error.message
            });
        }
    }
};

module.exports = mlController;
