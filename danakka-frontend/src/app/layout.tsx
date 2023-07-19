// app/layout.tsx
import { Providers } from "./providers";
import { ChakraProvider,Box  } from '@chakra-ui/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}