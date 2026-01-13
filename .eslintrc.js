module.exports = {
	extends: ['plugin:n8n-nodes-base/community'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		project: './tsconfig.json',
	},
};
