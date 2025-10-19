# n8n AI Automation Workflow

This repository contains an AI automation workflow for n8n that demonstrates how to create intelligent content generation and processing pipelines.

## Workflow Overview

The **AI Content Generation Workflow** is designed to:

1. **Receive requests** via webhook
2. **Generate AI content** using OpenAI GPT
3. **Save content** to Google Docs
4. **Send notifications** via email
5. **Return responses** to the requester

## Workflow Components

### 1. Webhook Trigger
- **Endpoint**: `POST /webhook/ai-content`
- **Purpose**: Receives content generation requests
- **Input**: JSON with `prompt` and optional `email` fields

### 2. OpenAI GPT Node
- **Model**: GPT-3.5-turbo
- **Purpose**: Generates content based on user prompts
- **Configuration**: Temperature 0.7, Max tokens 1000

### 3. Conditional Logic
- **Purpose**: Validates AI response before proceeding
- **Action**: Routes to success or error handling

### 4. Google Docs Integration
- **Purpose**: Saves generated content to a Google Doc
- **Format**: Creates new document with timestamp

### 5. Email Notification
- **Purpose**: Sends confirmation email to user
- **Content**: Includes content preview and status

### 6. Webhook Response
- **Purpose**: Returns structured JSON response
- **Format**: Success/error status with generated content

## Setup Instructions

### Prerequisites
1. n8n running locally (`npx n8n`)
2. OpenAI API key
3. Google Docs API credentials
4. Email service configuration

### Installation Steps

1. **Import the workflow**:
   - Open n8n at `http://localhost:5678`
   - Click "Import from file"
   - Select `ai-automation-workflow.json`

2. **Configure credentials**:
   - Set up OpenAI API key
   - Configure Google Docs OAuth
   - Set up email service (Gmail, SMTP, etc.)

3. **Activate the workflow**:
   - Toggle the workflow to active
   - Note the webhook URL

### Usage

Send a POST request to your webhook URL:

```bash
curl -X POST http://localhost:5678/webhook/ai-content \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a blog post about the benefits of AI automation",
    "email": "user@example.com"
  }'
```

### Response Format

**Success Response**:
```json
{
  "success": true,
  "message": "AI content generated successfully",
  "content": "Generated content here..."
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to generate AI content",
  "error": "No content generated"
}
```

## Customization Options

### 1. AI Model Configuration
- Change OpenAI model (GPT-4, Claude, etc.)
- Adjust temperature and token limits
- Add system prompts for specific use cases

### 2. Output Destinations
- Save to different file formats (PDF, Word, etc.)
- Store in databases (PostgreSQL, MongoDB)
- Upload to cloud storage (AWS S3, Google Drive)

### 3. Notification Channels
- Slack notifications
- Discord messages
- SMS alerts
- Push notifications

### 4. Content Processing
- Add content validation
- Implement content templates
- Add translation capabilities
- Include content formatting

## Advanced Features

### Multi-Step AI Processing
- Content generation → Review → Refinement
- Multiple AI models for different tasks
- Human-in-the-loop approval workflows

### Integration Examples
- CRM systems (Salesforce, HubSpot)
- Project management (Jira, Asana)
- Social media platforms (Twitter, LinkedIn)
- E-commerce platforms (Shopify, WooCommerce)

## Troubleshooting

### Common Issues
1. **API Key Errors**: Verify OpenAI credentials
2. **Webhook Timeouts**: Check n8n execution settings
3. **Google Docs Access**: Ensure proper OAuth setup
4. **Email Delivery**: Verify SMTP configuration

### Debug Tips
- Use n8n's execution log to trace issues
- Test individual nodes before full workflow
- Check webhook payload format
- Verify all required credentials are set

## Contributing

Feel free to extend this workflow with additional features:
- Add more AI providers
- Implement content templates
- Create workflow variations
- Add error handling improvements

## License

This workflow is provided as an example for educational and development purposes.
