import { notFound, redirect } from "next/navigation";
import { hasLocale, localePath } from "@/lib/i18n";

export default async function AskPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: candidate } = await params;
  if (!hasLocale(candidate)) notFound();
  redirect(localePath(candidate));
}
