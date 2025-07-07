import { createQuery } from "../querieController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json()
        const response = await createQuery(body)
        return NextResponse.json(response, { status: 200 })
    } catch (error) {
        console.log("createQuery error", error)
        return NextResponse.json({ error: 'Failed to create query' }, { status: 500 })
    }
}

