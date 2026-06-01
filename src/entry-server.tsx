import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, type Lang } from "@/i18n/LanguageProvider";
import { SiteLayout } from "@/components/layout/SiteLayout";

import Home from "./pages/Home";
import Method from "./pages/Method";
import WorkWithMe from "./pages/WorkWithMe";
import Workshops from "./pages/Workshops";
import About from "./pages/About";
import DiscoveryCall from "./pages/DiscoveryCall";
import BreathReset from "./pages/BreathReset";
import ThankYou from "./pages/ThankYou";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";

const queryClient = new QueryClient();

export function render(url: string, lang: Lang): string {
  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider initialLang={lang}>
          <StaticRouter location={url}>
            <SiteLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/method" element={<Method />} />
                <Route path="/work-with-me" element={<WorkWithMe />} />
                <Route path="/workshops" element={<Workshops />} />
                <Route path="/about" element={<About />} />
                <Route path="/discovery-call" element={<DiscoveryCall />} />
                <Route path="/breath-reset" element={<BreathReset />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/impressum" element={<Impressum />} />
              </Routes>
            </SiteLayout>
          </StaticRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
