'use client';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Logo from '@/assets/logo.png';

export default function Frontdesk_Nav() {
   const Logout = async () => {
      console.log('Logout');
   };
   return (
      <nav className="p-1 shadow-md">
         <div className="flex justify-between items-center">
            {/* Left side */}
            <div className="flex items-center">
               <a className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Image
                     src={Logo}
                     width={60}
                     quality={100}
                     alt="logo"
                     unoptimized
                  />

                  <span className="self-center whitespace-nowrap">
                     <p className="text-2xl font-bold">Mof Hotel</p>
                     <p className="text-md font-bold text-gray-500">
                        Frontdesk dashboard
                     </p>
                  </span>
               </a>
            </div>

            {/* Right side */}
            <div className="relative flex items-center">
               <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="outline"
                        className="rounded-full w-14 h-14 focus:ring focus:ring-black"
                     >
                        <Avatar className="w-14 h-14">
                           <AvatarImage
                              src="https://github.com/shadcn.png"
                              alt="Front Desk"
                           />
                           <AvatarFallback>FD</AvatarFallback>
                        </Avatar>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                     <DropdownMenuLabel>Front Desk</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        <DropdownMenuItem
                           className="cursor-pointer"
                           onClick={Logout}
                        >
                           <LogOut className="mr-2 h-4 w-4 text-red-600" />
                           <span className="text-red-600">Logout</span>
                        </DropdownMenuItem>
                     </DropdownMenuGroup>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
      </nav>
   );
}
