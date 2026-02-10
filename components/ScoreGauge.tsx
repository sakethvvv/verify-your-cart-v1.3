import React, { useEffect, useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Check, Info } from 'lucide-react';

interface ScoreVisualizerProps {
    score: number;
}

export const ScoreGauge: React.FC<ScoreVisualizerProps> = ({ score }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const [barWidth, setBarWidth] = useState(0);

    // Animate the score counting up and the bar filling
    useEffect(() => {
        // Reset
        setDisplayScore(0);
        setBarWidth(0);

        // Animate Bar Width
        const timer = setTimeout(() => {
            setBarWidth(score);
        }, 100);

        // Animate Number Counter
        let start = 0;
        const end = score;
        const duration = 1500; // Match CSS duration for sync
        const startTime = performance.now();

        const animateNumber = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic: 1 - (1 - x)^3
            const ease = 1 - Math.pow(1 - progress, 3);
            
            setDisplayScore(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animateNumber);
            }
        };
        
        requestAnimationFrame(animateNumber);

        return () => clearTimeout(timer);
    }, [score]);

    // Determine configuration based on the FINAL score rules (not the animating one)
    // This keeps color stable while numbers count up
    let config = {
        color: 'bg-emerald-500',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        bgLight: 'bg-emerald-50',
        icon: <ShieldCheck size={28} className="text-white" />,
        label: 'Safe Product',
        emoji: '🛡️✨',
        animationClass: '',
        advice: "Safe to buy. Verified seller and authentic reviews."
    };

    if (score >= 95) {
        config = {
            ...config,
            color: 'bg-emerald-500',
            animationClass: 'animate-pulse-glow',
            label: 'Excellent Trust',
            emoji: '🛡️✨',
            advice: "Highly trusted! This product passes all safety checks with flying colors.",
        };
    } else if (score >= 90) {
        config = {
            ...config,
            color: 'bg-emerald-500',
            animationClass: 'transition-all duration-700 ease-in-out',
            label: 'Safe Product',
            emoji: '✅😄',
        };
    } else if (score >= 85) {
        config = {
            color: 'bg-yellow-400',
            textColor: 'text-yellow-700',
            borderColor: 'border-yellow-200',
            bgLight: 'bg-yellow-50',
            icon: <ShieldCheck size={28} className="text-white" />,
            label: 'Good (Minor Caution)',
            emoji: '👍🙂',
            animationClass: 'animate-pulse-slow',
            advice: "Generally safe, but check recent reviews just in case."
        };
    } else if (score >= 80) {
        config = {
            color: 'bg-orange-400',
            textColor: 'text-orange-700',
            borderColor: 'border-orange-200',
            bgLight: 'bg-orange-50',
            icon: <AlertTriangle size={28} className="text-white" />,
            label: 'Risky (Warning)',
            emoji: '⚠️🤔',
            animationClass: 'animate-shake-subtle',
            advice: "Proceed with caution. Some mixed signals detected."
        };
    } else if (score >= 50) {
        config = {
            color: 'bg-orange-600',
            textColor: 'text-orange-800',
            borderColor: 'border-orange-300',
            bgLight: 'bg-orange-100',
            icon: <AlertTriangle size={28} className="text-white" />,
            label: 'High Risk',
            emoji: '🚨😟',
            animationClass: 'animate-pulse',
            advice: "Not recommended. Significant red flags found."
        };
    } else {
        // < 50%
        config = {
            color: 'bg-red-600',
            textColor: 'text-red-700',
            borderColor: 'border-red-200',
            bgLight: 'bg-red-50',
            icon: <AlertOctagon size={28} className="text-white" />,
            label: 'Likely Fake',
            emoji: '❌☠️',
            animationClass: 'animate-shake-strong',
            advice: "DANGER: Do not buy. High probability of being a scam."
        };
    }

    return (
        <div className={`w-full max-w-md mx-auto ${config.animationClass}`}>
            
            {/* Header: Score & Label */}
            <div className="flex items-end justify-between mb-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 animate-enter-smooth">Trust Score</span>
                    <div className="flex items-center gap-2 md:gap-3">
                        <h3 className={`text-4xl md:text-5xl font-extrabold ${config.textColor} tracking-tight tabular-nums transition-colors duration-500`}>
                            {displayScore}%
                        </h3>
                        {/* Emoji Indicator - Scales in when score stabilizes */}
                        <span 
                            className={`text-3xl md:text-4xl filter drop-shadow-sm animate-float cursor-help transition-all duration-700 transform ${displayScore > 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} 
                            title={config.label}
                        >
                            {config.emoji}
                        </span>
                    </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 ${config.bgLight} ${config.textColor} border ${config.borderColor} mb-2 animate-enter-smooth`} style={{ animationDelay: '0.2s' }}>
                    {score >= 85 ? <Check size={14} className="md:w-4 md:h-4" /> : <Info size={14} className="md:w-4 md:h-4" />}
                    <span className="whitespace-nowrap">{config.label}</span>
                </div>
            </div>

            {/* Visual Bar */}
            <div className="h-4 md:h-6 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }}></div>
                
                {/* The Bar */}
                <div 
                    className={`h-full ${config.color} rounded-full shadow-lg relative transition-all duration-[1500ms] ease-premium-ease flex items-center justify-end pr-2`}
                    style={{ width: `${barWidth}%` }}
                >
                    <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/30 blur-[2px]"></div>
                </div>
            </div>

            {/* User Advice Micro-interaction */}
            <div className="mt-6 flex items-start gap-4 bg-white/60 p-4 rounded-2xl border border-slate-100 shadow-sm backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:bg-white animate-enter-smooth" style={{ animationDelay: '0.4s' }}>
                <div className={`p-3 rounded-xl ${config.color} shadow-lg text-white transition-colors duration-500`}>
                    {config.icon}
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                        AI Verdict
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{config.advice}</p>
                </div>
            </div>
        </div>
    );
};