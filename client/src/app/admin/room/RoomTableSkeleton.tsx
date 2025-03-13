import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function RoomTableSkeleton() {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Room Number</TableHead>
            <TableHead className="w-1/6">Room Type</TableHead>
            <TableHead className="w-1/6">Price</TableHead>
            <TableHead className="w-1/6">Status</TableHead>
            <TableHead className="w-1/6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-32 aspect-video" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="w-28 h-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-28 h-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-28 h-6" />
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
