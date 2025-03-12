"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addEmployeeToReport } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import { MapPin, Plus } from "lucide-react"
import type { Employee, Report } from "@/lib/data"

interface IncompleteEmployeeCardProps {
  employee: Employee
  currentReport: Report
  availableReports: Report[]
}

export function IncompleteEmployeeCard({ employee, currentReport, availableReports }: IncompleteEmployeeCardProps) {
  const [selectedReportId, setSelectedReportId] = useState<string>("")
  const [isSubmitting, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const handleAddToReport = async () => {
    if (!selectedReportId) return

    startTransition(async () => {
      try {
        const result = await addEmployeeToReport(employee.id, selectedReportId)

        if (result.success) {
          toast({
            title: "Success",
            description: `${employee.name} has been added to the report.`,
          })
          setIsOpen(false)
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to add employee to report.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Card>
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

        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-500 mb-2">Currently Mapped To:</h5>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{currentReport.name}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add to Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Employee to Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Report</label>
                <Select value={selectedReportId} onValueChange={setSelectedReportId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableReports.map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        {report.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddToReport} disabled={!selectedReportId || isSubmitting} className="w-full">
                {isSubmitting ? "Adding..." : "Add to Report"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}

