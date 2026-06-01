import { useEffect } from "react";

type SeoOpts = {
  title: string;
  description?: string;
  canonical?: string;
  /** When true, injects cache-control meta tags so the page is always re-fetched fresh. */
  noCache?: boolean;
};

function setMeta(name: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setHttpEquiv(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[http-equiv="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("http-equiv", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeHttpEquiv(name: string) {
  const el = document.head.querySelector<HTMLMetaElement>(`meta[http-equiv="${name}"]`);
  if (el) el.remove();
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({ title, description, canonical, noCache }: SeoOpts) {
  useEffect(() => {
    document.title = title;
    if (description) setMeta("description", description);
    const url = canonical ?? (typeof window !== "undefined" ? window.location.href : undefined);
    if (url) setLink("canonical", url);

    if (noCache) {
      setHttpEquiv("Cache-Control", "no-cache, no-store, must-revalidate");
      setHttpEquiv("Pragma", "no-cache");
      setHttpEquiv("Expires", "0");
      return () => {
        removeHttpEquiv("Cache-Control");
        removeHttpEquiv("Pragma");
        removeHttpEquiv("Expires");
      };
    }
  }, [title, description, canonical, noCache]);
}
