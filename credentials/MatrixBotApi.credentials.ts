import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MatrixBotApi implements ICredentialType {
	name = 'matrixBotApi';
	displayName = 'Matrix Bot API';
	documentationUrl = 'https://github.com/KilianSen/n8n-matrix-proxy-restapi';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'http://localhost:8000',
			placeholder: 'http://localhost:8000',
			description: 'The base URL of the Matrix Bot REST API',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/health',
			method: 'GET',
		},
	};
}
