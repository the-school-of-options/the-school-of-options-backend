import { Request, Response } from "express";
import { subscriberService } from "../services/subscriber.service";

const create = async (req: Request, res: Response) => {
  try {
    const { email, fullName } = req.body as { email?: string; fullName?: string };
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const subscriber = await subscriberService.create({ email, fullName });
    return res.status(201).json({ subscriber });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    const status = message.includes("already exists") ? 409 : 500;
    return res.status(status).json({ error: message });
  }
};

const findOneById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const subscriber = await subscriberService.findById(id);
    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    return res.status(200).json({ subscriber });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return res.status(500).json({ error: message });
  }
};

const findOneByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query as { email?: string };
    if (!email) {
      return res.status(400).json({ error: "Email query param is required" });
    }
    const subscriber = await subscriberService.findByEmail(email);
    if (!subscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }
    return res.status(200).json({ subscriber });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return res.status(500).json({ error: message });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const { page, limit, q } = req.query as { page?: string; limit?: string; q?: string };
    const result = await subscriberService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      q,
    });
    return res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return res.status(500).json({ error: message });
  }
};

export const subscriberController = {
  create,
  findOneById,
  findOneByEmail,
  findAll,
};
