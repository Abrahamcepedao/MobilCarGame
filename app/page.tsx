'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import Game from '@/components/game/Game';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="flex min-h-screen flex-col items-center justify-between bg-background">
        <Game />
      </main>
    </ThemeProvider>
  );
}