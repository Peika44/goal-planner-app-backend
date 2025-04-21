const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generatePlan = async (goal, timeframe) => {
  const prompt = `Create a step-by-step plan to achieve the goal: "${goal}" within the timeframe: ${timeframe}. Include milestones and rough time estimates.`;

  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
};
