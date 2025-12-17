
import styled from 'styled-components';
import { parseMarkdown } from '../utils/markdownParser';

const StyledMarkdown = styled.div`
  & h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; }
  & h2 { font-size: 1.25em; font-weight: bold; margin-bottom: 0.5em; }
  & p { margin-bottom: 0.5em; }
  & ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
  & ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
  & blockquote { border-left: 4px solid #ddd; padding-left: 1em; color: #666; }
  & code { background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 3px; }
  & pre { background: #f0f0f0; padding: 1em; border-radius: 5px; overflow-x: auto; }
  & a { color: #1f73b7; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const MarkdownRenderer = ({ content }) => {
  const html = parseMarkdown(content);
  return <StyledMarkdown dangerouslySetInnerHTML={{ __html: html }} />;
};

export default MarkdownRenderer;
