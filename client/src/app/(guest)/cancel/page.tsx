import Cancel from './Cancel';

export default function CancelPage({
   searchParams,
}: {
   searchParams: { reservationId: string };
}) {
   if (!searchParams.reservationId) {
      return <></>;
   }

   return <Cancel reservationId={searchParams.reservationId} />;
}
