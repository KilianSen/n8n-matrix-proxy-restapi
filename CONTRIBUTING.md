# Contributing to n8n-nodes-matrix-bot

Thank you for your interest in contributing to this n8n community node! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/n8n-matrix-proxy-restapi.git
   cd n8n-matrix-proxy-restapi
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Build the project**:
   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** to the TypeScript source files in:
   - `credentials/` - for credential types
   - `nodes/MatrixBot/` - for node implementations

3. **Build and test** your changes:
   ```bash
   npm run build
   ```

4. **Format your code**:
   ```bash
   npm run format
   ```

5. **Lint your code**:
   ```bash
   npm run lint
   ```

### Testing Your Changes

To test your changes in n8n:

1. **Link the package** locally:
   ```bash
   npm link
   ```

2. **In your n8n installation directory**:
   ```bash
   npm link n8n-nodes-matrix-bot
   ```

3. **Restart n8n** and your node should appear in the node palette

4. **Test your changes** by creating workflows that use the modified functionality

### Code Style

- Use **tabs for indentation** (not spaces)
- Follow the **existing code style** in the project
- Use **meaningful variable and function names**
- Add **comments** for complex logic
- Keep functions **focused and small**

### Commit Messages

Write clear and descriptive commit messages:
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests when relevant

Example:
```
Add support for message reactions

- Implement reaction operations (add, remove, list)
- Add corresponding API endpoints
- Update documentation with examples

Fixes #123
```

## Types of Contributions

### Bug Fixes

If you find a bug:
1. Check if it's already reported in the [Issues](https://github.com/KilianSen/n8n-matrix-proxy-restapi/issues)
2. If not, create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - n8n version and node version
3. Submit a PR with the fix

### New Features

Before adding a new feature:
1. Check if it aligns with the Matrix Bot REST API capabilities
2. Open an issue to discuss the feature
3. Wait for feedback before implementing
4. Submit a PR with:
   - The feature implementation
   - Documentation updates
   - Usage examples

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add more examples
- Improve setup instructions
- Translate documentation (if applicable)

### Testing

Help improve test coverage:
- Add test cases for existing features
- Test on different platforms
- Report compatibility issues

## Project Structure

```
├── credentials/              # Credential type definitions
│   └── MatrixBotApi.credentials.ts
├── nodes/
│   └── MatrixBot/           # Node implementations
│       ├── MatrixBot.node.ts        # Main action node
│       ├── MatrixBotTrigger.node.ts # Trigger node
│       └── matrix.svg               # Node icon
├── dist/                    # Compiled JavaScript (generated)
├── package.json            # Package configuration
├── tsconfig.json          # TypeScript configuration
├── gulpfile.js            # Build configuration
└── README.md              # Main documentation
```

## Pull Request Process

1. **Update documentation** if you've added or changed functionality
2. **Ensure all tests pass** and the build completes successfully
3. **Update EXAMPLES.md** if you've added new operations
4. **Create a pull request** with:
   - Clear description of changes
   - Link to related issues
   - Screenshots or examples if relevant
5. **Wait for review** - maintainers will review your PR and may request changes
6. **Address feedback** - make requested changes and push updates
7. **Merge** - once approved, your PR will be merged

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

- **Be respectful** and considerate of others
- **Be collaborative** and constructive in discussions
- **Accept constructive criticism** gracefully
- **Focus on what's best** for the community
- **Show empathy** towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or derogatory comments
- Trolling, insulting comments, or personal attacks
- Publishing others' private information
- Other conduct which could be considered inappropriate

## Questions?

If you have questions:
- Check the [README](README.md) and [EXAMPLES](EXAMPLES.md)
- Look through existing [Issues](https://github.com/KilianSen/n8n-matrix-proxy-restapi/issues)
- Open a new issue with the "question" label

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in the project's README and release notes.

Thank you for contributing! 🎉
