import { type ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { BackToTop } from "./BackToTop";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-midnight text-offwhite">
      <ScrollToTop />
      <TopBar />
      <Nav />
      <main id="main" className="pt-[96px]">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
