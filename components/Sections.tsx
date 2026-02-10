import React, { useState, useEffect, useRef } from 'react';
import { Brain, SearchCheck, TrendingDown, Copy, Search, FileText, ArrowRight, Mail, MapPin, Zap, Shield, AlertOctagon, Star, UserX, ImageOff, Tag, Smartphone, Chrome, ShoppingBag, Eye } from 'lucide-react';

// --- Helper Components ---

const ScrollReveal: React.FC<{ children: React.ReactNode; className?: string; delay?: string }> = ({ children, className = "", delay = '0s' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${className} transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; gradient: string }> = ({ icon, title, desc, gradient }) => (
  <div className="group relative p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 ease-out hover:-translate-y-2 overflow-hidden hover:border-blue-100 h-full">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-10 -mt-10 transition-transform duration-700 ease-out group-hover:scale-150 group-hover:rotate-12`}></div>
    
    <div className={`mb-8 p-4 bg-gradient-to-br ${gradient} rounded-2xl inline-block shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 ease-out`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
    <ul className="text-slate-600 leading-relaxed font-medium text-sm space-y-2">
        {desc.split('\n').map((line, i) => (
             line.trim() && <li key={i} className="flex items-start gap-2 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}><span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 shrink-0 group-hover:bg-blue-400 transition-colors"></span>{line}</li>
        ))}
    </ul>
  </div>
);

const GuideStep: React.FC<{ num: string; title: string; desc: string; icon: React.ReactNode }> = ({ num, title, desc, icon }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:translate-x-0 md:hover:translate-x-2 hover:border-white/20 transition-all duration-500 ease-out group backdrop-blur-sm cursor-default">
    <div className="hidden md:block text-6xl font-black text-white/5 group-hover:text-white/20 transition-colors font-mono group-hover:scale-110 duration-500 ease-out">{num}</div>
    <div className="w-full">
      <h4 className="text-xl md:text-2xl font-bold mb-3 flex items-center justify-between sm:justify-start gap-4 text-white">
        {title} 
        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 ease-out group-hover:rotate-12 group-hover:scale-110">{icon}</div>
      </h4>
      <p className="text-slate-400 leading-relaxed font-medium text-base md:text-lg transition-colors group-hover:text-slate-300">{desc}</p>
    </div>
  </div>
);

const TipCard: React.FC<{ title: string; desc: string; color: string; icon: React.ReactNode }> = ({ title, desc, color, icon }) => {
    const colorClasses: {[key: string]: string} = {
        rose: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:border-rose-200 group-hover:bg-rose-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:border-blue-200 group-hover:bg-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:border-emerald-200 group-hover:bg-emerald-100',
        violet: 'bg-violet-50 text-violet-600 border-violet-100 group-hover:border-violet-200 group-hover:bg-violet-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:border-amber-200 group-hover:bg-amber-100',
    };
    const iconColor = colorClasses[color] || colorClasses.blue;

    return (
        <div className={`group p-6 md:p-8 rounded-3xl border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 ease-out hover:-translate-y-2 bg-white hover:border-transparent h-full`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 ${iconColor}`}>
                {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
            </div>
            <h4 className={`font-bold text-xl mb-3 text-slate-900 group-hover:text-slate-700 transition-colors duration-300`}>{title}</h4>
            <p className="text-slate-600 font-medium leading-relaxed">{desc}</p>
        </div>
    );
};

