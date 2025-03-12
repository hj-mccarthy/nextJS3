// Types
export interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
}

export interface Report {
  id: string
  name: string
  region: string
  supervisors: string[]
  mappings: string[]
  description: string
  lastUpdated: string
}

export interface Region {
  id: string
  name: string
}

export interface Supervisor {
  id: string
  name: string
  email: string
  phone: string
  department: string
  title: string
  bio: string
  yearsOfExperience: number
  reportsManaged: string[]
  profileImage?: string
}

// Mock data
export const regions: Region[] = [
  { id: "na", name: "North America" },
  { id: "eu", name: "Europe" },
  { id: "asia", name: "Asia Pacific" },
  { id: "latam", name: "Latin America" },
]

export const supervisors: Supervisor[] = [
  {
    id: "sup1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    department: "Sales",
    title: "Regional Sales Director",
    bio: "John has over 15 years of experience in sales management across North America. He specializes in building high-performing teams and developing strategic partnerships.",
    yearsOfExperience: 15,
    reportsManaged: ["r1"],
  },
  {
    id: "sup2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    department: "Sales",
    title: "VP of Sales Operations",
    bio: "Jane brings 12 years of expertise in sales operations and analytics. She is known for implementing data-driven strategies that consistently exceed targets.",
    yearsOfExperience: 12,
    reportsManaged: ["r1"],
  },
  {
    id: "sup3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 456-7890",
    department: "Finance",
    title: "Financial Analysis Director",
    bio: "Robert has 20 years of experience in financial analysis and reporting. He specializes in identifying cost-saving opportunities and optimizing financial processes.",
    yearsOfExperience: 20,
    reportsManaged: ["r2"],
  },
  {
    id: "sup4",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    phone: "+34 612 345 678",
    department: "Marketing",
    title: "European Marketing Lead",
    bio: "Maria has led marketing initiatives across European markets for 10 years. She excels at developing localized marketing strategies that resonate with diverse audiences.",
    yearsOfExperience: 10,
    reportsManaged: ["r3"],
  },
  {
    id: "sup5",
    name: "Hans Mueller",
    email: "hans.mueller@example.com",
    phone: "+49 30 12345678",
    department: "Market Research",
    title: "Senior Market Analyst",
    bio: "Hans brings 8 years of experience in market research and competitive analysis. He specializes in identifying emerging market trends and growth opportunities.",
    yearsOfExperience: 8,
    reportsManaged: ["r3"],
  },
  {
    id: "sup6",
    name: "Li Wei",
    email: "li.wei@example.com",
    phone: "+86 10 8765 4321",
    department: "Customer Success",
    title: "APAC Customer Success Director",
    bio: "Li has 14 years of experience in customer success and relationship management across Asia Pacific. She is skilled at building long-term client partnerships.",
    yearsOfExperience: 14,
    reportsManaged: ["r4"],
  },
  {
    id: "sup7",
    name: "Akira Tanaka",
    email: "akira.tanaka@example.com",
    phone: "+81 3 1234 5678",
    department: "Operations",
    title: "Regional Operations Manager",
    bio: "Akira has 9 years of experience optimizing business operations across Asia. He specializes in process improvement and operational efficiency.",
    yearsOfExperience: 9,
    reportsManaged: ["r4"],
  },
  {
    id: "sup8",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@example.com",
    phone: "+52 55 1234 5678",
    department: "Business Development",
    title: "LATAM Growth Director",
    bio: "Carlos has 11 years of experience in business development across Latin America. He excels at identifying new market opportunities and building strategic partnerships.",
    yearsOfExperience: 11,
    reportsManaged: ["r5"],
  },
]

export const reports: Report[] = [
  {
    id: "r1",
    name: "Q1 Sales Report",
    region: "na",
    supervisors: ["John Doe", "Jane Smith"],
    mappings: ["e1", "e2", "e3"],
    description: "Quarterly sales report for North America region",
    lastUpdated: "2025-03-01",
  },
  {
    id: "r2",
    name: "Annual Financial Review",
    region: "na",
    supervisors: ["Robert Johnson"],
    mappings: ["e4", "e5"],
    description: "Annual financial performance review for North America",
    lastUpdated: "2025-02-15",
  },
  {
    id: "r3",
    name: "Market Analysis",
    region: "eu",
    supervisors: ["Maria Garcia", "Hans Mueller"],
    mappings: ["e6", "e7", "e8"],
    description: "Comprehensive market analysis for European markets",
    lastUpdated: "2025-03-10",
  },
  {
    id: "r4",
    name: "Customer Satisfaction Survey",
    region: "asia",
    supervisors: ["Li Wei", "Akira Tanaka"],
    mappings: ["e9", "e10"],
    description: "Annual customer satisfaction survey results for Asia Pacific",
    lastUpdated: "2025-02-28",
  },
  {
    id: "r5",
    name: "Growth Opportunities",
    region: "latam",
    supervisors: ["Carlos Rodriguez"],
    mappings: ["e11"],
    description: "Analysis of growth opportunities in Latin American markets",
    lastUpdated: "2025-03-05",
  },
]

