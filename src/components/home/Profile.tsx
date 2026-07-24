import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { SiteConfig } from '@/lib/config';

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
    bioContent?: string;
}

interface TextLink {
    label: string;
    href: string;
    external?: boolean;
}

export default function Profile({ author, social, researchInterests, bioContent = '' }: ProfileProps) {
    const links: TextLink[] = [];

    const emails = social.email
        ? social.email.split(';').map((email) => email.trim()).filter(Boolean)
        : [];

    emails.forEach((email, index) => {
        links.push({
            label: emails.length > 1 ? `Email ${index + 1}` : 'Email',
            href: `mailto:${email}`,
        });
    });

    const addExternalLink = (key: string, label: string) => {
        const value = social[key];
        if (typeof value === 'string' && value.trim()) {
            links.push({ label, href: value, external: true });
        }
    };

    addExternalLink('openreview', 'OpenReview');
    addExternalLink('google_scholar', 'Scholar');
    addExternalLink('orcid', 'ORCID');
    addExternalLink('github', 'GitHub');
    addExternalLink('linkedin', 'LinkedIn');

    if (social.location_url) {
        links.push({ label: social.location || 'Location', href: social.location_url, external: true });
    }

    return (
        <section className="profile-hero" aria-labelledby="profile-name">
            <div className="profile-copy">
                <h1 id="profile-name" className="profile-name">{author.name}</h1>

                {(author.title || author.institution) && (
                    <p className="profile-affiliation">
                        {[author.title, author.institution].filter(Boolean).join(' · ')}
                    </p>
                )}

                <div className="bio-copy">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p>{children}</p>,
                            ul: ({ children }) => <ul>{children}</ul>,
                            ol: ({ children }) => <ol>{children}</ol>,
                            li: ({ children }) => <li>{children}</li>,
                            a: ({ ...props }) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" />
                            ),
                            strong: ({ children }) => <strong>{children}</strong>,
                            em: ({ children }) => <em>{children}</em>,
                        }}
                    >
                        {bioContent}
                    </ReactMarkdown>
                </div>

                {researchInterests && researchInterests.length > 0 && (
                    <p className="research-interests">
                        <strong>Research Interests:</strong>{' '}
                        {researchInterests.join(' · ')}
                    </p>
                )}

                {links.length > 0 && (
                    <nav className="profile-links" aria-label="Profile links">
                        {links.map((link, index) => (
                            <span key={`${link.label}-${link.href}`} className="profile-link-item">
                                {index > 0 && <span className="profile-link-separator">/</span>}
                                <a
                                    href={link.href}
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener noreferrer' : undefined}
                                >
                                    {link.label}
                                </a>
                            </span>
                        ))}
                    </nav>
                )}
            </div>

            <div className="profile-photo-wrap">
                <Image
                    src={author.avatar}
                    alt={author.name}
                    width={720}
                    height={720}
                    className="profile-photo"
                    priority
                />
            </div>
        </section>
    );
}
