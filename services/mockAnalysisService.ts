import { AnalysisResult } from '../types';

/**
 * Mocks the Python Backend Logic in the browser.
 * In a real deployment, this would use fetch() to call the Flask API.
 */
export const mockAnalyzeProduct = async (url: string): Promise<AnalysisResult> => {
    // Simulate network delay (approx 0.5s - 1.5s)
    const delay = 500 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    const urlLower = url.toLowerCase();
    
    // Heuristic Logic to simulate ML Prediction
    let score = 82; // Default positive baseline
    let verdict: AnalysisResult['verdict'] = 'Genuine';
    let advice = '';

    // Default Breakdown Structure to ensure UI always has data
    let breakdown = {
        reviews: ["Reviews appear consistent with product performance.", "Verified buyer tags present."],
        sentiment: ["Positive sentiment matches star rating.", "Language patterns look natural."],
        price: ["Price is within 10% of market average.", "No suspicious discounts detected."],
        seller: ["Seller has a verified badge and history.", "Contact information is visible."],
        description: ["Professional product description.", "Clear specifications provided."]
    };

    // Simple keyword detection to simulate AI analysis
    const suspiciousKeywords = ['free', 'offer', 'win', 'cheap', 'discount', '70-off', 'urgent', 'buy-now', 'store-closing', 'clearance', 'jackpot', 'lucky'];
    const hasSuspiciousKeywords = suspiciousKeywords.some(k => urlLower.includes(k));
    
    // Expanded Whitelist for Major Platforms (Global & Regional)
    const isMajorPlatform = [
        'amazon', 'flipkart', 'myntra', 'apple', 'bestbuy', 'nike', 'atomberg', 
        'meesho', 'ajio', 'tatacliq', 'jiomart', 'shopsy', 'nykaa', 'croma', 
        'reliance', 'walmart', 'target', 'ebay'
    ].some(platform => urlLower.includes(platform));

    if (isMajorPlatform) {
        score = 94; // Higher confidence for known giants
        verdict = 'Genuine';
        advice = "Safe Product. This is a verified listing from a major trusted retailer.";
        breakdown = {
            reviews: ["High volume of verified reviews detected.", "Review distribution follows organic patterns."],
            sentiment: ["Sentiment analysis indicates genuine buyer satisfaction.", "No bot-like repetition found."],
            price: ["Price aligns with market standards for this category.", "Discount structure is realistic."],
            seller: ["Sold by an official partner or highly-rated seller.", "Platform offers buyer protection."],
            description: ["Detailed, professional product specifications.", "Includes valid warranty/return policy information."]
        };
    } 
    else if (hasSuspiciousKeywords || urlLower.length > 80 || urlLower.includes('myshopify')) {
        score = 45;
        verdict = 'Fake';
        advice = "High Risk Detected. The URL contains keywords often associated with scams or temporary stores.";
        breakdown = {
            reviews: ["Reviews (if any) look repetitive or fake.", "Possible copy-paste patterns."],
            sentiment: ["Description uses high-pressure sales tactics.", "Generic phrasing detected."],
            price: ["Price is suspiciously low (>60% off).", "Too good to be true."],
            seller: ["Seller identity is hidden or unverified.", "No physical address found."],
            description: ["Description matches known scam templates.", "Poor grammar or spelling."]
        };
    } 
    else {
        score = 65;
        verdict = 'Suspicious';
        advice = "Proceed with caution. The seller is new, so double-check the return policy before spending your money.";
        breakdown = {
            reviews: ["Limited number of reviews available.", "Some 5-star reviews look generic."],
            sentiment: ["Review text sounds neutral but ratings are high.", "Mixed signals detected."],
            price: ["Price is slightly lower than expected.", "Unusual discount structure."],
            seller: ["Seller profile was created recently.", "Low response rate to queries."],
            description: ["Product specs are vague.", "Images might be stock photos."]
        };
    }

    const reasons = [
        breakdown.seller[0],
        breakdown.price[0],
        breakdown.description[0]
    ];

    return {
        trust_score: score,
        verdict,
        reasons,
        advice,
        url,
        timestamp: new Date().toISOString(),
        breakdown
    };
};