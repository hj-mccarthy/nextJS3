"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Briefcase, Calendar, FileText } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Supervisor } from "@/lib/data"

interface SupervisorModalProps {
  supervisorName: string
  isOpen: boolean
  onClose: () => void
}

export function SupervisorModal({ supervisorName, isOpen, onClose }: SupervisorModalProps) {
  const [supervisor, setSupervisor] = useState<Supervisor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch supervisor data when the modal opens
  useEffect(() => {
    if (isOpen && supervisorName) {
      setLoading(true)
      setError(null)

      fetch(`/api/supervisors?name=${encodeURIComponent(supervisorName)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch supervisor data")
          return res.json()
        })
        .then((data) => {
          setSupervisor(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching supervisor:", err)
          setError("Failed to load supervisor information. Please try again.")
          setLoading(false)
        })
    }
  }, [isOpen, supervisorName])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Supervisor Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
          </div>
        ) : supervisor ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {supervisor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{supervisor.name}</h3>
                <p className="text-sm text-muted-foreground">{supervisor.title}</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground">{supervisor.bio}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{supervisor.email}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{supervisor.phone}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{supervisor.department}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{supervisor.yearsOfExperience} years experience</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-sm">Reports Managed</h4>
              <div className="flex flex-wrap gap-2">
                {supervisor.reportsManaged.length > 0 ? (
                  supervisor.reportsManaged.map((reportId, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {reportId}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No reports currently managed</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>No information available for {supervisorName}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

