import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
	IHttpRequestMethods,
} from 'n8n-workflow';

export class MatrixBot implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Matrix Bot',
		name: 'matrixBot',
		icon: 'file:matrix.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Matrix chat via REST API',
		defaults: {
			name: 'Matrix Bot',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'matrixBotApi',
				required: true,
			},
		],
		properties: [
			// Resource selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Authentication',
						value: 'authentication',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Room',
						value: 'room',
					},
					{
						name: 'Presence',
						value: 'presence',
					},
					{
						name: 'Profile',
						value: 'profile',
					},
					{
						name: 'Device',
						value: 'device',
					},
					{
						name: 'Info',
						value: 'info',
					},
				],
				default: 'message',
			},

			// Authentication Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
					},
				},
				options: [
					{
						name: 'Login',
						value: 'login',
						description: 'Login to Matrix with credentials or access token',
						action: 'Login to Matrix',
					},
					{
						name: 'Logout',
						value: 'logout',
						description: 'Logout from Matrix',
						action: 'Logout from Matrix',
					},
				],
				default: 'login',
			},

			// Authentication: Login operation fields
			{
				displayName: 'Homeserver',
				name: 'homeserver',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				placeholder: 'https://matrix.example.com',
				description: 'Matrix homeserver URL',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				placeholder: '@user:example.com',
				description: 'Matrix user ID',
			},
			{
				displayName: 'Authentication Method',
				name: 'authMethod',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				options: [
					{
						name: 'Password',
						value: 'password',
					},
					{
						name: 'Access Token',
						value: 'accessToken',
					},
				],
				default: 'password',
				description: 'Method to authenticate with Matrix',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
						authMethod: ['password'],
					},
				},
				default: '',
				description: 'Password for Matrix login',
			},
			{
				displayName: 'Access Token',
				name: 'accessToken',
				type: 'string',
				typeOptions: {
					password: true,
				},
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
						authMethod: ['accessToken'],
					},
				},
				default: '',
				description: 'Existing Matrix access token',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				options: [
					{
						displayName: 'Device ID',
						name: 'deviceId',
						type: 'string',
						default: '',
						description: 'Device ID for consistent encryption',
					},
					{
						displayName: 'Store Path',
						name: 'storePath',
						type: 'string',
						default: '',
						description: 'Path to store encryption keys',
					},
				],
			},

			// Message Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message to a room',
						action: 'Send a message',
					},
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all received messages from queue',
						action: 'Get all messages',
					},
				],
				default: 'send',
			},

			// Room Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['room'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new room',
						action: 'Create a room',
					},
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get information about a room',
						action: 'Get room info',
					},
					{
						name: 'Get List',
						value: 'getList',
						description: 'Get list of joined rooms',
						action: 'Get list of rooms',
					},
					{
						name: 'Get Members',
						value: 'getMembers',
						description: 'Get list of members in a room',
						action: 'Get room members',
					},
					{
						name: 'Get Messages',
						value: 'getMessages',
						description: 'Get message history from a room',
						action: 'Get room messages',
					},
					{
						name: 'Join',
						value: 'join',
						description: 'Join a room',
						action: 'Join a room',
					},
					{
						name: 'Leave',
						value: 'leave',
						description: 'Leave a room',
						action: 'Leave a room',
					},
					{
						name: 'Invite User',
						value: 'invite',
						description: 'Invite a user to a room',
						action: 'Invite user to room',
					},
					{
						name: 'Kick User',
						value: 'kick',
						description: 'Kick a user from a room',
						action: 'Kick user from room',
					},
					{
						name: 'Ban User',
						value: 'ban',
						description: 'Ban a user from a room',
						action: 'Ban user from room',
					},
					{
						name: 'Unban User',
						value: 'unban',
						description: 'Unban a user from a room',
						action: 'Unban user from room',
					},
					{
						name: 'Set Name',
						value: 'setName',
						description: 'Set the name of a room',
						action: 'Set room name',
					},
					{
						name: 'Set Topic',
						value: 'setTopic',
						description: 'Set the topic of a room',
						action: 'Set room topic',
					},
					{
						name: 'Send Typing',
						value: 'sendTyping',
						description: 'Send typing notification',
						action: 'Send typing notification',
					},
					{
						name: 'Mark as Read',
						value: 'markAsRead',
						description: 'Mark a message as read',
						action: 'Mark message as read',
					},
				],
				default: 'getList',
			},

			// Presence Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['presence'],
					},
				},
				options: [
					{
						name: 'Set',
						value: 'set',
						description: 'Set user presence status',
						action: 'Set presence',
					},
				],
				default: 'set',
			},

			// Profile Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['profile'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get user profile',
						action: 'Get profile',
					},
					{
						name: 'Set Display Name',
						value: 'setDisplayName',
						description: "Set the bot's display name",
						action: 'Set display name',
					},
				],
				default: 'get',
			},

			// Device Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['device'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get list of devices',
						action: 'Get all devices',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a device',
						action: 'Delete a device',
					},
				],
				default: 'getAll',
			},

			// Info Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['info'],
					},
				},
				options: [
					{
						name: 'Get Bot Info',
						value: 'getBotInfo',
						description: 'Get information about the bot',
						action: 'Get bot info',
					},
					{
						name: 'Health Check',
						value: 'healthCheck',
						description: 'Check API health status',
						action: 'Health check',
					},
				],
				default: 'healthCheck',
			},

			// Message: Send operation fields
			{
				displayName: 'Room ID',
				name: 'roomId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
				placeholder: '!roomid:example.com',
				description: 'The Matrix room ID to send the message to',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
				typeOptions: {
					rows: 4,
				},
				description: 'The message content to send',
			},

			// Room: Create operation fields
			{
				displayName: 'Room Name',
				name: 'roomName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The name for the new room',
			},
			{
				displayName: 'Room Topic',
				name: 'roomTopic',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The topic for the new room',
			},
			{
				displayName: 'Is Public',
				name: 'isPublic',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['create'],
					},
				},
				default: false,
				description: 'Whether the room should be public',
			},
			{
				displayName: 'Invite Users',
				name: 'inviteUsers',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['create'],
					},
				},
				default: '',
				placeholder: '@user1:example.com,@user2:example.com',
				description: 'Comma-separated list of user IDs to invite',
			},

			// Room: Join operation fields
			{
				displayName: 'Room ID',
				name: 'roomId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['join'],
					},
				},
				default: '',
				placeholder: '!roomid:example.com',
				description: 'The Matrix room ID to join',
			},

			// Room: Common Room ID field for operations that need it
			{
				displayName: 'Room ID',
				name: 'roomId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['room'],
						operation: [
							'getInfo',
							'getMembers',
							'getMessages',
							'leave',
							'invite',
							'kick',
							'ban',
							'unban',
							'setName',
							'setTopic',
							'sendTyping',
							'markAsRead',
						],
					},
				},
				default: '',
				placeholder: '!roomid:example.com',
				description: 'The Matrix room ID',
			},

			// Room: Get Messages fields
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['getMessages'],
					},
				},
				default: 50,
				description: 'Maximum number of messages to retrieve',
			},
			{
				displayName: 'Start Token',
				name: 'start',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['getMessages'],
					},
				},
				default: '',
				description: 'Pagination token for fetching earlier messages',
			},

			// Room: User operations fields
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['invite', 'kick', 'ban', 'unban'],
					},
				},
				default: '',
				placeholder: '@user:example.com',
				description: 'The Matrix user ID',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['kick', 'ban'],
					},
				},
				default: '',
				description: 'Optional reason for the action',
			},

			// Room: Set Name field
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['setName'],
					},
				},
				default: '',
				description: 'The new name for the room',
			},

			// Room: Set Topic field
			{
				displayName: 'Topic',
				name: 'topic',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['setTopic'],
					},
				},
				default: '',
				description: 'The new topic for the room',
			},

			// Room: Send Typing fields
			{
				displayName: 'Typing',
				name: 'typing',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['sendTyping'],
					},
				},
				default: true,
				description: 'Whether the user is typing',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['sendTyping'],
					},
				},
				default: 5000,
				description: 'Typing timeout in milliseconds',
			},

			// Room: Mark as Read field
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['room'],
						operation: ['markAsRead'],
					},
				},
				default: '',
				placeholder: '$eventid',
				description: 'The event ID to mark as read',
			},

			// Presence: Set operation fields
			{
				displayName: 'Presence',
				name: 'presence',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['presence'],
						operation: ['set'],
					},
				},
				options: [
					{
						name: 'Online',
						value: 'online',
					},
					{
						name: 'Offline',
						value: 'offline',
					},
					{
						name: 'Unavailable',
						value: 'unavailable',
					},
				],
				default: 'online',
				description: 'The presence status to set',
			},

			// Profile: Get operation fields
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['get'],
					},
				},
				default: '',
				placeholder: '@user:example.com',
				description: 'User ID to get profile for (leave empty for bot profile)',
			},

			// Profile: Set Display Name field
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['profile'],
						operation: ['setDisplayName'],
					},
				},
				default: '',
				description: 'The new display name for the bot',
			},

			// Device: Delete operation field
			{
				displayName: 'Device ID',
				name: 'deviceId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['device'],
						operation: ['delete'],
					},
				},
				default: '',
				description: 'The device ID to delete',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const credentials = await this.getCredentials('matrixBotApi');
		const baseUrl = credentials.apiUrl as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let endpoint = '';
				let method: IHttpRequestMethods = 'GET';
				let body: IDataObject = {};
				let qs: IDataObject = {};

				// Authentication operations
				if (resource === 'authentication') {
					if (operation === 'login') {
						endpoint = '/login';
						method = 'POST';
						const homeserver = this.getNodeParameter('homeserver', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						const authMethod = this.getNodeParameter('authMethod', i) as string;
						const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

						body = {
							homeserver,
							user_id: userId,
						};

						if (authMethod === 'password') {
							const password = this.getNodeParameter('password', i) as string;
							body.password = password;
						} else if (authMethod === 'accessToken') {
							const accessToken = this.getNodeParameter('accessToken', i) as string;
							body.access_token = accessToken;
						}

						if (additionalOptions.deviceId) {
							body.device_id = additionalOptions.deviceId;
						}
						if (additionalOptions.storePath) {
							body.store_path = additionalOptions.storePath;
						}
					} else if (operation === 'logout') {
						endpoint = '/logout';
						method = 'POST';
					}
				}

				// Message operations
				else if (resource === 'message') {
					if (operation === 'send') {
						endpoint = '/messages/send';
						method = 'POST';
						body = {
							room_id: this.getNodeParameter('roomId', i) as string,
							message: this.getNodeParameter('message', i) as string,
						};
					} else if (operation === 'getAll') {
						endpoint = '/messages';
						method = 'GET';
					}
				}

				// Room operations
				else if (resource === 'room') {
					if (operation === 'create') {
						endpoint = '/rooms/create';
						method = 'POST';
						const roomName = this.getNodeParameter('roomName', i, '') as string;
						const roomTopic = this.getNodeParameter('roomTopic', i, '') as string;
						const isPublic = this.getNodeParameter('isPublic', i, false) as boolean;
						const inviteUsers = this.getNodeParameter('inviteUsers', i, '') as string;

						body = {
							is_public: isPublic,
						};
						if (roomName) body.name = roomName;
						if (roomTopic) body.topic = roomTopic;
						if (inviteUsers) {
							body.invite = inviteUsers.split(',').map((u) => u.trim());
						}
					} else if (operation === 'getList') {
						endpoint = '/rooms';
						method = 'GET';
					} else if (operation === 'getInfo') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/info`;
						method = 'GET';
					} else if (operation === 'getMembers') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/members`;
						method = 'GET';
					} else if (operation === 'getMessages') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;
						const start = this.getNodeParameter('start', i, '') as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/messages`;
						method = 'GET';
						qs.limit = limit;
						if (start) qs.start = start;
					} else if (operation === 'join') {
						endpoint = '/rooms/join';
						method = 'POST';
						body = {
							room_id: this.getNodeParameter('roomId', i) as string,
						};
					} else if (operation === 'leave') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/leave`;
						method = 'POST';
					} else if (operation === 'invite') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/invite`;
						method = 'POST';
						body = {
							user_id: this.getNodeParameter('userId', i) as string,
						};
					} else if (operation === 'kick') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/kick`;
						method = 'POST';
						const reason = this.getNodeParameter('reason', i, '') as string;
						body = {
							user_id: this.getNodeParameter('userId', i) as string,
						};
						if (reason) body.reason = reason;
					} else if (operation === 'ban') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/ban`;
						method = 'POST';
						const reason = this.getNodeParameter('reason', i, '') as string;
						body = {
							user_id: this.getNodeParameter('userId', i) as string,
						};
						if (reason) body.reason = reason;
					} else if (operation === 'unban') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/unban`;
						method = 'POST';
						body = {
							user_id: this.getNodeParameter('userId', i) as string,
						};
					} else if (operation === 'setName') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/name`;
						method = 'PUT';
						body = {
							name: this.getNodeParameter('name', i) as string,
						};
					} else if (operation === 'setTopic') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/topic`;
						method = 'PUT';
						body = {
							topic: this.getNodeParameter('topic', i) as string,
						};
					} else if (operation === 'sendTyping') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/typing`;
						method = 'POST';
						body = {
							typing: this.getNodeParameter('typing', i) as boolean,
							timeout: this.getNodeParameter('timeout', i) as number,
						};
					} else if (operation === 'markAsRead') {
						const roomId = this.getNodeParameter('roomId', i) as string;
						endpoint = `/rooms/${encodeURIComponent(roomId)}/read`;
						method = 'POST';
						body = {
							event_id: this.getNodeParameter('eventId', i) as string,
						};
					}
				}

				// Presence operations
				else if (resource === 'presence') {
					if (operation === 'set') {
						endpoint = '/presence';
						method = 'POST';
						body = {
							presence: this.getNodeParameter('presence', i) as string,
						};
					}
				}

				// Profile operations
				else if (resource === 'profile') {
					if (operation === 'get') {
						endpoint = '/profile';
						method = 'GET';
						const userId = this.getNodeParameter('userId', i, '') as string;
						if (userId) {
							qs.user_id = userId;
						}
					} else if (operation === 'setDisplayName') {
						endpoint = '/profile/displayname';
						method = 'PUT';
						body = {
							displayname: this.getNodeParameter('displayName', i) as string,
						};
					}
				}

				// Device operations
				else if (resource === 'device') {
					if (operation === 'getAll') {
						endpoint = '/devices';
						method = 'GET';
					} else if (operation === 'delete') {
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						endpoint = `/devices/${encodeURIComponent(deviceId)}`;
						method = 'DELETE';
					}
				}

				// Info operations
				else if (resource === 'info') {
					if (operation === 'healthCheck') {
						endpoint = '/health';
						method = 'GET';
					} else if (operation === 'getBotInfo') {
						endpoint = '/info';
						method = 'GET';
					}
				}

				// Make the API request
				const options = {
					method,
					body: body && Object.keys(body).length > 0 ? body : undefined,
					qs: qs && Object.keys(qs).length > 0 ? qs : undefined,
					uri: `${baseUrl}${endpoint}`,
					json: true,
				};

				const responseData = await this.helpers.request(options);
				returnData.push(responseData as IDataObject);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ error: errorMessage });
					continue;
				}
				throw new NodeOperationError(
					this.getNode(),
					error instanceof Error ? error : new Error(String(error)),
				);
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
