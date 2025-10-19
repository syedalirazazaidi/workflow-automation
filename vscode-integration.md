# 🔄 n8n Workflow Integration with VS Code

This guide shows you how to seamlessly work with n8n workflows between the browser interface and VS Code.

## 📋 Quick Export Methods

### Method 1: Browser Export (Recommended)
1. **In n8n Browser** (`http://localhost:5678`):
   - Open your workflow
   - Click **"..." menu** → **"Download"**
   - Choose **"JSON"** format
   - Save to your project folder

2. **In VS Code**:
   - Open the downloaded JSON file
   - Edit, version control, and manage your workflow

### Method 2: Copy-Paste Method
1. **In n8n Browser**:
   - Open workflow → **Ctrl+A** (select all) → **Ctrl+C** (copy)
   - The entire workflow JSON is now in clipboard

2. **In VS Code**:
   - Create new file → **Ctrl+V** (paste) → Save as `.json`

## 🛠️ Using the Workflow Manager

I've created a Node.js tool to help you manage workflows from the command line:

### Setup
```bash
# The workflow-manager.js is already created for you
node workflow-manager.js --help
```

### Commands

#### List All Workflows
```bash
node workflow-manager.js list
```

#### Save Workflow from Clipboard
```bash
# 1. Copy workflow JSON from n8n browser
# 2. Run this command
node workflow-manager.js save my-workflow
# 3. Paste the JSON and press Ctrl+D (EOF)
```

#### Load Workflow for Import
```bash
node workflow-manager.js load my-workflow
# This outputs the JSON ready to import back to n8n
```

#### Create Templates
```bash
# Create a basic webhook workflow
node workflow-manager.js template basic-webhook basic

# Create an AI-powered workflow
node workflow-manager.js template ai-assistant ai
```

#### Validate Workflow
```bash
node workflow-manager.js validate my-workflow
```

## 🔄 Complete Workflow: Browser → VS Code → Browser

### Step 1: Export from Browser
1. Create/edit workflow in n8n browser
2. Click "..." → "Download" → "JSON"
3. Save to your project folder

### Step 2: Work in VS Code
```bash
# List your workflows
node workflow-manager.js list

# Validate the workflow
node workflow-manager.js validate my-workflow

# Edit the JSON file in VS Code
code my-workflow.json
```

### Step 3: Import Back to Browser
1. Copy the JSON content from VS Code
2. Go to n8n browser → "Import from file" or "Import from clipboard"
3. Paste the JSON content
4. Activate the workflow

## 🎯 VS Code Extensions for Better Workflow Management

### Recommended Extensions
1. **JSON Tools** - Format and validate JSON
2. **Prettify JSON** - Auto-format JSON files
3. **GitLens** - Version control for workflows
4. **Thunder Client** - Test webhook endpoints
5. **REST Client** - Test API calls

### VS Code Settings for n8n Workflows
Add to your VS Code `settings.json`:

```json
{
  "files.associations": {
    "*.n8n.json": "json"
  },
  "json.schemas": [
    {
      "fileMatch": ["*.n8n.json"],
      "url": "https://n8n.io/schemas/workflow.json"
    }
  ],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## 🔧 Advanced Workflow Management

### Version Control Your Workflows
```bash
# Initialize git repository
git init

# Add workflow files
git add *.json

# Commit changes
git commit -m "Add AI automation workflow"

# Create branches for different workflow versions
git checkout -b feature/new-ai-integration
```

### Workflow Templates
Create reusable templates:

```bash
# Create AI workflow template
node workflow-manager.js template ai-content-generator ai

# Create webhook template
node workflow-manager.js template webhook-handler basic

# Create data processing template
node workflow-manager.js template data-processor basic
```

### Batch Operations
```bash
# Validate all workflows
for file in workflows/*.json; do
  name=$(basename "$file" .json)
  echo "Validating $name..."
  node workflow-manager.js validate "$name"
done
```

## 🚀 Pro Tips

### 1. Workflow Naming Convention
```
ai-content-generator-v1.json
webhook-data-processor.json
email-automation-workflow.json
```

### 2. Organize by Category
```
workflows/
├── ai/
│   ├── content-generation.json
│   └── data-analysis.json
├── webhooks/
│   ├── api-handler.json
│   └── form-processor.json
└── integrations/
    ├── google-sheets.json
    └── slack-bot.json
```

### 3. Add Metadata to Workflows
```json
{
  "name": "AI Content Generator",
  "description": "Generates content using OpenAI GPT",
  "version": "1.0.0",
  "author": "Your Name",
  "tags": ["ai", "content", "automation"],
  "nodes": [...],
  "connections": {...}
}
```

### 4. Use Environment Variables
In your workflows, use environment variables for sensitive data:
```json
{
  "parameters": {
    "apiKey": "={{ $env.OPENAI_API_KEY }}",
    "webhookUrl": "={{ $env.WEBHOOK_URL }}"
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Invalid JSON**: Use the validator
   ```bash
   node workflow-manager.js validate my-workflow
   ```

2. **Missing Nodes**: Check node types and versions
   ```json
   "type": "n8n-nodes-base.openAi",
   "typeVersion": 1
   ```

3. **Connection Errors**: Verify node IDs match
   ```json
   "connections": {
     "Node Name": {
       "main": [[{"node": "Target Node", "type": "main", "index": 0}]]
     }
   }
   ```

### Debug Workflow
```bash
# Load and inspect workflow
node workflow-manager.js load my-workflow | jq '.nodes[].name'

# Check node types
node workflow-manager.js load my-workflow | jq '.nodes[].type'
```

## 📚 Next Steps

1. **Set up the workflow manager**: `node workflow-manager.js --help`
2. **Export your first workflow** from n8n browser
3. **Create a template**: `node workflow-manager.js template my-first-workflow basic`
4. **Set up VS Code** with recommended extensions
5. **Start version controlling** your workflows with Git

This setup gives you a complete workflow management system that bridges n8n's visual interface with VS Code's powerful editing capabilities!
