"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { residentProfile } from '@/lib/mock/resident';

interface ChatMessage {
  role: 'ai' | 'user';
  content: string;
}

const suggestedPrompts = [
  'My kitchen sink is leaking under the cabinet',
  'The AC in my bedroom stopped cooling',
  'A light switch sparked when I flipped it',
  'My bedroom door won’t close properly',
];

const canned: Record<string, string> = {
  leak: 'That sounds like a Plumbing issue — likely a worn pipe joint or seal. Estimated cost: KES 1,500–3,500. Urgency: High. Want me to match you with a nearby verified plumber?',
  ac: 'That sounds like an HVAC issue — possibly low refrigerant or a blocked filter. Estimated cost: KES 2,000–6,000. Urgency: Medium. I can match you with a verified HVAC technician now.',
  spark: 'That sounds like an Electrical issue, and it may be unsafe — please avoid using that switch. Estimated cost: KES 1,000–2,500. Urgency: Critical. I recommend requesting a verified electrician immediately.',
  door: 'That sounds like a Carpentry issue — likely a misaligned hinge or frame. Estimated cost: KES 800–2,000. Urgency: Low. I can match you with a nearby verified carpenter.',
};

function getReply(input: string) {
  const lower = input.toLowerCase();
  if (lower.includes('sink') || lower.includes('leak') || lower.includes('pipe')) return canned.leak;
  if (lower.includes('ac') || lower.includes('cool') || lower.includes('hvac')) return canned.ac;
  if (lower.includes('spark') || lower.includes('switch') || lower.includes('electric')) return canned.spark;
  if (lower.includes('door') || lower.includes('hinge') || lower.includes('cabinet')) return canned.door;
  return `Thanks for the details, ${residentProfile.firstName}. Based on what you've described, I'd categorize this as a general maintenance issue. I'll flag it as Medium urgency and match you with a nearby verified technician — you can also submit it directly as a request.`;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      content: `Hi ${residentProfile.firstName}! I'm the MERGE AI Assistant. Describe your maintenance issue and I'll help categorize it, estimate cost and urgency, and match you with a verified technician.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setMessages((prev) => [...prev, { role: 'user', content }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', content: getReply(content) }]);
      setLoading(false);
    }, 1100);
  };

  return (
    <div className="space-y-6 pb-12">
      <Reveal>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            AI Maintenance Assistant
          </h1>
          <p className="mt-1 text-sm text-slate-500">Describe your issue in plain language and get instant triage.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[560px] overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'ai' ? 'flex items-start gap-3' : 'flex items-start justify-end gap-3'}>
                {m.role === 'ai' && (
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </span>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    m.role === 'ai'
                      ? 'bg-slate-50 text-slate-700 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-xs font-bold text-slate-600">
                    {residentProfile.initials}
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </span>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-50 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-slate-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="px-5 sm:px-6 pb-3 flex flex-wrap gap-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => send(p)}
                  className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 sm:p-5 border-t border-slate-100 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="e.g. My sink is leaking under the cabinet..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={!input.trim()}
              aria-label="Send message"
              className="w-11 h-11 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
