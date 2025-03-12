import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllEmployees } from "@/lib/data"
import { EmployeeList } from "@/components/employees/employee-list"
import { UserPlus } from "lucide-react"

export default async function EmployeesPage() {
  const employees = await getAllEmployees()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your employees and their information.</p>
        </div>
        <Button asChild>
          <Link href="/employees/new">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Link>
        </Button>
      </div>

      <EmployeeList employees={employees} />
    </div>
  )
}

