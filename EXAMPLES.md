# Example n8n Workflows

This directory contains example workflows demonstrating how to use the Matrix Bot nodes.

## Example 1: Echo Bot

This workflow listens for incoming messages and echoes them back to the sender.

```json
{
  "name": "Matrix Echo Bot",
  "nodes": [
    {
      "parameters": {
        "pollInterval": 5
      },
      "name": "Matrix Bot Trigger",
      "type": "n8n-nodes-matrix-bot.matrixBotTrigger",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "send",
        "roomId": "={{ $json.room_id }}",
        "message": "Echo: {{ $json.message }}"
      },
      "name": "Send Echo Reply",
      "type": "n8n-nodes-matrix-bot.matrixBot",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Matrix Bot Trigger": {
      "main": [[{"node": "Send Echo Reply", "type": "main", "index": 0}]]
    }
  }
}
```

## Example 2: Room Management

Create a room and invite users:

```json
{
  "name": "Create Matrix Room",
  "nodes": [
    {
      "parameters": {},
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "resource": "room",
        "operation": "create",
        "roomName": "My New Room",
        "roomTopic": "Discussion about n8n automation",
        "isPublic": false,
        "inviteUsers": "@user1:example.com,@user2:example.com"
      },
      "name": "Create Room",
      "type": "n8n-nodes-matrix-bot.matrixBot",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{"node": "Create Room", "type": "main", "index": 0}]]
    }
  }
}
```

## Example 3: Message Filter and Auto-Respond

Filter messages from a specific room and auto-respond to keywords:

```json
{
  "name": "Matrix Auto-Responder",
  "nodes": [
    {
      "parameters": {
        "pollInterval": 10,
        "options": {
          "filterByRoom": "!myroom:example.com"
        }
      },
      "name": "Poll Messages",
      "type": "n8n-nodes-matrix-bot.matrixBotTrigger",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.message }}",
              "operation": "contains",
              "value2": "help"
            }
          ]
        }
      },
      "name": "Filter Help Messages",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [450, 300]
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "send",
        "roomId": "={{ $json.room_id }}",
        "message": "Hi! How can I help you? Available commands:\n- status\n- info\n- help"
      },
      "name": "Send Help Response",
      "type": "n8n-nodes-matrix-bot.matrixBot",
      "typeVersion": 1,
      "position": [650, 250]
    }
  ],
  "connections": {
    "Poll Messages": {
      "main": [[{"node": "Filter Help Messages", "type": "main", "index": 0}]]
    },
    "Filter Help Messages": {
      "main": [[{"node": "Send Help Response", "type": "main", "index": 0}]]
    }
  }
}
```

## Example 4: Presence Management

Set bot presence based on time of day:

```json
{
  "name": "Matrix Presence Scheduler",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 9 * * 1-5"
            }
          ]
        }
      },
      "name": "Morning Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [250, 250]
    },
    {
      "parameters": {
        "resource": "presence",
        "operation": "set",
        "presence": "online"
      },
      "name": "Set Online",
      "type": "n8n-nodes-matrix-bot.matrixBot",
      "typeVersion": 1,
      "position": [450, 250]
    },
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "cronExpression",
              "expression": "0 17 * * 1-5"
            }
          ]
        }
      },
      "name": "Evening Schedule",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1,
      "position": [250, 400]
    },
    {
      "parameters": {
        "resource": "presence",
        "operation": "set",
        "presence": "offline"
      },
      "name": "Set Offline",
      "type": "n8n-nodes-matrix-bot.matrixBot",
      "typeVersion": 1,
      "position": [450, 400]
    }
  ],
  "connections": {
    "Morning Schedule": {
      "main": [[{"node": "Set Online", "type": "main", "index": 0}]]
    },
    "Evening Schedule": {
      "main": [[{"node": "Set Offline", "type": "main", "index": 0}]]
    }
  }
}
```

## Tips

1. **Testing**: Use the "Execute Node" feature in n8n to test individual operations before building full workflows
2. **Error Handling**: Enable "Continue on Fail" for nodes that might encounter errors in production
3. **Filtering**: Use n8n's IF node to filter messages before processing
4. **Room IDs**: Matrix room IDs start with `!` and look like `!roomid:example.com`
5. **User IDs**: Matrix user IDs start with `@` and look like `@username:example.com`

## Common Use Cases

- **Chat Bot**: Use the trigger node to listen for messages and respond automatically
- **Notifications**: Send alerts to Matrix rooms when events occur in other systems
- **Room Management**: Automate room creation, user invitations, and moderation
- **Integration Hub**: Connect Matrix with other services like webhooks, databases, or APIs
- **Status Updates**: Automatically update presence and profile information
