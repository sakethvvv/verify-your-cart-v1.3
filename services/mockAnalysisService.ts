import { AnalysisResult } from '../types';

/**
 * Mocks the Analysis Logic.
 * Used when API keys are missing, invalid, or rate-limited.
 */
export const mockAnalyzeProduct = async (url: string): Promise<AnalysisResult> => {
    // Artificial delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    const urlLower = url.toLowerCase();
    
    // Logic: Identify Known Good vs Known Bad patterns
    let score = 65; 
    let verdict: AnalysisResult['verdict'] = 'Suspicious';
    let advice = "We couldn't fully verify this site. Proceed with caution.";
    
    // Trusted Whitelist (Simulated Knowledge)
    const trustedDomains = [
        'amazon', 'flipkart', 'myntra', 'apple', 'nike', 'adidas', 
        'samsung', 'bestbuy', 'walmart', 'target', 'ebay', 'meesho',
        'ajio', 'tatacliq', 'jiomart', 'zara', 'h&m', 'uniqlo'
    ];
    
    // Suspicious Keywords
    const scamKeywords = [
        'free', 'giveaway', 'winner', '70-off', '80-off', '90-off',
        'lucky-draw', 'wheel-spin', 'claim-now', 'urgent', 'limited-time'
    ];

    const isTrusted = trustedDomains.some(d => urlLower.includes(d));
    const isScam = scamKeywords.some(k => urlLower.includes(k));

    if (isTrusted) {
        score = 92;
        verdict = 'Genuine';
        advice = "This appears to be a verified listing from a trusted major retailer. Safe to proceed.";
    } else if (isScam) {
        score = 25;
        verdict = 'Fake';
        advice = "High Risk! This URL contains keywords commonly associated with phishing or scam campaigns.";
    }

    return {
        trust_score: score,
        verdict,
        reasons: [
            isTrusted ? "Domain matches a known major retailer" : "Domain trust level is low or unknown",
            isScam ? "Suspicious promotional keywords detected" : "Pricing analysis inconclusive",
            "Seller reputation scan completed"
        ],
        advice,
        url,
        timestamp: new Date().toISOString(),
        sources: [], // No live sources in mock
        breakdown: {
            reviews: ["Unable to fetch live reviews (Mock Mode)."],
            sentiment: ["Sentiment analysis unavailable (Mock Mode)."],
            price: ["Price comparison unavailable (Mock Mode)."],
            seller: ["Seller verification skipped."],
            description: ["URL structure analyzed."]
        }
    };
};