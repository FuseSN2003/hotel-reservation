import AdminHeader from '@/components/AdminHeader';
import AdminSidebarMenu from '@/components/AdminSidebarMenu';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/assets/logo.png';

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex w-full bg-primary-foreground">
      <div className="min-h-screen border bg-background">
        <div className="sticky top-0 w-[250px] p-4 flex flex-col">
          <Link href="/">
            <div className="flex justify-center items-center gap-2">
              <Image priority src={Logo} alt="logo" width={96} />
              <h1 className="text-xl font-bold">Mof Hotel</h1>
            </div>
          </Link>
          <AdminSidebarMenu />
        </div>
      </div>
      <div className="grow flex flex-col">
        <header className="bg-background text-foreground h-24 sticky top-0 border-b flex items-center px-12 z-50">
          <AdminHeader />
        </header>
        <main className="p-20 overflow-hidden grow">{children}</main>
      </div>
    </div>
  );
}
