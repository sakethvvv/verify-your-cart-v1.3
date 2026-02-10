import React from 'react';
import { Database, Server, BrainCircuit, Globe, ArrowRight, FileSearch } from 'lucide-react';

export const ArchitectureExplainer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800">System Architecture</h2>
        <p className="text-slate-600 mt-2">How TrustLens processes and analyzes potential threats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
        <ArchitectureCard icon={<Globe className="text-blue-500" />} title="1. Input" desc="User submits Product URL via React Frontend" />
        <ArchitectureCard icon={<Server className="text-indigo-500" />} title="2. Backend" desc="Python/Flask API receives request & validates" />
        <ArchitectureCard icon={<FileSearch className="text-purple-500" />} title="3. Extraction" desc="BeautifulSoup scrapes text & metadata" />
        <ArchitectureCard icon={<BrainCircuit className="text-pink-500" />} title="4. ML Model" desc="Random Forest Classifier predicts legitimacy" />
      </div>

      <div className="space-y-6">
        <Section title="Feature Engineering Logic">
            <p className="text-slate-600 mb-4">The core of our detection engine relies on extracting 15+ datapoints from a single URL.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureBox title="URL-Based Features" items={[
                    "Domain Age (WHOIS lookup)",
                    "Subdomain depth (e.g. amazon.secure-login.com)",
                    "HTTPS protocol presence",
                    "Suspicious keywords (free, win, urgent)"
                ]} />
                <FeatureBox title="Content-Based Features" items={[
                    "Grammar & Spelling error rate",
                    "Presence of 'Return Policy' links",
                    "Image-to-text ratio",
                    "Social Proof verification (Review patterns)"
                ]} />
            </div>
        </Section>

        <Section title="Machine Learning Approach">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-800 mb-2">Model Selection: Random Forest Classifier</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    We chose a Random Forest model because it handles non-linear relationships well (e.g., a new domain isn't always fake, but a new domain + bad grammar usually is). It also provides 
                    <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded mx-1">feature_importances_</span> which allows us to generate the "Reasons" list for the user.
                </p>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Scikit-Learn</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Pandas</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">NumPy</span>
                </div>
            </div>
        </Section>
      </div>
    </div>
  );
};

const ArchitectureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
        <div className="mb-3 p-3 bg-slate-50 rounded-full">{icon}</div>
        <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
        <p className="text-xs text-slate-500">{desc}</p>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-3">
        <h3 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">{title}</h3>
        {children}
    </div>
);

const FeatureBox: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h4 className="font-semibold text-slate-700 mb-3">{title}</h4>
        <ul className="space-y-2">
            {items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    {item}
                </li>
            ))}
        </ul>
    </div>
);