import { EmployeeCard } from "@/components/employees/employee-card"
import type { Employee } from "@/lib/data"

interface EmployeeListProps {
  employees: Employee[]
  emptyMessage?: string
}

export function EmployeeList({ employees, emptyMessage = "No employees found" }: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-white rounded-lg border">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}
    </div>
  )
}

