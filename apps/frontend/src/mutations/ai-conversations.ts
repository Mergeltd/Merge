import { createClient } from '@/lib/supabase/client';

// The AI reply logic itself stays the client-side canned-response matcher
// for now (ai-diagnose-proxy, the real LLM-backed replacement, is Phase
// 13 — it needs a server-held secret to call apps/ai-service). What's new
// here is that the conversation now actually persists in ai_conversations/
// ai_messages instead of living only in React state and vanishing on
// refresh.
export async function createConversation(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ai_conversations')
    .insert({ user_id: userId })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function addMessage(conversationId: string, role: 'user' | 'assistant', content: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('ai_messages')
    .insert({ conversation_id: conversationId, role, content });

  if (error) throw error;
}
