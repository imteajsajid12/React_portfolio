import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ 
  value, 
  onChange, 
  placeholder = "Start writing your blog post...",
  height = "300px",
  readOnly = false 
}) => {
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

  return (
    <div className="rich-text-editor">
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
