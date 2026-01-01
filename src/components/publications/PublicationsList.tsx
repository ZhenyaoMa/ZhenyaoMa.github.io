'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  BookOpenIcon,
  ClipboardDocumentIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface PublicationsListProps {
  config: PublicationPageConfig;
  publications: Publication[];
  embedded?: boolean;
}

export default function PublicationsList({
  config,
  publications,
  embedded = false
}: PublicationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
  const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);

  // UI hygiene: reset BibTeX expansion when publications list changes
  useEffect(() => {
    setExpandedBibtexId(null);
  }, [publications]);

  // Extract unique years and types
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [publications]);

  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
    return uniqueTypes.sort();
  }, [publications]);

  // Filter publications
  const filteredPublications = useMemo(() => {
    return publications.filter(pub => {
      const matchesSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.some(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
      const matchesType = selectedType === 'all' || pub.type === selectedType;

      return matchesSearch && matchesYear && matchesType;
    });
  }, [publications, searchQuery, selectedYear, selectedType]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} font-serif font-bold text-primary mb-4`}>
          {config.title}
        </h1>
        {config.description && (
          <p className={`${embedded ? 'text-base' : 'text-lg'} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
            {config.description}
          </p>
        )}
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center justify-center px-4 py-2 rounded-lg border transition-all',
              showFilters
                ? 'bg-accent text-white border-accent'
                : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:border-accent hover:text-accent'
            )}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-6">
                {/* Year */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" /> Year
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedYear('all')}
                      className={cn(
                        'px-3 py-1 text-xs rounded-full',
                        selectedYear === 'all'
                          ? 'bg-accent text-white'
                          : 'bg-white dark:bg-neutral-800'
                      )}
                    >
                      All
                    </button>
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={cn(
                          'px-3 py-1 text-xs rounded-full',
                          selectedYear === year
                            ? 'bg-accent text-white'
                            : 'bg-white dark:bg-neutral-800'
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <BookOpenIcon className="h-4 w-4 mr-1" /> Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedType('all')}
                      className={cn(
                        'px-3 py-1 text-xs rounded-full',
                        selectedType === 'all'
                          ? 'bg-accent text-white'
                          : 'bg-white dark:bg-neutral-800'
                      )}
                    >
                      All
                    </button>
                    {types.map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={cn(
                          'px-3 py-1 text-xs rounded-full capitalize',
                          selectedType === type
                            ? 'bg-accent text-white'
                            : 'bg-white dark:bg-neutral-800'
                        )}
                      >
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Publications */}
      <div className="space-y-6">
        {filteredPublications.map((pub, index) => (
          <motion.div
            key={pub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800"
          >
            <h3 className={`${embedded ? 'text-lg' : 'text-xl'} font-semibold mb-2`}>
              {pub.title}
            </h3>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              {pub.authors.map(a => a.name).join(', ')}
            </p>

            <p className="text-sm font-medium mb-3">
              {pub.journal || pub.conference} {pub.year}
            </p>

            {pub.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-500 mb-4">
                {pub.description}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {pub.abstract && (
                <button
                  onClick={() =>
                    setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)
                  }
                  className="px-3 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800"
                >
                  <DocumentTextIcon className="h-3 w-3 inline mr-1" />
                  Abstract
                </button>
              )}

              {pub.bibtex && !pub.hidden_bib && (
                <button
                  onClick={() =>
                    setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)
                  }
                  className="px-3 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800"
                >
                  <BookOpenIcon className="h-3 w-3 inline mr-1" />
                  BibTeX
                </button>
              )}
            </div>

            <AnimatePresence>
              {expandedAbstractId === pub.id && pub.abstract && (
                <motion.div className="mt-4">
                  <p className="text-sm">{pub.abstract}</p>
                </motion.div>
              )}

              {expandedBibtexId === pub.id &&
                pub.bibtex &&
                !pub.hidden_bib && (
                  <motion.div className="mt-4 relative">
                    <pre className="text-xs bg-neutral-50 dark:bg-neutral-800 p-4 rounded">
                      {pub.bibtex}
                    </pre>
                    <button
                      onClick={() => navigator.clipboard.writeText(pub.bibtex || '')}
                      className="absolute top-2 right-2"
                      title="Copy BibTeX"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
