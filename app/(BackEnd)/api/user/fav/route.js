import { addToFav, getFav } from "../userController";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json()
        const response = await addToFav(body)
        return NextResponse.json(response, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to sign in user' }, { status: 500 })
    }
}
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        
        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }
        
        const response = await getFav({ userId })
        return NextResponse.json(response, { status: response.status })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to get favorites' }, { status: 500 })
    }
}

