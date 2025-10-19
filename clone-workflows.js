#!/usr/bin/env node

/**
 * n8n Workflow Cloner
 * Helps clone workflows from various sources to your localhost n8n
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class N8nWorkflowCloner {
  constructor() {
    this.workflowsDir = './cloned-workflows';
    this.ensureWorkflowsDir();
  }

  ensureWorkflowsDir() {
    if (!fs.existsSync(this.workflowsDir)) {
      fs.mkdirSync(this.workflowsDir, { recursive: true });
      console.log(`✅ Created workflows directory: ${this.workflowsDir}`);
    }
  }

  /**
   * Clone workflow from n8n community
   */
  async cloneFromCommunity(workflowId) {
    const url = `https://n8n.io/workflows/${workflowId}`;
    console.log(`🔍 Fetching workflow from: ${url}`);
    
    try {
      // Note: This is a simplified example. In reality, you'd need to parse the HTML
      // or use the n8n API if available
      console.log(`📋 To clone workflow ${workflowId}:`);
      console.log(`1. Go to: ${url}`);
      console.log(`2. Click "Copy to n8n" or "Download"`);
      console.log(`3. Import the JSON into your localhost n8n`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error fetching workflow: ${error.message}`);
      return false;
    }
  }

  /**
   * Clone workflow from GitHub repository
   */
  async cloneFromGitHub(repoUrl, workflowPath) {
    console.log(`🔍 Cloning workflow from GitHub: ${repoUrl}`);
    
    try {
      const githubUrl = `https://raw.githubusercontent.com${repoUrl.replace('https://github.com', '')}/${workflowPath}`;
      console.log(`📥 Downloading from: ${githubUrl}`);
      
      // This would require additional HTTP client library like axios
      console.log(`📋 To clone from GitHub:`);
      console.log(`1. Go to: ${githubUrl}`);
      console.log(`2. Copy the raw JSON content`);
      console.log(`3. Save it using: node clone-workflows.js save <name>`);
      
      return true;
    } catch (error) {
      console.error(`❌ Error cloning from GitHub: ${error.message}`);
      return false;
    }
  }

  /**
   * Clone workflow from URL
   */
  async cloneFromUrl(url, name) {
    console.log(`🔍 Cloning workflow from URL: ${url}`);
    
    try {
      const response = await this.fetchUrl(url);
      const workflowData = JSON.parse(response);
      
      if (this.validateWorkflow(workflowData)) {
        const filename = `${name}.json`;
        const filepath = path.join(this.workflowsDir, filename);
        
        // Add metadata
        workflowData.clonedFrom = url;
        workflowData.clonedAt = new Date().toISOString();
        
        fs.writeFileSync(filepath, JSON.stringify(workflowData, null, 2));
        console.log(`✅ Workflow cloned successfully: ${filepath}`);
        return filepath;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Error cloning from URL: ${error.message}`);
      return null;
    }
  }

  /**
   * Save workflow from clipboard or input
   */
  saveWorkflow(name, content) {
    const filename = `${name}.json`;
    const filepath = path.join(this.workflowsDir, filename);
    
    try {
      let workflowData;
      if (typeof content === 'string') {
        workflowData = JSON.parse(content);
      } else {
        workflowData = content;
      }

      // Add metadata
      workflowData.clonedAt = new Date().toISOString();
      workflowData.clonedBy = 'n8n-workflow-cloner';

      fs.writeFileSync(filepath, JSON.stringify(workflowData, null, 2));
      console.log(`✅ Workflow saved: ${filepath}`);
      return filepath;
    } catch (error) {
      console.error(`❌ Error saving workflow: ${error.message}`);
      return null;
    }
  }

  /**
   * List all cloned workflows
   */
  listClonedWorkflows() {
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
          clonedAt: content.clonedAt,
          clonedFrom: content.clonedFrom
        };
      });

    console.log('\n📋 Cloned Workflows:');
    console.log('===================');
    files.forEach(workflow => {
      console.log(`📄 ${workflow.name}`);
      console.log(`   File: ${workflow.filename}`);
      console.log(`   Nodes: ${workflow.nodes}`);
      console.log(`   Size: ${(workflow.size / 1024).toFixed(2)} KB`);
      console.log(`   Modified: ${workflow.modified.toLocaleString()}`);
      if (workflow.clonedAt) {
        console.log(`   Cloned: ${new Date(workflow.clonedAt).toLocaleString()}`);
      }
      if (workflow.clonedFrom) {
        console.log(`   Source: ${workflow.clonedFrom}`);
      }
      console.log('');
    });

    return files;
  }

  /**
   * Validate workflow JSON
   */
  validateWorkflow(workflow) {
    try {
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
      return true;
    } catch (error) {
      console.error(`❌ Invalid workflow: ${error.message}`);
      return false;
    }
  }

  /**
   * Get popular workflow sources
   */
  getPopularSources() {
    const sources = {
      'n8n-community': {
        name: 'n8n Community Workflows',
        url: 'https://n8n.io/workflows',
        description: 'Official n8n community workflows'
      },
      'github-n8n': {
        name: 'n8n GitHub Examples',
        url: 'https://github.com/n8n-io/n8n/tree/master/packages/cli/src/workflows',
        description: 'Official n8n workflow examples'
      },
      'awesome-n8n': {
        name: 'Awesome n8n',
        url: 'https://github.com/agileng/awesome-n8n',
        description: 'Curated list of n8n resources and workflows'
      },
      'n8n-templates': {
        name: 'n8n Templates',
        url: 'https://github.com/n8n-io/n8n-templates',
        description: 'Template workflows for common use cases'
      }
    };

    console.log('\n🌟 Popular Workflow Sources:');
    console.log('============================');
    
    Object.entries(sources).forEach(([key, source]) => {
      console.log(`📌 ${source.name}`);
      console.log(`   URL: ${source.url}`);
      console.log(`   Description: ${source.description}`);
      console.log('');
    });

    return sources;
  }

  /**
   * Create import instructions for n8n
   */
  createImportInstructions(workflowName) {
    const instructions = `
📋 How to Import "${workflowName}" into your localhost n8n:

Method 1 - Import from File:
1. Open n8n at http://localhost:5678
2. Click "Import from file"
3. Select: ${path.join(this.workflowsDir, `${workflowName}.json`)}
4. Click "Import"
5. Activate the workflow

Method 2 - Import from Clipboard:
1. Open: ${path.join(this.workflowsDir, `${workflowName}.json`)}
2. Copy all content (Ctrl+A, Ctrl+C)
3. Open n8n at http://localhost:5678
4. Click "Import from clipboard"
5. Paste content (Ctrl+V)
6. Click "Import"
7. Activate the workflow

Method 3 - Using n8n CLI (if available):
npx n8n import:workflow --input="${path.join(this.workflowsDir, `${workflowName}.json`)}"
`;

    console.log(instructions);
    return instructions;
  }
}

// CLI Interface
if (require.main === module) {
  const cloner = new N8nWorkflowCloner();
  const command = process.argv[2];
  const arg = process.argv[3];

  switch (command) {
    case 'list':
      cloner.listClonedWorkflows();
      break;
      
    case 'save':
      if (!arg) {
        console.log('Usage: node clone-workflows.js save <workflow-name>');
        console.log('Then paste your workflow JSON and press Ctrl+D (EOF)');
        process.exit(1);
      }
      
      let input = '';
      process.stdin.on('data', chunk => {
        input += chunk;
      });
      
      process.stdin.on('end', () => {
        cloner.saveWorkflow(arg, input.trim());
        cloner.createImportInstructions(arg);
      });
      break;
      
    case 'sources':
      cloner.getPopularSources();
      break;
      
    case 'import-instructions':
      if (!arg) {
        console.log('Usage: node clone-workflows.js import-instructions <workflow-name>');
        process.exit(1);
      }
      cloner.createImportInstructions(arg);
      break;
      
    case 'validate':
      if (!arg) {
        console.log('Usage: node clone-workflows.js validate <workflow-name>');
        process.exit(1);
      }
      
      const filepath = path.join(cloner.workflowsDir, `${arg}.json`);
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf8');
        cloner.validateWorkflow(JSON.parse(content));
      } else {
        console.error(`❌ Workflow not found: ${filepath}`);
      }
      break;
      
    default:
      console.log(`
🔄 n8n Workflow Cloner

Usage:
  node clone-workflows.js <command> [arguments]

Commands:
  list                           - List all cloned workflows
  save <name>                    - Save workflow from stdin (paste JSON)
  sources                        - Show popular workflow sources
  import-instructions <name>     - Show how to import workflow to n8n
  validate <name>                - Validate cloned workflow

Examples:
  node clone-workflows.js list
  node clone-workflows.js save my-cloned-workflow
  node clone-workflows.js sources
  node clone-workflows.js import-instructions my-cloned-workflow
  node clone-workflows.js validate my-cloned-workflow

🌟 Popular Sources:
  - n8n Community: https://n8n.io/workflows
  - GitHub Examples: https://github.com/n8n-io/n8n/tree/master/packages/cli/src/workflows
  - Awesome n8n: https://github.com/agileng/awesome-n8n
      `);
  }
}

module.exports = N8nWorkflowCloner;
