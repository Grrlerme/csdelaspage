import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CS DELAS | Conexão em movimento",
  description: "Comunidade gratuita de aprendizagem, apoio e oportunidades para mulheres em Customer Service.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
