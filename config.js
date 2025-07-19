// const BaseUrl = "/api"
const BaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api"

const Endpoints = {
    auth: {
        signUp: {
            url: `${BaseUrl}/auth/signUp`,
            method: "POST"
        },
        signIn: {
            url: `${BaseUrl}/auth/signIn`,
            method: "POST"
        }
    },
    user: {
        addToFav: {
            url: `${BaseUrl}/user/fav`,
            method: "POST"
        },
        getFav: (userId) => ({
            url: `${BaseUrl}/user/fav?userId=${userId}`,
            method: "GET"
        }),
        getAllFav: (userId, page = 1, limit = 12) => ({
            url: `${BaseUrl}/user/allfav?userId=${userId}&page=${page}&limit=${limit}`,
            method: "GET"
        }),
        getUser: (userId) => ({
            url: `${BaseUrl}/user/getbyId?userId=${userId}`,
            method: "GET"
        })
    },
    product: {
        getProducts: (search = '', page = 1, limit = 12, category = '', brand = '', condition = '', size = '', location = '', gender = '', price = '') => ({
            url: `${BaseUrl}/product?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}&category=${category}&brand=${brand}&condition=${condition}&size=${size}&location=${location}&gender=${gender}&price=${price}`,
            method: "GET"
        })
    },
    queries: {
        create: {
            url: `${BaseUrl}/queries/create`,
            method: "POST"
        }
    }
}
export { BaseUrl, Endpoints }