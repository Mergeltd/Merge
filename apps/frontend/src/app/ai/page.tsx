"use client";
import React from 'react';
import { ChatAssistant } from '../../components/ai/chat-assistant';

export default function AiAssistantPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AI Maintenance Assistant</h1>
      <p className="text-slate-500 mb-6">Describe your issue to get smart diagnostics and technician recommendations.</p>
      <ChatAssistant />
    </div>
  );
}
