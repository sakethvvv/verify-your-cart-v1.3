import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { AnalysisResult } from '../types';
import { mockAnalyzeProduct } from './mockAnalysisService';

/**
 * Analyzes a product URL using a tiered strategy:
 * 1. Gemini 3 Pro (Best Reasoning)
 * 2. Gemini 2.5 Flash (Fallback for speed/availability)
 * 3. Mock Engine (Offline/Error fallback)
 */
export const analyzeProduct = async (url: string): Promise<AnalysisResult> => {
    // 1. Safe API Key Access
    // We access process.env inside the function to prevent top-level ReferenceErrors in some environments
    let apiKey = "";
    try {
        apiKey = process.env.API_KEY || "";
    } catch (e) {
        console.warn("Error accessing process.env", e);
    }

    // Immediate Mock Fallback if no key
    if (!apiKey || apiKey === "PLACEHOLDER_API_KEY" || apiKey === "") {
        console.warn("API Key missing. Using Mock Analysis Service.");
        return mockAnalyzeProduct(url);
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Extract hostname for prompt context
    let hostname = url;
    try {
        hostname = new URL(url).hostname;
    } catch (e) { /* ignore invalid url parsing */ }

    const systemInstruction = `You are TrustLens, an elite cybersecurity AI. 
    Your goal is to protect users from e-commerce scams.
    
    SCORING RUBRIC:
    - 90-100 (Genuine): Official sites of major brands (Amazon, Nike, Flipkart).
    - 60-89 (Good/Caution): Legitimate lesser-known stores.
    - 0-59 (Suspicious/Fake): New domains, scam patterns, unrealistic prices.`;

    const prompt = `Analyze this product URL: ${url}
    
    REQUIRED CHECKS:
    1. Verify Domain Trust for "${hostname}".
    2. Check for "Too Good To Be True" pricing.
    3. Look for scam reports or poor reviews.
    
    Return JSON.`;

    const modelConfig = {
        systemInstruction: systemInstruction,
        tools: [{googleSearch: {}}], // Try to use Search
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
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ]
    };

    /**
     * Helper to parse AI response safely
     */
    const parseResponse = (rawText: string | undefined): any => {
        if (!rawText) throw new Error("Empty response from AI");
        
        let cleanText = rawText;
        // Clean Markdown wrappers
        const jsonMatch = cleanText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) cleanText = jsonMatch[1];
        else {
             const genericMatch = cleanText.match(/```\s*([\s\S]*?)\s*```/);
             if (genericMatch) cleanText = genericMatch[1];
        }
        
        // Locate JSON object if extra text exists
        const start = cleanText.indexOf('{');
        const end = cleanText.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            cleanText = cleanText.substring(start, end + 1);
        }

        return JSON.parse(cleanText);
    };

    /**
     * Helper to format the final result object
     */
    const formatResult = (result: any, sources: string[] = []) => {
        let mappedVerdict: AnalysisResult['verdict'] = 'Suspicious';
        const v = (result.verdict || '').toLowerCase();
        if (v.includes('genuine') || v.includes('safe')) mappedVerdict = 'Genuine';
        else if (v.includes('fake') || v.includes('scam')) mappedVerdict = 'Fake';

        return {
            trust_score: result.trust_score || 0,
            verdict: mappedVerdict,
            reasons: result.reasons || ["Analysis based on domain reputation."],
            advice: result.advice || "Verify independently.",
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

    // --- EXECUTION FLOW ---

    try {
        // TIER 1: Try Gemini 3 Pro (Best)
        try {
            console.log("Attempting Tier 1: Gemini 3 Pro...");
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: modelConfig
            });
            const result = parseResponse(response.text);
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
                ?.map((c: any) => c.web?.uri).filter(Boolean) || [];
            
            return formatResult(result, sources);

        } catch (tier1Error) {
            console.warn("Tier 1 (Pro) Failed, switching to Tier 2 (Flash). Error:", tier1Error);
            
            // TIER 2: Try Gemini 2.5 Flash (Reliable Fallback)
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: modelConfig // Re-use config (supports search on 2.5 too usually, or ignores it)
            });
            const result = parseResponse(response.text);
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
                ?.map((c: any) => c.web?.uri).filter(Boolean) || [];

            return formatResult(result, sources);
        }

    } catch (finalError) {
        console.error("All AI Tiers Failed. Falling back to Mock Engine.", finalError);
        // TIER 3: Mock Engine (Safety Net)
        return mockAnalyzeProduct(url);
    }
};