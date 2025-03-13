import './frontdesk.css';

export default function FrontdeskLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="min-h-screen" id="body">
        {children}
      </div>
    </>
  );
}
