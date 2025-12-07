import mongoose, { model, models, Types } from 'mongoose';

const QuerySchema = new mongoose.Schema({
    query: { type: String },
    status: {
        type: String,
        default: "pending"
    },
    landingPageId: {
        type: Types.ObjectId,
        ref: 'LandingPage',
        required: false
    },
    limit: {
        type: Number,
        required: false
    },
    pages_processed: {
        type: Number,
        default: 0
    },
    total_pages: {
        type: Number,
        default: 0
    },
    total_products: {
        type: Number,
        default: 0
    },
    products_processed: {
        type: Number,
        default: 0
    },
    products_failed: {
        type: Number,
        default: 0
    },
    last_updated: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

export const Query = models.Query || model('Query', QuerySchema)
// export const Product = mongoose.model('Product', ProductSchema)
