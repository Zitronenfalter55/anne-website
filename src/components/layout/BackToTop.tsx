import { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const threshold = docHeight > 0 ? docHeight * 0.5 : 0;
      setVisible(scrollTop > threshold);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`
        fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
        w-10 h-10 md:w-11 md:h-11 rounded-full
        flex items-center justify-center
        bg-midnight border border-champagne/40
        text-champagne/80 hover:text-champagne
        shadow-lg shadow-black/30
        backdrop-blur-sm
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"}
      `}
    >
      <ArrowUp size={18} strokeWidth={1.5} />
    </button>
  );
}
