import type { NextRequest } from "next/server"
import { getSupervisorByName } from "@/lib/data"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get("name")

  if (!name) {
    return Response.json({ error: "Supervisor name is required" }, { status: 400 })
  }

  try {
    const supervisor = await getSupervisorByName(name)

    if (!supervisor) {
      return Response.json({ error: "Supervisor not found" }, { status: 404 })
    }

    return Response.json(supervisor)
  } catch (error) {
    console.error("Error fetching supervisor:", error)
    return Response.json({ error: "Failed to fetch supervisor data" }, { status: 500 })
  }
}

