import { format as prettier } from 'prettier';
import { reverse } from 'ramda';
import ts from 'typescript';

export const format = (content: string) =>
  prettier(content, {
    ...{
      arrowParens: 'avoid',
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    },
    parser: 'typescript',
  });

export const organizeImports = (content: string) => {
  const languageServiceHost = new InMemoryLanguageServiceHost();
  const languageService = ts.createLanguageService(
    languageServiceHost,
    ts.createDocumentRegistry(),
  );
  languageServiceHost.addFile('output.ts', content);
  const fileTextChanges = languageService.organizeImports(
    {
      type: 'file',
      fileName: 'output.ts',
    },
    ts.getDefaultFormatCodeSettings(),
    undefined,
  );

  if (fileTextChanges.length === 0) {
    return content;
  }
  return applyTextChanges(content, fileTextChanges[0].textChanges);
};

const applyTextChanges = (content: string, changes: readonly ts.TextChange[]) =>
  reverse(changes).reduce(
    (newContent, { span, newText }) =>
      `${newContent.slice(0, span.start)}${newText}${newContent.slice(
        span.start + span.length,
      )}`,
    content,
  );

class InMemoryLanguageServiceHost implements ts.LanguageServiceHost {
  private files: Record<string, { file: ts.IScriptSnapshot; ver: number }> = {};

  public getCompilationSettings = ts.getDefaultCompilerOptions;

  public getScriptFileNames(): string[] {
    return Object.keys(this.files);
  }

  public getScriptVersion(fileName: string): string {
    return String(this.files[fileName].ver);
  }

  public getScriptSnapshot(fileName: string): ts.IScriptSnapshot | undefined {
    return this.files[fileName]?.file;
  }

  // eslint-disable-next-line class-methods-use-this
  public getCurrentDirectory(): string {
    return '';
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public getDefaultLibFileName(options: ts.CompilerOptions): string {
    return 'lib';
  }

  public addFile(fileName: string, content: string) {
    const snapshot = ts.ScriptSnapshot.fromString(content);
    snapshot.getChangeRange = () => undefined;
    if (this.files[fileName] === undefined) {
      this.files[fileName] = { ver: 1, file: snapshot };
    } else {
      this.files[fileName].ver += 1;
      this.files[fileName].file = snapshot;
    }
  }
}
