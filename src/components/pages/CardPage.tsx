import Link from 'next/link';
import { CardPageConfig } from '@/types/page';

export default function CardPage({
    config,
    embedded = false,
}: {
    config: CardPageConfig;
    embedded?: boolean;
}) {
    return (
        <section className={embedded ? 'simple-section' : 'document-page'}>
            <h1 className={embedded ? 'section-title' : 'document-title'}>{config.title}</h1>
            {config.description && <p className="document-description">{config.description}</p>}

            <div className="statement-list">
                {config.items.map((item, index) => {
                    const content = (
                        <article className="statement-item">
                            <div className="statement-meta">
                                {item.date && <span>{item.date}</span>}
                                {item.subtitle && <span>{item.subtitle}</span>}
                            </div>
                            <div className="statement-body">
                                <h2 className="statement-title">{item.title}</h2>
                                {item.content && <p className="statement-description">{item.content}</p>}
                                {item.tags && item.tags.length > 0 && (
                                    <p className="statement-tags">{item.tags.join(' · ')}</p>
                                )}
                            </div>
                        </article>
                    );

                    return item.link ? (
                        <Link key={`${item.title}-${index}`} href={item.link} className="statement-link-block">
                            {content}
                        </Link>
                    ) : (
                        <div key={`${item.title}-${index}`}>{content}</div>
                    );
                })}
            </div>
        </section>
    );
}
