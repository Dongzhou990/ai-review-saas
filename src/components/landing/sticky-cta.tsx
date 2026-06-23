"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StickyCTA() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down past hero, show when scrolling up
      if (currentScrollY > 600) {
        setVisible(currentScrollY < lastScrollY);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300 bg-black/90 backdrop-blur-lg border-t border-neutral-800 px-4 py-3 safe-area-bottom ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link href="/register">
        <Button variant="primary" size="lg" className="w-full text-base">
          免费注册，每天 3 条
        </Button>
      </Link>
    </div>
  );
}
