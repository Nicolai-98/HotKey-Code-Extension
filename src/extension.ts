import * as vscode from 'vscode';

const hotkeyMap: Map<number, string> = new Map();
var hotkeyBarMap: Map<number, vscode.StatusBarItem> = new Map();

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "hotkey" is now active!');

	for (let i = 0; i <= 9; i++) {
		const assignCommand = `hotkey.assign${i}`;
		const jumpCommand = `hotkey.jump${i}`;

		// Register command specified in package.json (Standard: <cntrl>+<number>) to assign a hotkey to the currently opened file.
		context.subscriptions.push(vscode.commands.registerCommand(assignCommand, () => {
			assignHotkey(i);
		}));

		// Register command specified in package.json (Standard: <shift>+<number>) to jump to the file assigned to the hotkey previously.
		context.subscriptions.push(vscode.commands.registerCommand(jumpCommand, () => {
			jumpToHotkey(i);
		}));
	}
}

function getFileNameFromUri(uri: string) {
	return vscode.Uri.parse(uri, true).path.split('/').pop() || '';
}

function assignHotkey(number: number) {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const filePath = editor.document.uri.toString();
		const fileName = getFileNameFromUri(filePath);
		if (hotkeyMap.has(number)) {
			const previousFileName = getFileNameFromUri(hotkeyMap.get(number) || '');
			vscode.window.showInformationMessage(`Reassigned hotkey ${number} from ${previousFileName} to ${fileName}`);
		} else {
			vscode.window.showInformationMessage(`Assigned hotkey ${number} to ${fileName}`);
		}
		hotkeyMap.set(number, filePath);
		updateHotkeyBarItem(number, fileName);
	} else {
		// This code should be unreachable because the command is disabled when there is no active editor.
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

function updateHotkeyBarItem(number: number, fileName: string) {
	if (hotkeyBarMap.has(number)) {
		hotkeyBarMap.get(number)?.dispose();
	}
	let hotkeyBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 10 - number)
	hotkeyBarMap.set(number, hotkeyBar);
	hotkeyBar.text = `${number}: ${fileName}`;
	hotkeyBar.show();
}

export function deactivate() { }
