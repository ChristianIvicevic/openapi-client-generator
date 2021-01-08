import { format as prettier } from 'prettier';

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
