/* 오방사주 자유 상담 — Claude API 서버 함수 (체험용 일부 오픈)
   - 화면(ask.js)이 계산한 사주 사실 + 캐릭터 규칙을 첫 메시지로, 이어서 대화 최대 8턴을 보낸다
   - 남용 방지: 첫 메시지에 [사주 사실] 표식 필수, 질문 300자 · 첫 메시지 1만 2천 자 이하, 답 700토큰
   - 사용 제한(보수적): IP당 1분 6회 · IP당 하루 질문 8개 · 사이트 전체 하루 300개 · 한 달 4,000개 */
import { getStore } from "@netlify/blobs";
const MODEL = "claude-sonnet-5-5";
const IP_DAY = 8, ALL_DAY = 300, ALL_MONTH = 4000;
const ORIGINS = [/^https:\/\/obangsaju\.netlify\.app$/, /^https:\/\/[a-z0-9-]+--obangsaju\.netlify\.app$/, /^http:\/\/localhost(:\d+)?$/];
/* Anthropic 스트림(SSE)에서 글자만 뽑아 그대로 흘려보낸다 → 첫 글자가 1~2초 안에 보이고, 넷리파이 스트리밍 한도(60초) 안에서 끝난다 */
function sse(body, onEnd) { const enc = new TextEncoder(), dec = new TextDecoder(); let all = "";
  return new ReadableStream({ async start(ctrl) { const rd = body.getReader(); let buf = "";
    try { for (;;) { const { done, value } = await rd.read(); if (done) break; buf += dec.decode(value, { stream: true }); let k;
      while ((k = buf.indexOf("\n\n")) >= 0) { const ev = buf.slice(0, k); buf = buf.slice(k + 2); const line = ev.split("\n").find(l => l.startsWith("data:")); if (!line) continue;
        try { const j = JSON.parse(line.slice(5)); if (j.type === "content_block_delta" && j.delta && j.delta.text) { all += j.delta.text; ctrl.enqueue(enc.encode(j.delta.text)); } } catch {} } } }
    catch {} if (onEnd) { try { await onEnd(all); } catch {} } ctrl.close(); } }); }
const out = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
export default async (req, context) => {
  if (req.method === "GET") return out({ ok: true, key: !!process.env.ANTHROPIC_API_KEY, model: MODEL });
  if (req.method !== "POST") return out({ error: "method" }, 405);
  const origin = req.headers.get("origin") || "";
  if (origin && !ORIGINS.some(r => r.test(origin))) return out({ error: "origin" }, 403);
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return out({ error: "nokey" }, 503);
  let body; try { body = await req.json(); } catch { return out({ error: "bad" }, 400); }
  const msgs = Array.isArray(body.messages) ? body.messages : [];
  if (msgs.length < 2 || msgs.length > 17) return out({ error: "size" }, 400);
  const first = String(msgs[0] && msgs[0].content || "");
  if (!first.includes("[사주 사실]") || first.length > 12000) return out({ error: "bad" }, 400);
  const clean = [];
  for (let i = 0; i < msgs.length; i++) { const m = msgs[i] || {}; const role = m.role === "assistant" ? "assistant" : "user"; const c = String(m.content || "");
    if (i > 0 && role === "user" && c.length > 300) return out({ error: "size" }, 400);
    if (role === "assistant" && c.length > 2000) return out({ error: "size" }, 400);
    if (clean.length && clean[clean.length - 1].role === role) clean[clean.length - 1].content += "\n" + c; else clean.push({ role, content: c }); }
  if (clean[clean.length - 1].role !== "user") return out({ error: "bad" }, 400);
  const store = getStore("chat");
  const ip = context.ip || "x", day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const ipK = `n/${day}/${ip}`, allK = `n/${day}/all`, monK = `m/${day.slice(0, 7)}`;
  const [ipN, allN, monN] = await Promise.all([ipK, allK, monK].map(k => store.get(k, { type: "json" }).catch(() => 0)));
  if ((ipN || 0) >= IP_DAY || (allN || 0) >= ALL_DAY || (monN || 0) >= ALL_MONTH) return out({ error: "limit" }, 429);
  await Promise.all([store.setJSON(ipK, (ipN || 0) + 1), store.setJSON(allK, (allN || 0) + 1), store.setJSON(monK, (monN || 0) + 1)]);
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 650, stream: true, messages: clean }) });
  if (!r.ok || !r.body) { const t = await r.text().catch(() => ""); return out({ error: "upstream", status: r.status, detail: t.slice(0, 300) }, 502); }
  return new Response(sse(r.body), { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-left": String(Math.max(0, IP_DAY - (ipN || 0) - 1)) } });
};
export const config = { path: "/api/chat", rateLimit: { windowLimit: 6, windowSize: 60, aggregateBy: ["ip", "domain"] } };
