import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import { BreadcrumbProvider } from "@/components/breadcrumb-context";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

// Matches the `--font-sans` theme token in globals.css directly, so no
// extra CSS variable indirection is needed.
const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/satoshi/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/satoshi/Satoshi-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/satoshi/Satoshi-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zeen Hardware",
  description: "Repositório de hardware com preços e lojas em tempo real.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${satoshi.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <NuqsAdapter>
          <TooltipProvider>
            <BreadcrumbProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-5" />
                    <AppBreadcrumb />
                  </header>
                  <div className="flex flex-1 flex-col">{children}</div>
                  <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
                    Dados fornecidos por{" "}
                    <a
                      href="https://www.pcbuildwizard.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      PC Build Wizard
                    </a>
                  </footer>
                </SidebarInset>
              </SidebarProvider>
            </BreadcrumbProvider>
          </TooltipProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
