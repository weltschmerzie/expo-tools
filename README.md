# Expo Tools VSCode Extension

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://marketplace.visualstudio.com/items?itemName=dunningkrueg.expo-tools)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/dunningkrueg/expo-tools/actions)
[![Marketplace](https://img.shields.io/badge/marketplace-VSCode-blue.svg)](https://marketplace.visualstudio.com/items?itemName=dunningkrueg.expo-tools)
[![Installs](https://img.shields.io/badge/installs-10k%2B-brightgreen.svg)](https://marketplace.visualstudio.com/items?itemName=dunningkrueg.expo-tools)

A Visual Studio Code extension that helps you create and manage Expo applications directly from your IDE.

## ⚠️ Development Status

This extension is currently under active development. Features and functionality may change or be incomplete.

### Current Features
- Create new Expo applications from template
- Choose between creating in new folder or current workspace
- Automatic dependency installation
- Project name customization
- Run Expo Doctor to diagnose project issues
- Build and Deploy Expo apps to iOS, Android, and Web platforms

### Planned Features
- Expo project management
- Development server controls
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

### Creating a New App
1. Open the Command Palette (Ctrl+Shift+P)
2. Type "Create New Expo App"
3. Enter your application name
4. Choose where to create the app (new folder or current workspace)
5. Wait for the template to be downloaded and customized
6. Choose whether to install dependencies automatically

### Running Expo Doctor
1. Open your Expo project in VSCode
2. Open the Command Palette (Ctrl+Shift+P)
3. Type "Run Expo Doctor"
4. View the diagnostic results in the output panel

### Building and Deploying
1. Open your Expo project in VSCode
2. Open the Command Palette (Ctrl+Shift+P)
3. Type "Build and Deploy Expo App"
4. Select the platform (iOS, Android, or Web)
5. Choose the build type (Development, Preview, or Production)
6. For iOS/Android, select additional build options
7. Wait for the build to complete
8. For web builds, you can optionally deploy to:
   - Expo Hosting
   - GitHub Pages
   - Netlify
   - Vercel

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