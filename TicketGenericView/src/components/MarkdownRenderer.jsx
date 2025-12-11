import React from 'react';
import { MarkdownContent } from '../styles/MarkdownStyles';
import { parseMarkdown } from '../utils/markdownParser';

export const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const htmlContent = parseMarkdown(content);

  return (
    <MarkdownContent dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};
