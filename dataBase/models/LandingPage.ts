import { Schema, model, models, Types } from 'mongoose'

const landingPageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    filters: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'fetching'],
      default: 'fetching',
    },
    boostedProducts: [
      {
        type: Types.ObjectId,
        ref: 'Product',
      },
    ],
    deletedProjects: [
      {
        type: Types.ObjectId,
        ref: 'Product',
      },
    ],
    queries: [
      {
        query: {
          type: String,
          required: true,
        },
        range: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

export const LandingPage = models.LandingPage || model('LandingPage', landingPageSchema)


