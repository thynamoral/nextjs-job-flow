"use client";

import H1 from "@/components/ui/h1";

type ErrorProps = {};

export default function Error({}: ErrorProps) {
  return (
    <main className="m-auto my-10 max-w-5xl space-y-5 px-3 text-center">
      <H1 className="text-red-500">Error</H1>
      <p className="font-medium">An unexpected error occurred!</p>
    </main>
  );
}
