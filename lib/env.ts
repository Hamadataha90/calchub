const required = {
  DATABASE_URL: process.env.DATABASE_URL,
  EMAIL_API_KEY: process.env.EMAIL_API_KEY,
} as const;

for (const [key, value] of Object.entries(required)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  DATABASE_URL: required.DATABASE_URL as string,
  EMAIL_API_KEY: required.EMAIL_API_KEY as string,
  EMAIL_FROM: process.env.EMAIL_FROM ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  NEXT_PUBLIC_MONETAG_KEY: process.env.NEXT_PUBLIC_MONETAG_KEY ?? "",
};
