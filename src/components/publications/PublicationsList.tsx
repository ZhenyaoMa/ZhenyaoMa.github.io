import Image from 'next/image';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

function PublicationAuthors({ publication }: { publication: Publication }) {
    return (
        <>
            {publication.authors.map((author, idx) => (
                <span key={`${publication.id}-${author.name}-${idx}`}>
                    <span className={author.isHighlighted ? 'highlighted-author' : undefined}>
                        {author.name}
                    </span>
                    {author.isCorresponding && <sup>†</sup>}
                    {idx < publication.authors.length - 1 && ', '}
                </span>
            ))}
        </>
    );
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    return (
        <section className={embedded ? 'simple-section' : 'document-page'}>
            <h1 className={embedded ? 'section-title' : 'document-title'}>{config.title}</h1>
            {config.description && <p className="document-description">{config.description}</p>}

            <div className="project-list publication-list">
                {publications.map((pub) => {
                    const venue = pub.journal || pub.conference;
                    return (
                        <article key={pub.id} className="project-item publication-item">
                            <div className="project-figure" aria-label={`Research figure for ${pub.title}`}>
                                {pub.preview ? (
                                    <Image
                                        src={pub.preview}
                                        alt={`Research figure for ${pub.title}`}
                                        width={720}
                                        height={540}
                                    />
                                ) : (
                                    <div className="project-figure-fallback">
                                        <span>{pub.title}</span>
                                    </div>
                                )}
                            </div>

                            <div className="project-copy">
                                <p className="project-meta">
                                    {[venue, pub.year].filter(Boolean).join(' · ')}
                                </p>
                                <h2 className="project-title">
                                    {pub.url ? (
                                        <a href={pub.url} target="_blank" rel="noopener noreferrer">{pub.title}</a>
                                    ) : pub.title}
                                </h2>
                                <p className="project-authors"><PublicationAuthors publication={pub} /></p>

                                {pub.description && (
                                    <div className="project-text-block">
                                        <p className="project-label">Contribution</p>
                                        <p className="project-description">{pub.description}</p>
                                    </div>
                                )}

                                {(pub.summary || pub.abstract) && (
                                    <div className="project-text-block">
                                        <p className="project-label">Summary</p>
                                        <p className="project-summary">{pub.summary || pub.abstract}</p>
                                    </div>
                                )}

                                <div className="publication-links">
                                    {pub.url && <a href={pub.url} target="_blank" rel="noopener noreferrer">Project</a>}
                                    {pub.pdfUrl && <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">PDF</a>}
                                    {pub.doi && <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">DOI</a>}
                                    {pub.code && <a href={pub.code} target="_blank" rel="noopener noreferrer">Code</a>}
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
