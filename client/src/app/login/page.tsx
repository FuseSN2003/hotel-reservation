import Image from 'next/image';
import logo from '@/assets/logo.png';
import LoginForm from './LoginForm';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { user } = await getCurrentUser();

  if (user) {
    if (user.role === 'administrator') {
      redirect('/admin');
    }
    if (user.role === 'frontdesk') {
      redirect('/frontdesk');
    }
  }

  return (
    <div className="flex w-full min-h-screen bg-background justify-center items-center">
      <div className="flex flex-col gap-2 justify-center shadow-md items-center w-full max-w-sm h-fit bg-background p-6 rounded-lg border">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="logo" width={100} height={100} />
          <div>
            <h1 className="text-xl font-bold">Mof Hotel</h1>
            <h2>Admin dashboard</h2>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
