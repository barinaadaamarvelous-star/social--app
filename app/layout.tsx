// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "My Social",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div>{children}</div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header style={{ padding: 12, borderBottom: "1px solid #eee" }}>
      <a href="/">Home</a> | <a href="/create">Create</a>
      <span style={{ float: "right" }}>
        <a href="/auth">Auth</a>
      </span>
    </header>
  );
}
