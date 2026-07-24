import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <article className={embedded ? 'simple-section' : 'document-page'}>
            <h1 className={embedded ? 'section-title' : 'document-title'}>{config.title}</h1>
            {config.description && <p className="document-description">{config.description}</p>}
            <div className="markdown-copy document-copy">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1>{children}</h1>,
                        h2: ({ children }) => <h2>{children}</h2>,
                        h3: ({ children }) => <h3>{children}</h3>,
                        p: ({ children }) => <p>{children}</p>,
                        ul: ({ children }) => <ul>{children}</ul>,
                        ol: ({ children }) => <ol>{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
                        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                        strong: ({ children }) => <strong>{children}</strong>,
                        em: ({ children }) => <em>{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
