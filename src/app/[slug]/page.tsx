import { notFound } from 'next/navigation';
import { getPageConfig, getMarkdownContent, getBibtexContent } from '@/lib/content';
import { getConfig } from '@/lib/config';
import { parseBibTeX } from '@/lib/bibtexParser';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import {
    BasePageConfig,
    PublicationPageConfig,
    TextPageConfig,
    CardPageConfig
} from '@/types/page';

import { Metadata } from 'next';

import fs from "fs";
import path from "path";

export function generateStaticParams() {
    const config = getConfig();
    const contentDir = path.join(process.cwd(), "content");

    // 1️⃣ 从 content/*.toml 扫描所有“页面配置”
    const slugsFromContent = fs
        .readdirSync(contentDir)
        .filter((file) => file.endsWith(".toml"))
        .filter((file) => !["config.toml"].includes(file)) // 排除全局配置
        .filter((file) => {
            // 只把真正的“页面 toml”当成路由
            const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
            return /^\s*type\s*=/.test(raw);
        })
        .map((file) => file.replace(".toml", ""));

    // 2️⃣ 原来 navigation 里的页面（保留，防止行为变化）
    const slugsFromNav = config.navigation
        .filter(nav => nav.type === 'page' && nav.target !== 'about')
        .map(nav => nav.target);

    // 3️⃣ 合并 + 去重
    const slugs = Array.from(new Set([...slugsFromNav, ...slugsFromContent]));

    return slugs.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        return {};
    }

    return {
        title: pageConfig.title,
        description: pageConfig.description,
    };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageConfig = getPageConfig(slug) as BasePageConfig | null;

    if (!pageConfig) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {pageConfig.type === 'publication' && (
                <PublicationPage config={pageConfig as PublicationPageConfig} />
            )}
            {pageConfig.type === 'text' && (
                <TextPageWrapper config={pageConfig as TextPageConfig} />
            )}
            {pageConfig.type === 'card' && (
                <CardPage config={pageConfig as CardPageConfig} />
            )}
        </div>
    );
}

function PublicationPage({ config }: { config: PublicationPageConfig }) {
    const bibtex = getBibtexContent(config.source);
    const publications = parseBibTeX(bibtex);
    return <PublicationsList config={config} publications={publications} />;
}

function TextPageWrapper({ config }: { config: TextPageConfig }) {
    const content = getMarkdownContent(config.source);
    return <TextPage config={config} content={content} />;
}
