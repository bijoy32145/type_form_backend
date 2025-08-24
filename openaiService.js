import OpenAI from "openai";

export async function generatePersonalityResult(allAnswers) {
  // ✅ Create client lazily so dotenv has already populated process.env
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
You are a smart creator-aligned personality engine for Beyond.

Using the 28-question quiz responses (A/B), analyze and generate a complete 6-page personality result for a creator.

Use MBTI logic to derive their type and persona. Every word must be written from Beyond’s point of view — using “you” to describe the creator’s traits, never “I.”

Match tone to modern creators: emotionally intelligent, sharp, never cheesy. Celebrate the creator’s creative edge while keeping it grounded in behavior and content style.

🎯 Output structure:

Page 1: 3 bold identity traits (max 12 characters each)
Page 2: MBTI code, Archetype Title (exactly 2 words), 90–100 word intro paragraph (max 700 chars)
Page 3:
  - 2 insight lines (90–100 characters each)
  - 1 inner insight paragraph (300–350 characters)
Page 4: 1 bold affirmation line (max 120 characters)
Page 5:
  - Strength (max 180 characters)
  - Unique Thing (max 180 characters)
  - Signature Quote (max 180 characters)
  - Cute Roast (max 180 characters)
Page 6: Static text (unchanged)

Now, based on the quiz answers, generate the full structured result.

Quiz Answers:
${allAnswers.map((a, idx) => `Q${idx + 1}: ${a}`).join("\n")}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // fast GPT-4
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}
