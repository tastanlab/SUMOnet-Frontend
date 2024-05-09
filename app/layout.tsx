import "@mantine/core/styles.css";
import React from "react";

import { MantineProvider, ColorSchemeScript, Container,Space  } from "@mantine/core";
import { theme } from "../theme";
import { FooterLinks } from "../components/footer/FooterLinks";
import HeaderMenu from "../components/navbar/HeaderMenu";
export const metadata = {
  title: "SUMOnet",
  description: "Ailenizin predicterı",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link
          rel="icon"
          href="/icon.svg"
          type="image/svg+xml"
          sizes="any"
        />
                <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Container size="100%" >
              <Container className="header" size="100%">
                <HeaderMenu/>
              </Container>
              <Container h="80%" className="content" size="100%">
                {children}
              

              </Container>

          </Container>
          <Space h="xl" />
          <FooterLinks/>
          </MantineProvider>

      </body>
    </html>
  );
}
