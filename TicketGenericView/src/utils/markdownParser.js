export const parseMarkdown = (markdown) => {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML characters first
  html = html.replaceAll(/&/g, '&amp;')
    .replaceAll(/</g, '&lt;')
    .replaceAll(/>/g, '&gt;');

  // Headers - now more flexible with optional space after #
  html = html.replaceAll(/^###\s*(.*$)/gim, '<h3>$1</h3>');
  html = html.replaceAll(/^##\s*(.*$)/gim, '<h2>$1</h2>');
  html = html.replaceAll(/^#\s*(.*$)/gim, '<h1>$1</h1>');

  // Bold and italic
  html = html.replaceAll(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replaceAll(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replaceAll(/\_\_\_(.*?)\_\_\_/g, '<strong><em>$1</em></strong>');
  html = html.replaceAll(/\_\_(.*?)\_\_/g, '<strong>$1</strong>');
  html = html.replaceAll(/\_(.*?)\_/g, '<em>$1</em>');

  // Links
  html = html.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Code blocks and inline code
  html = html.replaceAll(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  html = html.replaceAll(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  html = html.replaceAll(/^\* (.+)$/gim, '<li>$1</li>');
  html = html.replaceAll(/^\- (.+)$/gim, '<li>$1</li>');
  html = html.replaceAll(/^\+ (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  html = html.replaceAll(/^\d+\. (.+)$/gim, '<li>$1</li>');
  const orderedListRegex = /(<li>.*?<\/li>)(?=\n\d+\.|\n*$)/gs;
  html = html.replaceAll(orderedListRegex, (match) => {
    if (!match.includes('<ul>') && !match.includes('<ol>')) {
      return '<ol>' + match + '</ol>';
    }
    return match;
  });

  // Blockquotes
  html = html.replaceAll(/^&gt; (.+)$/gim, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replaceAll(/^\-\-\-$/gim, '<hr>');
  html = html.replaceAll(/^\*\*\*$/gim, '<hr>');

  // Convert single newlines to <br> and double newlines to paragraphs
  html = html.replaceAll(/\n/g, '<br>');
  html = html.replaceAll(/<br><br>/g, '</p><p>');
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs and fix block elements inside paragraphs
  html = html.replaceAll(/<p><\/p>/g, '');
  html = html.replaceAll(/<p>(<h[1-6]>)/g, '$1');
  html = html.replaceAll(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replaceAll(/<p>(<ul>)/g, '$1');
  html = html.replaceAll(/(<\/ul>)<\/p>/g, '$1');
  html = html.replaceAll(/<p>(<ol>)/g, '$1');
  html = html.replaceAll(/(<\/ol>)<\/p>/g, '$1');
  html = html.replaceAll(/<p>(<pre>)/g, '$1');
  html = html.replaceAll(/(<\/pre>)<\/p>/g, '$1');
  html = html.replaceAll(/<p>(<blockquote>)/g, '$1');
  html = html.replaceAll(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replaceAll(/<p>(<hr>)<\/p>/g, '$1');
  
  // Remove <br> tags before and after block elements
  html = html.replaceAll(/<br>(<h[1-6]>)/g, '$1');
  html = html.replaceAll(/(<\/h[1-6]>)<br>/g, '$1');
  html = html.replaceAll(/<br>(<ul>)/g, '$1');
  html = html.replaceAll(/(<\/ul>)<br>/g, '$1');
  html = html.replaceAll(/<br>(<ol>)/g, '$1');
  html = html.replaceAll(/(<\/ol>)<br>/g, '$1');

  return html;
};