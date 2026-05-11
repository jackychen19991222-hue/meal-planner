import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "一周菜单管家",
  description: "根据人数规划菜单，自动生成购物清单，保存你的专属菜谱库。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
