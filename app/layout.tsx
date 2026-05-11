import "./globals.css";

export const metadata = {
  title: "一周菜单管家",
  description: "AI recipe generator with Google login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
