export const parseMarkdown = (markdown) => {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML characters first
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Headers - now more flexible with optional space after #
  html = html.replace(/^(#{1,6})\s*(.*)$/gm, (match, hashes, content) => {
    const level = hashes.length; // Count the number of hashes
    return `<h${level}>${content}</h${level}>`;
  });

  // Bold and italic
  html = html.replace(/(\*\*\*|___)(.*?)\1/g, '<strong><em>$2</em></strong>') // Bold + Italic
             .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>') // Bold
             .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>'); // Italic

  // Links
  html = html.replace(/$$([^$$]+)\]$$([^)]+)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Code blocks and inline code
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
             .replace(/`([^`]+)`/g, '<code>$1</code>');

  // Lists
  html = html.replace(/^\s*[\*\-\+]\s*(.+)$/gm, '<li>$1</li>') // Unordered lists
             .replace(/^\s*\d+\.\s*(.+)$/gm, '<li>$1</li>'); // Ordered lists

  // Wrap list items in <ul> or <ol>
  html = html.replace(/(<li>.*?<\/li>)(?=\n\s*\d+\.)/gs, (match) => {
    return `<ol>${match}</ol>`;
  }).replace(/(<li>.*?<\/li>)(?=\n\s*[\*\-\+])/gs, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^\-{3,}$/gm, '<hr>')
             .replace(/^\*{3,}$/gm, '<hr>');

  // Convert single newlines to <br> and double newlines to paragraphs
  html = html.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br>');
  html = `<p>${html}</p>`;

  // Clean up empty paragraphs and fix block elements inside paragraphs
  html = html.replace(/<p><\/p>/g, '')
             .replace(/<p>(<h[1-6]>)/g, '$1')
             .replace(/(<\/h[1-6]>)<\/p>/g, '$1')
             .replace(/<p>(<ul>|<ol>|<blockquote>|<pre>|<hr>)/g, '$1')
             .replace(/(<\/ul>|<\/ol>|<\/blockquote>|<\/pre>|<\/hr>)<\/p>/g, '$1');

  // Remove <br> tags before and after block elements
  html = html.replace(/<br>(<h[1-6]>|<ul>|<ol>|<blockquote>|<pre>)/g, '$1')
             .replace(/(<\/h[1-6]>)<br>|(<\/ul>)<br>|(<\/ol>)<br>|(<\/blockquote>)<br>|(<\/pre>)<br>/g, '$1');

  return html;
};
