export function uuid() {
  const uuid = URL.createObjectURL(new Blob());
  URL.revokeObjectURL(uuid);
  return uuid.substring(Math.max(uuid.lastIndexOf('/'), uuid.lastIndexOf(':')) + 1);
}
