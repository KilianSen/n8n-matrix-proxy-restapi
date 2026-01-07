import {
	ITriggerFunctions,
	INodeType,
	INodeTypeDescription,
	ITriggerResponse,
	IDataObject,
} from 'n8n-workflow';

export class MatrixBotTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Matrix Bot Trigger',
		name: 'matrixBotTrigger',
		icon: 'file:matrix.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '=Poll for new messages every {{$parameter["pollInterval"]}}s',
		description: 'Triggers when new messages are received in Matrix',
		defaults: {
			name: 'Matrix Bot Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'matrixBotApi',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Poll Interval',
				name: 'pollInterval',
				type: 'number',
				default: 10,
				description: 'How often to check for new messages (in seconds)',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Return All Messages on First Poll',
						name: 'returnAllOnFirstPoll',
						type: 'boolean',
						default: false,
						description: 'Whether to return all existing messages on the first poll or only new messages from that point forward',
					},
					{
						displayName: 'Filter by Room',
						name: 'filterByRoom',
						type: 'string',
						default: '',
						placeholder: '!roomid:example.com',
						description: 'Only return messages from a specific room ID (leave empty for all rooms)',
					},
					{
						displayName: 'Filter by Sender',
						name: 'filterBySender',
						type: 'string',
						default: '',
						placeholder: '@user:example.com',
						description: 'Only return messages from a specific sender (leave empty for all senders)',
					},
				],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const pollInterval = this.getNodeParameter('pollInterval') as number;
		const options = this.getNodeParameter('options', {}) as IDataObject;
		const returnAllOnFirstPoll = options.returnAllOnFirstPoll as boolean || false;
		const filterByRoom = options.filterByRoom as string || '';
		const filterBySender = options.filterBySender as string || '';

		const credentials = await this.getCredentials('matrixBotApi');
		const baseUrl = credentials.apiUrl as string;

		// Keep track of processed message IDs to avoid duplicates
		const processedMessageIds = new Set<string>();
		let isFirstPoll = true;

		const pollForMessages = async () => {
			try {
				// Fetch messages from the API
				const options = {
					method: 'GET',
					uri: `${baseUrl}/messages`,
					json: true,
				};

				const response = await this.helpers.request(options);
				
				// The API returns messages in a format we need to handle
				let messages: IDataObject[] = [];
				
				// Handle different response formats
				if (Array.isArray(response)) {
					messages = response;
				} else if (response.messages && Array.isArray(response.messages)) {
					messages = response.messages;
				} else if (typeof response === 'object') {
					// If it's a single message object, wrap it in an array
					messages = [response];
				}

				// Filter and process messages
				const newMessages: IDataObject[] = [];

				for (const message of messages) {
					// Create a unique ID for the message (event_id or combination of room + timestamp + sender)
					const messageId = message.event_id as string || 
						`${message.room_id}_${message.timestamp}_${message.sender}`;

					// Skip if we've already processed this message
					if (processedMessageIds.has(messageId)) {
						continue;
					}

					// Apply filters if specified
					if (filterByRoom && message.room_id !== filterByRoom) {
						continue;
					}

					if (filterBySender && message.sender !== filterBySender) {
						continue;
					}

					// On first poll, only add messages if returnAllOnFirstPoll is true
					if (isFirstPoll && !returnAllOnFirstPoll) {
						processedMessageIds.add(messageId);
						continue;
					}

					// Mark as processed and add to new messages
					processedMessageIds.add(messageId);
					newMessages.push(message);
				}

				isFirstPoll = false;

				// Emit new messages
				if (newMessages.length > 0) {
					this.emit([this.helpers.returnJsonArray(newMessages)]);
				}

				// Clean up old message IDs to prevent memory leak (keep last 1000)
				if (processedMessageIds.size > 1000) {
					const idsArray = Array.from(processedMessageIds);
					const toKeep = idsArray.slice(-1000);
					processedMessageIds.clear();
					toKeep.forEach(id => processedMessageIds.add(id));
				}
			} catch (error) {
				// Log error but don't stop polling
				this.logger.error(`Error polling for messages: ${error.message}`);
			}
		};

		// Initial poll
		await pollForMessages();

		// Set up interval for subsequent polls
		const intervalId = setInterval(pollForMessages, pollInterval * 1000);

		// Define the closeFunction that will be called when the trigger is deactivated
		async function closeFunction() {
			clearInterval(intervalId);
		}

		return {
			closeFunction,
		};
	}
}
