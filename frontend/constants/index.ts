const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const WORLD_APP_ID = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
const WORLD_ACTION_ID = process.env.NEXT_PUBLIC_ACTION_ID!;

export { BACKEND_URL, WORLD_APP_ID, WORLD_ACTION_ID };
