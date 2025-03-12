import { getEmployeesWithSingleMappingFiltered, getReports, getUniqueDepartments, getUniquePositions } from "@/lib/data"
import { IncompleteEmployeeCard } from "@/components/incomplete-mappings/incomplete-employee-card"
import { FilterDropdowns } from "@/components/incomplete-mappings/filter-dropdowns"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function IncompleteMappingsPage({
  searchParams,
}: {
  searchParams: { department?: string; position?: string; report?: string }
}) {
  // Get filter values from search params
  const departmentFilter = searchParams.department || "all"
  const positionFilter = searchParams.position || "all"
  const reportFilter = searchParams.report || "all"

  // Get data for filters and results
  const departments = await getUniqueDepartments()
  const positions = await getUniquePositions()
  const allReports = await getReports()
  const employeesWithSingleMapping = await getEmployeesWithSingleMappingFiltered(
    departmentFilter !== "all" ? departmentFilter : undefined,
    positionFilter !== "all" ? positionFilter : undefined,
    reportFilter !== "all" ? reportFilter : undefined,
  )

  // Check if any filters are active
  const hasActiveFilters = departmentFilter !== "all" || positionFilter !== "all" || reportFilter !== "all"

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Incomplete Mappings</h2>
        <p className="text-gray-600 mb-6">
          Employees who are currently mapped to only one report. Add them to additional reports to complete their
          mappings.
        </p>

        <FilterDropdowns
          departments={departments}
          positions={positions}
          reports={allReports}
          selectedDepartment={departmentFilter}
          selectedPosition={positionFilter}
          selectedReport={reportFilter}
        />

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>

            {departmentFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Department: {departmentFilter}
                <Link href={createFilterUrl(searchParams, "department")}>
                  <X className="h-3 w-3 ml-1" />
                  <span className="sr-only">Remove department filter</span>
                </Link>
              </Badge>
            )}

            {positionFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Position: {positionFilter}
                <Link href={createFilterUrl(searchParams, "position")}>
                  <X className="h-3 w-3 ml-1" />
                  <span className="sr-only">Remove position filter</span>
                </Link>
              </Badge>
            )}

            {reportFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Report: {allReports.find((r) => r.id === reportFilter)?.name || reportFilter}
                <Link href={createFilterUrl(searchParams, "report")}>
                  <X className="h-3 w-3 ml-1" />
                  <span className="sr-only">Remove report filter</span>
                </Link>
              </Badge>
            )}

            {hasActiveFilters && (
              <Link href="/incomplete-mappings" className="text-sm text-primary hover:underline ml-2">
                Clear all filters
              </Link>
            )}
          </div>
        )}
      </div>

      <Suspense fallback={<IncompleteMappingsSkeleton />}>
        {employeesWithSingleMapping.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">
              {hasActiveFilters
                ? "No employees found matching the selected filters."
                : "No employees with incomplete mappings found."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employeesWithSingleMapping.map(({ employee, report }) => (
              <IncompleteEmployeeCard
                key={employee.id}
                employee={employee}
                currentReport={report}
                availableReports={allReports.filter((r) => r.id !== report.id)}
              />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  )
}

// Helper function to create a URL with a filter removed
function createFilterUrl(searchParams: Record<string, string | undefined>, filterToRemove: string): string {
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key !== filterToRemove && value) {
      params.set(key, value)
    }
  })

  return `/incomplete-mappings${params.toString() ? `?${params.toString()}` : ""}`
}

function IncompleteMappingsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border p-4">
          <div className="flex items-start space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <Skeleton className="h-3 w-1/3 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

