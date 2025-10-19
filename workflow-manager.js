#!/usr/bin/env node

/**
 * n8n Workflow Manager
 * Helps export, import, and manage n8n workflows from command line
 */

const fs = require('fs');
const path = require('path');

class N8nWorkflowManager {
  constructor() {
    this.workflowsDir = './workflows';
    this.ensureWorkflowsDir();
  }

  ensureWorkflowsDir() {
    if (!fs.existsSync(this.workflowsDir)) {
      fs.mkdirSync(this.workflowsDir, { recursive: true });
      console.log(`✅ Created workflows directory: ${this.workflowsDir}`);
    }
  }

  /**
   * Save workflow from clipboard or file
   */
  saveWorkflow(name, content) {
    const filename = `${name}.json`;
    const filepath = path.join(this.workflowsDir, filename);
    
    try {
      // If content is a string, try to parse it as JSON
      let workflowData;
      if (typeof content === 'string') {
        workflowData = JSON.parse(content);
      } else {
        workflowData = content;
      }

      // Add metadata
      workflowData.exportedAt = new Date().toISOString();
      workflowData.exportedBy = 'n8n-workflow-manager';

      fs.writeFileSync(filepath, JSON.stringify(workflowData, null, 2));
      console.log(`✅ Workflow saved: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Error saving workflow: ${error.message}`);
      return null;
    }
  }

  /**
   * List all saved workflows
   */
  listWorkflows() {
    const files = fs.readdirSync(this.workflowsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const filepath = path.join(this.workflowsDir, file);
        const stats = fs.statSync(filepath);
        const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        
        return {
          name: file.replace('.json', ''),
          filename: file,
          size: stats.size,
          modified: stats.mtime,
          nodes: content.nodes ? content.nodes.length : 0,
          exportedAt: content.exportedAt
        };
      });

    console.log('\n📋 Saved Workflows:');
    console.log('==================');
    files.forEach(workflow => {
      console.log(`📄 ${workflow.name}`);
      console.log(`   File: ${workflow.filename}`);
      console.log(`   Nodes: ${workflow.nodes}`);
      console.log(`   Size: ${(workflow.size / 1024).toFixed(2)} KB`);
      console.log(`   Modified: ${workflow.modified.toLocaleString()}`);
      if (workflow.exportedAt) {
        console.log(`   Exported: ${new Date(workflow.exportedAt).toLocaleString()}`);
      }
      console.log('');
    });

