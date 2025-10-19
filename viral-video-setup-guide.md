# 🎥 AI Viral Video Generation Workflow - Setup Guide

## 🚀 **What This Workflow Does**

This is an **AI-powered viral video generation pipeline** that:
1. **Generates creative video ideas** using AI (GPT-5)
2. **Creates detailed video prompts** for VEO 3
3. **Generates videos** using VEO 3 AI
4. **Uploads to TikTok** automatically
5. **Tracks everything** in Google Sheets

## 📋 **Step-by-Step Setup in n8n Browser**

### **Step 1: Import the Workflow**

1. **Open n8n** at `http://localhost:5678`
2. **Click "Import from file"**
3. **Select** `viral-video-workflow.json`
4. **Click "Import"**

### **Step 2: Install Required Community Nodes**

1. **Go to Settings** → **Community Nodes**
2. **Click "Install"**
3. **Add these nodes**:
   ```
   @n8n/n8n-nodes-langchain
   @blotato/n8n-nodes-blotato
   ```
4. **Click "Install"** and wait for installation

### **Step 3: Set Up Credentials**

#### **3.1 OpenAI API (Required)**
1. **Get OpenAI API Key**:
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create new API key
   - Add funds to your [OpenAI Billing](https://platform.openai.com/settings/organization/billing/overview)

2. **Add to n8n**:
   - Go to **Credentials** → **New**
   - Choose **OpenAI API**
   - Paste your API key
   - Name it: `OpenAi account`

#### **3.2 Google Sheets (Required)**
1. **Set up Google Sheets**:
   - Create a new Google Sheet
   - Copy the [Sample Sheets Data](https://docs.google.com/spreadsheets/d/1pdMs3jWqiYQn3BNdmPhFYhbelQD3jRVtm72ECoCxo0o/copy)

2. **Add to n8n**:
   - Go to **Credentials** → **New**
   - Choose **Google Sheets OAuth2 API**
   - Follow OAuth setup
   - Name it: `Google Sheets account`

#### **3.3 VEO 3 (Kie AI) - Required**
1. **Get VEO 3 API Key**:
   - Sign up at [Kie AI Dashboard](https://kie.ai)
   - Go to **API Keys** → **Create new key**
   - Copy the key

2. **Add to n8n**:
   - Go to **Credentials** → **New**
   - Choose **HTTP Header Auth**
   - Header name: `Authorization`
   - Header value: `Bearer YOUR_API_KEY`
   - Name it: `Kie AI`

#### **3.4 Blotato (Required for TikTok Upload)**
1. **Get Blotato API Key**:
   - Sign up at [Blotato](https://blotato.com)
   - Go to **Settings** → **API Keys**
   - Create new key

2. **Add to n8n**:
   - Go to **Credentials** → **New**
   - Choose **Blotato API**
   - Paste your API key
   - Name it: `Blotato account`

### **Step 4: Configure the Workflow**

#### **4.1 Update Google Sheets References**
1. **Open the workflow**
2. **Find "Save Idea & Metadata to Google Sheets" node**
3. **Click on it**
4. **Update**:
   - **Document ID**: Your Google Sheet ID
   - **Sheet Name**: Your sheet name

#### **4.2 Update TikTok Account**
1. **Find "TikTok" node**
2. **Click on it**
3. **Select your TikTok account** from Blotato

#### **4.3 Configure Schedule (Optional)**
1. **Find "Trigger: Start Daily Content Generation" node**
2. **Click on it**
3. **Set your preferred schedule** (daily, weekly, etc.)

### **Step 5: Test the Workflow**

#### **5.1 Manual Test**
1. **Click "Execute Workflow"** button
2. **Watch the execution** in real-time
3. **Check each node** for errors

#### **5.2 Check Outputs**
1. **Google Sheets**: Should show new idea entries
2. **VEO 3**: Should generate video (takes ~3 minutes)
3. **TikTok**: Should upload video (if configured)

## 🔧 **Workflow Components Explained**

### **🎯 Input Section**
- **Schedule Trigger**: Starts the workflow automatically
- **AI Idea Generation**: Creates creative video concepts
- **Google Sheets**: Saves ideas and tracks progress

### **🎬 Video Generation Section**
- **AI Script Generation**: Creates detailed video prompts
- **VEO 3 API**: Generates the actual video
- **Wait Node**: Waits for video rendering (3 minutes)

### **📱 Publishing Section**
- **Video Download**: Gets the final video URL
- **Blotato Upload**: Uploads to TikTok
- **Status Update**: Marks as completed

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. OpenAI API Errors**
- **Check**: API key is valid and has credits
- **Solution**: Add funds to OpenAI account

#### **2. VEO 3 API Errors**
- **Check**: API key is correct
- **Solution**: Verify API key in Kie AI dashboard

#### **3. Google Sheets Errors**
- **Check**: Sheet permissions and OAuth setup
- **Solution**: Re-authenticate Google Sheets

#### **4. Blotato/TikTok Errors**
- **Check**: TikTok account is connected in Blotato
- **Solution**: Reconnect TikTok account

### **Debug Steps**
1. **Check execution log** for specific errors
2. **Test individual nodes** by clicking "Execute Node"
3. **Verify credentials** are properly set
4. **Check API quotas** and limits

## 💡 **Customization Options**

### **1. Change AI Models**
- **GPT-5 → GPT-4**: Update model in LLM nodes
- **VEO 3 → Other**: Change API endpoint and parameters

### **2. Modify Video Style**
- **Edit prompts** in "Generate Creative Video Idea" node
- **Adjust parameters** in "Set Master Prompt" node

### **3. Add More Platforms**
- **Instagram**: Add Blotato Instagram node
- **YouTube**: Add YouTube upload node
- **Twitter**: Add Twitter upload node

### **4. Change Schedule**
- **Daily**: Set to run every day
- **Weekly**: Set to run weekly
- **Manual**: Remove trigger, run manually

## 📊 **Monitoring & Analytics**

### **Google Sheets Tracking**
The workflow automatically tracks:
- **Ideas generated**
- **Production status**
- **Video URLs**
- **Publishing status**

### **Execution Monitoring**
- **Check execution history** in n8n
- **Monitor API usage** in respective dashboards
- **Track video performance** on TikTok

## 🎯 **Pro Tips**

1. **Start Small**: Test with manual execution first
2. **Monitor Costs**: VEO 3 and OpenAI have usage costs
3. **Quality Control**: Review generated content before publishing
4. **Backup Data**: Export Google Sheets regularly
5. **Update Prompts**: Refine AI prompts based on results

## 📚 **Additional Resources**

- **Tutorial Video**: [YouTube Tutorial](https://youtube.com/watch?v=E-_8KZ_FSeY)
- **Full Documentation**: [Notion Guide](https://automatisation.notion.site/Generate-AI-Viral-Videos-with-VEO-3-and-Upload-to-TikTok-2703d6550fd980aa9ea1dd7867c1cccf)
- **Support**: [LinkedIn](https://www.linkedin.com/in/dr-firas/) / [YouTube](https://www.youtube.com/@DRFIRASS)

## 🚀 **Ready to Go Viral!**

Once set up, this workflow will automatically:
1. **Generate creative video ideas** daily
2. **Create AI videos** using VEO 3
3. **Upload to TikTok** with optimized captions
4. **Track everything** in Google Sheets

Your AI-powered viral video factory is ready! 🎬✨
