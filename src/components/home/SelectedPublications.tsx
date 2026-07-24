import Image from 'next/image';
import Link from 'next/link';
import { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

function Authors({ publication }: { publication: Publication }) {
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

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    return (
        <section className="simple-section">
            <div className="section-heading-row">
                <h2 className="section-title">{title}</h2>
                <Link href={enableOnePageMode ? '/#publications' : '/publications'} className="section-link">
                    View All
                </Link>
            </div>

            <div className="project-list">
                {publications.map((pub) => {
                    const venue = pub.journal || pub.conference;
                    const titleContent = pub.url ? (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer">{pub.title}</a>
                    ) : pub.title;

                    return (
                        <article key={pub.id} className="project-item">
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
                                <h3 className="project-title">{titleContent}</h3>
                                <p className="project-authors"><Authors publication={pub} /></p>

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
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
