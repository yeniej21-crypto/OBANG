/* 로그인 설정(10/3): 넷리파이 환경변수에서만 읽어 화면에 내려 준다. 코드에는 키를 넣지 않는다.
   SUPABASE_URL · SUPABASE_ANON_KEY 둘 다 있으면 live(실제 로그인), 없으면 mock(체험판 로그인).
   AUTH_MODE=mock 으로 두면 키가 있어도 체험판 로그인으로 되돌린다. anon 키는 공개용 키(행 단위 보안 RLS로 보호). */
export default async () => {
  const url = process.env.SUPABASE_URL, anon = process.env.SUPABASE_ANON_KEY;
  const live = !!(url && anon) && process.env.AUTH_MODE !== "mock";
  return new Response(JSON.stringify(live ? { mode: "live", url, anon } : { mode: "mock" }), {
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=60" } });
};
export const config = { path: "/api/config" };
