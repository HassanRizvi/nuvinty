export interface UserInterface {
    name: string
    email: string
    password: string
    savedSearches?: string[]
    likedProducts?: string[]
    createdAt?: Date
    updatedAt?: Date
} 