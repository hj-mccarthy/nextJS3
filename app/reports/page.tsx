import {
  getRegions,
  getReports,
  getReportById,
  getEmployeesByReportId,
  getReportsByRegion,
  getEmployeesWithSingleMapping,
} from "@/lib/data"
import { RegionDropdown } from "@/components/reports/region-dropdown"
import { ReportDropdown } from "@/components/reports/report-dropdown"
import { ReportDetails } from "@/components/reports/report-details"
import { EmployeesTable } from "@/components/reports/employees-table"
import { ReportCard } from "@/components/reports/report-card"
import { IncompleteMappingsTable } from "@/components/incomplete-mappings/incomplete-mappings-table"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ExportButton } from "@/components/reports/export-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationChart } from "@/components/org-chart/organization-chart"

export const dynamic = "force-dynamic"

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { region?: string; report?: string; tab?: string }
}) {
  const regions = await getRegions()
  const selectedRegionId = searchParams.region || "all"
  const activeTab = searchParams.tab || "reports"

  // Get reports filtered by region if a region is selected
  const filteredReports = selectedRegionId !== "all" ? await getReportsByRegion(selectedRegionId) : await getReports()

  // Get selected report details if a report is selected
  const selectedReportId = searchParams.report || ""
  const selectedReport = selectedReportId ? await getReportById(selectedReportId) : undefined

  // Get employees for the selected report
  const reportEmployees = selectedReportId ? await getEmployeesByReportId(selectedReportId) : []

  // Get employees with single mapping for the incomplete mappings tab
  const employeesWithSingleMapping = await getEmployeesWithSingleMapping()

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="reports" asChild>
            <a href="/reports?tab=reports">Reports</a>
          </TabsTrigger>
          <TabsTrigger value="incomplete-mappings" asChild>
            <a href="/reports?tab=incomplete-mappings">Incomplete Mappings</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-xl font-semibold">Filter Reports</h2>
              <ExportButton />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <RegionDropdown regions={regions} selectedRegionId={selectedRegionId} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Name</label>
                <ReportDropdown reports={filteredReports} selectedReportId={selectedReportId} disabled={false} />
              </div>
            </div>
          </div>

          {selectedReport ? (
            <div className="space-y-6">
              <Suspense fallback={<div className="h-40 bg-white rounded-lg animate-pulse" />}>
                <ReportDetails report={selectedReport} employees={reportEmployees} />
              </Suspense>

              {reportEmployees.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Employees Assigned to This Report</h3>
                  <Suspense fallback={<EmployeeTableSkeleton />}>
                    <EmployeesTable employees={reportEmployees} report={selectedReport} />
                  </Suspense>
                </div>
              )}

              {reportEmployees.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Organizational Chart</h3>
                  <Suspense fallback={<OrgChartSkeleton />}>
                    <OrganizationChart employees={reportEmployees} report={selectedReport} />
                  </Suspense>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
              <Suspense fallback={<ReportListSkeleton />}>
                {filteredReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredReports.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No reports available for the selected region.</div>
                )}
              </Suspense>
            </div>
          )}
        </TabsContent>

        <TabsContent value="incomplete-mappings" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Incomplete Mappings</h2>
            <p className="text-gray-600 mb-6">
              Employees who are currently mapped to only one report. Add them to additional reports to complete their
              mappings.
            </p>
            <Suspense fallback={<IncompleteMappingsSkeleton />}>
              <IncompleteMappingsTable
                employeesWithSingleMapping={employeesWithSingleMapping}
                availableReports={filteredReports.filter(
                  (report) => !employeesWithSingleMapping.some(({ report: r }) => r.id === report.id),
                )}
              />
            </Suspense>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmployeeTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="h-10 border-b bg-muted/50"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b flex items-center px-4">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <Skeleton className="h-4 w-1/4" />
          <div className="ml-auto flex space-x-2">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ReportListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-4">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-5 w-1/4" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function IncompleteMappingsSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="h-10 border-b bg-muted/50"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 border-b flex items-center px-4">
          <Skeleton className="h-8 w-8 rounded-full mr-2" />
          <Skeleton className="h-4 w-1/4" />
          <div className="ml-auto flex space-x-2">
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

function OrgChartSkeleton() {
  return (
    <div className="h-96 w-full bg-muted/30 rounded-md flex items-center justify-center">
      <Skeleton className="h-80 w-4/5 rounded-md" />
    </div>
  )
}

