// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "iridium-templates" is now active!');

    /*
	let disposable = vscode.commands.registerCommand('iridium.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Iridium.Templates!');
	});
    

	context.subscriptions.push(disposable);
    */

    let disposable = vscode.commands.registerCommand('iridium.showPreview', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const replacedText = replaceTemplates(text);

            // Create and show a new webview
            const panel = vscode.window.createWebviewPanel(
                'iridiumPreview', // Identifies the type of the webview. Used internally
                'Preview', // Title of the panel displayed to the user
                vscode.ViewColumn.Two, // Editor column to show the new webview panel in.
                {} // Webview options. More on these later.
            );

            // Set its HTML content
            panel.webview.html = replacedText;
        }
   
    });

    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('iridium.buildSingle', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const replacedText = replaceTemplates(text);

            // Write the compiled HTML to a file
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders) {
                const previewFilePath = path.join(workspaceFolders[0].uri.fsPath, 'preview.html');
                fs.writeFileSync(previewFilePath, replacedText);

                // Open the file in VS Code
                const previewFileUri = vscode.Uri.file(previewFilePath);
                const previewDocument = await vscode.workspace.openTextDocument(previewFileUri);
                vscode.window.showTextDocument(previewDocument);
            }
        }     
    });

    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('iridium.buildTemplatedSite', () => {
        const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
        const config = vscode.workspace.getConfiguration('iridium-templates');
        const outputDirectory = config.get<string>('outputDirectory') || '.build';
        const outputPath = path.join(workspaceRoot, outputDirectory);
        buildTemplatedSite(workspaceRoot, outputPath);
    });

    context.subscriptions.push(disposable);
}

function buildTemplatedSite(dirPath: string, outputPath: string) {
    fs.readdirSync(dirPath).forEach(file => {
        const absolutePath = path.join(dirPath, file);
        const relativePath = path.relative(dirPath, absolutePath); // this is wrong when called from buildTemplatedSite
        const outputFilePath = path.join(outputPath, relativePath);

        if (fs.statSync(absolutePath).isDirectory()) {
            // check if directory is not .templates
            if (file === '.templates') {
                return;
            }

            if (!fs.existsSync(outputFilePath)) {
                fs.mkdirSync(outputFilePath, { recursive: true });
            }
            buildTemplatedSite(absolutePath, outputFilePath);
        } else if (path.extname(absolutePath) === '.html' && !relativePath.startsWith('.templates')) {
            const text = fs.readFileSync(absolutePath, 'utf-8');
            const replacedText = replaceTemplates(text);
            fs.writeFileSync(outputFilePath, replacedText);
        } else {
            fs.copyFileSync(absolutePath, outputFilePath);
        }
    });
}

function replaceTemplates(text: string): string {
    const templateRegex = /<template\.([a-zA-Z0-9]+)([^>]*)>([\s\S]*?)<\/template\.\1>/g;
    return text.replace(templateRegex, (match, id, parameters, content) => {
        const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
        const templatePath = path.resolve(workspaceRoot, '.templates', `${id}.html`);
        console.log(`Looking for: ${templatePath}`);
        if (fs.existsSync(templatePath)) {
            console.log(`Template file found at: ${templatePath}`);
            let template = fs.readFileSync(templatePath, 'utf-8');
            console.log(`Loaded template: ${template}`);
            const params = parameters.trim().split(' ').map((param: string) => param.split('='));
            params.forEach(([key, value]: [string, string]) => {
                if (key && value) {
                    console.log(`Replacing parameter: ${key} with value: ${value}`);
 template = template.replace(new RegExp(`{{${key}}}`, 'g'), value.replace(/"/g, ''));
                }
            });
            console.log(`Replacing content with: ${content}`);
            template = template.replace(/{{content}}/g, content);
            return template;
        }
        console.log(`Template file not found`);
        return match;
    });
}

// This method is called when your extension is deactivated
export function deactivate() {}
