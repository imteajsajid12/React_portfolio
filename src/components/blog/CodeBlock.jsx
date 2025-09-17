import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CodeBlock = ({ 
  children, 
  className = '', 
  isDarkMode = false,
  showLineNumbers = true,
  wrapLines = true 
}) => {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const language = className.replace(/language-/, '') || 'text';
  
  // Get the code content
  const code = typeof children === 'string' ? children : children?.props?.children || '';
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      toast.success('Code copied to clipboard!', {
        duration: 2000,
        position: 'bottom-right',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const getLanguageDisplayName = (lang) => {
    const languageMap = {
      'js': 'JavaScript',
      'jsx': 'React JSX',
      'ts': 'TypeScript',
      'tsx': 'TypeScript React',
      'py': 'Python',
      'python': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'php': 'PHP',
      'rb': 'Ruby',
      'go': 'Go',
      'rs': 'Rust',
      'sql': 'SQL',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'sass': 'Sass',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'md': 'Markdown',
      'bash': 'Bash',
      'sh': 'Shell',
      'powershell': 'PowerShell',
      'dockerfile': 'Dockerfile',
      'nginx': 'Nginx',
      'apache': 'Apache',
      'text': 'Plain Text'
    };
    
    return languageMap[lang.toLowerCase()] || lang.toUpperCase();
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2">
            {getLanguageDisplayName(language)}
          </span>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </motion.button>
      </div>
      
      {/* Code Content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={isDarkMode ? vscDarkPlus : vs}
          showLineNumbers={showLineNumbers}
          wrapLines={wrapLines}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: isDarkMode ? '#1e1e1e' : '#f8f9fa',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          lineNumberStyle={{
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            paddingRight: '1rem',
            minWidth: '2.5rem',
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// Enhanced markdown code block renderer
export const MarkdownCodeBlock = ({ node, inline, className, children, ...props }) => {
  if (inline) {
    return (
      <code 
        className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <CodeBlock className={className} {...props}>
      {children}
    </CodeBlock>
  );
};

export default CodeBlock;
