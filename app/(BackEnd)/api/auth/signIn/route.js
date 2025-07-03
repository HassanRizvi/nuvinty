import { signIn } from "../authController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json()
        console.log(body)
        const response = await signIn(body)
        return NextResponse.json(response, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to sign in user' }, { status: 500 })
    }
}

