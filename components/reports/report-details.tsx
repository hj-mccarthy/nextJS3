"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, MapPin, ArrowLeft } from "lucide-react"
import type { Report } from "@/lib/data"
import { regions } from "@/lib/data"
import { SupervisorModal } from "./supervisor-modal"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Employee } from "@/lib/data"

interface ReportDetailsProps {
  report: Report
  employees: Employee[]
}

export function ReportDetails({ report, employees }: ReportDetailsProps) {
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null)
  const router = useRouter()

  // Get the region name
  const regionName = regions.find((r) => r.id === report.region)?.name || report.region

  const handleSupervisorClick = (supervisorName: string) => {
    setSelectedSupervisor(supervisorName)
  }

  const handleCloseModal = () => {
    setSelectedSupervisor(null)
  }

  const handleBackClick = () => {
    router.back()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4">
            <Button variant="ghost" size="sm" className="w-fit -ml-2" onClick={handleBackClick}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Reports
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-2xl">{report.name}</CardTitle>
              <Badge variant="outline" className="w-fit">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {regionName}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-700">{report.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Supervisors</h3>
              <div className="flex flex-wrap gap-2">
                {report.supervisors.map((supervisor, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer hover:bg-secondary/70 transition-colors"
                    onClick={() => handleSupervisorClick(supervisor)}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {supervisor}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Last Updated</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarIcon className="h-4 w-4" />
                {new Date(report.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedSupervisor && (
        <SupervisorModal supervisorName={selectedSupervisor} isOpen={!!selectedSupervisor} onClose={handleCloseModal} />
      )}
    </>
  )
}

