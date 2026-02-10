import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { AnalysisResult } from '../types';
import { mockAnalyzeProduct } from './mockAnalysisService';

/**
 * Analyzes a product URL using a tiered strategy:
 * 1. Gemini 3 Pro (Best Reasoning)
 * 2. Gemini 2.5 Flash (Fallback for speed/availability)
 * 3. Mock Engine (Offline/Error fallback)
 * 
 * GUARANTEE: This function never throws. It always returns a result (real or mock).
 */
export const analyzeProduct = async (url: string): Promise<AnalysisResult> => {
    // WRAP EVERYTHING in a try/catch to ensure UI never crashes
    try {
        // --- 1. KEY VALIDATION ---
        let apiKey = "";
        try {
            // Safe access in case process.env is replaced oddly by bundlers
            apiKey = process.env.API_KEY || "";
        } catch (e) {
            console.warn("Environment variable access warning:", e);
        }

        // Immediate Fallback if key is missing/placeholder
        if (!apiKey || apiKey === "PLACEHOLDER_API_KEY" || apiKey.trim() === "") {
            console.warn("API Key missing. Switching to Mock Service.");
            return await mockAnalyzeProduct(url);
        }

        // --- 2. AI INITIALIZATION ---
        // We init here inside the try block so if constructor throws, we catch it.
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        // Hostname extraction for better prompts
        let hostname = url;
        try { hostname = new URL(url).hostname; } catch (e) { /* ignore */ }

        // --- 3. CONFIGURATION ---
        const systemInstruction = `You are TrustLens, an elite cybersecurity AI. 
        Your goal is to protect users from e-commerce scams.
        
        SCORING RUBRIC:
        - 90-100 (Genuine): Official sites of major brands (Amazon, Nike, Flipkart).
        - 60-89 (Good/Caution): Legitimate lesser-known stores.
        - 0-59 (Suspicious/Fake): New domains, scam patterns, unrealistic prices.`;

        const prompt = `Analyze this product URL: ${url}
        
        REQUIRED CHECKS:
        1. Verify Domain Trust for "${hostname}" via Search.
        2. Check for "Too Good To Be True" pricing.
        3. Look for scam reports or poor reviews.
        
        Return JSON.`;

        const commonConfig = {
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
                }
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
            ]
        };

        const parseResponse = (rawText: string | undefined): any => {
            if (!rawText) throw new Error("Empty response from AI");
            let cleanText = rawText.replace(/```json|```/g, '').trim();
            // Attempt to find JSON object if mixed with text
            const start = cleanText.indexOf('{');
            const end = cleanText.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                cleanText = cleanText.substring(start, end + 1);
            }
            return JSON.parse(cleanText);
        };

        const formatResult = (result: any, sources: string[] = []) => {
            let mappedVerdict: AnalysisResult['verdict'] = 'Suspicious';
            const v = (result.verdict || '').toLowerCase();
            if (v.includes('genuine') || v.includes('safe')) mappedVerdict = 'Genuine';
            else if (v.includes('fake') || v.includes('scam')) mappedVerdict = 'Fake';

            return {
                trust_score: result.trust_score || 0,
                verdict: mappedVerdict,
                reasons: result.reasons || ["Analysis based on domain patterns."],
                advice: result.advice || "Proceed with caution.",
                url: url,
                timestamp: new Date().toISOString(),
                sources: sources.slice(0, 4),
                breakdown: {
                    reviews: result.breakdown?.reviews || ["Data unavailable"],
                    sentiment: result.breakdown?.sentiment || ["Data unavailable"],
                    price: result.breakdown?.price || ["Data unavailable"],
                    seller: result.breakdown?.seller || ["Data unavailable"],
                    description: result.breakdown?.description || ["Data unavailable"]
                }
            };
        };

        // --- 4. EXECUTION TIERS ---

        // TIER 1: Gemini 3 Pro (Best)
        try {
            console.log("Tier 1: Calling Gemini 3 Pro...");
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    ...commonConfig,
                    systemInstruction: systemInstruction,
                    tools: [{googleSearch: {}}], // Search Grounding
                }
            });
            const result = parseResponse(response.text);
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
                ?.map((c: any) => c.web?.uri).filter(Boolean) || [];
            return formatResult(result, sources);

        } catch (tier1Error) {
            console.warn("Tier 1 Failed. Trying Tier 2...", tier1Error);

            // TIER 2: Gemini 2.5 Flash (Reliable)
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                         ...commonConfig,
                         // 2.5 Flash supports search but sometimes stricter on tools. 
                         // We keep it enabled but if it fails, we catch it.
                         tools: [{googleSearch: {}}] 
                    }
                });
                const result = parseResponse(response.text);
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
                    ?.map((c: any) => c.web?.uri).filter(Boolean) || [];
                return formatResult(result, sources);
            } catch (tier2Error) {
                console.warn("Tier 2 Failed. Throwing to fallback.", tier2Error);
                throw tier2Error; // Re-throw to reach the master catch block
            }
        }

    } catch (criticalError) {
        // --- 5. FINAL SAFETY NET (MOCK) ---
        console.error("Critical Analysis Failure. Using Mock Engine fallback.", criticalError);
        return await mockAnalyzeProduct(url);
    }
};