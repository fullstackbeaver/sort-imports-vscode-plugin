# Formatter: Sort and Align Imports VSCode Extension

This Visual Studio Code extension, **Formatter: Sort and Align Imports**, provides an easy way to format your import statements by sorting them alphabetically and aligning them in a consistent style. This extension is particularly helpful for JavaScript and TypeScript projects where well-organized import statements improve readability.

## Features

- Sorts import statements alphabetically, distinguishing between type and non-type imports.
- Aligns all import statements, ensuring visual consistency.
- Handles destructured imports, aligning them across multiple lines if necessary.

## Installation

### Prerequisites

1. Ensure you have **Node.js** installed, as the extension is built and packaged using `npx vsce`.
2. Install **VS Code** if you haven’t already.

### Building and Installing Locally

Since this extension includes `vsce` (Visual Studio Code Extension Manager) as a dev dependency, we can use `npx` to package it easily without requiring a global installation.

1. **Clone the repository** (or download the code):
   ```bash
   git clone https://github.com/fullstackbeaver/sort-imports-vscode-plugin
   cd formatter-sort-align-imports
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Build the Extension**:
   ```bash
   npx vsce package
   ```

   This command will generate a `.vsix` file in the project directory, which can then be installed as an extension in VS Code.

4. **Install the Extension in VS Code**:
   - Open VS Code.
   - Go to the Extensions sidebar (`View` > `Extensions`).
   - Click on the `...` menu in the top-right corner and select `Install from VSIX...`.
   - Choose the generated `.vsix` file.

## Usage

Once the extension is activated, you can use the following command in the Command Palette (press `Ctrl+Shift+P`):

```plaintext
Formatter: Sort and Align Imports
```

This command will organize and align all selected import statements in the active editor.

## Extension Commands

The extension registers the command `formatter.sortAndAlignFroms` to perform the sorting and alignment.
