import { Suspense } from "react";
import EmployeeTable from "./EmployeeTable";
import TopSection from "./TopSection";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function EmployeePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const { user } = await getCurrentUser();

  if(!user) {
    redirect("/login");
  }

  const q = searchParams?.q || "";

  return (
    <div className="bg-background w-full h-full rounded-md shadow-md border p-8">
      <TopSection />
      <div className="my-8">
        <Suspense>
          <EmployeeTable query={q} />
        </Suspense>
      </div>
    </div>
  );
}
