/* eslint-disable @typescript-eslint/no-explicit-any */
import Webinar from "../models/webinar";

export const createWebinar = (data: any) => Webinar.create(data);

export const listWebinars = async (query: any) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  const sort = (query.sort as string) || "-webinarDate";
  const q = (query.q as string) || "";

  const filter: any = {};
  if (q) filter.webinarName = { $regex: q, $options: "i" };

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Webinar.find(filter).sort(sort).skip(skip).limit(limit),
    Webinar.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
};

export const getWebinarById = async (id: string) => {
  const doc = await Webinar.findById(id);
  if (!doc)
    throw Object.assign(new Error("Webinar not found"), { status: 404 });
  return doc;
};

export const updateWebinar = async (id: string, data: any) => {
  const updated = await Webinar.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updated)
    throw Object.assign(new Error("Webinar not found"), { status: 404 });
  return updated;
};

export const deleteWebinar = async (id: string) => {
  const deleted = await Webinar.findByIdAndDelete(id);
  if (!deleted)
    throw Object.assign(new Error("Webinar not found"), { status: 404 });
  return deleted;
};

export const enrollUser = async (id: string, email: string) => {
  const webinar = await Webinar.findById(id);
  if (!webinar)
    throw Object.assign(new Error("Webinar not found"), { status: 404 });

  const exists = webinar.enrolledUser.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists)
    throw Object.assign(new Error("User already enrolled"), { status: 409 });

  webinar.enrolledUser.push({ email: email.toLowerCase() });
  await webinar.save();
  return webinar;
};

export const unenrollUser = async (id: string, email: string) => {
  const webinar = await Webinar.findById(id);
  if (!webinar)
    throw Object.assign(new Error("Webinar not found"), { status: 404 });

  const before = webinar.enrolledUser.length;
  webinar.enrolledUser = webinar.enrolledUser.filter(
    (u) => u.email.toLowerCase() !== email.toLowerCase()
  );
  if (webinar.enrolledUser.length === before) {
    throw Object.assign(new Error("Email not enrolled for this webinar"), {
      status: 404,
    });
  }

  await webinar.save();
  return webinar;
};
