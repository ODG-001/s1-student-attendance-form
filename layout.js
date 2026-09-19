import "./globals.css";

export const metadata = {
  title: "S1 Student Attendance",
  description: "S1 Student Attendance Form — Surgical Rotation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
