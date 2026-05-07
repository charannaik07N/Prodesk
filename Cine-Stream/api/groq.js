const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";
const FALLBACK_MODELS = ["llama-3.1-8b-instant", "llama-3.1-70b-versatile"];
const CACHE_TTL_MS = 10 * 60 * 1000;

const cache = new Map();

const parseTitle = (raw) =>
  raw
    .replace(/[\n\r]+/g, " ")
    .replace(/^['\"\s]+|['\"\s]+$/g, "")
    .split("|")[0]
    .trim();

const loadConfig = () => {
  const apiKey =
    process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";
  const model = process.env.GROQ_MODEL || process.env.VITE_GROQ_MODEL || "";
  return { apiKey, model };
};

const getCachedTitle = (prompt) => {
  const entry = cache.get(prompt);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt < Date.now()) {
    cache.delete(prompt);
    return null;
  }

  return entry.title;
};

const setCachedTitle = (prompt, title) => {
  cache.set(prompt, { title, expiresAt: Date.now() + CACHE_TTL_MS });
};

const sendJson = (res, status, payload) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
};

const getRequestBody = async (req) => {
  if (req.body) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
};

const requestGroqTitle = async (apiKey, model, moodPrompt) => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a movie expert. Return exactly one movie title only. No explanation. No quotes.",
        },
        { role: "user", content: `User mood prompt: ${moodPrompt}` },
      ],
      temperature: 0.4,
      max_tokens: 40,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      status: "ok",
      title: parseTitle(data.choices?.[0]?.message?.content || ""),
    };
  }

  if (response.status === 404) {
    return { status: "not_found" };
  }

  if (response.status === 401 || response.status === 403) {
    return { status: "auth_error" };
  }

  if (response.status === 429) {
    return { status: "rate_limited" };
  }

  return { status: "error", code: response.status };
};

const getGroqTitle = async (apiKey, model, moodPrompt) => {
  if (!apiKey) {
    return { status: "missing_key" };
  }

  const modelsToTry = [model || DEFAULT_MODEL, ...FALLBACK_MODELS].filter(
    (value, index, arr) => value && arr.indexOf(value) === index,
  );

  let sawRateLimit = false;
  let sawNotFound = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    for (const candidate of modelsToTry) {
      const result = await requestGroqTitle(apiKey, candidate, moodPrompt);
      if (result.status === "ok" && result.title) {
        return result;
      }

      if (result.status === "rate_limited") {
        sawRateLimit = true;
        continue;
      }

      if (result.status === "not_found") {
        sawNotFound = true;
        continue;
      }

      if (result.status === "missing_key") {
        return result;
      }

      if (result.status === "error") {
        return result;
      }
    }

    if (sawRateLimit) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  if (sawRateLimit) {
    return { status: "rate_limited" };
  }

  if (sawNotFound) {
    return { status: "not_found" };
  }

  return { status: "error", code: 500 };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const { apiKey, model } = loadConfig();
  let body = {};

  try {
    body = await getRequestBody(req);
  } catch (error) {
    sendJson(res, 400, { error: "Invalid JSON body" });
    return;
  }

  const prompt = (body.prompt || "").trim();
  if (!prompt) {
    sendJson(res, 400, { error: "Missing prompt" });
    return;
  }

  const cachedTitle = getCachedTitle(prompt);
  if (cachedTitle) {
    sendJson(res, 200, { title: cachedTitle, cached: true });
    return;
  }

  const result = await getGroqTitle(apiKey, model, prompt);

  if (result.status === "ok" && result.title) {
    setCachedTitle(prompt, result.title);
    sendJson(res, 200, { title: result.title });
    return;
  }

  if (result.status === "missing_key") {
    sendJson(res, 500, { error: "Missing GROQ_API_KEY" });
    return;
  }

  if (result.status === "auth_error") {
    sendJson(res, 401, { error: "Invalid GROQ_API_KEY" });
    return;
  }

  if (result.status === "rate_limited") {
    sendJson(res, 429, { error: "Rate limited" });
    return;
  }

  if (result.status === "not_found") {
    sendJson(res, 404, { error: "Model not found" });
    return;
  }

  sendJson(res, 500, { error: "Groq request failed" });
}
