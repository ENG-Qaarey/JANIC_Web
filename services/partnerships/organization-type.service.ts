import { SettingService } from "@/services/settings/setting.service";

const DEFAULT_ORG_TYPES = [
  "SMEs & Startups",
  "Women-Owned Businesses",
  "Universities & Education",
  "NGOs & Development Orgs",
  "Government Institutions",
  "Technology Companies",
  "Researchers & Professionals",
];

export class OrganizationTypeService {
  static async getAll(): Promise<{ id: string; name: string }[]> {
    try {
      const setting = await SettingService.getByKey("partnership_org_types");
      if (setting?.value) {
        const list: string[] = JSON.parse(setting.value);
        if (Array.isArray(list) && list.length > 0) {
          return list.map((name, index) => ({ id: `org-type-${index}-${name}`, name }));
        }
      }
    } catch {}
    return DEFAULT_ORG_TYPES.map((name, index) => ({ id: `org-type-${index}-${name}`, name }));
  }

  static async create(name: string): Promise<{ id: string; name: string }> {
    if (!name || name.trim().length < 2) {
      throw new Error("Organization type name must be at least 2 characters");
    }
    const trimmed = name.trim();
    const current = await this.getAll();
    if (current.some((t) => t.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error("Organization type already exists");
    }
    const updatedNames = [...current.map((t) => t.name), trimmed];
    await SettingService.upsert("partnership_org_types", JSON.stringify(updatedNames), "partnerships");
    return { id: `org-type-${updatedNames.length - 1}-${trimmed}`, name: trimmed };
  }

  static async update(idOrName: string, newName: string): Promise<{ id: string; name: string }> {
    if (!newName || newName.trim().length < 2) {
      throw new Error("Organization type name must be at least 2 characters");
    }
    const trimmed = newName.trim();
    const current = await this.getAll();
    if (current.some((t) => t.name.toLowerCase() === trimmed.toLowerCase() && t.id !== idOrName && t.name !== idOrName)) {
      throw new Error("Organization type already exists");
    }
    const updatedNames = current.map((t) => (t.id === idOrName || t.name === idOrName ? trimmed : t.name));
    await SettingService.upsert("partnership_org_types", JSON.stringify(updatedNames), "partnerships");
    return { id: idOrName, name: trimmed };
  }

  static async delete(idOrName: string): Promise<boolean> {
    const current = await this.getAll();
    const filtered = current.filter((t) => t.id !== idOrName && t.name !== idOrName);
    const updatedNames = filtered.map((t) => t.name);
    await SettingService.upsert("partnership_org_types", JSON.stringify(updatedNames), "partnerships");
    return true;
  }
}
