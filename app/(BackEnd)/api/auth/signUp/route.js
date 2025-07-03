import { signUp } from "../authController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json()
        const response = await signUp(body)
        return NextResponse.json(response, { status: response.status })
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
        }
        console.log("SignUp error", error)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
}

