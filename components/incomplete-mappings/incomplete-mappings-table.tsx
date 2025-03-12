"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addEmployeeToReport } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"
import type { Employee, Report } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface IncompleteMappingsTableProps {
  employeesWithSingleMapping: { employee: Employee; report: Report }[]
  availableReports: Report[]
}

export function IncompleteMappingsTable({
  employeesWithSingleMapping,
  availableReports,
}: IncompleteMappingsTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedReportId, setSelectedReportId] = useState<string>("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(employeesWithSingleMapping.length / itemsPerPage)

  const handleAddToReport = async () => {
    if (!selectedEmployee || !selectedReportId) return

    setIsSubmitting(true)

    try {
      const result = await addEmployeeToReport(selectedEmployee.id, selectedReportId)

      if (result.success) {
        toast({
          title: "Success",
          description: `${selectedEmployee.name} has been added to the report.`,
        })
        setIsAddDialogOpen(false)
        setSelectedReportId("")
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
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenAddDialog = (employee: Employee, currentReport: Report) => {
    setSelectedEmployee(employee)
    setSelectedReport(currentReport)
    setIsAddDialogOpen(true)
  }

  const handleOpenDetailsDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailsDialogOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Calculate the current page's data
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = employeesWithSingleMapping.slice(indexOfFirstItem, indexOfLastItem)

  // Generate page numbers for pagination
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  if (employeesWithSingleMapping.length === 0) {
    return <div className="text-center py-8 text-gray-500">No employees with incomplete mappings found.</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Current Report</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map(({ employee, report }) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <button
                    onClick={() => handleOpenDetailsDialog(employee)}
                    className="flex items-center gap-2 hover:underline text-left"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{employee.name}</span>
                  </button>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  <Badge variant="outline">{report.name}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenAddDialog(employee, report)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {pageNumbers.map((number) => (
                <PaginationItem key={number}>
                  <PaginationLink isActive={currentPage === number} onClick={() => handlePageChange(number)}>
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add to Report Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee to Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {selectedEmployee?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedEmployee?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedEmployee?.position}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Currently mapped to: <Badge variant="outline">{selectedReport?.name}</Badge>
              </p>

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

      {/* Employee Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {selectedEmployee?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{selectedEmployee?.name}</h3>
                <p className="text-muted-foreground">{selectedEmployee?.position}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{selectedEmployee?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Department</p>
                <p>{selectedEmployee?.department}</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Current Report</p>
              <Badge>
                {employeesWithSingleMapping.find((e) => e.employee.id === selectedEmployee?.id)?.report.name}
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

