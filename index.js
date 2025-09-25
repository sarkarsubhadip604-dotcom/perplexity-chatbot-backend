const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration for secure frontend connection
const corsOptions = {
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Perplexity client using OpenAI SDK (since Perplexity is OpenAI compatible)
const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai',
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Perplexity API Chatbot Backend is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint for Perplexity API
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'llama-3.1-sonar-small-128k-online' } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string',
        success: false
      });
    }

    // Check if API key is configured
    if (!process.env.PERPLEXITY_API_KEY) {
      return res.status(500).json({
        error: 'Perplexity API key not configured',
        success: false
      });
    }

    // Make request to Perplexity API
    const response = await perplexity.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide accurate, informative, and concise responses.'
        },
        {
          role: 'user',
          content: message.trim()
        }
      ],
      max_tokens: 2048,
      temperature: 0.7,
      stream: false
    });

    // Extract and return the response
    const reply = response.choices[0]?.message?.content;
    
    if (!reply) {
      throw new Error('No response content received from Perplexity API');
    }

    res.json({
      reply: reply,
      success: true,
      model: model,
      timestamp: new Date().toISOString(),
      usage: response.usage
    });

  } catch (error) {
    console.error('Chat API Error:', error);

    // Handle specific error types
    if (error.status === 401) {
      return res.status(401).json({
        error: 'Invalid Perplexity API key',
        success: false
      });
    } else if (error.status === 429) {
      return res.status(429).json({
        error: 'API rate limit exceeded. Please try again later.',
        success: false
      });
    } else if (error.status === 400) {
      return res.status(400).json({
        error: 'Invalid request to Perplexity API',
        success: false
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error while processing your request',
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get available models endpoint
app.get('/api/models', (req, res) => {
  const availableModels = [
    'llama-3.1-sonar-small-128k-online',
    'llama-3.1-sonar-small-128k-chat',
    'llama-3.1-sonar-large-128k-online',
    'llama-3.1-sonar-large-128k-chat',
    'llama-3.1-8b-instruct',
    'llama-3.1-70b-instruct',
    'mixtral-8x7b-instruct'
  ];

  res.json({
    models: availableModels,
    success: true,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    success: false
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    success: false
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Perplexity API Chatbot Backend running on port ${port}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Key configured: ${process.env.PERPLEXITY_API_KEY ? 'Yes' : 'No'}`);
});

module.exports = app;