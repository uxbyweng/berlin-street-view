/**
 * Smart-Link-Komponente ermöglicht das Vorladen von Zielrouten
 * beim Überfahren mit der Maus. Reduziert efühlte Latenz.
 * Kommt im Header-Menu für die 'Map' zum Einsatz.
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type PrefetchingLinkProps = ComponentProps<typeof Link>;

export function PrefetchingLink({
  href,
  onMouseEnter,
  onFocus,
  ...props
}: PrefetchingLinkProps) {
  const router = useRouter();

  const handlePrefetch = () => {
    if (typeof href === "string") {
      router.prefetch(href);
    }
  };

  return (
    <Link
      href={href}
      onMouseEnter={(event) => {
        handlePrefetch();
        onMouseEnter?.(event);
      }}
      onFocus={(event) => {
        handlePrefetch();
        onFocus?.(event);
      }}
      {...props}
    />
  );
}
