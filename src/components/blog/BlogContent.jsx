import React from 'react';
import DOMPurify from 'dompurify';

const BlogContent = ({ content, className = "" }) => {
  // Sanitize HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'strong', 'em', 'u', 's',
      'blockquote', 'pre', 'code',
      'ul', 'ol', 'li',
      'a', 'img',
      'span', 'div'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title',
      'class', 'style',
      'target', 'rel'
    ]
  });

  return (
    <div 
      className={`blog-content prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      style={{
        // Custom styling for blog content
        '--tw-prose-body': 'rgb(55 65 81)',
        '--tw-prose-headings': 'rgb(17 24 39)',
        '--tw-prose-lead': 'rgb(75 85 99)',
        '--tw-prose-links': 'rgb(59 130 246)',
        '--tw-prose-bold': 'rgb(17 24 39)',
        '--tw-prose-counters': 'rgb(107 114 128)',
        '--tw-prose-bullets': 'rgb(209 213 219)',
        '--tw-prose-hr': 'rgb(229 231 235)',
        '--tw-prose-quotes': 'rgb(17 24 39)',
        '--tw-prose-quote-borders': 'rgb(229 231 235)',
        '--tw-prose-captions': 'rgb(107 114 128)',
        '--tw-prose-code': 'rgb(17 24 39)',
        '--tw-prose-pre-code': 'rgb(229 231 235)',
        '--tw-prose-pre-bg': 'rgb(17 24 39)',
        '--tw-prose-th-borders': 'rgb(209 213 219)',
        '--tw-prose-td-borders': 'rgb(229 231 235)',
      }}
    />
  );
};

export default BlogContent;
