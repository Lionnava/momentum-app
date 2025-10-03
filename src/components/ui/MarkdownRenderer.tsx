// src/components/ui/MarkdownRenderer.tsx

'use client'; // Este componente necesita ejecutarse en el cliente

import { marked } from 'marked';
import { useEffect, useState } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        const parsedHtml = marked.parse(content || '') as string;
        setHtmlContent(parsedHtml);
    }, [content]);

    // Tailwind CSS @tailwindcss/typography plugin (prose) es ideal para esto,
    // pero por ahora usamos estilos básicos.
    return (
        <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
        />
    );
}