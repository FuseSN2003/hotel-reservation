import Success from './Sucess';

export default function SuccessPage({
   searchParams,
}: {
   searchParams: { email: string };
}) {
   return <Success email={searchParams.email} />;
}
