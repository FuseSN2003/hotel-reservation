import FrontDeskContextProvide from '@/context/front-desk';
import Child from './Child';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import Frontdesk_Nav from '@/components/frontdesk/FrontDeskNavbar';

export default async function FrontDeskPage() {
   const { user } = await getCurrentUser();

   if(!user) {
      redirect("/");
   }
   
   return (
      <FrontDeskContextProvide>
         <Frontdesk_Nav user={user} />
         <Child />
      </FrontDeskContextProvide>
   );
}