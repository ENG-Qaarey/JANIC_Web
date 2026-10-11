import { EventRepository } from "@/repositories/event.repository";
import { slugify } from "@/lib/utils";
import { ContentStatus, Prisma } from "@prisma/client";

function serializeJson(val: any): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "string") return val;
  try {
    return JSON.stringify(val);
  } catch {
    return null;
  }
}

export class EventService {
  static async getUpcomingEvents(limit = 4) {
    return EventRepository.findPublished({ upcomingOnly: true, limit });
  }

  static async getPublishedEvents(options?: {
    isFeatured?: boolean;
    upcomingOnly?: boolean;
    pastOnly?: boolean;
    limit?: number;
  }) {
    return EventRepository.findPublished(options);
  }

  static async getEventBySlug(slug: string) {
    return EventRepository.findBySlug(slug);
  }

  static async getAllAdmin(options?: { status?: ContentStatus; search?: string }) {
    return EventRepository.findAllAdmin(options);
  }

  static async createEvent(data: {
    title: string;
    summary: string;
    description: string;
    category: string;
    eventDate: Date;
    endDate?: Date | null;
    location: string;
    isVirtual?: boolean;
    registrationUrl?: string | null;
    capacity?: number | null;
    status?: ContentStatus;
    isFeatured?: boolean;
    coverImage?: string | null;
    videoUrl?: string | null;
    attendeesCount?: number | null;
    gallery?: any;
    guests?: any;
    agenda?: any;
    keyHighlights?: any;
  }) {
    let slug = slugify(data.title);
    const existing = await EventRepository.findBySlug(slug);
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const createInput: any = {
      title: data.title,
      slug,
      summary: data.summary,
      description: data.description,
      category: data.category,
      eventDate: data.eventDate,
      endDate: data.endDate || null,
      location: data.location,
      isVirtual: !!data.isVirtual,
      registrationUrl: data.registrationUrl || null,
      capacity: data.capacity,
      status: data.status || ContentStatus.DRAFT,
      isFeatured: !!data.isFeatured,
      coverImage: data.coverImage || null,
      videoUrl: data.videoUrl || null,
      attendeesCount: data.attendeesCount,
      gallery: serializeJson(data.gallery),
      guests: serializeJson(data.guests),
      agenda: serializeJson(data.agenda),
      keyHighlights: serializeJson(data.keyHighlights),
    };

    return EventRepository.create(createInput);
  }

  static async updateEvent(id: string, data: any) {
    const updateInput: any = { ...data };
    if ("gallery" in data) updateInput.gallery = serializeJson(data.gallery);
    if ("guests" in data) updateInput.guests = serializeJson(data.guests);
    if ("agenda" in data) updateInput.agenda = serializeJson(data.agenda);
    if ("keyHighlights" in data) updateInput.keyHighlights = serializeJson(data.keyHighlights);
    return EventRepository.update(id, updateInput);
  }

  static async deleteEvent(id: string) {
    return EventRepository.delete(id);
  }
}
