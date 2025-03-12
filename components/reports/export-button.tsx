"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { generateExcelData } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

export function ExportButton() {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Get the data from the server
      const mappingsData = await generateExcelData()

      // Convert the data to CSV format
      const headers = [
        "Report ID",
        "Report Name",
        "Report Region",
        "Employee ID",
        "Employee Name",
        "Employee Email",
        "Employee Position",
        "Employee Department",
      ]

      const csvContent = [
        headers.join(","),
        ...mappingsData.map((row) =>
          [
            row.reportId,
            `"${row.reportName.replace(/"/g, '""')}"`,
            row.reportRegion,
            row.employeeId,
            `"${row.employeeName.replace(/"/g, '""')}"`,
            `"${row.employeeEmail.replace(/"/g, '""')}"`,
            `"${row.employeePosition.replace(/"/g, '""')}"`,
            `"${row.employeeDepartment.replace(/"/g, '""')}"`,
          ].join(","),
        ),
      ].join("\n")

      // Create a Blob with the CSV data
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

      // Create a download link and trigger the download
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)

      link.setAttribute("href", url)
      link.setAttribute("download", `report-mappings-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export Successful",
        description: "The report mappings have been exported to CSV.",
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting the report mappings.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
      <FileDown className="h-4 w-4 mr-2" />
      {isExporting ? "Exporting..." : "Export to Excel"}
    </Button>
  )
}

