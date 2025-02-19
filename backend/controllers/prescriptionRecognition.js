const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

const preprocessImage = async (imageBuffer) => {
  return await sharp(imageBuffer)
    .greyscale() // Convert to grayscale
    .normalize() // Normalize the image
    .sharpen() // Sharpen the image
    .threshold(128) // Apply binary threshold
    .toBuffer();
};

const extractMedicationInfo = (text) => {
  // Common medication-related keywords
  const medicationKeywords = ['tablet', 'capsule', 'mg', 'ml', 'times', 'daily', 'dose'];
  
  // Split text into lines
  const lines = text.toLowerCase().split('\n');
  
  const medications = [];
  const dosages = [];
  const frequencies = [];
  const diagnoses = [];

  lines.forEach(line => {
    if (line.trim()) {
      // Check if line contains medication-related keywords
      if (medicationKeywords.some(keyword => line.includes(keyword))) {
        // Extract medication name (usually comes before dosage)
        const medMatch = line.match(/([a-zA-Z]+)\s*(tablet|capsule|mg|ml)/i);
        if (medMatch) {
          medications.push(medMatch[1].trim());
        }

        // Extract dosage
        const dosageMatch = line.match(/(\d+\s*(?:mg|ml|mcg|g))/i);
        if (dosageMatch) {
          dosages.push(dosageMatch[1]);
        }

        // Extract frequency
        const freqMatch = line.match(/(\d+\s*times|daily|twice|once|weekly)/i);
        if (freqMatch) {
          frequencies.push(freqMatch[1]);
        }
      } else if (line.includes('diagnosis') || line.includes('condition')) {
        diagnoses.push(line.replace(/(diagnosis|condition):/i, '').trim());
      }
    }
  });

  return {
    medications,
    dosages,
    frequencies,
    diagnoses
  };
};

exports.analyzePrescription = async (req, res) => {
  try {
    console.log("Request file:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the image URL from Cloudinary
    const imageUrl = req.file.path;

    // Download the image from Cloudinary using axios
    const imageResponse = await axios({
      url: imageUrl,
      responseType: 'arraybuffer'
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Preprocess the image
    const preprocessedImage = await preprocessImage(imageBuffer);

    // Perform OCR
    const { data: { text } } = await Tesseract.recognize(
      preprocessedImage,
      'eng',
      {
        logger: m => console.log(m),
        tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,()-/',
      }
    );

    // Extract medication information
    const analysis = extractMedicationInfo(text);

    return res.json({
      success: true,
      result: {
        analysis,
        extracted_text: text,
        image_url: imageUrl
      }
    });

  } catch (error) {
    console.error('Prescription analysis error:', error);
    return res.status(500).json({
      message: 'Error analyzing prescription',
      error: error.message
    });
  }
};
