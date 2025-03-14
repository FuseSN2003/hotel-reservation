import { Employee } from '@/lib/type';
import { headers } from 'next/headers';
import EmployeeTableClient from './EmployeeTableClient';

async function getEmployees(
  query: string
): Promise<
  { status: 'error'; message: string } | { status: 'success'; data: Employee[] }
> {
  const searchParams = new URLSearchParams({
    q: query,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/employees?${searchParams.toString()}`,
    {
      headers: headers(),
      cache: 'no-store',
    }
  );

  return res.json();
}

interface EmployeeProps {
  query: string;
}

export default async function EmployeeTable({ query }: EmployeeProps) {
  const result = await getEmployees(query);
  if (result.status === 'success') {
    return <EmployeeTableClient employees={result.data} />;
  } else {
    return <div>{result.message}</div>;
  }
}
