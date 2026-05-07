import http from "node:http";
import { existsSync, readFileSync } from "node:fs";

const loadEnvFile = () => {
  const env = {};
  const envPath = new URL("../.env", import.meta.url);
  if (!existsSync(envPath)) {
    return env;
  }

  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match) {
      continue;
    }

    const key = match[1];
    const raw = match[2] || "";
    env[key] = raw.replace(/^['\"]|['\"]$/g, "");
  }

  return env;
};

const env = { ...loadEnvFile(), ...process.env };
const GROQ_API_KEY = env.GROQ_API_KEY || env.VITE_GROQ_API_KEY || "";
const GROQ_MODEL =
  env.GROQ_MODEL || env.VITE_GROQ_MODEL || "llama-3.1-8b-instant";
const FALLBACK_MODELS = ["llama-3.1-8b-instant", "llama-3.1-70b-versatile"];

const parseTitle = (raw) =>
  raw
    .replace(/[\n\r]+/g, " ")
    .replace(/^['\"\s]+|['\"\s]+$/g, "")
    .split("|")[0]
    .trim();

const systemPrompt =
  "You are a movie expert. Return exactly one movie title only. No explanation. No quotes.";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestGroqTitle = async (model, moodPrompt) => {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `User mood prompt: ${moodPrompt}` },
        ],
        temperature: 0.4,
        max_tokens: 40,
      }),
    },
  );

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

const getGroqTitle = async (moodPrompt) => {
  if (!GROQ_API_KEY) {
    return { status: "missing_key" };
  }

  const modelsToTry = [GROQ_MODEL, ...FALLBACK_MODELS].filter(
    (model, index, arr) => model && arr.indexOf(model) === index,
  );

  let sawRateLimit = false;
  let sawNotFound = false;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    for (const model of modelsToTry) {
      const result = await requestGroqTitle(model, moodPrompt);
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
      await sleep(500 * (attempt + 1));
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

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

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
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/api/groq") {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body || "{}");
      const prompt = (parsed.prompt || "").trim();

      if (!prompt) {
        sendJson(res, 400, { error: "Missing prompt" });
        return;
      }

      const cachedTitle = getCachedTitle(prompt);
      if (cachedTitle) {
        sendJson(res, 200, { title: cachedTitle, cached: true });
        return;
      }

      const result = await getGroqTitle(prompt);
      if (result.status === "ok" && result.title) {
        setCachedTitle(prompt, result.title);
        sendJson(res, 200, { title: result.title, cached: false });
        return;
      }

      if (result.status === "missing_key") {
        sendJson(res, 500, { error: "Missing Groq API key" });
        return;
      }

      if (result.status === "auth_error") {
        sendJson(res, 401, { error: "Invalid Groq API key" });
        return;
      }

      if (result.status === "rate_limited") {
        sendJson(res, 429, { error: "Rate limit reached" });
        return;
      }

      if (result.status === "not_found") {
        sendJson(res, 404, { error: "Model not found" });
        return;
      }

      sendJson(res, 502, { error: "Groq request failed" });
    } catch (err) {
      sendJson(res, 500, { error: "Invalid request" });
    }
  });
});

const PORT = Number(env.PORT || 8787);
server.listen(PORT, () => {
  console.log(`Groq proxy listening on http://localhost:${PORT}`);
});
