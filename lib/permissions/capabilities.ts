import { Role } from "@prisma/client";

export const MODULES = [
  "projects",
  "project_members",
  "training",
  "research",
  "events",
  "submissions",
  "partnerships",
  "messages",
  "team",
  "media",
  "settings",
  "users"
] as const;

export type PermissionModule = (typeof MODULES)[number];
export type CrudAction = "create" | "read" | "update" | "delete";
export type PermissionCapability = `${PermissionModule}:${CrudAction}`;

export const PERMISSION_CAPABILITIES: PermissionCapability[] = MODULES.flatMap(mod => [
  `${mod}:create`,
  `${mod}:read`,
  `${mod}:update`,
  `${mod}:delete`
] as PermissionCapability[]);

export const DEFAULT_ROLE_PERMISSIONS: Record<Role | "USER" | string, PermissionCapability[]> = {
  ADMIN: [...PERMISSION_CAPABILITIES],
  EDITOR: [
    "projects:create", "projects:read", "projects:update", "projects:delete",
    "training:create", "training:read", "training:update", "training:delete",
    "research:create", "research:read", "research:update", "research:delete",
    "events:create", "events:read", "events:update", "events:delete",
    "media:create", "media:read", "media:update", "media:delete",
    "submissions:read", "submissions:update",
    "partnerships:create", "partnerships:read", "partnerships:update", "partnerships:delete"
  ],
  STAFF: [
    "projects:read", "training:read", "research:read", "events:read", "media:read", "submissions:read",
    "partnerships:read", "partnerships:update"
  ],
  USER: [],
};
