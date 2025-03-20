# Expo Tools VSCode Extension

A Visual Studio Code extension that helps you create and manage Expo applications directly from your IDE.

## ⚠️ Development Status

This extension is currently under active development. Features and functionality may change or be incomplete.

### Current Features
- Create new Expo applications from template
- Choose between creating in new folder or current workspace
- Automatic dependency installation
- Project name customization

### Planned Features
- Expo project management
- Development server controls
- Build and deployment tools
- Project templates selection

## Installation

You can install this extension in several ways:

1. **Via VSCode Marketplace**:
   - Open VSCode
   - Open Extension Marketplace (Ctrl+Shift+X)
   - Search for "Expo Tools for VSCode"
   - Click Install

2. **Via Direct Link**:
   - Visit [Expo Tools on VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=dunningkrueg.expo-tools)
   - Click Install

3. **Via Command Palette**:
   - Press Ctrl+P to open Quick Open
   - Type `ext install dunningkrueg.expo-tools`
   - Press Enter

4. **For Development**:
   - Clone this repository
   - Open the project in VSCode
   - Press F5 to start debugging
   - A new VSCode window will open with the extension loaded

## Usage

1. Open the Command Palette (Ctrl+Shift+P)
2. Type "Create New Expo App"
3. Enter your application name
4. Choose where to create the app (new folder or current workspace)
5. Wait for the template to be downloaded and customized
6. Choose whether to install dependencies automatically

## Requirements

- Visual Studio Code 1.85.0 or higher
- Node.js and npm installed
- Git installed

## Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Git

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open in VSCode:
   ```bash
   code .
   ```
4. Press F5 to start debugging

### Project Structure
```
expo-tools/
├── commands/         # Command implementations
├── git/             # Git operations
├── helpers/         # Helper functions
├── utils/           # Utility functions
└── .vscode/         # VSCode configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details. This license provides more comprehensive protection and is suitable for both commercial and non-commercial use.

## Support

Since this is a development version, please report issues on the GitHub repository. 