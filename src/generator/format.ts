import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { format as prettier } from 'prettier';
import ts from 'typescript';

/**
 * Formats the specified code using prettier.
 * @param code Code to format.
 */
export const formatUsingPrettier = (code: string) =>
  prettier(code, {
    ...{
      arrowParens: 'avoid',
      singleQuote: true,
      tabWidth: 2,
      trailingComma: 'all',
    },
    parser: 'typescript',
  });

/**
 * Organizes and removes unused imports from the specified code.
 * @param code Code to organize.
 */
export const organizeImports = (code: string) => {
  const languageServiceHost = new InMemoryLanguageServiceHost();
  const languageService = ts.createLanguageService(
    languageServiceHost,
    ts.createDocumentRegistry(),
  );
  languageServiceHost.addFile('output.ts', code);
  const fileTextChanges = languageService.organizeImports(
    {
      type: 'file',
      fileName: 'output.ts',
    },
    ts.getDefaultFormatCodeSettings(),
    undefined,
  );

  return fileTextChanges.length === 0
    ? code
    : applyTextChanges(code, fileTextChanges[0].textChanges);
};

const applyTextChanges = (content: string, changes: readonly ts.TextChange[]) =>
  pipe(
    changes,
    RA.reverse,
    RA.reduce(content, (newContent, { span, newText }) =>
      [
        newContent.slice(0, span.start),
        newText,
        newContent.slice(span.start + span.length),
      ].join(''),
    ),
  );

/* istanbul ignore next */
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
