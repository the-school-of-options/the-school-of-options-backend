import { Types } from "mongoose";
import Subscriber, { ISubscriber } from "../models/subscriber.model";

export interface CreateSubscriberInput {
  email: string;
  fullName?: string;
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const subscriberService = {
  async create(data: CreateSubscriberInput): Promise<ISubscriber> {
    const email = normalizeEmail(data.email);

    const exists = await Subscriber.findOne({ email }).lean();
    if (exists) {
      throw new Error("Subscriber with this email already exists");
    }

    const sub = new Subscriber({
      email,
      fullName: data.fullName?.trim(),
    });

    await sub.save();
    return sub.toObject();
  },

  async findById(id: string): Promise<ISubscriber | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    return Subscriber.findById(id).lean();
  },

  async findByEmail(email: string): Promise<ISubscriber | null> {
    return Subscriber.findOne({ email: normalizeEmail(email) }).lean();
  },

  /**
   * Basic list with optional text search on email/fullName and pagination
   */
  async findAll(opts?: {
    page?: number;
    limit?: number;
    q?: string;
  }): Promise<{ data: ISubscriber[]; page: number; limit: number; total: number }> {
    const page = Math.max(1, Number(opts?.page || 1));
    const limit = Math.min(100, Math.max(1, Number(opts?.limit || 10)));

    const filter: Record<string, any> = {};
    if (opts?.q) {
      const q = String(opts.q).trim();
      filter.$or = [
        { email: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      Subscriber.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Subscriber.countDocuments(filter),
    ]);

    return { data, page, limit, total };
  },
};
