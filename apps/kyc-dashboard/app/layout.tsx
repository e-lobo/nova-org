
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { locales, defaultLocale, isRTL } from "@/config/i18n";
import "./globals.css";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

// async function getMessages(locale: string) {
//   try {
//     return (await import(`../messages/${locale}.json`)).default;
//   } catch (error) {
//     return (await import(`../messages/${defaultLocale}.json`)).default;
//   }
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || defaultLocale;
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={isRTL(locale as any) ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
