import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Employee } from "@/lib/data"

interface EmployeeListProps {
  employees: Employee[]
}

export function EmployeeList({ employees }: EmployeeListProps) {
  if (employees.length === 0) {
    return <div className="text-center py-8 text-gray-500">No employees assigned to this report.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => (
        <Card key={employee.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="font-medium">{employee.name}</h4>
                <p className="text-sm text-gray-500">{employee.position}</p>
                <p className="text-sm text-gray-500">{employee.email}</p>
                <div className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 w-fit">
                  {employee.department}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

