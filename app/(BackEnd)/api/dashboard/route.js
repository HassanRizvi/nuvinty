import { NextResponse } from 'next/server'
import { getDashboard } from './dashboardController'

export async function GET() {
  const result = await getDashboard()
  return NextResponse.json(result, { status: result.status })
}


