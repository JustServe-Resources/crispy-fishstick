import styled from 'styled-components';

export const MarkdownContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: inherit;

  h1 {
    font-size: 20px;
    font-weight: 700;
    margin: 16px 0 8px 0;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 4px;
  }

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 14px 0 6px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding-bottom: 4px;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 12px 0 6px 0;
  }

  p {
    margin: 8px 0;
  }

  strong {
    font-weight: 700;
  }

  em {
    font-style: italic;
  }

  a {
    color: #1f73b7;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 13px;
  }

  pre {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 12px;
    border-radius: 4px;
    overflow-x: auto;
    margin: 12px 0;

    code {
      background-color: transparent;
      padding: 0;
      font-size: 13px;
    }
  }

  ul, ol {
    margin: 8px 0;
    padding-left: 24px;
  }

  li {
    margin: 4px 0;
  }

  blockquote {
    border-left: 4px solid rgba(0, 0, 0, 0.2);
    padding-left: 12px;
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.7);
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    margin: 16px 0;
  }
`;
