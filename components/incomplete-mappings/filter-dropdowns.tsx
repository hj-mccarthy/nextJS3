"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTransition } from "react"
import type { Report } from "@/lib/data"

interface FilterDropdownsProps {
  departments: string[]
  positions: string[]
  reports: Report[]
  selectedDepartment: string
  selectedPosition: string
  selectedReport: string
}

export function FilterDropdowns({
  departments,
  positions,
  reports,
  selectedDepartment,
  selectedPosition,
  selectedReport,
}: FilterDropdownsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleFilterChange = (key: string, value: string) => {
    startTransition(() => {
      // Create a new URLSearchParams object based on the current params
      const params = new URLSearchParams(searchParams.toString())

      // Update the parameter
      if (value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      // Navigate to the new URL
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
        <Select
          value={selectedDepartment || "all"}
          onValueChange={(value) => handleFilterChange("department", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
        <Select
          value={selectedPosition || "all"}
          onValueChange={(value) => handleFilterChange("position", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map((position) => (
              <SelectItem key={position} value={position}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Report</label>
        <Select
          value={selectedReport || "all"}
          onValueChange={(value) => handleFilterChange("report", value)}
          disabled={isPending}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by current report" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            {reports.map((report) => (
              <SelectItem key={report.id} value={report.id}>
                {report.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

