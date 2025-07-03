import { User } from "@/dataBase/models/Users"
import bcrypt from 'bcryptjs'
import connectDB from "@/dataBase/db"
async function signUp(body) {
    try {
        await connectDB()
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt)
        body.password = hashedPassword
        const user = await User.create(body)
        const userWithoutPassword = { ...user.toObject(), password: undefined }
        return {
            status: 201,
            message: 'User created successfully',
            user: userWithoutPassword
        }
    } catch (error) {
        console.log("SignUp error", error)

        // Check if it's a duplicate key error (E11000)
        if (error.code === 11000) {
            // Check if it's a duplicate email
            if (error.keyPattern && error.keyPattern.email) {
                return {
                    status: 409,
                    message: 'Email must be unique'
                }
            }
            // Handle other duplicate key errors
            return {
                status: 409,
                message: 'Duplicate key error'
            }
        }

        return {
            status: 500,
            message: 'Failed to create user',
            error: error
        }
    }
}

async function signIn(body) {
    try {
        console.log(body)
        await connectDB()
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return {
                status: 404,
                message: 'User not found'
            }
        }
        const isPasswordValid = await bcrypt.compare(body.password, user.password)
        if (!isPasswordValid) {
            return {
                status: 401,
                message: 'Invalid password'
            }
        }
        const userWithoutPassword = { ...user.toObject(), password: undefined }
        return {
            status: 200,
            message: 'User signed in successfully',
            user: userWithoutPassword
        }
    }
    catch (error) {
        return {
            status: 500,
            message: 'Failed to sign in user',
            error: error
        }
    }
}
export { signUp, signIn }