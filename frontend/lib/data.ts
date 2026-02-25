// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface FileItem {
  id: number;
  name: string;
  type: "doc" | "image" | "video" | "audio" | "figma" | "ai" | "zip";
  size: string;
  modified: string;
  members: string[];
  encryption: string;
  status: "encrypted" | "processing" | "pending";
  clouds: CloudProvider[];
}

export interface FolderItem {
  id: number;
  name: string;
  count: number;
  color: string;
  bgColor: string;
  iconColor: string;
}

export interface StorageCategory {
  label: string;
  files: number;
  size: string;
  sizeGB: number;
  color: string;
  icon: string;
}

export interface CloudNode {
  name: string;
  pct: number;
  shards: number;
  color: string;
  gradient: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export type CloudProvider = "AWS" | "GCP" | "Azure";

export interface SecurityLog {
  time: string;
  event: string;
  level: "success" | "warning" | "info" | "error";
}

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "files", label: "My Files", icon: "files", badge: 3 },
  { id: "shards", label: "Encrypted Shards", icon: "shards" },
  { id: "cloud", label: "Multi-Cloud Nodes", icon: "cloud" },
  { id: "security", label: "Security Logs", icon: "shield", badge: 1 },
  { id: "access", label: "Access Control", icon: "lock" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// ─── FILE TYPE STATS ──────────────────────────────────────────────────────────

export const fileTypeStats = [
  { label: "Documents", count: 994, color: "#F59E0B", bg: "bg-amber-100", text: "text-amber-600" },
  { label: "Photos", count: 2328, color: "#3B82F6", bg: "bg-blue-100", text: "text-blue-600" },
  { label: "Videos", count: 228, color: "#EF4444", bg: "bg-red-100", text: "text-red-600" },
  { label: "Audio", count: 424, color: "#A855F7", bg: "bg-purple-100", text: "text-purple-600" },
  { label: "Archives", count: 824, color: "#EC4899", bg: "bg-pink-100", text: "text-pink-600" },
];

// ─── FOLDERS ──────────────────────────────────────────────────────────────────

export const folders: FolderItem[] = [
  { id: 1, name: "Financial Records", count: 29, color: "#3B82F6", bgColor: "#EFF6FF", iconColor: "#3B82F6" },
  { id: 2, name: "Client Contracts", count: 36, color: "#8B5CF6", bgColor: "#F5F3FF", iconColor: "#8B5CF6" },
  { id: 3, name: "Infrastructure", count: 123, color: "#06B6D4", bgColor: "#ECFEFF", iconColor: "#06B6D4" },
  { id: 4, name: "Crypto Keys", count: 7343, color: "#F59E0B", bgColor: "#FFFBEB", iconColor: "#F59E0B" },
];

// ─── FILES ────────────────────────────────────────────────────────────────────

export const files: FileItem[] = [
  {
    id: 1, name: "Proposal.docx", type: "doc", size: "2.9 MB", modified: "Feb 18, 2025",
    members: ["A", "B", "C"], encryption: "AES-256 + RSA", status: "encrypted", clouds: ["AWS", "GCP"],
  },
  {
    id: 2, name: "Background.jpg", type: "image", size: "3.5 MB", modified: "Feb 17, 2025",
    members: ["A", "B"], encryption: "ChaCha20", status: "encrypted", clouds: ["Azure"],
  },
  {
    id: 3, name: "E-Wallet App.fig", type: "figma", size: "23.2 MB", modified: "Feb 16, 2025",
    members: ["A", "B", "C", "D"], encryption: "AES-256 + RSA", status: "encrypted", clouds: ["AWS"],
  },
  {
    id: 4, name: "Illustration.ai", type: "ai", size: "7.3 MB", modified: "Feb 15, 2025",
    members: ["A", "B"], encryption: "RSA-4096", status: "encrypted", clouds: ["GCP"],
  },
  {
    id: 5, name: "Animation.mkv", type: "video", size: "49.8 MB", modified: "Feb 14, 2025",
    members: ["A", "B", "C"], encryption: "AES-256", status: "processing", clouds: ["AWS"],
  },
];

// ─── STORAGE CATEGORIES ───────────────────────────────────────────────────────

export const storageCategories: StorageCategory[] = [
  { label: "Documents", files: 994, size: "2.2 GB", sizeGB: 2.2, color: "#F59E0B", icon: "doc" },
  { label: "Photos", files: 2328, size: "13 GB", sizeGB: 13, color: "#3B82F6", icon: "image" },
  { label: "Videos", files: 228, size: "42 GB", sizeGB: 42, color: "#EF4444", icon: "video" },
  { label: "Musics", files: 424, size: "1.8 GB", sizeGB: 1.8, color: "#A855F7", icon: "audio" },
  { label: "Other Files", files: 824, size: "16 GB", sizeGB: 16, color: "#EC4899", icon: "zip" },
];

// ─── CLOUD NODES ──────────────────────────────────────────────────────────────

export const cloudNodes: CloudNode[] = [
  { name: "AWS S3", pct: 45, shards: 128, color: "#F59E0B", gradient: "from-amber-400 to-orange-500" },
  { name: "Google Cloud", pct: 31, shards: 88, color: "#3B82F6", gradient: "from-blue-400 to-blue-600" },
  { name: "Azure Blob", pct: 24, shards: 68, color: "#8B5CF6", gradient: "from-violet-400 to-violet-600" },
];

// ─── SECURITY LOGS ────────────────────────────────────────────────────────────

export const securityLogs: SecurityLog[] = [
  { time: "09:42", event: "Shard reconstruction verified", level: "success" },
  { time: "09:38", event: "New file encrypted & sharded", level: "success" },
  { time: "09:21", event: "Access attempt from new IP", level: "warning" },
  { time: "08:55", event: "Key rotation completed", level: "success" },
  { time: "08:30", event: "Multi-cloud sync verified", level: "info" },
];

export const totalStorage = 100;
export const usedStorage = 75;