    return files;
  }

  /**
   * Load workflow for import back to n8n
   */
  loadWorkflow(name) {
    const filename = `${name}.json`;
    const filepath = path.join(this.workflowsDir, filename);
    
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      const workflowData = JSON.parse(content);
      
      // Remove metadata before importing
      delete workflowData.exportedAt;
      delete workflowData.exportedBy;
      
      console.log(`✅ Workflow loaded: ${filepath}`);
      console.log(`📋 Nodes: ${workflowData.nodes ? workflowData.nodes.length : 0}`);
      console.log(`🔗 Connections: ${workflowData.connections ? Object.keys(workflowData.connections).length : 0}`);
      
      return workflowData;
    } catch (error) {
      console.error(`❌ Error loading workflow: ${error.message}`);
      return null;
    }
  }

  /**
   * Create a workflow template
   */
  createTemplate(name, type = 'basic') {
    const templates = {
      basic: {
        name: `${name} - Basic Workflow`,
        nodes: [
          {
            parameters: {
              httpMethod: "GET",
              path: "webhook",
              responseMode: "responseNode"
            },
            id: "webhook-trigger",
            name: "Webhook Trigger",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [240, 300]
          },
          {
            parameters: {
              respondWith: "json",
              responseBody: "={{ { \"message\": \"Hello from n8n!\" } }}"
            },
            id: "webhook-response",
            name: "Webhook Response",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [460, 300]
          }
        ],
        connections: {
          "Webhook Trigger": {
            "main": [
              [
                {
                  "node": "Webhook Response",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          }
        }
      },
      ai: {
        name: `${name} - AI Workflow`,
        nodes: [
          {
            parameters: {
              httpMethod: "POST",
              path: "ai-webhook",
              responseMode: "responseNode"
            },
            id: "webhook-trigger",
            name: "Webhook Trigger",
            type: "n8n-nodes-base.webhook",
            typeVersion: 1,
            position: [240, 300]
          },
          {
            parameters: {
              model: "gpt-3.5-turbo",
              messages: {
                values: [
                  {
                    role: "user",
                    content: "={{ $json.body.prompt }}"
                  }
                ]
              }
            },
            id: "openai-node",
            name: "OpenAI",
            type: "n8n-nodes-base.openAi",
            typeVersion: 1,
            position: [460, 300]
          },
          {
            parameters: {
              respondWith: "json",
              responseBody: "={{ { \"result\": $json.choices[0].message.content } }}"
            },
            id: "webhook-response",
            name: "Webhook Response",
            type: "n8n-nodes-base.respondToWebhook",
            typeVersion: 1,
            position: [680, 300]
          }
        ],
        connections: {
          "Webhook Trigger": {
            "main": [
              [
                {
                  "node": "OpenAI",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          },
          "OpenAI": {
            "main": [
              [
                {
                  "node": "Webhook Response",
                  "type": "main",
                  "index": 0
                }
              ]
            ]
          }
        }
      }
    };

    const template = templates[type] || templates.basic;
    template.createdAt = new Date().toISOString();
    
    return this.saveWorkflow(name, template);
  }

  /**
   * Validate workflow JSON
   */
  validateWorkflow(content) {
    try {
      const workflow = typeof content === 'string' ? JSON.parse(content) : content;
      
      const required = ['name', 'nodes'];
      const missing = required.filter(field => !workflow[field]);
      
      if (missing.length > 0) {
        console.error(`❌ Missing required fields: ${missing.join(', ')}`);
        return false;
      }

      if (!Array.isArray(workflow.nodes)) {
        console.error('❌ Nodes must be an array');
        return false;
      }

      console.log('✅ Workflow validation passed');
      console.log(`📋 Name: ${workflow.name}`);
      console.log(`🔧 Nodes: ${workflow.nodes.length}`);
      console.log(`🔗 Connections: ${workflow.connections ? Object.keys(workflow.connections).length : 0}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Invalid JSON: ${error.message}`);
      return false;
    }
  }
}

// CLI Interface
if (require.main === module) {
  const manager = new N8nWorkflowManager();
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'list':
      manager.listWorkflows();
      break;
      
    case 'save':
      if (!arg) {
        console.log('Usage: node workflow-manager.js save <workflow-name>');
        console.log('Then paste your workflow JSON and press Ctrl+D (EOF)');
        process.exit(1);
      }
      
      let input = '';
      process.stdin.on('data', chunk => {
        input += chunk;
      });
      
      process.stdin.on('end', () => {
        manager.saveWorkflow(arg, input.trim());
      });
      break;
      
    case 'load':
      if (!arg) {
        console.log('Usage: node workflow-manager.js load <workflow-name>');
        process.exit(1);
      }
      
      const workflow = manager.loadWorkflow(arg);
      if (workflow) {
        console.log('\n📋 Workflow JSON:');
        console.log('================');
        console.log(JSON.stringify(workflow, null, 2));
      }
      break;
      
    case 'template':
      if (!arg) {
        console.log('Usage: node workflow-manager.js template <workflow-name> [type]');
        console.log('Types: basic, ai');
        process.exit(1);
      }
      
      const type = process.argv[4] || 'basic';
      manager.createTemplate(arg, type);
      break;
      
    case 'validate':
      if (!arg) {
        console.log('Usage: node workflow-manager.js validate <workflow-name>');
        process.exit(1);
      }
      
      const content = fs.readFileSync(path.join(manager.workflowsDir, `${arg}.json`), 'utf8');
      manager.validateWorkflow(content);
      break;
      
    default:
      console.log(`
🔧 n8n Workflow Manager

Usage:
  node workflow-manager.js <command> [arguments]

Commands:
  list                           - List all saved workflows
  save <name>                    - Save workflow from stdin (paste JSON)
  load <name>                    - Load and display workflow JSON
  template <name> [type]         - Create workflow template (basic, ai)
  validate <name>                - Validate workflow JSON

Examples:
  node workflow-manager.js list
  node workflow-manager.js save my-workflow
  node workflow-manager.js load my-workflow
  node workflow-manager.js template new-workflow ai
  node workflow-manager.js validate my-workflow
      `);
  }
}

module.exports = N8nWorkflowManager;
