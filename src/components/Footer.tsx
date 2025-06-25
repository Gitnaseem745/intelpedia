"use client";
import { config } from "@/config";
import { Rss } from "lucide-react";
import Link from "next/link";
import { FunctionComponent } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Button } from "./ui/button";

export const Footer: FunctionComponent = () => {
  return (
    <section className="container mt-8 md:mt-16 mx-auto mb-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          © {config.blog.copyright} {new Date().getFullYear()}
        </div>
        
        {/* Legal Links */}
        <div className="flex items-center gap-4 text-sm">
          <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <span className="text-muted-foreground">•</span>
          <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
        
        <div className="flex items-center">
          <Link href="/rss">
            <Button variant="ghost" role="button" aria-label="Rss Feed" className="p-2">
              <Rss className="w-4 h-4" />
            </Button>
          </Link>
          <DarkModeToggle />
        </div>
      </div>
    </section>
  );
};
