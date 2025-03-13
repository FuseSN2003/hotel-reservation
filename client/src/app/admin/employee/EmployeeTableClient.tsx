'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Employee } from '@/lib/type';
import { MoreHorizontal, Phone } from 'lucide-react';
import DeleteEmployeeModal from './DeleteEmployeeModal';
import EditAccountModal from './EditAccountModal';
import ResetPasswordModal from './ResetPasswordModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeTableClientProps {
  employees: Employee[];
}

export default function EmployeeTableClient({
  employees,
}: EmployeeTableClientProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-4/6">Information</TableHead>
            <TableHead className="w-1/6">Job</TableHead>
            <TableHead className="w-1/6">Contact</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div className="flex gap-2">
                  <Avatar className="size-28">
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${employee.profile_picture}`}
                    />
                    <AvatarFallback>{employee.first_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Name: </span>{' '}
                      {employee.first_name} {employee.last_name}
                    </p>
                    <p>
                      <span className="font-semibold">Username: </span>{' '}
                      {employee.username}
                    </p>
                    <p>
                      <span className="font-semibold">Born: </span>{' '}
                      {new Date(employee.date_of_birth).toDateString()}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="capitalize">
                {employee.role.replaceAll('_', ' ')}
              </TableCell>
              <TableCell>
                <div className="inline-flex gap-2">
                  <Phone /> {employee.phone_number}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditAccountModal employee={employee} />
                    <DeleteEmployeeModal employeeId={employee.id} />
                    <ResetPasswordModal employeeId={employee.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
