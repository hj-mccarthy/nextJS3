import { EmployeeForm } from "@/components/employees/employee-form"

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
        <p className="text-muted-foreground">Create a new employee record in the system.</p>
      </div>

      <EmployeeForm />
    </div>
  )
}

