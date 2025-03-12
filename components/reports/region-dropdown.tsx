"use client"

import { useRouter, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Region } from "@/lib/data"
import { useTransition } from "react"

interface RegionDropdownProps {
  regions: Region[]
  selectedRegionId: string
}

export function RegionDropdown({ regions, selectedRegionId }: RegionDropdownProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleRegionChange = (value: string) => {
    startTransition(() => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams()

      // Add the region parameter
      if (value !== "all") {
        params.set("region", value)
      }

      // Navigate to the new URL
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <Select value={selectedRegionId || "all"} onValueChange={handleRegionChange} disabled={isPending}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Regions</SelectItem>
        {regions.map((region) => (
          <SelectItem key={region.id} value={region.id}>
            {region.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

