# Perplexity API Chatbot Backend

A secure Node.js/Express backend API for connecting to Perplexity AI with proper API key management and CORS configuration.

## Features

- ✅ Secure API key management using environment variables
- ✅ CORS configuration for frontend integration
- ✅ Input validation and error handling
- ✅ Multiple Perplexity model support
- ✅ Rate limiting awareness
- ✅ Ready for Render deployment
- ✅ Health check endpoint

## Prerequisites

- Node.js 18+ and npm
- Perplexity API key (get from [Perplexity Settings](https://www.perplexity.ai/settings/api))
- Git for version control

## Local Development Setup

1. **Clone this repository:**
   ```bash
   git clone <your-repo-url>
   cd perplexity-chatbot-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your Perplexity API key:
   ```
   PERPLEXITY_API_KEY=your_actual_perplexity_api_key_here
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/`
- Returns server status and health information

### Chat with Perplexity AI
- **POST** `/api/chat`
- **Body:**
  ```json
  {
    "message": "Your question here",
    "model": "llama-3.1-sonar-small-128k-online" // optional
  }
  ```
- **Response:**
  ```json
  {
    "reply": "AI response here",
    "success": true,
    "model": "llama-3.1-sonar-small-128k-online",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "usage": {...}
  }
  ```

### Get Available Models
- **GET** `/api/models`
- Returns list of available Perplexity models

## Available Perplexity Models

- `llama-3.1-sonar-small-128k-online` - Fast, web-connected model
- `llama-3.1-sonar-small-128k-chat` - Chat optimized model
- `llama-3.1-sonar-large-128k-online` - Large web-connected model
- `llama-3.1-sonar-large-128k-chat` - Large chat optimized model
- `llama-3.1-8b-instruct` - General instruction following
- `llama-3.1-70b-instruct` - Large instruction following
- `mixtral-8x7b-instruct` - Mixture of experts model

## Deployment on Render

1. **Push your code to GitHub**
2. **Create a new Web Service on Render**
3. **Connect your GitHub repository**
4. **Configure build settings:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

5. **Add environment variables in Render dashboard:**
   - `PERPLEXITY_API_KEY`: Your actual Perplexity API key
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Your frontend domain (e.g., https://yourfrontend.com)

## Security Features

- API key stored securely in environment variables
- CORS configured for specific frontend domains
- Input validation and sanitization
- Error handling without exposing sensitive information
- Rate limiting awareness and proper error messages

## Frontend Integration

To connect your frontend, make requests to:
```javascript
const response = await fetch('https://your-backend.onrender.com/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello, how can you help me?'
  })
});

const data = await response.json();
console.log(data.reply);
```

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid input)
- `401`: Unauthorized (invalid API key)
- `429`: Rate limit exceeded
- `500`: Internal server error

## Project Structure

```
perplexity-chatbot-backend/
├── index.js              # Main server file
├── package.json          # Dependencies and scripts
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── .env                 # Your local environment (not in git)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub issues
2. Review Perplexity API documentation
3. Check Render deployment logs

## Notes

- Keep your API key secret and never commit it to version control
- The `.env` file is automatically ignored by Git
- Update CORS settings for your specific frontend domain
- Monitor your Perplexity API usage and costs