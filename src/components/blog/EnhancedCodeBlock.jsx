import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Copy, 
  Check, 
  Code2, 
  Download,
  Maximize2,
  Eye,
  Terminal,
  FileCode
} from 'lucide-react';
import toast from 'react-hot-toast';

const EnhancedCodeBlock = ({ 
  code, 
  language = 'javascript', 
  filename = '',
  showLineNumbers = true,
  isDarkMode = true,
  maxHeight = 400
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename || `code.${getFileExtension(language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Code downloaded!');
  };

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      css: 'css',
      html: 'html',
      jsx: 'jsx',
      tsx: 'tsx',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      sql: 'sql',
      json: 'json',
      yaml: 'yml',
      xml: 'xml',
      bash: 'sh',
      shell: 'sh'
    };
    return extensions[lang] || 'txt';
  };

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔵',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      c: '🔧',
      css: '🎨',
      html: '🌐',
      jsx: '⚛️',
      tsx: '⚛️',
      php: '🐘',
      ruby: '💎',
      go: '🐹',
      rust: '🦀',
      sql: '🗄️',
      json: '📋',
      yaml: '📄',
      bash: '🐚',
      shell: '💻'
    };
    return icons[lang] || '📝';
  };

  const formatLanguage = (lang) => {
    const formatMap = {
      javascript: 'JavaScript',
      typescript: 'TypeScript',
      jsx: 'React JSX',
      tsx: 'React TSX',
      cpp: 'C++',
      css: 'CSS',
      html: 'HTML',
      php: 'PHP',
      python: 'Python',
      java: 'Java',
      sql: 'SQL',
      json: 'JSON',
      yaml: 'YAML',
      bash: 'Bash',
      shell: 'Shell'
    };
    return formatMap[lang] || lang.toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-4">
          {/* Window Controls */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Language Info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getLanguageIcon(language)}</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formatLanguage(language)}
              </span>
            </div>
            
            {filename && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-900 rounded-lg">
                <FileCode className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  {filename}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {language === 'html' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {isExpanded ? 'Collapse' : 'Expand'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCode}
            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy'}
          </motion.button>
        </div>
      </div>

      {/* Preview Section for HTML */}
      {showPreview && language === 'html' && (
        <div className="border-b border-gray-200 dark:border-gray-600">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</span>
          </div>
          <div className="p-6 bg-white dark:bg-gray-900">
            <div dangerouslySetInnerHTML={{ __html: code }} />
          </div>
        </div>
      )}

      {/* Code Section */}
      <div className="relative">
        <div className={`${isExpanded ? '' : `max-h-[${maxHeight}px]`} overflow-auto`}>
          <SyntaxHighlighter
            language={language}
            style={isDarkMode ? vscDarkPlus : vs}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: isDarkMode ? '#0d1117' : '#ffffff',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}
            lineNumberStyle={{
              color: isDarkMode ? '#6b7280' : '#9ca3af',
              fontSize: '0.75rem'
            }}
            wrapLines={true}
            wrapLongLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>

        {/* Fade overlay when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
        )}

        {/* Code stats */}
        <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-xs text-gray-300">
            {code.split('\n').length} lines • {code.length} chars
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedCodeBlock;