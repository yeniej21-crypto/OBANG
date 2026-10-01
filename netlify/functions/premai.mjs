/* 오방사주 상세 풀이 — Claude API 서버 함수
   - API 키는 넷리파이 환경 변수 ANTHROPIC_API_KEY 에만 둔다(화면 코드에 넣지 않는다)
   - 같은 프롬프트(= 같은 사주 · 같은 상품)는 저장해 둔 결과를 돌려준다(비용 0, 같은 사주 같은 풀이)
   - 사용 제한: IP당 1분 16회(넷리파이 rateLimit) · IP당 하루 40회 · 사이트 전체 하루 400회
   - 프롬프트 길이 2만 4천 자 이하, 답 길이 max_tokens 3500, 모델 고정 */
import { getStore } from "@netlify/blobs";
const MODEL = "claude-sonnet-5-5";
const IP_DAY = 40, ALL_DAY = 400;
const ORIGINS = [/^https:\/\/obangsaju\.netlify\.app$/, /^https:\/\/[a-z0-9-]+--obangsaju\.netlify\.app$/, /^http:\/\/localhost(:\d+)?$/];
const out = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
async function sha(s) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("").slice(0, 40); }
function parse(t) { t = String(t || "").trim(); try { return JSON.parse(t); } catch {} const m = t.match(/```(?:json)?\s*([\s\S]*?)```/); if (m) { try { return JSON.parse(m[1]); } catch {} }
  const a = Math.min(...["{", "["].map(c => { const i = t.indexOf(c); return i < 0 ? 1e9 : i; })), z = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]")); if (a < z) { try { return JSON.parse(t.slice(a, z + 1)); } catch {} } return null; }
export default async (req, context) => {
  if (req.method !== "POST") return out({ error: "method" }, 405);
  const origin = req.headers.get("origin") || "";
  if (origin && !ORIGINS.some(r => r.test(origin))) return out({ error: "origin" }, 403);
  const key = process.env.ANTHROPIC_API_KEY; if (!key) return out({ error: "nokey" }, 503);
  let body; try { body = await req.json(); } catch { return out({ error: "bad" }, 400); }
  const prompt = String(body.prompt || ""); if (prompt.length < 50 || prompt.length > 24000) return out({ error: "size" }, 400);
  const store = getStore("premai"); const h = await sha(prompt);
  const hit = await store.get("c/" + h, { type: "json" }).catch(() => null); if (hit) return out({ data: hit, cached: true });
  const ip = context.ip || "x", day = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const ipK = `n/${day}/${ip}`, allK = `n/${day}/all`;
  const [ipN, allN] = await Promise.all([store.get(ipK, { type: "json" }).catch(() => 0), store.get(allK, { type: "json" }).catch(() => 0)]);
  if ((ipN || 0) >= IP_DAY || (allN || 0) >= ALL_DAY) return out({ error: "limit" }, 429);
  await Promise.all([store.setJSON(ipK, (ipN || 0) + 1), store.setJSON(allK, (allN || 0) + 1)]);
  const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 3500, messages: [{ role: "user", content: prompt + "\n\n출력은 JSON 값 하나만. 앞뒤 설명이나 코드펜스 없이." }] }) });
  if (!r.ok) { const t = await r.text().catch(() => ""); return out({ error: "upstream", status: r.status, detail: t.slice(0, 300) }, 502); }
  const j = await r.json(); const text = (j.content || []).map(c => c.text || "").join("");
  const data = parse(text); if (!data) return out({ error: "invalid_json" }, 502);
  await store.setJSON("c/" + h, data).catch(() => {});
  return out({ data });
};
export const config = { path: "/api/premai", rateLimit: { windowLimit: 16, windowSize: 60, aggregateBy: ["ip", "domain"] } };
