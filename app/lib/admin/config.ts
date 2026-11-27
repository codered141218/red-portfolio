import "server-only";

export function authConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL?.trim() &&
      process.env.ADMIN_PASSWORD &&
      (process.env.SESSION_SECRET?.length ?? 0) >= 32,
  );
}

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export const SESSION_COOKIE = "admin_session";
