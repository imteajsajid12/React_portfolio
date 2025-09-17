import React, { useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Code2, Edit3, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Start writing your blog post...",
  height = "300px",
  readOnly = false,
  showPreview = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  // Custom toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // Text formatting
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        
        // Text styling
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        
        // Paragraph formatting
        [{ 'align': [] }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        
        // Lists and quotes
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['blockquote', 'code-block'],

        // Media and links
        ['link', 'image', 'video'],

        // Custom code insertion
        ['code-insert'],

        // Utilities
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: true
    }
  }), []);

  // Formats allowed in the editor
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background',
    'align', 'script',
    'code-block', 'direction'
  ];

  // Enhanced content processing for preview
  const processContentForPreview = (content) => {
    if (!content) return '';

    let processed = content;

    // Convert Quill's code blocks to markdown-style for better preview
    processed = processed.replace(
      /<pre class="ql-syntax" spellcheck="false">([\s\S]*?)<\/pre>/g,
      (match, code) => {
        const cleanCode = code.replace(/<[^>]*>/g, '').trim();
        return `
          <div class="code-block-wrapper relative group my-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
            <div class="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
              <div class="flex items-center gap-3">
                <div class="flex gap-1.5">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">CODE</span>
                </div>
              </div>
              <button
                class="copy-btn flex items-center gap-2 px-3 py-1.5 text-xs bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 transition-all duration-200 border border-gray-200 dark:border-gray-500 shadow-sm"
                onclick="copyCodeFromPreview('${encodeURIComponent(cleanCode)}')"
              >
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                </svg>
                <span class="font-medium">Copy</span>
              </button>
            </div>
            <div class="syntax-highlighter-container bg-gray-950 dark:bg-gray-900 relative">
              <pre class="text-gray-100 p-6 overflow-x-auto text-sm leading-relaxed font-mono">${cleanCode}</pre>
            </div>
          </div>
        `;
      }
    );

    return processed;
  };

  const copyCodeFromPreview = async (encodedCode) => {
    try {
      const code = decodeURIComponent(encodedCode);
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  // Make copyCode available globally for the preview
  React.useEffect(() => {
    window.copyCodeFromPreview = copyCodeFromPreview;
    return () => {
      delete window.copyCodeFromPreview;
    };
  }, []);

  return (
    <div className="rich-text-editor">
      {showPreview && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Blog Content Editor
          </h3>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPreviewMode(false)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                !isPreviewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPreviewMode(true)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md transition-colors ${
                isPreviewMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <Eye className="w-3 h-3" />
              Preview
            </motion.button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isPreviewMode ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="preview-container"
          >
            <div
              className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
              style={{ minHeight: height }}
              dangerouslySetInnerHTML={{
                __html: processContentForPreview(value) || '<p class="text-gray-500 dark:text-gray-400 italic">No content to preview...</p>'
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="editor-container"
          >
            <ReactQuill
              theme="snow"
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              placeholder={placeholder}
              modules={modules}
              formats={formats}
              style={{ height }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .ql-editor {
          min-height: ${height};
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          background: #f9fafb;
        }
        
        .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 8px 8px;
          background: white;
        }
        
        .dark .ql-toolbar {
          background: #374151;
          border-color: #4b5563;
        }
        
        .dark .ql-container {
          background: #1f2937;
          border-color: #4b5563;
        }
        
        .dark .ql-editor {
          color: #f9fafb;
        }
        
        .dark .ql-editor.ql-blank::before {
          color: #9ca3af;
        }
        
        /* Toolbar button styling */
        .ql-toolbar .ql-stroke {
          stroke: #6b7280;
        }
        
        .ql-toolbar .ql-fill {
          fill: #6b7280;
        }
        
        .dark .ql-toolbar .ql-stroke {
          stroke: #d1d5db;
        }
        
        .dark .ql-toolbar .ql-fill {
          fill: #d1d5db;
        }
        
        /* Active button styling */
        .ql-toolbar button:hover,
        .ql-toolbar button:focus,
        .ql-toolbar button.ql-active {
          color: #3b82f6;
        }
        
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button:focus .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6;
        }
        
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button:focus .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6;
        }
        
        /* Dropdown styling */
        .ql-toolbar .ql-picker-label {
          color: #6b7280;
        }
        
        .dark .ql-toolbar .ql-picker-label {
          color: #d1d5db;
        }
        
        .ql-toolbar .ql-picker-options {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .dark .ql-toolbar .ql-picker-options {
          background: #374151;
          border-color: #4b5563;
        }
        
        /* Content styling */
        .ql-editor h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin: 1rem 0;
        }
        
        .ql-editor h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin: 0.875rem 0;
        }
        
        .ql-editor h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.75rem 0;
        }
        
        .ql-editor h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.625rem 0;
        }
        
        .ql-editor h5 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        
        .ql-editor h6 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        
        .ql-editor p {
          margin: 0.75rem 0;
        }
        
        .ql-editor blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 0 6px 6px 0;
        }
        
        .dark .ql-editor blockquote {
          background: #1e293b;
          border-left-color: #60a5fa;
        }
        
        .ql-editor pre {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        
        .dark .ql-editor pre {
          background: #0f172a;
          border-color: #334155;
        }
        
        .ql-editor code {
          background: #f1f5f9;
          padding: 0.125rem 0.25rem;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
        
        .dark .ql-editor code {
          background: #334155;
        }
        
        .ql-editor ul, .ql-editor ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        
        .ql-editor li {
          margin: 0.25rem 0;
        }
        
        .ql-editor a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .ql-editor a:hover {
          color: #1d4ed8;
        }
        
        .dark .ql-editor a {
          color: #60a5fa;
        }
        
        .dark .ql-editor a:hover {
          color: #93c5fd;
        }
        
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 1rem 0;
        }
        
        /* Placeholder styling */
        .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
          font-size: 16px;
        }
        
        /* Focus styling */
        .ql-container.ql-snow {
          border: 1px solid #e5e7eb;
        }
        
        .ql-container.ql-snow:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .dark .ql-container.ql-snow {
          border-color: #4b5563;
        }
        
        .dark .ql-container.ql-snow:focus-within {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }
      `}</style>
      
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

export default RichTextEditor;
