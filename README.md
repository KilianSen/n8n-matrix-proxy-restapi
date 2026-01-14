# n8n-nodes-matrix-bot

This is an n8n community node that lets you interact with Matrix chat via a REST API proxy.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Features

This package provides two nodes for n8n:

### Matrix Bot Node
A regular action node that allows you to:
- **Authentication**: Login to Matrix server with credentials or access token, logout from Matrix
- **Messages**: Send messages, get all received messages
- **Rooms**: Create, join, leave rooms; manage room settings (name, topic); get room info, members, and messages
- **Room Moderation**: Invite, kick, ban, and unban users
- **Presence**: Set online/offline/unavailable status
- **Profile**: Get user profiles, set display name
- **Devices**: List and delete devices, manage device verification (SAS verification with emoji/decimal comparison)
- **Device Verification**: Start, accept, confirm, or cancel interactive device verification; trust devices in rooms; get verification sessions
- **Utilities**: Health checks, typing notifications, mark messages as read

### Matrix Bot Trigger Node
A trigger node that polls for new messages at configurable intervals:
- Polls the Matrix API for new messages automatically
- Configurable polling interval
- Filter messages by room or sender
- Option to return all existing messages on first poll or only new messages
- Automatically tracks processed messages to avoid duplicates

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Install via n8n UI

1. Go to **Settings > Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-matrix-bot` in the **npm Package Name** field
4. Agree to the risks and click **Install**

### Manual Installation

To install the node locally for development:

```bash
# Clone the repository
git clone https://github.com/KilianSen/n8n-matrix-proxy-restapi.git
cd n8n-matrix-proxy-restapi

# Install dependencies
npm install

# Build the node
npm run build

# Link the package
npm link
```

Then in your n8n installation directory:
```bash
npm link n8n-nodes-matrix-bot
```

## Prerequisites

You need to have a Matrix Bot REST API server running. This node communicates with the API described in the `openapi.json` file in this repository.

The API should be running and accessible from your n8n instance.

## Configuration

### Credentials

This node requires the Matrix Bot API credentials:

1. **API URL**: The base URL of your Matrix Bot REST API server (e.g., `http://localhost:8000`)

The node will automatically test the connection using the `/health` endpoint.

## Usage

### Matrix Bot Node

#### Login to Matrix
1. Select **Authentication** as the resource
2. Select **Login** as the operation
3. Enter the **Homeserver** URL (e.g., `https://matrix.org`)
4. Enter your **User ID** (e.g., `@user:example.com`)
5. Enter either **Password** or **Access Token**
6. Optionally configure **Device ID** and **Store Path** in Additional Fields

#### Logout from Matrix
1. Select **Authentication** as the resource
2. Select **Logout** as the operation

#### Send a Message
1. Select **Message** as the resource
2. Select **Send** as the operation
3. Enter the **Room ID** (e.g., `!roomid:example.com`)
4. Enter your **Message** text

#### Poll for Messages (Trigger)
1. Add the **Matrix Bot Trigger** node to your workflow
2. Configure the **Poll Interval** (how often to check for messages in seconds)
3. Optionally filter by room or sender
4. The trigger will emit new messages as they arrive

#### Create a Room
1. Select **Room** as the resource
2. Select **Create** as the operation
3. Configure room name, topic, visibility, and initial invites

#### Join a Room
1. Select **Room** as the resource
2. Select **Join** as the operation
3. Enter the **Room ID** to join

#### Set Presence
1. Select **Presence** as the resource
2. Select **Set** as the operation
3. Choose presence status (online, offline, unavailable)

#### Device Verification
The node supports interactive device verification (SAS - Short Authentication String):

##### Start Device Verification
1. Select **Device** as the resource
2. Select **Start Verification** as the operation
3. Enter the **User ID** to verify
4. Enter the **Device ID** to verify
5. The response will include a transaction ID for subsequent steps

##### Get Verification Emoji/Decimals
1. Select **Device** as the resource
2. Select **Get Verification Emoji** or **Get Verification Decimals**
3. Enter the **Transaction ID** from the start verification step
4. Compare the emoji or decimals shown on both devices

##### Confirm or Cancel Verification
1. Select **Device** as the resource
2. Select **Confirm Verification** or **Cancel Verification**
3. Enter the **Transaction ID**
4. For cancellation, optionally provide a **Reason**

##### Trust Room Devices
1. Select **Device** as the resource
2. Select **Trust Room Devices** as the operation
3. Enter the **Room ID**
4. This will trust all devices of all users in the room (use with caution)

### Matrix Bot Trigger Node

The trigger node continuously polls for new messages and emits them to the workflow:

1. Add the **Matrix Bot Trigger** node as the start of your workflow
2. Set the **Poll Interval** (default: 10 seconds)
3. Configure options:
   - **Return All Messages on First Poll**: Get existing messages immediately or wait for new ones
   - **Filter by Room**: Only receive messages from a specific room
   - **Filter by Sender**: Only receive messages from a specific user
4. Connect subsequent nodes to process incoming messages

Example workflow:
```
Matrix Bot Trigger → Filter (optional) → Send Response → Matrix Bot (Send)
```

## Compatibility

- Tested with n8n version 1.0.0 and above
- Requires Node.js 18.x or higher

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Matrix Protocol](https://matrix.org/)
* [OpenAPI Specification](./openapi.json)

## Development

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Watch for changes
npm run dev

# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lintfix
```

## License

[MIT](LICENSE)

## Version History

### 1.0.0
- Initial release
- Matrix Bot action node with full API support
- Matrix Bot Trigger node for polling messages
- Support for all Matrix Bot REST API endpoints