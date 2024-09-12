"use client"

import { useState } from 'react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

import theme from './theme';

export default function ThemeRegistry({ options, children, darkMode }: { options: any, children: any, darkMode: boolean }) {

  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ ...options, stylisPlugins: [prefixer, rtlPlugin] });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };

    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <NextThemeProvider attribute="class" storageKey="theme" defaultTheme="light">
        <ThemeProvider theme={theme(darkMode)}>
          {children}
        </ThemeProvider>
      </NextThemeProvider>
    </CacheProvider>
  );
}