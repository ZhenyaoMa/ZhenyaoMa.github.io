import ReactMarkdown from 'react-markdown';

interface AboutProps {
    content: string;
    title?: string;
}

export default function About({ content, title = 'About' }: AboutProps) {
    return (
        <section className="simple-section">
            <h2 className="section-title">{title}</h2>
            <div className="markdown-copy">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1>{children}</h1>,
                        h2: ({ children }) => <h2>{children}</h2>,
                        h3: ({ children }) => <h3>{children}</h3>,
                        p: ({ children }) => <p>{children}</p>,
                        ul: ({ children }) => <ul>{children}</ul>,
                        ol: ({ children }) => <ol>{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        a: ({ ...props }) => (
                            <a {...props} target="_blank" rel="noopener noreferrer" />
                        ),
                        blockquote: ({ children }) => <blockquote>{children}</blockquote>,
                        strong: ({ children }) => <strong>{children}</strong>,
                        em: ({ children }) => <em>{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </section>
    );
}
