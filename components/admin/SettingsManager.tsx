"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  CheckCircle,
  Loader2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  Clock,
  Image as ImageIcon,
  ListOrdered,
  Layout,
  SlidersHorizontal,
  KeyRound,
  UserCog,
} from "lucide-react";
import { SystemToggles } from "./SystemToggles";
import { PermissionsMatrix } from "./PermissionsMatrix";
import { UserManager } from "./UserManager";
import { ImageUploadChoice } from "./ImageUploadChoice";

interface SettingItem {
  id: string;
  key: string;
  value: string;
  group: string;
}

interface SettingsManagerProps {
  initialSettings: SettingItem[];
  isAdmin?: boolean;
}

const ALL_TABS = [
  { id: "content", label: "Site Content", icon: Globe },
  { id: "system", label: "System", icon: SlidersHorizontal },
  { id: "permissions", label: "Permissions", icon: KeyRound },
  { id: "users", label: "Users", icon: UserCog },
];

export function SettingsManager({ initialSettings, isAdmin = true }: SettingsManagerProps) {
  const router = useRouter();
  const [tab, setTab] = useState("content");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const tabs = ALL_TABS.filter(t => isAdmin || (t.id !== "permissions" && t.id !== "users"));

  const settingsMap = initialSettings.reduce<Record<string, string>>((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const [form, setForm] = useState({
    site_name: settingsMap["site_name"] || "Jazeera Nexus Innovation Center (JANIC)",
    site_tagline: settingsMap["site_tagline"] || "Innovating Technology. Empowering the Future.",
    portal_notice: settingsMap["portal_notice"] || "Official Innovation Hub of the Faculty of Computer Science & IT",
    founded_date: settingsMap["founded_date"] || "October 25, 2021",
    institution_name: settingsMap["institution_name"] || "Jazeera University",
    faculty_name: settingsMap["faculty_name"] || "Faculty of Computer Science & IT",
    contact_email: settingsMap["contact_email"] || "info@janic.edu.so",
    contact_phone: settingsMap["contact_phone"] || "+252 61 555 1234",
    campus_address: settingsMap["campus_address"] || "Jazeera University Main Campus, KM4, Mogadishu, Somalia",
    campus_wing: settingsMap["campus_wing"] || "Faculty of Computer Science & IT, 2nd Floor Innovation Wing",
    office_hours: settingsMap["office_hours"] || "Saturday – Thursday: 8:00 AM – 5:00 PM\nFriday: Closed",
    accreditation_text: settingsMap["accreditation_text"] || "Accredited by the Ministry of Education, Culture and Higher Education of the Federal Government of Somalia.",
    linkedin_url: settingsMap["linkedin_url"] || "https://linkedin.com/school/jazeera-university",
    github_url: settingsMap["github_url"] || "https://github.com/janic-innovation",
    twitter_url: settingsMap["twitter_url"] || "",
    facebook_url: settingsMap["facebook_url"] || "",
    hero_title: settingsMap["hero_title"] || "Innovating Technology. Empowering the Future.",
    hero_subtitle:
      settingsMap["hero_subtitle"] ||
      "The leading institutional hub for technological transformation, advanced research, and digital excellence.",
    hero_image: settingsMap["hero_image"] || "/images/jazeera.jpeg",
    hero_badge_value: settingsMap["hero_badge_value"] || "18+",
    hero_badge_label: settingsMap["hero_badge_label"] || "STUDENT INNOVATION PROJECTS",
    footer_tagline: settingsMap["footer_tagline"] || "Technology • Innovation • Research • Training",
    accreditation_badge: settingsMap["accreditation_badge"] || "Accredited Academic Innovation Lab",
    nav_links: settingsMap["nav_links"] || "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSavedSuccess(false);

    try {
      const groupFor = (key: string) => {
        if (key.includes("email") || key.includes("phone") || key.includes("address") || key.includes("hours") || key.includes("wing") || key.includes("accreditation_text")) return "contact";
        if (key.includes("url")) return "social";
        if (key.startsWith("hero_")) return "hero";
        if (key.startsWith("footer_") || key === "accreditation_badge") return "footer";
        if (key === "nav_links") return "navigation";
        return "general";
      };

      const payload = Object.entries(form).map(([key, value]) => ({ key, value, group: groupFor(key) }));

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSavedSuccess(true);
      router.refresh();
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error saving settings");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none";

  const field = (label: string, key: keyof typeof form, type: string = "text", required = false) => (
    <div className="space-y-1.5" key={key}>
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => handleChange(key, e.target.value)}
        className={inputCls}
        required={required}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                tab === t.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                  : "bg-white text-muted-foreground border-border hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "system" && <SystemToggles settings={initialSettings} />}
      {isAdmin && tab === "permissions" && <PermissionsMatrix settings={initialSettings} />}
      {isAdmin && tab === "users" && <UserManager />}

      {tab === "content" && (
        <form onSubmit={handleSave} className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-border/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Institutional Configuration</h2>
                <p className="text-xs text-muted-foreground">
                  Changes reflect dynamically across public headers, footers, and portals.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fadeIn">
                  <CheckCircle className="w-4 h-4" /> Changes Saved!
                </span>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Settings
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* General Identity */}
            <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Globe className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-foreground">General Identity</h3>
              </div>
              {field("Center Name", "site_name", "text", true)}
              {field("Motto / Tagline", "site_tagline", "text", true)}
              {field("Official Portal Subtitle", "portal_notice")}
              {field("Founded Date", "founded_date")}
              {field("Institution Name", "institution_name")}
              {field("Faculty Name", "faculty_name")}
            </div>

            {/* Contact & Location */}
            <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Building className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-foreground">Institutional Contact & Location</h3>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Primary Email
                </label>
                <input type="email" value={form.contact_email} onChange={(e) => handleChange("contact_email", e.target.value)} className={inputCls} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Telephone / Helpline
                </label>
                <input type="text" value={form.contact_phone} onChange={(e) => handleChange("contact_phone", e.target.value)} className={inputCls} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Campus Address
                </label>
                <textarea rows={2} value={form.campus_address} onChange={(e) => handleChange("campus_address", e.target.value)} className={`${inputCls} resize-none`} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-muted-foreground" /> Innovation Wing / Floor Location
                </label>
                <input type="text" value={form.campus_wing} onChange={(e) => handleChange("campus_wing", e.target.value)} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Office Hours
                </label>
                <textarea rows={2} value={form.office_hours} onChange={(e) => handleChange("office_hours", e.target.value)} className={`${inputCls} resize-none`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" /> Academic Accreditation / Affiliation Note
                </label>
                <textarea rows={2} value={form.accreditation_text} onChange={(e) => handleChange("accreditation_text", e.target.value)} className={`${inputCls} resize-none`} />
              </div>
            </div>

            {/* Social */}
            <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Globe className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-foreground">Social Channels</h3>
              </div>
              {field("LinkedIn URL", "linkedin_url", "url")}
              {field("GitHub URL", "github_url", "url")}
              {field("Twitter / X URL", "twitter_url", "url")}
              {field("Facebook URL", "facebook_url", "url")}
            </div>

            {/* Hero */}
            <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-foreground">Homepage Hero</h3>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Hero Title (use line breaks)</label>
                <textarea rows={3} value={form.hero_title} onChange={(e) => handleChange("hero_title", e.target.value)} className={`${inputCls} resize-none`} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Hero Subtitle</label>
                <textarea rows={2} value={form.hero_subtitle} onChange={(e) => handleChange("hero_subtitle", e.target.value)} className={`${inputCls} resize-none`} />
              </div>
              <ImageUploadChoice
                label="Hero Background Image"
                value={form.hero_image}
                onChange={(val) => handleChange("hero_image", val)}
                folder="hero"
                placeholder="/images/jazeera.jpeg or https://..."
              />
              {field("Badge Value", "hero_badge_value")}
              {field("Badge Label", "hero_badge_label")}
            </div>

            {/* Footer & Nav */}
            <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <Layout className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-foreground">Footer & Branding</h3>
              </div>
              {field("Footer Tagline", "footer_tagline")}
              {field("Accreditation Badge Text", "accreditation_badge")}
            </div>

            <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border">
                <ListOrdered className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-foreground">Navigation Links (JSON)</h3>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nav Links — JSON array, e.g. {`[{"name":"ABOUT","href":"/about"}]`}. Leave blank for defaults.
                </label>
                <textarea rows={5} value={form.nav_links} onChange={(e) => handleChange("nav_links", e.target.value)} className={`${inputCls} resize-none font-mono text-xs`} placeholder='[{"name":"ABOUT JANIC","href":"/about"}]' />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
