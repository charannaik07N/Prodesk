const parseTitle = (raw) =>
  raw
    .replace(/[\n\r]+/g, " ")
    .replace(/^['\"\s]+|['\"\s]+$/g, "")
    .split("|")[0]
    .trim();

const getGroqTitle = async (moodPrompt) => {
  const response = await fetch("/api/groq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: moodPrompt,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return parseTitle(data.title || "");
  }

  if (response.status === 429) {
    throw new Error(
      "Groq rate limit reached. Please wait a moment and try Mood Matcher again.",
    );
  }

  if (response.status === 404) {
    throw new Error(
      "Groq model not found (404). Set VITE_GROQ_MODEL to a valid model like llama-3.1-8b-instant.",
    );
  }

  if (response.status === 401) {
    throw new Error("Invalid VITE_GROQ_API_KEY for Mood Matcher.");
  }

  if (response.status === 500) {
    throw new Error("Missing VITE_GROQ_API_KEY for Mood Matcher.");
  }

  throw new Error(`Groq request failed: ${response.status}`);
};

export const getMoodMatchedTitle = async (moodPrompt) => {
  if (!moodPrompt.trim()) {
    throw new Error("Enter a mood before running Mood Matcher.");
  }

  const title = await getGroqTitle(moodPrompt);

  if (!title) {
    throw new Error("Could not derive a movie title from AI response.");
  }

  return title;
};
