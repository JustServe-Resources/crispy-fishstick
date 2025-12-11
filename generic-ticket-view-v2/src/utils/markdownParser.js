import { marked } from 'marked';

export const parseMarkdown = (text) => {
  if (!text) return '';
  return marked.parse(text);
};
