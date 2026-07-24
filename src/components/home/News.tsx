export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

export default function News({ items, title = 'News' }: NewsProps) {
    return (
        <section className="simple-section">
            <h2 className="section-title">{title}</h2>
            <div className="statement-list compact-list">
                {items.map((item, index) => (
                    <div key={`${item.date}-${index}`} className="statement-item">
                        <div className="statement-meta"><span>{item.date}</span></div>
                        <p className="statement-body statement-description">{item.content}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
