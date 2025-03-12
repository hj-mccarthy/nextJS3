"use server"

import { reports, getReports, getEmployees } from "./data"
import { revalidatePath } from "next/cache"

export async function addEmployeeToReport(employeeId: string, reportId: string) {
  // In a real app, this would update a database
  const report = reports.find((r) => r.id === reportId)

  if (report && !report.mappings.includes(employeeId)) {
    report.mappings.push(employeeId)

    // Revalidate the paths to refresh the data
    revalidatePath("/reports")
    revalidatePath("/incomplete-mappings")

    return { success: true }
  }

  return { success: false, error: "Failed to add employee to report" }
}

export async function generateExcelData() {
  // Get all reports and employees
  const allReports = await getReports()
  const allEmployees = await getEmployees()

  // Create a mapping of employee IDs to employee objects for quick lookup
  const employeeMap = new Map(allEmployees.map((employee) => [employee.id, employee]))

  // Prepare the data for Excel export
  const mappingsData = []

  // For each report, find all mapped employees and add them to the data
  for (const report of allReports) {
    for (const employeeId of report.mappings) {
      const employee = employeeMap.get(employeeId)

      if (employee) {
        mappingsData.push({
          reportId: report.id,
          reportName: report.name,
          reportRegion: report.region,
          employeeId: employee.id,
          employeeName: employee.name,
          employeeEmail: employee.email,
          employeePosition: employee.position,
          employeeDepartment: employee.department,
        })
      }
    }
  }

  return mappingsData
}

export async function updateEmployeeStatus(updates: { employeeId: string; isActive: boolean; reportId: string }[]) {
  try {
    // In a real app, this would update a database
    // For this demo, we'll just log the updates
    console.log("Employee status updates:", updates)

    // Simulate a database update
    for (const update of updates) {
      const { employeeId, isActive, reportId } = update

      // If employee is marked as inactive, we would update the database
      // For this demo, we'll just log the action
      console.log(`Employee ${employeeId} is now ${isActive ? "active" : "inactive"} for report ${reportId}`)
    }

    // Revalidate the paths to refresh the data
    revalidatePath("/reports")

    return { success: true }
  } catch (error) {
    console.error("Error updating employee statuses:", error)
    return { success: false, error: "Failed to update employee statuses" }
  }
}

// New action to assign a supervisor to an employee
export async function assignSupervisorToEmployee(employeeId: string, supervisorId: string) {
  try {
    // In a real app, this would update a database
    // For this demo, we'll just log the assignment
    console.log(`Assigning supervisor ${supervisorId} to employee ${employeeId}`)

    // Revalidate the paths to refresh the data
    revalidatePath("/reports")

    return { success: true }
  } catch (error) {
    console.error("Error assigning supervisor:", error)
    return { success: false, error: "Failed to assign supervisor" }
  }
}

