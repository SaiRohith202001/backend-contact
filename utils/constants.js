const CLIENT_URL =
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://tolet-globe.vercel.app"
    : "http://localhost:5173");

exports.CLIENT_URL = CLIENT_URL;