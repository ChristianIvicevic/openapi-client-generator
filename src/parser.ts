import type { OpenAPIV3 } from 'openapi-types';
import yaml from 'yaml';

export const parseYaml = (content: string) =>
  yaml.parse(content) as OpenAPIV3.Document;
