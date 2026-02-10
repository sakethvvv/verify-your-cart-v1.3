import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeProduct = async (url: string): Promise<AnalysisResult> => {
  // ✅ Correct way for Vite frontend env variable
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // ❌ Don't use mock fallback if you want real AI Studio accuracy
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("Gemini API Key missing. Add VITE_GEMINI_API_KEY in deployment environment.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Extract hostname for better search queries
    let hostname = url;
    try {
      hostname = new URL(url).hostname;
    } catch {
      hostname = url;
    }

    // ✅ AI Studio style system instruction
    const systemInstruction = `
You are TrustLens, an elite cybersecurity AI specialized in E-commerce Fraud Detection.

STRICT RULES:
1. You MUST use googleSearch grounding results.
2. Never hallucinate. If no strong evidence, verdict MUST be "Suspicious".
3. Verdict can ONLY be: Genuine, Suspicious, Fake.
4. Genuine only if strong verified reputation exists.
5. Fake if scam evidence exists (complaints, scamadviser warnings, scam reports).
6. Output JSON only. No extra explanation text.
`;

    const prompt = `
Analyze this product URL:
${url}

Perform these Google Search checks:

1. Reputation Search:
- "${hostname} reviews"
- "${hostname} trustpilot"
- "${hostname} scamadviser"
- "${hostname} complaints"

2. Ownership / Legitimacy Search:
- "is ${hostname} legit"
- "who owns ${hostname}"
- "${hostname} company details"

3. Price Scam Check:
- infer product name from URL
- search market price
- compare discount realism

Return final JSON response.
`;

    const response = await ai.models.generateContent({
      // ✅ REAL model (works in deployed website)
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }], // ✅ enables grounding like AI Studio

        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trust_score: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                reviews: { type: Type.ARRAY, items: { type: Type.STRING } },
                sentiment: { type: Type.ARRAY, items: { type: Type.STRING } },
                price: { type: Type.ARRAY, items: { type: Type.STRING } },
                seller: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING }
          },
          required: ["trust_score", "verdict", "reasons", "advice"]
        },

        generationConfig: {
          temperature: 0.15,
          topP: 0.9,
          maxOutputTokens: 4096
        },

        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ]
      }
    });

    const rawText = response.text || "{}";
    const result = JSON.parse(rawText);

    // ✅ Extract grounding sources
    const sources: string[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) sources.push(chunk.web.uri);
      });
    }

    // ✅ Normalize verdict (strict)
    let mappedVerdict: AnalysisResult["verdict"] = "Suspicious";
    const v = (result.verdict || "").toLowerCase();

    if (v.includes("genuine") || v.includes("safe")) mappedVerdict = "Genuine";
    else if (v.includes("fake") || v.includes("scam") || v.includes("danger")) mappedVerdict = "Fake";

    return {
      trust_score: result.trust_score ?? 0,
      verdict: mappedVerdict,
      reasons: result.reasons ?? [],
      advice: result.advice ?? "Verify seller independently before purchasing.",
      url,
      timestamp: new Date().toISOString(),
      sources: sources.slice(0, 4),

      breakdown: {
        reviews: result.breakdown?.reviews ?? [],
        sentiment: result.breakdown?.sentiment ?? [],
        price: result.breakdown?.price ?? [],
        seller: result.breakdown?.seller ?? [],
        description: result.breakdown?.description ?? []
      }
    };
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("AI Analysis failed. Please try again.");
  }
};
