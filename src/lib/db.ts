import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

export async function connectDb() {
  if (global.mongooseCache?.conn) {
    return global.mongooseCache.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI. Set it in your environment");
  }

  global.mongooseCache = global.mongooseCache ?? { conn: null, promise: null };

  if (!global.mongooseCache.promise) {
    global.mongooseCache.promise = mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10_000,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  global.mongooseCache.conn = await global.mongooseCache.promise;
  return global.mongooseCache.conn;
}
