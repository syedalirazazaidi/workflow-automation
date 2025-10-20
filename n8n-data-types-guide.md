# 📊 n8n Data Types & Structures Guide

## 🎯 **Overview**

n8n uses a specific data structure to pass information between nodes. Understanding these data types is crucial for building effective workflows.

## 📋 **Main Data Structure: Items**

In n8n, data flows through **items**. Each item is an object that contains:

```json
{
  "json": { /* Your actual data */ },
  "binary": { /* File attachments */ },
  "pairedItem": { /* Reference to source item */ }
}
```

## 🔧 **Core Data Types**

### **1. JSON Data (`json` property)**

The main data container. Can contain any JSON-serializable data:

```json
{
  "json": {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "active": true,
    "tags": ["user", "premium"],
    "metadata": {
      "created": "2024-01-01",
      "source": "api"
    }
  }
}
```

### **2. Binary Data (`binary` property)**

For file attachments, images, documents, etc.:

```json
{
  "binary": {
    "image": {
      "data": "base64-encoded-data",
      "mimeType": "image/png",
      "fileName": "screenshot.png",
      "fileExtension": "png"
    },
    "document": {
      "data": "base64-encoded-data",
      "mimeType": "application/pdf",
      "fileName": "report.pdf",
      "fileExtension": "pdf"
    }
  }
}
```

### **3. Paired Item (`pairedItem` property)**

References to source items for tracking data lineage:

```json
{
  "pairedItem": {
    "item": 0,
    "input": 0
  }
}
```

## 📊 **Common Data Patterns**

### **1. Simple Values**

```json
{
  "json": {
    "string": "Hello World",
    "number": 42,
    "boolean": true,
    "null": null
  }
}
```

### **2. Arrays**

```json
{
  "json": {
    "users": [
      {"name": "Alice", "age": 25},
      {"name": "Bob", "age": 30}
    ],
    "tags": ["urgent", "important", "review"]
  }
}
```

### **3. Nested Objects**

```json
{
  "json": {
    "user": {
      "profile": {
        "name": "John",
        "avatar": "https://example.com/avatar.jpg"
      },
      "settings": {
        "notifications": true,
        "theme": "dark"
      }
    }
  }
}
```

### **4. API Response Data**

```json
{
  "json": {
    "id": 123,
    "title": "Sample Post",
    "content": "This is the post content",
    "author": {
      "id": 456,
      "name": "Jane Smith"
    },
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

## 🔄 **Data Flow Between Nodes**

### **Single Item Flow**
```
Node A → Node B → Node C
[Item] → [Item] → [Item]
```

### **Multiple Items Flow**
```
Node A → Node B
[Item1, Item2, Item3] → [Item1, Item2, Item3]
```

### **Item Merging**
```
Node A → Node C
[Item1] → [Item1 + Item2]
Node B → Node C
[Item2] → 
```

## 🛠️ **Working with Data in n8n**

### **1. Accessing Data in Expressions**

Use `$json` to access the JSON data:

```javascript
// Access simple values
$json.name
$json.age

// Access nested values
$json.user.profile.name
$json.settings.notifications

// Access array elements
$json.users[0].name
$json.tags[1]
```

### **2. Data Transformation**

#### **Set Node**
```json
{
  "assignments": [
    {
      "name": "fullName",
      "value": "={{ $json.firstName }} {{ $json.lastName }}"
    },
    {
      "name": "isAdult",
      "value": "={{ $json.age >= 18 }}"
    }
  ]
}
```

#### **Code Node**
```javascript
// Transform data
const items = $input.all();

