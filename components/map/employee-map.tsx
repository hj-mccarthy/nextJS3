"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { updateEmployeeStatus } from "@/lib/actions"
import type { Employee } from "@/lib/data"

// Dynamically import the Map component to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("./map-container").then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-muted rounded-md flex items-center justify-center">
      <Skeleton className="w-full h-full rounded-md" />
    </div>
  ),
})

// Mock coordinates for demonstration purposes
// In a real app, these would come from your database
const getEmployeeCoordinates = (employeeId: string) => {
  // Generate deterministic but random-looking coordinates based on employee ID
  // This is just for demo purposes - in a real app, you'd use actual coordinates
  const hash = employeeId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Generate coordinates roughly centered around the US
  const lat = 37 + (hash % 10) * 0.5
  const lng = -95 + ((hash * 13) % 20) - 10

  return { lat, lng }
}

interface EmployeeMapProps {
  employees: Employee[]
  reportId: string
}

export function EmployeeMap({ employees, reportId }: EmployeeMapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("department")
  const [selectedValue, setSelectedValue] = useState<string>("all")
  const [employeeStatuses, setEmployeeStatuses] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Initialize employee statuses
  useEffect(() => {
    const initialStatuses: Record<string, boolean> = {}
    employees.forEach((employee) => {
      initialStatuses[employee.id] = true // Default to active/add
    })
    setEmployeeStatuses(initialStatuses)
  }, [employees])

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const departments = new Set<string>()
    const positions = new Set<string>()

    employees.forEach((employee) => {
      departments.add(employee.department)
      positions.add(employee.position)
    })

    return {
      department: Array.from(departments),
      position: Array.from(positions),
    }
  }, [employees])

  // Filter employees based on selected category and value
  const filteredEmployees = useMemo(() => {
    if (selectedValue === "all") {
      return employees
    }

    return employees.filter((employee) => {
      if (selectedCategory === "department") {
        return employee.department === selectedValue
      } else if (selectedCategory === "position") {
        return employee.position === selectedValue
      }
      return true
    })
  }, [employees, selectedCategory, selectedValue])

  // Handle checkbox change
  const handleStatusChange = (employeeId: string, checked: boolean) => {
    setEmployeeStatuses((prev) => ({
      ...prev,
      [employeeId]: checked,
    }))
  }

  // Save changes to employee statuses
  const handleSaveChanges = async () => {
    setIsSaving(true)

    try {
      // Convert to array of updates
      const updates = Object.entries(employeeStatuses).map(([employeeId, isActive]) => ({
        employeeId,
        isActive,
        reportId,
      }))

      // Call server action to update statuses
      const result = await updateEmployeeStatus(updates)

      if (result.success) {
        toast({
          title: "Changes saved",
          description: `Updated status for ${updates.length} employees.`,
        })
      } else {
        throw new Error(result.error || "Failed to update employee statuses")
      }
    } catch (error) {
      console.error("Error saving employee statuses:", error)
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Prepare map markers data
  const mapMarkers = filteredEmployees.map((employee) => ({
    ...employee,
    ...getEmployeeCoordinates(employee.id),
    isActive: employeeStatuses[employee.id] ?? true,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee Map</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Filter By</h3>
                  <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="department" id="department" />
                      <Label htmlFor="department">Department</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="position" id="position" />
                      <Label htmlFor="position">Position</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {selectedCategory === "department" ? "Department" : "Position"}
                  </h3>
                  <RadioGroup value={selectedValue} onValueChange={setSelectedValue} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">All</Label>
                    </div>

                    {(selectedCategory === "department" ? categories.department : categories.position).map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value} id={value} />
                        <Label htmlFor={value}>{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <MapContainer markers={mapMarkers} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Showing {filteredEmployees.length} employees</h3>
                <Button onClick={handleSaveChanges} disabled={isSaving} size="sm">
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              <div className="border rounded-md divide-y">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-sm text-muted-foreground">{employee.email}</span>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="outline">{employee.department}</Badge>
                        <Badge variant="outline">{employee.position}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`employee-${employee.id}`}
                        checked={employeeStatuses[employee.id] ?? true}
                        onCheckedChange={(checked) => handleStatusChange(employee.id, checked === true)}
                      />
                      <Label htmlFor={`employee-${employee.id}`}>
                        {employeeStatuses[employee.id] ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

