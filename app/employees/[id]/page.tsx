import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmployeeStatusButton } from "@/components/employees/employee-status-button"
import { getEmployeeById } from "@/lib/data"
import { formatCurrency, formatDate, getInitials } from "@/lib/utils"
import { ArrowLeft, Mail, Phone, Building2, Calendar, DollarSign } from "lucide-react"

interface EmployeePageProps {
  params: {
    id: string
  }
}

export default async function EmployeePage({ params }: EmployeePageProps) {
  const employee = await getEmployeeById(params.id)

  if (!employee) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/employees">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Employee Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{getInitials(employee.name)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{employee.name}</CardTitle>
                <p className="text-muted-foreground">{employee.position}</p>
              </div>
            </div>
            <EmployeeStatusButton employeeId={employee.id} currentStatus={employee.status} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email</span>
                </div>
                <p>{employee.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Phone</span>
                </div>
                <p>{employee.phone}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Department</span>
                </div>
                <p>{employee.department}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Hire Date</span>
                </div>
                <p>{formatDate(employee.hireDate)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Salary</span>
                </div>
                <p>{formatCurrency(employee.salary)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Edit Employee</Button>
            <Button variant="outline" className="w-full">
              View Documents
            </Button>
            <Button variant="outline" className="w-full">
              Performance Review
            </Button>
            <Button variant="destructive" className="w-full">
              Delete Employee
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