const TeamMember: React.FC<{ name: string; roll: string; initials: string; gradient: string; text: string }> = ({ name, roll, initials, gradient, text }) => (
  <div className="group bg-white p-6 md:p-10 rounded-3xl border border-slate-100 text-center hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 ease-out hover:-translate-y-3">
    <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold ${text} mx-auto mb-6 border-4 border-white shadow-lg group-hover:scale-110 group-hover:shadow-blue-200/50 transition-all duration-500 ease-out`}>
      {initials}
    </div>
    <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
    <p className={`text-xs font-bold ${text} bg-slate-50 inline-block px-3 py-1.5 rounded-lg font-mono group-hover:bg-white group-hover:shadow-sm transition-all duration-300`}>{roll}</p>
  </div>
);

const FraudTypeCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 ease-out group hover:-translate-y-1 hover:border-blue-100">
    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-rose-500 group-hover:border-rose-100 transition-all duration-300 shadow-sm group-hover:scale-110">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">{title}</h4>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// --- Exported Sections ---

export function ProblemSection() {
  return (
    <div className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal>
             <div className="inline-block px-4 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wide mb-6 hover:bg-rose-100 transition-colors cursor-default">
                The Core Problem
             </div>
             <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
               Imagine saving up for <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600">branded gear...</span>
             </h2>
             <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6 border-l-4 border-rose-200 pl-6 italic hover:border-rose-400 transition-colors duration-300">
               "You find a pair with a 4.5-star rating. But when the package arrives, it’s a cheap plastic knock-off that stops working in 48 hours. It’s more than just a waste of money; it’s a breach of trust."
             </p>
             <p className="text-slate-600 leading-relaxed mb-8">
               The digital marketplace has a major transparency issue. Currently, it is nearly impossible for a regular shopper to distinguish between reality and a well-crafted scam.
             </p>
          </ScrollReveal>
          
          <ScrollReveal delay="0.2s">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="col-span-1 sm:col-span-2 text-center mb-4">
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Targeting 4 Types of Fraud</span>
               </div>
               <FraudTypeCard 
                 icon={<Star size={24} />}
                 title="Fake Reviews"
                 desc="Bot-generated 5-star ratings that hide poor quality."
               />
               <FraudTypeCard 
                 icon={<UserX size={24} />}
                 title="Fake Sellers"
                 desc="Accounts that disappear after taking your money."
               />
               <FraudTypeCard 
                 icon={<ImageOff size={24} />}
                 title="Fake Images"
                 desc="Using professional stock photos for a sub-par physical item."
               />
               <FraudTypeCard 
                 icon={<Tag size={24} />}
                 title="Price Scams"
                 desc="Listings that use 'too good to be true' prices to lure victims."
               />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <div className="py-20 md:py-32 bg-slate-50 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3 block animate-pulse">The Detection Engine</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">How the Technology Works</h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
               Our smart system acts as a digital bodyguard. Instead of just looking at the price tag, we analyze multiple data points using simple AI concepts.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay="0.1s" className="h-full">
            <FeatureCard 
              icon={<Star className="text-white" size={32} />}
              gradient="from-violet-500 to-purple-500"
              title="1. Product Review"
              desc={`Analyze review text sentiment.
  Check if sentiment matches star rating.
  Detect fake patterns (copy-paste).
  Identify abnormal 5-star spikes.`}
            />
          </ScrollReveal>
          <ScrollReveal delay="0.2s" className="h-full">
            <FeatureCard 
              icon={<UserX className="text-white" size={32} />}
              gradient="from-orange-500 to-amber-500"
              title="2. Seller Trust"
              desc={`Evaluate seller history & behavior.
  Check for new or suspicious accounts.
  Detect sellers with frequent complaints.
  Flag missing seller details.`}
            />
          </ScrollReveal>
          <ScrollReveal delay="0.3s" className="h-full">
            <FeatureCard 
              icon={<TrendingDown className="text-white" size={32} />}
              gradient="from-emerald-500 to-teal-500"
              title="3. Price Analysis"
              desc={`Compare price with market average.
  Flag unrealistically low prices.
  Detect misleading discount claims.
  Identify 'too good to be true' offers.`}
            />
          </ScrollReveal>
          <ScrollReveal delay="0.4s" className="h-full">
             <FeatureCard 
              icon={<FileText className="text-white" size={32} />}
              gradient="from-blue-500 to-cyan-500"
              title="4. Product Content"
              desc={`Check title & description quality.
  Detect exaggerated claims.
  Identify grammar errors.
  Find mismatches between images & text.`}
            />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

export function GuideSection() {
  return (
    <div className="py-20 md:py-32 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', 
        backgroundSize: '50px 50px' 
      }}></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="lg:w-1/3">
            <ScrollReveal>
              <div className="inline-block p-2 bg-blue-500/10 rounded-lg mb-6 border border-blue-500/20">
                 <Zap size={24} className="text-blue-400" />
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 md:mb-8">The Final Verdict</h2>
              <p className="text-slate-400 text-lg md:text-xl mb-8 md:mb-10 leading-relaxed font-light">
                The goal isn't to confuse you with data, but to give a clear, actionable result.
              </p>
              <div className="flex flex-col gap-4">
                 <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                 <button className="text-white font-bold flex items-center gap-3 mt-4 hover:gap-5 transition-all duration-300 group bg-white/10 w-fit px-6 py-3 rounded-full hover:bg-white/20 border border-white/5 hover:border-white/20 active:scale-95">
                    Start Scanning <ArrowRight size={20} className="text-blue-400 group-hover:text-white transition-colors" />
                 </button>
              </div>
            </ScrollReveal>
          </div>
          
          <div className="lg:w-2/3 grid gap-6 w-full">
            <ScrollReveal delay="0.2s">
              <GuideStep 
                num="01" 
                title="Safe Product" 
                desc="High trust, verified seller, and authentic reviews. Safe to buy." 
                icon={<Shield size={24} />} 
              />
            </ScrollReveal>
            <ScrollReveal delay="0.3s">
              <GuideStep 
                num="02" 
                title="Risky Product" 
                desc="Mixed signals found. Proceed with caution. Double check." 
                icon={<AlertOctagon size={24} />} 
              />
            </ScrollReveal>
            <ScrollReveal delay="0.4s">
              <GuideStep 
                num="03" 
                title="Likely Fake" 
                desc="High probability of being a scam or low-quality clone. Avoid." 
                icon={<AlertOctagon size={24} className="text-red-500" />} 
              />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TipsSection() {
  return (
    <div className="py-20 md:py-32 bg-white relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="container mx-auto px-4 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-3 block">Safety First</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Fraud Prevention Tips</h2>
            <p className="text-slate-600 text-lg">Essential habits for safe online shopping</p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ScrollReveal delay="0.1s" className="h-full">
            <TipCard title="Price Too Low?" desc="If a deal is 70% cheaper than competitors, it's a red flag." color="rose" icon={<TrendingDown />} />
          </ScrollReveal>
          <ScrollReveal delay="0.2s" className="h-full">
            <TipCard title="Check Protocol" desc="Ensure the URL starts with 'https://' before entering payment data." color="blue" icon={<Shield />} />
          </ScrollReveal>
          <ScrollReveal delay="0.3s" className="h-full">
            <TipCard title="Grammar Matters" desc="Professional brands rarely have typos in descriptions." color="emerald" icon={<FileText />} />
          </ScrollReveal>
          <ScrollReveal delay="0.4s" className="h-full">
            <TipCard title="Reverse Search" desc="Scammers often steal high-quality images from other sites." color="violet" icon={<Search />} />
          </ScrollReveal>
          <ScrollReveal delay="0.5s" className="h-full">
            <TipCard title="Payment Methods" desc="Avoid sellers asking for direct wire transfers or crypto." color="amber" icon={<AlertOctagon />} />
          </ScrollReveal>
          <ScrollReveal delay="0.6s" className="h-full">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 flex items-center justify-center text-white text-center shadow-xl transform hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer group hover:rotate-1 hover:shadow-2xl h-full">
                <div>
                    <div className="mx-auto bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-110 transition-transform duration-500 ease-out">
                        <Shield size={32} className="text-blue-400" />
                    </div>
                    <h4 className="font-bold text-2xl mb-3 group-hover:text-blue-400 transition-colors">Stay Vigilant</h4>
                    <p className="text-slate-400 font-medium">If it feels wrong, it probably is.</p>
                </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

export function VisionSection() {
  return (
    <div className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[100px] opacity-60 pointer-events-none animate-blob animation-delay-2000"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
              <h4 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-6">Our Mission</h4>
              <h2 className="text-3xl md:text-6xl font-extrabold text-slate-900 mb-8 tracking-tight">Making Online Shopping <br/> Reliable for Everyone</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
            <ScrollReveal>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Smartphone size={24} className="text-blue-600" /> The Impact
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                    This isn't just about saving a few dollars. Fake products can be dangerous. 
                </p>
                <ul className="space-y-4">
                    <li className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                        <div className="mt-1 text-rose-500"><AlertOctagon size={20} /></div>
                        <span className="text-slate-700">Fake chargers that damage phones</span>
                    </li>
                    <li className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                         <div className="mt-1 text-rose-500"><AlertOctagon size={20} /></div>
                        <span className="text-slate-700">Counterfeit cosmetics causing skin reactions</span>
                    </li>
                    <li className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                         <div className="mt-1 text-rose-500"><AlertOctagon size={20} /></div>
                        <span className="text-slate-700">Uncertified power banks posing fire risks</span>
                    </li>
                </ul>
            </ScrollReveal>
            <ScrollReveal delay="0.2s">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-10 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 ease-out">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity duration-700"></div>
                   <div className="relative z-10">
                      <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                          <Chrome size={40} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Future Vision</h3>
                      <p className="text-slate-400 leading-relaxed mb-6">
                          "Technology should work for the people, not the scammers."
                      </p>
                      <p className="text-lg font-medium">
                          Our goal is to launch this as a <span className="text-blue-400">Browser Extension</span> and Mobile App that works in the background while you shop.
                      </p>
                   </div>
              </div>
            </ScrollReveal>
        </div>

        <div className="text-center max-w-3xl mx-auto">
            <p className="text-slate-500 text-sm">
            Founded as a student initiative at <span className="font-bold text-slate-800">Aditya College of Engineering and Technology</span>.
            </p>
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  return (
    <div className="py-20 md:py-32 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <h4 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Project Team</h4>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Meet The Developers</h2>
            <div className="inline-block mt-6 px-6 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 uppercase tracking-wide hover:bg-slate-100 transition-colors cursor-default">
              Aditya College of Engineering and Technology • ECE-A
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <ScrollReveal delay="0.1s">
            <TeamMember name="Saketh Vedullapalli" roll="24P31A0459" initials="SV" gradient="from-blue-100 to-indigo-100" text="text-blue-700" />
          </ScrollReveal>
          <ScrollReveal delay="0.2s">
            <TeamMember name="Goda Jagadeesh" roll="24P31A0418" initials="GJ" gradient="from-purple-100 to-pink-100" text="text-purple-700" />
          </ScrollReveal>
          <ScrollReveal delay="0.3s">
            <TeamMember name="Madhuri Palla" roll="24P31A0445" initials="MP" gradient="from-emerald-100 to-teal-100" text="text-emerald-700" />
          </ScrollReveal>
          <ScrollReveal delay="0.4s">
            <TeamMember name="Akash Kumar Kosetti" roll="24P31A04Q3" initials="AK" gradient="from-orange-100 to-amber-100" text="text-orange-700" />
          </ScrollReveal>
          <ScrollReveal delay="0.5s">
            <TeamMember name="Sowmya Betha" roll="24P31A04K4" initials="SB" gradient="from-cyan-100 to-sky-100" text="text-cyan-700" />
          </ScrollReveal>
          <ScrollReveal delay="0.6s">
            <TeamMember name="Saranya D" roll="24P31A04E5" initials="SD" gradient="from-rose-100 to-red-100" text="text-rose-700" />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <div className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <ScrollReveal>
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-16 bg-slate-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 group-hover:opacity-40 transition-opacity duration-700"></div>
                    <div className="relative z-10">
                        <h4 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-6">Get In Touch</h4>
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">We'd love to hear from you</h2>
                        <p className="text-slate-400 mb-12 leading-relaxed font-medium text-lg">
                            Have a suggestion? Found a bug? Or simply want to collaborate? Use the form to reach out to the project developers directly.
                        </p>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group/item cursor-pointer">
                                <div className="bg-white/10 p-4 rounded-2xl text-blue-400 group-hover/item:bg-blue-500 group-hover/item:text-white transition-colors duration-300"><Mail size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-white text-lg mb-1 group-hover/item:text-blue-400 transition-colors">Email Us</h4>
                                    <a href="mailto:sakethvedullapalli@gmail.com" className="text-slate-400 hover:text-white transition-colors font-medium break-all">sakethvedullapalli@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-6 group/item cursor-pointer">
                                <div className="bg-white/10 p-4 rounded-2xl text-purple-400 group-hover/item:bg-purple-500 group-hover/item:text-white transition-colors duration-300"><MapPin size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-white text-lg mb-1 group-hover/item:text-purple-400 transition-colors">Our Location</h4>
                                    <p className="text-slate-400 font-medium">Surampalem, Andhra Pradesh, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-16 bg-white">
                    <h3 className="font-bold text-2xl text-slate-900 mb-8">Send us a message</h3>
                    <form className="space-y-6" onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                        window.location.href = `mailto:sakethvedullapalli@gmail.com?subject=Inquiry from ${name}&body=${message}`;
                    }}>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                            <input name="name" type="text" placeholder="Your full name" className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 bg-slate-50 focus:bg-white hover:border-blue-300" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input name="email" type="email" placeholder="email@example.com" className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 bg-slate-50 focus:bg-white hover:border-blue-300" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                            <textarea name="message" placeholder="How can we help you?" rows={4} className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 bg-slate-50 focus:bg-white hover:border-blue-300" required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-slate-900 text-white font-bold py-5 rounded-xl hover:bg-blue-600 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 transform active:scale-[0.98] hover:-translate-y-0.5">
                            Send Message <ArrowRight size={20} />
                        </button>
                        <p className="text-xs text-slate-400 text-center mt-4">
                          This will open your email app with a pre-filled message to sakethvedullapalli@gmail.com
                        </p>
                    </form>
                </div>
              </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}