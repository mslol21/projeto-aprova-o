import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StudyProvider } from "@/context/StudyContext";
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Projeto Aprovação - Controle de Estudos para Concurseiros",
    template: "%s | Projeto Aprovação"
  },
  description: "Sistema minimalista de controle de horas de estudo para concurseiros. Construa seu prédio da aprovação com disciplina, constância e foco total.",
  keywords: ["concurso público", "estudo", "controle de horas", "pomodoro", "aprovação", "concurseiro", "gestão de tempo"],
  authors: [{ name: "Projeto Aprovação" }],
  creator: "Projeto Aprovação",
  publisher: "Projeto Aprovação",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Projeto Aprovação",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://projetoaprovacao.com",
    title: "Projeto Aprovação - Controle de Estudos para Concurseiros",
    description: "Sistema minimalista de controle de horas de estudo. Construa seu prédio da aprovação com disciplina e constância.",
    siteName: "Projeto Aprovação",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projeto Aprovação - Controle de Estudos",
    description: "Sistema minimalista para concurseiros focados em aprovação.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Toaster richColors position="top-right" />
        <AuthProvider>
          <StudyProvider>
            {children}
          </StudyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
