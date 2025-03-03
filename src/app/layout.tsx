import "../styles/globals.css";

export const metadata = {
  title: "FinChat",
  description: "A chat app for financial insights",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}