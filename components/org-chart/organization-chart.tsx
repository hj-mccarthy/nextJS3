"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Employee, Report, Supervisor } from "@/lib/data"

interface OrgChartNode {
  id: string
  name: string
  position: string
  department: string
  email: string
  children: OrgChartNode[]
  isSupervisor?: boolean
}

interface OrganizationChartProps {
  employees: Employee[]
  report: Report
}

export function OrganizationChart({ employees, report }: OrganizationChartProps) {
  const [orgData, setOrgData] = useState<OrgChartNode[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [activeView, setActiveView] = useState<"hierarchy" | "list">("hierarchy")

  useEffect(() => {
    async function fetchSupervisorsAndBuildTree() {
      try {
        setLoading(true)

        // Fetch all supervisors for this report
        const supervisorPromises = report.supervisors.map((name) =>
          fetch(`/api/supervisors?name=${encodeURIComponent(name)}`).then((res) => res.json()),
        )

        const supervisors = await Promise.all(supervisorPromises)

        // Build the org chart tree
        const tree = buildOrgTree(supervisors, employees)
        setOrgData(tree)
      } catch (error) {
        console.error("Error building org chart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSupervisorsAndBuildTree()
  }, [report, employees])

  // Function to build the organizational tree
  function buildOrgTree(supervisors: Supervisor[], employees: Employee[]): OrgChartNode[] {
    // Create supervisor nodes
    const supervisorNodes = supervisors.map((supervisor) => ({
      id: supervisor.id,
      name: supervisor.name,
      position: supervisor.title,
      department: supervisor.department,
      email: supervisor.email,
      children: [],
      isSupervisor: true,
    }))

    // Create a map for quick lookup
    const supervisorMap = new Map<string, OrgChartNode>()
    supervisorNodes.forEach((node) => {
      supervisorMap.set(node.name, node)
    })

    // Assign employees to supervisors based on department
    employees.forEach((employee) => {
      // Find a supervisor in the same department
      const matchingSupervisor = supervisorNodes.find((supervisor) => supervisor.department === employee.department)

      if (matchingSupervisor) {
        matchingSupervisor.children.push({
          id: employee.id,
          name: employee.name,
          position: employee.position,
          department: employee.department,
          email: employee.email,
          children: [],
        })
      }
    })

    return supervisorNodes
  }

  const handleOpenDetailsDialog = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailsDialogOpen(true)
  }

  const findEmployeeById = (id: string): Employee | undefined => {
    return employees.find((emp) => emp.id === id)
  }

  if (loading) {
    return (
      <div className="h-96 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Building organizational chart...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Tabs
        defaultValue="hierarchy"
        className="w-full"
        onValueChange={(value) => setActiveView(value as "hierarchy" | "list")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="hierarchy">Hierarchy View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-6">
          <div className="overflow-auto">
            <div className="min-w-[800px] p-4">
              <div className="flex justify-center">
                {orgData.length > 0 ? (
                  <div className="flex flex-col items-center">
                    <div className="flex space-x-8 justify-center">
                      {orgData.map((supervisor) => (
                        <OrgChartNode
                          key={supervisor.id}
                          node={supervisor}
                          onNodeClick={(id) => {
                            const emp = findEmployeeById(id)
                            if (emp) handleOpenDetailsDialog(emp)
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No organizational data available for this report.
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-4">
            {orgData.length > 0 ? (
              orgData.map((supervisor) => (
                <Card key={supervisor.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-muted p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {supervisor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{supervisor.name}</h4>
                          <p className="text-sm text-muted-foreground">{supervisor.position}</p>
                        </div>
                        <Badge className="ml-auto">Supervisor</Badge>
                      </div>
                    </div>

                    {supervisor.children.length > 0 ? (
                      <ul className="divide-y">
                        {supervisor.children.map((employee) => {
                          const emp = findEmployeeById(employee.id)
                          return (
                            <li key={employee.id} className="p-4">
                              <button
                                className="flex items-center gap-3 w-full text-left hover:bg-muted/50 p-2 rounded-md"
                                onClick={() => emp && handleOpenDetailsDialog(emp)}
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                    {employee.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h5 className="font-medium">{employee.name}</h5>
                                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                                </div>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">No direct reports</div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No organizational data available for this report.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

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
              <p className="text-sm font-medium text-muted-foreground mb-2">Assigned to Report</p>
              <Badge>{report.name}</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Component to render a single node in the org chart
function OrgChartNode({
  node,
  onNodeClick,
}: {
  node: OrgChartNode
  onNodeClick: (id: string) => void
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`p-4 rounded-lg border-2 ${
          node.isSupervisor ? "border-primary bg-primary/10" : "border-secondary bg-secondary/10"
        } w-48 text-center cursor-pointer hover:shadow-md transition-shadow`}
        onClick={() => onNodeClick(node.id)}
      >
        <div className="flex justify-center mb-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback
              className={`${
                node.isSupervisor ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {node.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <h4 className="font-medium truncate" title={node.name}>
          {node.name}
        </h4>
        <p className="text-xs text-muted-foreground truncate" title={node.position}>
          {node.position}
        </p>
        {node.isSupervisor && <Badge className="mt-2">Supervisor</Badge>}
      </div>

      {node.children.length > 0 && (
        <>
          <div className="w-px h-4 bg-border"></div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-[calc(100%-3rem)] h-4 border-t border-l border-r border-border rounded-t-md"></div>
            <div className="flex space-x-4 pt-4">
              {node.children.map((child) => (
                <OrgChartNode key={child.id} node={child} onNodeClick={onNodeClick} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