export const employees: Employee[] = [
  {
    id: "e1",
    name: "Alice Johnson",
    email: "alice@example.com",
    position: "Sales Representative",
    department: "Sales",
  },
  { id: "e2", name: "Bob Smith", email: "bob@example.com", position: "Sales Manager", department: "Sales" },
  { id: "e3", name: "Carol Williams", email: "carol@example.com", position: "Data Analyst", department: "Analytics" },
  { id: "e4", name: "David Brown", email: "david@example.com", position: "Financial Analyst", department: "Finance" },
  { id: "e5", name: "Eva Davis", email: "eva@example.com", position: "Accountant", department: "Finance" },
  {
    id: "e6",
    name: "Frank Miller",
    email: "frank@example.com",
    position: "Market Researcher",
    department: "Marketing",
  },
  {
    id: "e7",
    name: "Grace Wilson",
    email: "grace@example.com",
    position: "Marketing Specialist",
    department: "Marketing",
  },
  { id: "e8", name: "Henry Taylor", email: "henry@example.com", position: "Product Manager", department: "Product" },
  {
    id: "e9",
    name: "Ivy Lee",
    email: "ivy@example.com",
    position: "Customer Success Manager",
    department: "Customer Support",
  },
  {
    id: "e10",
    name: "Jack Chen",
    email: "jack@example.com",
    position: "Support Specialist",
    department: "Customer Support",
  },
  { id: "e11", name: "Karen Lopez", email: "karen@example.com", position: "Business Development", department: "Sales" },
  { id: "e12", name: "Leo Martinez", email: "leo@example.com", position: "Sales Representative", department: "Sales" },
  { id: "e13", name: "Mia Robinson", email: "mia@example.com", position: "Data Scientist", department: "Analytics" },
]

// Server-side data fetching functions
export async function getRegions(): Promise<Region[]> {
  // In a real app, this would fetch from an API or database
  return regions
}

export async function getReports(): Promise<Report[]> {
  // In a real app, this would fetch from an API or database
  return reports
}

export async function getReportsByRegion(regionId: string): Promise<Report[]> {
  // In a real app, this would fetch from an API or database
  if (regionId === "all") return reports
  return reports.filter((report) => report.region === regionId)
}

export async function getReportById(reportId: string): Promise<Report | undefined> {
  // In a real app, this would fetch from an API or database
  return reports.find((report) => report.id === reportId)
}

export async function getEmployees(): Promise<Employee[]> {
  // In a real app, this would fetch from an API or database
  return employees
}

export async function getEmployeesByReportId(reportId: string): Promise<Employee[]> {
  // In a real app, this would fetch from an API or database
  const report = reports.find((r) => r.id === reportId)
  if (!report) return []

  return employees.filter((employee) => report.mappings.includes(employee.id))
}

export async function getSupervisorByName(name: string): Promise<Supervisor | undefined> {
  // In a real app, this would fetch from an API or database
  return supervisors.find((supervisor) => supervisor.name === name)
}

export async function getEmployeesWithSingleMapping(): Promise<{ employee: Employee; report: Report }[]> {
  // Get employees that appear in exactly one report's mappings
  const employeeMappingCount = new Map<string, string[]>()

  // Count the number of reports each employee is mapped to
  reports.forEach((report) => {
    report.mappings.forEach((employeeId) => {
      if (!employeeMappingCount.has(employeeId)) {
        employeeMappingCount.set(employeeId, [])
      }
      employeeMappingCount.get(employeeId)?.push(report.id)
    })
  })

  // Filter employees with exactly one mapping
  const singleMappedEmployees = Array.from(employeeMappingCount.entries())
    .filter(([_, reportIds]) => reportIds.length === 1)
    .map(([employeeId, reportIds]) => {
      const employee = employees.find((e) => e.id === employeeId)
      const report = reports.find((r) => r.id === reportIds[0])

      if (employee && report) {
        return { employee, report }
      }
      return null
    })
    .filter((item): item is { employee: Employee; report: Report } => item !== null)

  return singleMappedEmployees
}

export async function getEmployeesWithSingleMappingFiltered(
  departmentFilter?: string,
  positionFilter?: string,
  reportFilter?: string,
): Promise<{ employee: Employee; report: Report }[]> {
  // Get the base results
  const allResults = await getEmployeesWithSingleMapping()

  // Apply filters
  return allResults.filter(({ employee, report }) => {
    // Department filter
    if (departmentFilter && departmentFilter !== "all" && employee.department !== departmentFilter) {
      return false
    }

    // Position filter
    if (positionFilter && positionFilter !== "all" && employee.position !== positionFilter) {
      return false
    }

    // Report filter
    if (reportFilter && reportFilter !== "all" && report.id !== reportFilter) {
      return false
    }

    return true
  })
}

// Add this function to get unique departments
export async function getUniqueDepartments(): Promise<string[]> {
  const uniqueDepartments = new Set<string>()
  employees.forEach((employee) => uniqueDepartments.add(employee.department))
  return Array.from(uniqueDepartments)
}

// Add this function to get unique positions
export async function getUniquePositions(): Promise<string[]> {
  const uniquePositions = new Set<string>()
  employees.forEach((employee) => uniquePositions.add(employee.position))
  return Array.from(uniquePositions)
}

// Add this function to get supervisors for a specific report
export async function getSupervisorsForReport(reportId: string): Promise<Supervisor[]> {
  const report = reports.find((r) => r.id === reportId)
  if (!report) return []

  return supervisors.filter((supervisor) => report.supervisors.includes(supervisor.name))
}

// Add this function to get employees by supervisor
export async function getEmployeesBySupervisor(supervisorId: string): Promise<Employee[]> {
  const supervisor = supervisors.find((s) => s.id === supervisorId)
  if (!supervisor) return []

  // Get reports managed by this supervisor
  const managedReportIds = supervisor.reportsManaged

  // Get all employees mapped to these reports
  const employeeIds = new Set<string>()
  managedReportIds.forEach((reportId) => {
    const report = reports.find((r) => r.id === reportId)
    if (report) {
      report.mappings.forEach((employeeId) => employeeIds.add(employeeId))
    }
  })

  return employees.filter((employee) => employeeIds.has(employee.id))
}