return items.map(item => {
  return {
    json: {
      id: item.json.id,
      name: item.json.name.toUpperCase(),
      processed: true,
      timestamp: new Date().toISOString()
    }
  };
});
```

### **3. Data Filtering**

#### **IF Node**
```json
{
  "conditions": {
    "options": {
      "caseSensitive": true,
      "leftValue": "",
      "typeValidation": "strict"
    },
    "conditions": [
      {
        "id": "condition-1",
        "leftValue": "={{ $json.status }}",
        "rightValue": "active",
        "operator": {
          "type": "string",
          "operation": "equals"
        }
      }
    ],
    "combinator": "and"
  }
}
```

## 📝 **Data Type Examples by Node**

### **1. Webhook Node**
```json
{
  "json": {
    "body": {
      "name": "John",
      "email": "john@example.com"
    },
    "headers": {
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0"
    },
    "query": {
      "page": "1",
      "limit": "10"
    }
  }
}
```

### **2. HTTP Request Node**
```json
{
  "json": {
    "id": 1,
    "title": "Sample Post",
    "body": "This is the post content",
    "userId": 1
  }
}
```

### **3. Google Sheets Node**
```json
{
  "json": {
    "A": "John",
    "B": "Doe",
    "C": "john@example.com",
    "D": "Active"
  }
}
```

### **4. Database Node**
```json
{
  "json": {
    "id": 123,
    "name": "Product Name",
    "price": 29.99,
    "category": "Electronics",
    "in_stock": true
  }
}
```

## 🔍 **Data Validation & Type Checking**

### **1. Type Validation in IF Node**
```json
{
  "conditions": {
    "options": {
      "typeValidation": "strict"
    },
    "conditions": [
      {
        "leftValue": "={{ $json.age }}",
        "rightValue": 18,
        "operator": {
          "type": "number",
          "operation": "gte"
        }
      }
    ]
  }
}
```

### **2. Data Type Conversion**
```javascript
// In Code Node
const age = parseInt($json.age);
const isActive = Boolean($json.status === 'active');
const price = parseFloat($json.price);
```

## 📊 **Common Data Patterns**

### **1. API Integration Pattern**
```json
{
  "json": {
    "request_id": "req_123",
    "endpoint": "/api/users",
    "method": "POST",
    "payload": {
      "name": "John Doe",
      "email": "john@example.com"
    },
    "response": {
      "id": 456,
      "status": "created"
    }
  }
}
```

### **2. ETL Pattern**
```json
{
  "json": {
    "source_data": {
      "raw_value": "John,Doe,john@example.com,30"
    },
    "processed_data": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "age": 30
    },
    "validation": {
      "is_valid": true,
      "errors": []
    }
  }
}
```

### **3. Workflow State Pattern**
```json
{
  "json": {
    "workflow_id": "wf_123",
    "execution_id": "exec_456",
    "step": "data_processing",
    "status": "in_progress",
    "data": {
      "processed_items": 5,
      "failed_items": 0
    },
    "metadata": {
      "started_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:05:00Z"
    }
  }
}
```

## 🚨 **Common Data Issues & Solutions**

### **1. Missing Data**
```javascript
// Check if data exists
if ($json.user && $json.user.name) {
  return { json: { name: $json.user.name } };
} else {
  return { json: { name: "Unknown" } };
}
```

### **2. Data Type Mismatches**
```javascript
// Convert string to number
const price = parseFloat($json.price) || 0;

// Convert to boolean
const isActive = $json.status === 'active';
```

### **3. Array Handling**
```javascript
// Check if array exists and has items
if (Array.isArray($json.items) && $json.items.length > 0) {
  return { json: { firstItem: $json.items[0] } };
}
```

## 💡 **Best Practices**

### **1. Data Structure Design**
- Keep data flat when possible
- Use consistent naming conventions
- Include metadata for tracking

### **2. Error Handling**
- Always check for null/undefined values
- Use default values for missing data
- Validate data types before processing

### **3. Performance**
- Minimize data size
- Use efficient data structures
- Avoid deep nesting when possible

## 🔧 **Advanced Data Manipulation**

### **1. Data Aggregation**
```javascript
// Sum values from multiple items
const total = $input.all().reduce((sum, item) => {
  return sum + (parseFloat(item.json.amount) || 0);
}, 0);

return { json: { total } };
```

### **2. Data Grouping**
```javascript
// Group items by category
const grouped = $input.all().reduce((groups, item) => {
  const category = item.json.category || 'uncategorized';
  if (!groups[category]) {
    groups[category] = [];
  }
  groups[category].push(item.json);
  return groups;
}, {});

return Object.keys(grouped).map(category => ({
  json: { category, items: grouped[category] }
}));
```

### **3. Data Enrichment**
```javascript
// Add computed fields
const items = $input.all();

return items.map(item => ({
  json: {
    ...item.json,
    fullName: `${item.json.firstName} ${item.json.lastName}`,
    isVip: item.json.points > 1000,
    processedAt: new Date().toISOString()
  }
}));
```

## 📚 **Summary**

n8n's data structure is built around **items** containing:
- **`json`**: Main data payload
- **`binary`**: File attachments
- **`pairedItem`**: Source tracking

Key concepts:
- Data flows as arrays of items between nodes
- Use expressions (`$json.field`) to access data
- Transform data with Set, Code, and other nodes
- Always validate and handle missing data
- Design consistent data structures for reliability

Understanding these data types and patterns will help you build more robust and efficient n8n workflows! 🚀
