import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login — ERP Global",
  description: "Faça login para acessar o sistema ERP Global.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
