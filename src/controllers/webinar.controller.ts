// controllers/webinar.controller.ts
import type { Request, Response } from "express";
import {
  createWebinar,
  listWebinars,
  getWebinarById,
  updateWebinar,
  deleteWebinar,
  enrollUser,
  unenrollUser,
} from "../services/webinar.service";
import { catchAsync } from "../utils/createAsync";

export const create = catchAsync(async (req: Request, res: Response) => {
  const doc = await createWebinar(req.body);
  res.status(201).json(doc);
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const data = await listWebinars(req.query);
  res.json(data);
});

export const getById = catchAsync(async (req: Request, res: Response) => {
  const doc = await getWebinarById(req.params.id);
  res.json(doc);
});

export const update = catchAsync(async (req: Request, res: Response) => {
  const doc = await updateWebinar(req.params.id, req.body);
  res.json(doc);
});

export const remove = catchAsync(async (req: Request, res: Response) => {
  const doc = await deleteWebinar(req.params.id);
  res.json(doc);
});

export const enroll = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ error: { message: "email is required" } });
  const doc = await enrollUser(req.params.id, email);
  res.json(doc);
});

export const unenroll = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ error: { message: "email is required" } });
  const doc = await unenrollUser(req.params.id, email);
  res.json(doc);
});
