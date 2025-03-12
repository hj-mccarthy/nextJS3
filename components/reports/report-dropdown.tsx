"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Report } from "@/lib/data"
import { useTransition } from "react"

interface ReportDropdownProps {
  reports: Report[]
  selectedReportId: string
  disabled?: boolean
}

export function ReportDropdown({ reports, selectedReportId, disabled = false }: ReportDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleReportChange = (value: string) => {
    startTransition(() => {
      // Create a new URLSearchParams object based on the current params
      const params = new URLSearchParams(searchParams.toString())

      // Update the report parameter
      if (value !== "all") {
        params.set("report", value)
      } else {
        params.delete("report")
      }

      // Navigate to the new URL
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <Select
      value={selectedReportId || "all"}
      onValueChange={handleReportChange}
      disabled={disabled || reports.length === 0 || isPending}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={disabled ? "Select a region first" : "Select a report"} />
      </SelectTrigger>
      <SelectContent>
        {reports.length === 0 ? (
          <SelectItem value="no-reports" disabled>
            No reports available
          </SelectItem>
        ) : (
          <>
            <SelectItem value="all">All Reports</SelectItem>
            {reports.map((report) => (
              <SelectItem key={report.id} value={report.id}>
                {report.name}
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  )
}

