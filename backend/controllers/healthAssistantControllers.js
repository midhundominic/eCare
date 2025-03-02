const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
}

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
});

const generationConfig = {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
};

const HEALTH_ASSISTANT_PROMPT = `You are a knowledgeable and compassionate healthcare professional with expertise in chronic disease management. Your role is to:

1. Analyze health metrics and provide detailed assessments
2. Identify potential health risks based on the provided data
3. Provide evidence-based recommendations
4. Communicate in a clear, professional, yet friendly manner
5. Emphasize preventive care and healthy lifestyle choices

When analyzing health metrics, consider:
- Blood sugar levels and diabetes risk
- Blood pressure and cardiovascular health
- Oxygen saturation and respiratory function
- Temperature and potential infections
- Overall health patterns and trends

Always include:
- Clear explanations of health risks
- Practical recommendations
- Preventive measures
- When to seek immediate medical attention

Remember: This is for informational purposes only and does not replace professional medical advice.`;

const analyzeHealthMetrics = async (data) => {
  const risks = [];
  const recommendations = [];
  let exercisePlan = null;

  // Blood Sugar Analysis
  if (data.bloodSugar > 140) {
    risks.push('High blood sugar levels');
    recommendations.push('Monitor carbohydrate intake');
  }

  // Blood Pressure Analysis
  if (data.systolicBP > 130 || data.diastolicBP > 80) {
    risks.push('Elevated blood pressure');
    recommendations.push('Reduce sodium intake');
  }

  // Oxygen Level Analysis
  if (data.oxygenLevel < 95) {
    risks.push('Low oxygen saturation');
    recommendations.push('Consider deep breathing exercises');
  }

  // Get exercise recommendations from ML server
  try {
    const mlResponse = await axios.post('http://localhost:5002/api/ml/recommend-exercise', data);
    if (mlResponse.data.success) {
      exercisePlan = mlResponse.data.recommendations.exercise_plan;
      
      // Add exercise recommendations to the main recommendations array
      recommendations.push(
        `Recommended Exercise: ${exercisePlan.type}`,
        `Intensity: ${exercisePlan.intensity}`,
        `Duration: ${exercisePlan.duration}`,
        `Frequency: ${exercisePlan.frequency}`
      );
      
      return {
        risks,
        recommendations,
        exercisePlan,
        healthCondition: mlResponse.data.recommendations.health_condition
      };
    }
  } catch (error) {
    console.error('Error getting exercise recommendations:', error);
  }

  return { risks, recommendations };
};

exports.analyzeHealth = async (req, res) => {
  try {
    const healthData = req.body;
    const { risks, recommendations, exercisePlan, healthCondition } = await analyzeHealthMetrics(healthData);

    const prompt = `As a medical professional, analyze the following health metrics:
      Blood Sugar: ${healthData.bloodSugar} mg/dL
      Blood Pressure: ${healthData.systolicBP}/${healthData.diastolicBP} mmHg
      Oxygen Level: ${healthData.oxygenLevel}%
      Temperature: ${healthData.temperature}°F
      
      Identified risks: ${risks.join(', ')}
      Health Condition: ${healthCondition || 'Not specified'}
      
      Please provide a detailed health assessment and recommendations.`;

    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: HEALTH_ASSISTANT_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "I understand and will provide a professional health assessment." }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const aiAnalysis = result.response.text();

    return res.json({
      success: true,
      result: {
        metrics: healthData,
        risks,
        recommendations,
        exercisePlan,
        healthCondition,
        aiAnalysis,
        urgentCare: risks.length > 2 ? "Please consult your healthcare provider soon." : null
      }
    });
  } catch (error) {
    console.error('Health analysis error:', error);
    return res.status(500).json({
      message: 'Error analyzing health data',
      error: error.message
    });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    const prompt = `Previous context: ${context}
    
    Patient's question: ${message}
    
    Please provide a helpful and accurate response.`;

    const chat = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: HEALTH_ASSISTANT_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "I understand and will provide medical guidance based on the available information." }],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    return res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      message: 'Error processing chat message',
      error: error.message
    });
  }
};