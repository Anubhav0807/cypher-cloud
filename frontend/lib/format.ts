export const formatDate = (date: Date | string | number): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const formatSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"] as const;

  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.floor(size)} ${units[unitIndex]}`;
};

type StoragePairInput = {
  total: number;
  used: number;
};

type StoragePairOutput = {
  total: string;
  used: string;
};

export const formatStoragePair = ({
  total,
  used,
}: StoragePairInput): StoragePairOutput => {
  if (!total || total <= 0) {
    return { total: "0 B", used: "0 B" };
  }

  const units = ["B", "KB", "MB", "GB", "TB"] as const;

  let unitIndex = 0;
  let value = total;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  const unit = units[unitIndex];
  const divisor = 1024 ** unitIndex;

  const convert = (bytes: number): string =>
    `${(bytes / divisor).toFixed(1)} ${unit}`;

  return {
    total: convert(total),
    used: convert(used),
  };
};