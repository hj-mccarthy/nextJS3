"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { updateEmployeeStatus } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { statusColors } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface EmployeeStatusButtonProps {
  employeeId: string
  currentStatus: "active" | "inactive" | "on_leave"
}

export function EmployeeStatusButton({ employeeId, currentStatus }: EmployeeStatusButtonProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const statusOptions: { value: "active" | "inactive" | "on_leave"; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "on_leave", label: "On Leave" },
  ]

  const handleStatusChange = async (newStatus: "active" | "inactive" | "on_leave") => {
    if (newStatus === status) return

    setIsUpdating(true)

    try {
      const result = await updateEmployeeStatus(employeeId, newStatus)

      if (result.success) {
        setStatus(newStatus)
        toast({
          title: "Status updated",
          description: `Employee status changed to ${newStatus.replace("_", " ")}.`,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const statusColor = statusColors[status]
  const statusLabel = status.replace("_", " ")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`${statusColor} border-0`} disabled={isUpdating}>
          {isUpdating ? "Updating..." : statusLabel}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={option.value === status ? "bg-secondary" : ""}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

