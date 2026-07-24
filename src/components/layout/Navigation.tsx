'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { SiteConfig } from '@/lib/config';

interface NavigationProps {
  items: SiteConfig['navigation'];
  siteTitle: string;
  enableOnePageMode?: boolean;
}

export default function Navigation({ items, siteTitle, enableOnePageMode }: NavigationProps) {
  const pathname = usePathname();

  const itemHref = (item: SiteConfig['navigation'][number]) =>
    enableOnePageMode ? `/#${item.target}` : item.href;

  const isActive = (item: SiteConfig['navigation'][number]) => {
    if (enableOnePageMode) return false;
    return item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
  };

  return (
    <Disclosure as="header" className="site-header">
      {({ open }) => (
        <>
          <div className="site-nav-inner">
            <Link href="/" className="site-title">{siteTitle}</Link>

            <nav className="desktop-nav" aria-label="Main navigation">
              {items.map((item) => (
                <Link
                  key={item.title}
                  href={itemHref(item)}
                  className={isActive(item) ? 'nav-link active' : 'nav-link'}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <Disclosure.Button className="mobile-menu-button" aria-label="Toggle menu">
              {open ? <XMarkIcon aria-hidden="true" /> : <Bars3Icon aria-hidden="true" />}
            </Disclosure.Button>
          </div>

          <Disclosure.Panel className="mobile-nav">
            {items.map((item) => (
              <Disclosure.Button
                as={Link}
                key={item.title}
                href={itemHref(item)}
                className={isActive(item) ? 'nav-link active' : 'nav-link'}
              >
                {item.title}
              </Disclosure.Button>
            ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
