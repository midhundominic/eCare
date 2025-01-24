const ChatMessage = require('../models/chatModel');
const OpenAI = require('openai');

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// The system message that sets the context for the medical chatbot
const SYSTEM_MESSAGE = `You are a helpful medical assistant chatbot. 
You can provide general health information and guidance, but always remind users 
to consult healthcare professionals for specific medical advice. 
Never provide diagnoses or prescribe medications.`;

const chatWithBot = async (req, res) => {
  try {
    const { message } = req.body;
    // Get userId directly from req.user since it's set by auth middleware
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_MESSAGE },
        { role: "user", content: message }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('No response from OpenAI');
    }

    const botResponse = completion.choices[0].message.content;

    // Save the conversation to database
    const chatMessage = new ChatMessage({
      userId,
      message,
      response: botResponse
    });
    console.log("Chatgpt response",chatMessage);
    await chatMessage.save()
    

    res.status(201).json({ 
      success: true, 
      response: botResponse 
    });

  } catch (error) {
    console.error('Chat error:', error);
    
    // Handle OpenAI specific errors
    if (error.error?.type === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.',
        error: 'API quota exceeded'
      });
    }
    
    // Send appropriate error response based on the error type
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error processing your request' 
    });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const history = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(201).json({ 
      success: true, 
      history 
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error fetching chat history' 
    });
  }
};

module.exports = {
  chatWithBot,
  getChatHistory
};