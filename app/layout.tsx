
import "./globals.css";

export const metadata = {
  title: "Meal Planner",
  description: "Weekly meal planner",
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
