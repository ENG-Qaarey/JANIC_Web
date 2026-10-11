import { TrainingRepository, TrainerData } from "@/repositories/training.repository";
import { slugify, calculateDuration } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";

export class TrainingService {
  static async getFeaturedPrograms(limit = 4) {
    return TrainingRepository.findPublished({ isFeatured: true, limit });
  }

  static async getPublishedPrograms(options?: {
    category?: string;
    level?: string;
    limit?: number;
  }) {
    return TrainingRepository.findPublished(options);
  }

  static async getProgramBySlug(slug: string) {
    return TrainingRepository.findBySlug(slug);
  }

  static async getProgramById(id: string) {
    return TrainingRepository.findById(id);
  }

  static async getAllAdmin(options?: { status?: ContentStatus; search?: string }) {
    return TrainingRepository.findAllAdmin(options);
  }

  static async createProgram(data: {
    title: string;
    summary?: string;
    description: string;
    category: string;
    level?: string;
    duration?: string;
    schedule?: string;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    mode?: string;
    certification?: string;
    status?: ContentStatus;
    isFeatured?: boolean;
    coverImage?: string;
    maxSeats?: number | string | null;
    syllabus?: string;
    trainers?: TrainerData[] | string;
    allowComments?: boolean;
    allowInteractions?: boolean;
  }) {
    let slug = slugify(data.title);
    const existing = await TrainingRepository.findBySlug(slug);
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const trainersString =
      typeof data.trainers === "string"
        ? data.trainers
        : data.trainers
        ? JSON.stringify(data.trainers)
        : null;

    // Automatically calculate duration from start and end dates
    const computedDuration = calculateDuration(data.startDate, data.endDate);

    const createInput: Prisma.TrainingProgramCreateInput = {
      title: data.title,
      slug,
      summary: data.summary || data.description.slice(0, 160),
      description: data.description,
      category: data.category,
      level: data.level || "Intermediate",
      duration: computedDuration || data.duration || "Self-Paced",
      schedule: data.schedule || "Flexible",
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      mode: data.mode || "On-Campus",
      certification: data.certification || null,
      status: data.status || ContentStatus.DRAFT,
      isFeatured: !!data.isFeatured,
      coverImage: data.coverImage || null,
      maxSeats: data.maxSeats ? Number(data.maxSeats) : null,
      syllabus: data.syllabus || null,
      trainers: trainersString,
      allowComments: data.allowComments !== undefined ? Boolean(data.allowComments) : true,
      allowInteractions: data.allowInteractions !== undefined ? Boolean(data.allowInteractions) : true,
    };

    return TrainingRepository.create(createInput);
  }

  static async updateProgram(id: string, data: any) {
    const updatePayload: any = {};

    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.summary !== undefined) updatePayload.summary = data.summary;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.category !== undefined) updatePayload.category = data.category;
    if (data.level !== undefined) updatePayload.level = data.level;
    if (data.schedule !== undefined) updatePayload.schedule = data.schedule;
    if (data.mode !== undefined) updatePayload.mode = data.mode;
    if (data.certification !== undefined) updatePayload.certification = data.certification;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.isFeatured !== undefined) updatePayload.isFeatured = Boolean(data.isFeatured);
    if (data.coverImage !== undefined) updatePayload.coverImage = data.coverImage;
    if (data.syllabus !== undefined) updatePayload.syllabus = data.syllabus;
    if (data.allowComments !== undefined) updatePayload.allowComments = Boolean(data.allowComments);
    if (data.allowInteractions !== undefined) updatePayload.allowInteractions = Boolean(data.allowInteractions);
    if (data.maxSeats !== undefined) {
      updatePayload.maxSeats = data.maxSeats ? Number(data.maxSeats) : null;
    }

    let startDateVal: Date | null | undefined = undefined;
    let endDateVal: Date | null | undefined = undefined;

    if (data.startDate !== undefined) {
      startDateVal = data.startDate ? new Date(data.startDate) : null;
      updatePayload.startDate = startDateVal;
    }
    if (data.endDate !== undefined) {
      endDateVal = data.endDate ? new Date(data.endDate) : null;
      updatePayload.endDate = endDateVal;
    }

    // Auto-calculate duration if start/end dates are provided or changed
    if (startDateVal !== undefined || endDateVal !== undefined) {
      let start = startDateVal;
      let end = endDateVal;
      if (start === undefined || end === undefined) {
        const existing = await TrainingRepository.findById(id);
        if (existing) {
          if (start === undefined) start = existing.startDate;
          if (end === undefined) end = existing.endDate;
        }
      }
      updatePayload.duration = calculateDuration(start, end);
    } else if (data.duration !== undefined) {
      updatePayload.duration = data.duration;
    }

    if (data.trainers !== undefined) {
      updatePayload.trainers =
        typeof data.trainers === "string"
          ? data.trainers
          : data.trainers
          ? JSON.stringify(data.trainers)
          : null;
    }

    return TrainingRepository.update(id, updatePayload);
  }

  static async deleteProgram(id: string) {
    return TrainingRepository.delete(id);
  }
}

