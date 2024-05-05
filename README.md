# Iridium Templates

Iridium Templates is a simple templating engine for static HTML websites. It allows you to define reusable HTML templates and use them in your HTML files.

## Features

- **Show Templated Preview**: This command compiles the current HTML file with templates and displays the compiled HTML in a webview.
- **Open Templated Preview File**: This command compiles the current HTML file with templates and opens the compiled HTML in a new editor.
- **Build Templated Site**: This command compiles all HTML files in the workspace with templates and writes the compiled HTML to a `.build` directory.

## Usage

To use a template in your HTML files, use the `<template.id>` tag, where `id` is the id of the template. The template file should be located at `.templates/id.html`.

For example, to use the `header` template, you would use the `<template.header>` tag in your HTML file, and the template file would be located at `.templates/header.html`.

### Parameters

You can use parameters like `<template.id parameterName="red"></template.id>`. This content can then be rendered in the template. Example: `<p style="color: {{parameterName}};">This text is red.</p>`.

A planned feature will be "IF" statements and dynamic templates, but these are currently not supported.


### Content

The `{{content}}` placeholder is always filled with all the child items from the <template.name>**CONTENT**</template.name>.

## Configuration

You can configure the output directory for the compiled HTML files by setting the `iridium-templates.outputDirectory` setting in your settings.json file. If the setting is not set, the default value `.build` will be used.

## Recommended Extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Integrates ESLint JavaScript into VS Code.
- [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner): A test runner for VS Code extensions.

## Development

To compile the TypeScript code, run `npm run compile`.

To run the tests, run `npm test`.

**Created by Sojourner Development** (sojourner.dev)