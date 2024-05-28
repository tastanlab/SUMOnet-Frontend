import "@mantine/core/styles.css";
import React from "react";
import "./layout_responsive.css";
import { MantineProvider, ColorSchemeScript, Container} from "@mantine/core";
import { theme } from "../theme";
import { FooterLinks } from "../components/footer/FooterLinks";
import HeaderMenu from "../components/navbar/HeaderMenu";
export const metadata = {
  title: "SUMOnet",
  description: "",
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
          <Container className="main_container" size="100%" style={{paddingInline:'0px'}} >
              <Container className="header" size="100%" w="100%" style={{paddingInline:'0px'}}>
                <HeaderMenu/>
              </Container>
              <Container h="80%" className="content" size="100%" w="100%" style={{paddingInline:'0px'}}>
                {children}
              </Container>
              <Container className="footer" size="100%" w="100%" style={{paddingInline:'0px'}}>
                <FooterLinks/>
              </Container>
          </Container>

          </MantineProvider>

      </body>
    </html>
  );
}
