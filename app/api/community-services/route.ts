import { NextRequest, NextResponse } from "next/server";
import { CommunityServiceService } from "@/lib/services/community-service.service";
import { getCurrentUser } from "@/lib/auth/jwt";
import { hasPermission } from "@/lib/permissions/roles";
import { notifyNewServiceRequest } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    // Submission is restricted to authenticated JANIC users. The identity comes from the
    // verified session token only — never from the request body.
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "You must be signed in to submit a service request.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    body.submittedById = user.id;

    const request = await CommunityServiceService.createRequest(body);

    // Notification is best-effort: never let mail delivery affect a saved submission.
    void notifyNewServiceRequest({
      id: request.id,
      requestNumber: request.requestNumber,
      organizationName: request.organizationName,
      organizationType: request.organizationType,
      organizationCategory: request.organizationCategory,
      contactPerson: request.contactPerson,
      email: request.email,
      phone: request.phone,
      country: request.country,
      city: request.city,
      serviceCategoryName: request.serviceCategoryRef?.name ?? null,
      serviceName: request.serviceRef?.name ?? null,
      requestTitle: request.requestTitle,
      description: request.description,
      budget: request.budget,
    });

    return NextResponse.json({ success: true, data: request });
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : "Error";
    if (msg.startsWith("{")) {
      return NextResponse.json({ success: false, errors: JSON.parse(msg) }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !hasPermission(user.role, "community_services:read")) {
      return NextResponse.json({ success: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || undefined;
    const orgType = searchParams.get("organizationType") || undefined;
    const categoryId = searchParams.get("serviceCategoryId") || undefined;
    const assignedTo = searchParams.get("assignedToId") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const search = searchParams.get("search") || undefined;

    const { CommunityServiceRepository } = await import("@/lib/repositories/community-service.repository");
    const result = await CommunityServiceRepository.list({
      page,
      limit,
      status: status as any,
      organizationType: orgType as any,
      serviceCategoryId: categoryId,
      assignedToId: assignedTo,
      priority: priority as any,
      search,
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    const msg = err instanceof Error ? err.message : "Error";
    const status = msg === "UNAUTHORIZED" ? 401 : msg === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}
