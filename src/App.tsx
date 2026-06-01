import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageProvider";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SiteLayout>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
