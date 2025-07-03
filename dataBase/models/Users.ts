import { Schema, model, models, Types } from 'mongoose'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    savedSearches: {
        type: [String],
        default: []
    },
    likedProducts: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// Update the updatedAt timestamp before saving
userSchema.pre('save', function (next) {
    this.updatedAt = new Date()
    next()
})

export const User = models.User || model('User', userSchema)