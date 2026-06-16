import "./globals.css";

export const metadata = {
  title: "GymPro - Smart Gym Management System",
  description: "Premium full stack gym management dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
