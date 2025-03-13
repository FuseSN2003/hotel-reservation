import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function EmployeeTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-3/6">Information</TableHead>
          <TableHead className="w-1/6">Job</TableHead>
          <TableHead className="w-2/6">Contact</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <td className="flex items-center gap-4">
              <div className="size-28 bg-gray-100 rounded-full"></div>
              <div className="flex flex-col gap-1">
                <div className="w-32 h-4 bg-gray-100 rounded"></div>
                <div className="w-20 h-4 bg-gray-100 rounded"></div>
              </div>
            </td>
            <td className="w-1/6">
              <div className="w-20 h-4 bg-gray-100 rounded"></div>
            </td>
            <td className="w-2/6">
              <div className="w-20 h-4 bg-gray-100 rounded"></div>
            </td>
            <td className="w-1/6">
              <div className="w-20 h-4 bg-gray-100 rounded"></div>
            </td>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
