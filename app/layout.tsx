import "./globals.css";

export const metadata = {
  title: "一周菜单管家",
  description: "AI weekly meal planner",
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
