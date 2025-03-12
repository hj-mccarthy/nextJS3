import { getEmployees } from "@/lib/data"
import { EmployeeList } from "@/components/reports/employee-list"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""
  const employees = await getEmployees()

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => {
    if (!query) return false

    const searchTerms = query.toLowerCase()
    return (
      employee.name.toLowerCase().includes(searchTerms) ||
      employee.email.toLowerCase().includes(searchTerms) ||
      employee.position.toLowerCase().includes(searchTerms) ||
      employee.department.toLowerCase().includes(searchTerms)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/reports">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Search Results</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">
          {query ? `Search results for "${query}"` : "Search for employees"}
        </h2>
        <p className="text-gray-600">
          {query
            ? `Found ${filteredEmployees.length} employee${filteredEmployees.length !== 1 ? "s" : ""} matching your search.`
            : "Enter a search term to find employees by name, email, position, or department."}
        </p>
      </div>

      <Suspense fallback={<EmployeeListSkeleton />}>
        {filteredEmployees.length > 0 ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <EmployeeList employees={filteredEmployees} />
          </div>
        ) : query ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No employees found matching your search.</p>
          </div>
        ) : null}
      </Suspense>
    </div>
  )
}

function EmployeeListSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

