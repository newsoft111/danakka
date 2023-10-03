import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}