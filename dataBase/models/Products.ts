import mongoose, { model, models } from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    size: {
        type: [String],
        default: [],
    },
    location: {
        type: String,
    },
    type: {
        type: String,
    },
    brand: {
        type: String,
    },
    category: {
        type: String,
    },
    material: {
        type: String,
    },
    color: {
        type: String,
    },
    condition: {
        type: String,
    },
    scraped_data: {
        type: Boolean,
        default: false,
    },
    images: {
        type: [String],
        default: [],
    },
    item_id: {
        type: String,
        unique: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      price: {
        type: String, // or Number if you plan to use it for math
        required: true,
      },
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema)
// export const Product = mongoose.model('Product', ProductSchema)
