import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('formatter.sortAndAlignFroms', () => {
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document             = editor.document;
      const selection            = editor.selection;
      const text                 = document.getText(selection);
      const sortedAndAlignedText = sortAndAlignFroms(text);

      editor.edit(editBuilder => {
        editBuilder.replace(selection, sortedAndAlignedText);
      });
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }

function sortAndAlignFroms(text: string): string {

  function checkIfHasType(imports: { isType: boolean }[]): number {
    for (const { isType } of imports) {
      if (isType) {return 1;}
    }
    return 0;
  }

  function getStart(arr:any[]): number {
    return arr.reduce((max, current) => (current.length > max ? current.length : max), newImports[0].length)
    + (hasType ? 12 : 7); // type + "import " or only "import "
  }

  function rebuild({ imports, isDestructuredAssignements, isType, src }: { imports:string, isDestructuredAssignements:boolean, isType:boolean, src:string })  {
    let line = "import ";
    if (isType) { line += "type "; }
    else if (hasType) { line += "     "; }

    line += isDestructuredAssignements
      ? "{ " + imports + " }"
      : imports;

    while (line.length < start) {
      line += " ";
    }
    return line + " from " + src;
  }

  function sortImports(a:string, b:string) {
    const isAUppercase = /^[A-Z]/.test(a);
    const isBUppercase = /^[A-Z]/.test(b);

    if (isAUppercase && !isBUppercase) {
      return -1;
    }
    if (!isAUppercase && isBUppercase) {
      return 1;
    }
    return a.localeCompare(b);
  }

  const lines                   = text.split('\n');
  const excludedLines: string[] = [];
  const multipleImports:any[]   = [];
  const newImports              = lines
    .map(line => {

      // exclue non import lines
      if (!line.startsWith('import')) {
        excludedLines.push(line);
        return null;
      }

      let [imports, src] = line.split(' from ');

      // clean src
      src = src
        .replaceAll(' ', '');

      // remove "import "
      imports = imports
        .replace('import ', '')
        .trim();

      // check if import is a type
      const isType = imports.startsWith('type');

      // remove "type "
      if (isType) {
        imports = imports
          .replace('type ', '')
          .trim();
      }

      // check if import is a destructured
      const isDestructuredAssignements = imports.includes('{');

      // remove {}
      imports = imports?.match(/\{([^}]*)\}/)?.[1] ?? imports;

      imports = imports
        .split(',')
        .map(s => s.trim())
        .sort((a, b) => sortImports(a, b))
        .join(', ');

      const refactoredLine = {
        isDestructuredAssignements,
        isType,
        imports,
        length: imports.length + (isDestructuredAssignements ? 4 : 0),
        src
      };

      if (imports.includes(',')) {
        multipleImports.push(refactoredLine);
        return null;
      }

      return refactoredLine;
    })
    .filter(value => value !== null)
    .sort((a, b) => sortImports(a.imports, b.imports));

  const hasType = checkIfHasType(newImports) + checkIfHasType(multipleImports) > 0;
  const start   = [getStart(multipleImports), getStart(newImports)].sort((a, b) => b - a)[0];

  return multipleImports
    .sort((a, b) => sortImports(a.imports, b.imports))
    .map(rebuild)
    .concat(newImports.map(rebuild), excludedLines)
    .join('\n');
}