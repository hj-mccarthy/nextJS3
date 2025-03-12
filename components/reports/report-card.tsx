"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPin, Users } from "lucide-react"
import type { Report } from "@/lib/data"
import { regions } from "@/lib/data"
import { useTransition } from "react"

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Get the region name
  const regionName = regions.find((r) => r.id === report.region)?.name || report.region

  const handleClick = () => {
    startTransition(() => {
      router.push(`/reports?report=${report.id}`)
    })
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <CardTitle className="text-lg">{report.name}</CardTitle>
          <Badge variant="outline" className="w-fit">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {regionName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>

        <div className="flex flex-wrap justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              {report.supervisors.length} supervisor{report.supervisors.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{new Date(report.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

