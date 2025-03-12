import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllDepartments, getEmployeesByDepartment } from "@/lib/data"
import { Users } from "lucide-react"

export default async function DepartmentsPage() {
  const departments = await getAllDepartments()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">View and manage your company departments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map(async (department) => {
          const employees = await getEmployeesByDepartment(department.name)
          const activeEmployees = employees.filter((e) => e.status === "active").length

          return (
            <Card key={department.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{department.name}</CardTitle>
                    <CardDescription>{department.description}</CardDescription>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Employees</p>
                      <p className="text-xl font-semibold">{department.employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-xl font-semibold">{activeEmployees}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Manager</p>
                    <p className="font-medium">{department.manager || "Unassigned"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

