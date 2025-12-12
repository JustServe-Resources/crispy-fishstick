export const parseMarkdown = (markdown) => {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML characters first
  html = html.replace('&', '&amp;')
    .replace('<', '&lt;')
    .replace('>', '&gt;');

  // Headers - now more flexible with optional space after #
  html = html.replace(/^###\s*([^\\n]+)$/gim, '<h3>$1</h3>');
  html = html.replace(/^##\s*([^\\n]+)$/gim, '<h2>$1</h2>');
  html = html.replace(/^#\s*([^\\n]+)$/gim, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Links
  // Links
html = html.replaceAll(/$$([^$$]+)\]$$([^)]+)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Code blocks and inline code
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^\- (.+)$/gim, '<li>$1</li>');
  html = html.replace(/^\+ (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
  const orderedListRegex = /(<li>.*?<\/li>)(?=\n\d+\.|\n*$)/gs;
  html = html.replace(orderedListRegex, (match) => {
    if (!match.includes('<ul>') && !match.includes('<ol>')) {
      return '<ol>' + match + '</ol>';
    }
    return match;
  });

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gim, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^\-\-\-$/gim, '<hr>');
  html = html.replace(/^\*\*\*$/gim, '<hr>');

  // Convert single newlines to <br> and double newlines to paragraphs
  html = html.replace('\n', '<br>');
  html = html.replace('<br><br>', '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs and fix block elements inside paragraphs
  html = html.replace('<p><p>', '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ol>)/g, '$1');
  html = html.replace(/(<\/ol>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
  
  // Remove <br> tags before and after block elements
  html = html.replace(/<br>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<br>/g, '$1');
  html = html.replace(/<br>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<br>/g, '$1');
  html = html.replace(/<br>(<ol>)/g, '$1');
  html = html.replace(/(<\/ol>)<br>/g, '$1');

  return html;
};