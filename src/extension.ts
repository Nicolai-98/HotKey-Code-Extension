import * as vscode from 'vscode';

const hotkeyMap: Map<number, string> = new Map();

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "hotkey" is now active!');

	for (let i = 0; i <= 9; i++) {
		const assignCommand = `hotkey.assign${i}`;
		const jumpCommand = `hotkey.jump${i}`;

		context.subscriptions.push(vscode.commands.registerCommand(assignCommand, () => {
			assignHotkey(i);
		}));

		context.subscriptions.push(vscode.commands.registerCommand(jumpCommand, () => {
			jumpToHotkey(i);
		}));
	}
}

function assignHotkey(number: number) {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const filePath = editor.document.uri.toString();
		hotkeyMap.set(number, filePath);
		vscode.window.showInformationMessage(`Assigned hotkey ${number} to ${filePath}`);
	} else {
		vscode.window.showErrorMessage('No active editor to assign a hotkey.');
	}
}

function jumpToHotkey(number: number) {
	const filePath = hotkeyMap.get(number);
	if (filePath) {
		const uri = vscode.Uri.parse(filePath);
		vscode.workspace.openTextDocument(uri).then(doc => {
			vscode.window.showTextDocument(doc);
		});
	} else {
		vscode.window.showErrorMessage(`No file assigned to hotkey ${number}`);
	}
}

export function deactivate() { }
