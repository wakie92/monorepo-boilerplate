"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Web + Mobile Monorepo
        </h1>
        <p className="mt-4 text-muted-foreground">
          Next.js · Expo · Supabase · Zustand · TanStack Query
        </p>
      </motion.div>
    </main>
  );
}
