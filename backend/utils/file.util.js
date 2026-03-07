import fileModel from "../models/file.model.js";

export const autoRename = async (originalName, userId) => {
  const extIndex = originalName.lastIndexOf(".");
  const ext = extIndex !== -1 ? originalName.slice(extIndex) : "";
  const rawBase = ext ? originalName.slice(0, extIndex) : originalName;

  // Remove trailing (number) if user re-uploads a renamed file
  const base = rawBase.replace(/\(\d+\)$/, "").trim();

  const safeBase = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const safeExt = ext.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(`^${safeBase}( \\(\\d+\\))?${safeExt}$`);

  const existingFiles = await fileModel
    .find({
      owner: userId,
      name: { $regex: regex },
    })
    .select("name");

  let max = 0;
  let originalExists = false;

  existingFiles.forEach((doc) => {
    const filename = doc.name;

    if (filename === originalName) {
      originalExists = true;
    }

    const nameWithoutExt = ext ? filename.slice(0, -ext.length) : filename;

    const match = nameWithoutExt.match(/\((\d+)\)$/);

    if (match) {
      max = Math.max(max, parseInt(match[1]));
    }
  });

  if (!originalExists) return originalName;

  return `${base} (${max + 1})${ext}`;
};

export const formatFiles = (files) => {
  return files.map((file) => {
    return {
      id: file._id,
      name: file.name,
      type: file.mimetype,
      size: file.size,
      modified: file.updatedAt,
      isFavourite: file.isFavourite,
      members: [file.owner.name, ...file.sharedWith.map((user) => user.name)],
    };
  });
};
