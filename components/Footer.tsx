import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const [modal, setModal] = useState<'privacy' | 'terms' | null>(null);

  const currentYear = new Date().getFullYear(); 

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="mb-6">
                 {/* Use the new logo with prefix in footer */}
                 <BrandLogo variant="light" withPrefix={true} className="w-48" />
              </div>
              <p className="text-sm leading-relaxed mb-8 opacity-80 font-medium">
                A robust AI analysis tool designed to identify fraudulent listing patterns in e-commerce, protecting consumers from financial loss.
              </p>
              <a href="mailto:sakethvedullapalli@gmail.com" className="inline-block px-4 py-2 bg-white/5 rounded-lg text-sm text-blue-400 hover:text-white hover:bg-blue-600 transition-all font-bold">
                Contact Developer
              </a>
            </div>

            <div className="md:ml-auto">
              <h4 className="text-white font-bold mb-8 tracking-wide text-xs uppercase opacity-90">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">Features</button></li>
                <li><button onClick={() => scrollToSection('team')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">Contact</button></li>
              </ul>
            </div>

            <div className="md:ml-auto">
              <h4 className="text-white font-bold mb-8 tracking-wide text-xs uppercase opacity-90">Resources</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button onClick={() => scrollToSection('guide')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">User Guide</button></li>
                <li><button onClick={() => scrollToSection('tips')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">Safety Tips</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">Report a Scam</button></li>
              </ul>
            </div>

            <div className="md:ml-auto">
              <h4 className="text-white font-bold mb-8 tracking-wide text-xs uppercase opacity-90">Legal</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><button type="button" onClick={() => setModal('privacy')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">Privacy Policy</button></li>
                <li><button type="button" onClick={() => setModal('terms')} className="hover:text-white hover:translate-x-1 transition-all inline-block text-left">Terms & Conditions</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-semibold text-slate-500 tracking-wide">
            <p>© {currentYear} Verify Your Cart Project.</p>
            <p className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
              Handcrafted with <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse-slow" /> by ECE-A Team
            </p>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-fade-in-up ring-1 ring-white/20 overflow-hidden relative">
            <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-2xl text-slate-900">
                {modal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button onClick={() => setModal(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar leading-relaxed text-slate-600 space-y-6 text-sm font-medium">
              {modal === 'privacy' ? <PrivacyContent /> : <TermsContent />}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setModal(null)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PrivacyContent = () => (
  <div className="prose prose-sm prose-slate max-w-none">
    <p className="font-bold text-slate-900">Last Updated: January 2026</p>
    <p>Welcome to <strong>Verify Your Cart</strong>. We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we handle information when you use our website.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">1. Information We Collect</h4>
    <p>We do not require users to create an account. When you use our "Scan Now" feature, the product URL or text you provide is processed by our AI (Google Gemini) to generate an analysis. We do not store these URLs in a permanent database linked to your identity.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">2. Cookies and Tracking</h4>
    <p>We may use cookies to improve your browsing experience and for Google AdSense to serve relevant advertisements. These cookies help us analyze web traffic and optimize site performance.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">3. Third-Party Services</h4>
    <p>Our service uses <strong>Google Gemini API</strong> for product analysis. By using this tool, you acknowledge that the content you input is processed according to Google's AI privacy standards. We also use <strong>Google AdSense</strong>, which may collect data to show personalized ads.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">4. Data Security</h4>
    <p>We implement industry-standard security measures to protect the integrity of our platform and the data processed through it.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">5. Contact Us</h4>
    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:sakethvedullapalli@gmail.com" className="text-blue-600 underline font-bold">sakethvedullapalli@gmail.com</a>.</p>
  </div>
);

const TermsContent = () => (
  <div className="prose prose-sm prose-slate max-w-none">
    <p>By accessing this website, you agree to be bound by these Terms and Conditions of use.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">1. Use License</h4>
    <p>Permission is granted to use Verify Your Cart for personal, non-commercial transitory viewing only. This tool is provided "as is" for informational purposes to help users identify potential fraud.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">2. Accuracy of Analysis</h4>
    <p>The AI-generated scores and reasoning are predictions based on patterns. We do not guarantee 100% accuracy. Users should always exercise their own judgment before making financial decisions or purchases.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">3. Limitations</h4>
    <p>In no event shall Verify Your Cart or its developers be liable for any damages arising out of the use or inability to use the materials on this website.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">4. Revisions</h4>
    <p>We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms.</p>
    
    <h4 className="font-bold text-slate-900 text-lg mt-8 mb-3">5. Governing Law</h4>
    <p>These terms are governed by the laws of India and any disputes will be subject to the exclusive jurisdiction of the courts in that location.</p>
  </div>
);