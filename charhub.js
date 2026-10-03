/* charhub.js — 홈 '캐릭터 상담' 통합(10/3 은주: 동그라미 누르면 누군지 모른 채 채팅으로 떨어짐 · 아래 '나의 수호신'과 중복)
   1) '오늘은 누구한테 털어놓을래' 줄 → 세로 카드(오방신은 음의 얼굴 동그라미를 겹쳐 두 얼굴임을 보여 줌, 내 수호신은 맨 앞 + 표시)
   2) 새 칸 '음의 현신 · 같은 바람, 다른 얼굴': 여신 소개 영상 배너 + 여신 다섯 카드
   3) 누르면 캐릭터 소개 화면: 영상(목소리) · 소개 · 대표 대사 · 잘 맞는 고민 · 같은 신수의 두 얼굴 전환 → '상담하기'(chat.html?h=) 또는 대표 메뉴
   '나의 수호신' 칸(#secMem)은 숨김(같은 내용). 페이지 쪽 연결은 window.ObHome(goPage · bgm). */
(function(){
  'use strict';
  var $ = function(id){ return document.getElementById(id); };
  var YV = 'https://d2ol7oe51mr4n9.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/';
  var SAEA_IMG = 'https://d8j0ntlcm91z4.cloudfront.net/user_39PvKg67WRq5T66HczulEDxUKSm/hf_20261002_064155_cabdc321-7f5b-47b3-9ba6-e41a246362c2_min.webp';
  var BEAST = {wood:['동쪽','청룡','木'],fire:['남쪽','주작','火'],earth:['중앙','황룡','土'],metal:['서쪽','백호','金'],water:['북쪽','현무','水']};
  var COL = {wood:'#46b47f',fire:'#ec5a43',earth:'#d3a13a',metal:'#c9d1dc',water:'#5b8ce6'};
  /* menu: [버튼 글자, 홈 카드 id, 바로 갈 주소] */
  var C = {
    seoha:{n:'서하',k:'한남동 살롱의 주인',img:'img/seoha.jpg',v:'v/t1.mp4',c:'#e3b866',q:'문 닫고, 이리 와 앉아.',
      d:'여덟 글자를 펼쳐 놓고 차분하게 핵심부터 짚어 줘요. 이야기 끝에는 오늘 해 볼 작은 행동 하나를 건네요.',t:['무엇이든','올해 흐름','내 성격'],menu:['오늘의 운세 보기','cToday','today.html'],role:'무엇이든'},
    taeo:{n:'태오',k:'도화 · 연애 담당',img:'img/taeo/base.jpg',v:'v/taeo/v1.mp4',c:'#ffb9a6',q:'뭐든 물어봐. 사주 펼쳐 놓고 대답해 줄게.',
      d:'눈치 빠르고 장난기 있는 연하. 끌림과 타이밍을 사주로 읽어서 연애를 옆에서 코치해 줘요.',t:['그 사람과 나','연애 타이밍','끌리는 유형'],menu:['도화 사주 보기','cDohwa','dohwa.html'],role:'연애 · 도화',maleMute:1},
    wood:{n:'하람',img:'img/wood.jpg',v:'v/rv_wood.mp4',q:'왔구나. 새로 시작하고 싶은 거 있어.',
      d:'새 시작과 다음 인연을 맡은 신. 맑고 다정하게, 망설이는 첫걸음을 끝까지 응원해요.',t:['새 시작','다음 인연','공부 · 취미'],menu:['다음 연애 보기','cNext','love2.html?m=next'],role:'새 시작',hj:'甲',im:'큰 나무',face:'곧게 뻗어 길을 내는 얼굴'},
    fire:{n:'이안',img:'img/fire.jpg',v:'v/rv_fire.mp4',q:'망설이는 거 있지. 말해 봐.',
      d:'고백과 결단을 맡은 신. 나른하고 짧게 말하지만, 무심한 듯 정확하게 등을 밀어 줘요.',t:['고백','결단','내 매력'],menu:['오방 궁합 보기','cObgh','obgh.html'],role:'고백 · 결단',hj:'丙',im:'한낮의 해',face:'환하게 앞을 비추는 얼굴'},
    earth:{n:'도준',img:'img/earth.jpg',v:'v/rv_earth.mp4',q:'일이든 돈이든 편하게 물어봐.',
      d:'일과 돈, 관계의 중심을 맡은 신. 선배처럼 차분하게, 현실적으로 정리해 줘요.',t:['이직','돈 흐름','맞는 일'],menu:['커리어 사주 보기','cCareer','career.html'],role:'일 · 돈',hj:'戊',im:'큰 산',face:'흔들리지 않게 받치는 얼굴'},
    metal:{n:'시온',img:'img/sion.jpg',v:'v/rv_metal.mp4',q:'누구 얘기야.',
      d:'정리와 결단을 맡은 신. 감정은 덜고 핵심만, 그 사람의 속마음을 담백하게 읽어요.',t:['그 사람 속마음','관계 정리','재회'],menu:['그 사람 속마음 보기','','heart.html'],role:'속마음 · 재회',hj:'庚',im:'무쇠',face:'단번에 끊어 내는 얼굴'},
    water:{n:'재이',img:'img/water.jpg',v:'v/rv_water.mp4',q:'오늘 좀 지쳐 보이네. 들어 줄게.',
      d:'속마음과 지혜를 맡은 신. 먼저 마음을 읽어 주고, 그다음에 사주로 짚어 줘요.',t:['복잡한 마음','나는 어떤 사람','조심할 달'],menu:['평생 사주 보기','cLife','lifetime.html'],role:'마음',hj:'壬',im:'큰 물',face:'깊고 멀리 흐르는 얼굴'},
    wood_y:{n:'새아',img:SAEA_IMG,v:YV+'5c50aa18-ca62-4c3f-a583-dcf5d4847487.mp4',q:'괜찮아. 휘어도 안 꺾여.',
      d:'웃으면서 할 말 다 하는 다정한 고집쟁이. 다시 시작하는 힘, 끝까지 버티는 힘을 맡았어요.',t:['다시 시작','버티는 힘','관계 회복'],menu:['다음 연애 보기','cNext','love2.html?m=next'],role:'다시 시작',hj:'乙',im:'덩굴',face:'휘어도 다시 일어서는 얼굴'},
    fire_y:{n:'별하',img:'img/yin/fire.jpg',v:YV+'30455774-ffb6-4d78-95f0-716de737468a.mp4',q:'작아도 괜찮아. 오래 타면 돼.',
      d:'조용히 집중하는 사람. 따뜻하지만 선이 분명하고, 몰입과 고백의 타이밍을 맡았어요.',t:['몰입','고백 타이밍','꾸준함'],menu:['오방 궁합 보기','cObgh','obgh.html'],role:'몰입 · 타이밍',hj:'丁',im:'등불',face:'곁에서 오래 타는 얼굴'},
    earth_y:{n:'도담',img:'img/yin/earth.jpg',v:YV+'9a5986fb-e15a-43b0-8227-fe37e6ec3d0e.mp4',q:'뿌린 만큼 거둬요. 걱정은 나한테 맡겨.',
      d:'챙겨 주는 실속파. 돈과 살림 감각이 좋고 잔소리마저 다정해요. 재물과 결혼 시기를 맡았어요.',t:['재물','살림','결혼 시기'],menu:['평생 사주 보기','cLife','lifetime.html'],role:'재물 · 살림',hj:'己',im:'기름진 밭',face:'품어서 키워 내는 얼굴'},
    metal_y:{n:'세린',img:'img/yin/metal.jpg',v:YV+'6e77ff4d-1bcc-4e77-9676-351a9f281be4.mp4',q:'칭찬은 아껴 둘게. 넌 아직 더 빛날 수 있어.',
      d:'세련된 완벽주의자. 칭찬은 드물지만 정확해요. 정리와 결단, 커리어를 맡았어요.',t:['커리어','정리','결단'],menu:['커리어 사주 보기','cCareer','career.html'],role:'커리어 · 정리',hj:'辛',im:'보석',face:'다듬어 빛나게 하는 얼굴'},
    water_y:{n:'이슬',img:'img/yin/water.jpg',v:YV+'cf2ab952-53cb-4703-b502-6445b716aec8.mp4',q:'천천히 말해도 돼. 다 들려.',
      d:'직관이 빠르고 꿈 이야기를 좋아하는 사람. 속마음과 꿈, 직감을 맡았어요.',t:['속마음','꿈','직감'],menu:['그 사람 속마음 보기','','heart.html'],role:'속마음 · 꿈',hj:'癸',im:'빗물',face:'조용히 스며드는 얼굴'},
    halmae:{n:'삼신 할매',k:'사람의 명을 지켜 온 정통 명인',img:'img/halmae.jpg',v:'v/halmae.mp4',vEnd:6.3,c:'#d9b38c',q:'네 사주에 적힌 만큼만 말해 주마.',
      d:'겁주지도 단정하지도 않고, 사주에 적힌 만큼만 담담하게 짚어 줘요.',t:['올해 운','이사 · 계약','조심할 달'],menu:['2027 신년운세 보기','','sinnyeon.html'],role:'정통'}
  };
  var EL = ['wood','fire','earth','metal','water'];
  EL.forEach(function(e){ var b=BEAST[e]; C[e].el=e; C[e+'_y'].el=e; C[e].yang=1; C[e+'_y'].yin=1; C[e].c=C[e+'_y'].c=COL[e];
    C[e].k=b[0]+'의 '+b[1]+' · '+b[2]+' · 양의 얼굴'; C[e+'_y'].k=b[0]+'의 '+b[1]+' · '+b[2]+' · 음의 얼굴'; });

  function mine(){ try{ var o=JSON.parse(sessionStorage.getItem('obLow')||'null'); return o&&o.k||null; }catch(e){ return null; } }
  function face(){ try{ return localStorage.getItem('obFace')==='yin'?'yin':'yang'; }catch(e){ return 'yang'; } }
  function isMale(){ try{ var m=JSON.parse(sessionStorage.getItem('me')||'null'); return m&&m.g==='m'; }catch(e){ return false; } }
  function jong(w){ var c=w.charCodeAt(w.length-1)-0xAC00; return c>=0&&c<11172&&c%28>0; }
  function go(u){ if(window.ObHome&&ObHome.goPage) ObHome.goPage(u); else { try{ sessionStorage.setItem('toHome','1'); }catch(e){} location.href=u; } }
  function bgm(on){ try{ if(window.ObHome) on?ObHome.duck():ObHome.idle(); }catch(e){} }

  var CSS = [
    '.chRow{display:flex;gap:10px;overflow-x:auto;padding:2px 16px 6px;scroll-snap-type:x mandatory;scroll-padding:0 16px;scrollbar-width:none}',
    '.chRow::-webkit-scrollbar{display:none}',
    '.chC{flex:none;position:relative;width:118px;aspect-ratio:3/4.2;border:0;padding:0;border-radius:16px;overflow:hidden;background:#111 center 16%/cover no-repeat;color:#fff;text-align:left;cursor:pointer;scroll-snap-align:start;box-shadow:inset 0 0 0 1px rgba(255,240,220,.08)}',
    '.chC::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 46%,rgba(8,6,10,.92) 100%)}',
    '.chC .tx{position:absolute;left:10px;right:10px;bottom:9px;z-index:1}',
    '.chC .tx b{display:block;font-size:15px;font-weight:800;letter-spacing:-.01em}',
    '.chC .tx small{display:block;margin-top:2px;font-size:10.5px;color:rgba(255,255,255,.72);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.chC .ln{position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--c);z-index:2;opacity:.9}',
    '.chC .mk{position:absolute;left:8px;top:8px;z-index:2;font-size:10px;font-weight:800;letter-spacing:.04em;color:#1a1206;background:#e3b866;padding:3px 7px;border-radius:999px}',
    '.chC .tw{position:absolute;right:8px;top:8px;z-index:2;width:26px;height:26px;border-radius:50%;background:#000 center 18%/cover no-repeat;box-shadow:0 0 0 1.5px rgba(10,8,12,.9),0 0 0 2.5px var(--c)}',
    '.yinBan{position:relative;display:block;width:calc(100% - 32px);margin:0 16px 12px;aspect-ratio:16/11;border:0;padding:0;border-radius:18px;overflow:hidden;background:#0d0a10 center 18%/cover no-repeat;color:#fff;text-align:left;cursor:pointer}',
    '.yinBan video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 18%;opacity:0;transition:opacity .9s}',
    '.yinBan.vOn video{opacity:1}',
    '.yinBan::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(8,6,12,.9) 100%)}',
    '.yinBan .tx{position:absolute;left:16px;right:16px;bottom:14px;z-index:1}',
    '.yinBan .tx small{display:block;font-size:11px;letter-spacing:.14em;color:#e3b866;font-weight:700}',
    '.yinBan .tx b{display:block;margin-top:5px;font-family:var(--serif,serif);font-size:22px;font-weight:900;line-height:1.3}',
    '.yinBan .tx span{display:block;margin-top:5px;font-size:12.5px;color:rgba(255,255,255,.78);line-height:1.5}',
    '.chMini{display:flex;gap:8px;overflow-x:auto;padding:2px 16px 4px;scroll-snap-type:x proximity;scroll-padding:0 16px;scrollbar-width:none}',
    '.chMini::-webkit-scrollbar{display:none}',
    '.chM{position:relative;flex:none;width:96px;height:132px;border:0;padding:0;background:#141117;color:#fff;text-align:left;cursor:pointer;font-family:inherit;overflow:hidden;scroll-snap-align:start;border-radius:0!important}',
    '.chM .ph{position:absolute;inset:0;background:#1a161c center 14%/cover no-repeat;transition:transform .5s}',
    '.chM:active .ph{transform:scale(1.04)}',
    '.chM::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,6,10,0) 42%,rgba(8,6,10,.92) 100%);pointer-events:none}',
    '.chM .nm{position:absolute;left:9px;right:6px;bottom:8px;z-index:1}',
    '.chM b{display:block;font-family:"Song Myung","Noto Serif KR",serif;font-weight:400;font-size:17px;line-height:1.1;letter-spacing:.02em;white-space:nowrap}',
    '.chM small{display:block;margin-top:3px;font-size:11px;color:rgba(255,255,255,.62);white-space:nowrap}',
    '.chM .mk{position:absolute;left:0;top:0;z-index:1;font-size:10.5px;font-weight:700;letter-spacing:.04em;color:#1a130b;background:#e3b866;padding:4px 7px}',
    '.chM.me{box-shadow:inset 0 0 0 1px #e3b866}',
    '.yinLn{display:flex;align-items:center;justify-content:space-between;margin:14px 16px 0;padding:13px 2px 2px;border:0;border-top:1px solid rgba(255,240,220,.1);border-radius:0;background:none;color:#fff;font-family:inherit;width:calc(100% - 32px);cursor:pointer;text-align:left}',
    '.yinLn span{font-size:13.5px;color:rgba(255,255,255,.72)}.yinLn span em{font-style:normal;color:#e3b866;font-weight:700;margin-right:8px}',
    '.yinLn svg{flex:none;color:#e3b866}',
    '.prf{position:absolute;inset:0;z-index:64;background:#0b090d;overflow-y:auto;overscroll-behavior:contain;opacity:0;pointer-events:none;transform:translateY(16px);transition:opacity .35s,transform .45s cubic-bezier(.2,.8,.2,1)}',
    '.prf.on{opacity:1;pointer-events:auto;transform:none}',
    '.prf .pv{position:relative;height:68vh;max-height:620px;min-height:420px;background:#000 center 16%/cover no-repeat}',
    '.prf .pv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 16%;opacity:0;transition:opacity .7s}',
    '.prf .pv video.on{opacity:1}',
    '.prf .pv::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,9,13,.45) 0,rgba(11,9,13,0) 18%,rgba(11,9,13,0) 58%,#0b090d 100%);pointer-events:none}',
    '.prf .pbtn{position:absolute;top:calc(env(safe-area-inset-top,0px) + 12px);z-index:3;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(10,8,12,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;display:grid;place-items:center;cursor:pointer}',
    '.prf .pbtn.x{left:14px}.prf .pbtn.s{right:14px}',
    '.prf .pb{position:relative;z-index:2;margin-top:-118px;padding:0 20px calc(env(safe-area-inset-bottom,0px) + 28px)}',
    '.prf .pk{font-size:11.5px;letter-spacing:.12em;font-weight:700;color:var(--pc,#e3b866)}',
    '.prf h2{margin:6px 0 0;font-family:var(--serif,serif);font-size:36px;font-weight:900;letter-spacing:-.01em;line-height:1.15;color:#fff}',
    '.prf .pmk{display:inline-block;margin-left:8px;vertical-align:middle;font-family:inherit;font-size:11px;font-weight:800;letter-spacing:.04em;color:#1a1206;background:#e3b866;padding:3px 8px;border-radius:999px}',
    '.prf .pq{margin:14px 0 0;font-family:var(--serif,serif);font-size:18px;line-height:1.55;color:#f3e6c8}',
    '.prf .pd{margin:12px 0 0;font-size:14px;line-height:1.7;color:rgba(255,255,255,.74)}',
    '.prf .ptg{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}',
    '.prf .ptg span{font-size:12px;padding:6px 10px;border:1px solid rgba(255,255,255,.16);color:rgba(255,255,255,.82);border-radius:999px}',
    '.prf .ptw{margin-top:22px;padding-top:18px;border-top:1px solid rgba(255,255,255,.08)}',
    '.prf .ptw h4{margin:0 0 4px;font-size:13px;font-weight:700;color:#fff}',
    '.prf .ptw p{margin:0 0 12px;font-size:12.5px;line-height:1.6;color:rgba(255,255,255,.58)}',
    '.prf .ptw .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.prf .ptw button{display:flex;align-items:center;gap:10px;padding:10px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#fff;font-family:inherit;text-align:left;cursor:pointer;border-radius:14px}',
    '.prf .ptw button.on{border-color:var(--pc);background:rgba(255,255,255,.06)}',
    '.prf .ptw button i{flex:none;width:40px;height:40px;border-radius:50%;background:#000 center 18%/cover no-repeat}',
    '.prf .ptw button b{display:block;font-size:14px}',
    '.prf .ptw button small{display:block;margin-top:1px;font-size:11px;color:rgba(255,255,255,.6)}',
    '.prf .pact{display:grid;gap:10px;margin-top:24px}',
    '.prf .pgo{width:100%;min-height:54px;border:0;border-radius:16px;background:linear-gradient(180deg,#f0cf8a,#d6a957);color:#1a1206;font-family:inherit;font-size:16px;font-weight:800;cursor:pointer}',
    '.prf .pmn{width:100%;min-height:50px;border-radius:16px;border:1px solid rgba(255,255,255,.18);background:none;color:#fff;font-family:inherit;font-size:15px;font-weight:600;cursor:pointer}',
    '.prf .poth{margin-top:28px}',
    '.prf .poth small{display:block;font-size:11.5px;letter-spacing:.1em;color:rgba(255,255,255,.5);margin-bottom:10px}',
    '.prf .poth .chRow{padding:0 0 4px;margin:0 -20px;padding-left:20px;scroll-padding:0 20px}',
    '.prf .poth .chC{width:88px}',
    /* 10/3 20:45 은주: 얼굴 카드 줄이 부담스러움 → 작은 동그라미가 천천히 흘러가는 띠(누르면 멈춤) */
    '.chBand{position:relative;overflow:hidden;padding:4px 0 2px;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0,#000 7%,#000 93%,transparent 100%)}',
    '.chTrack{display:flex;gap:16px;width:max-content;padding-left:16px;animation:chMq 46s linear infinite}',
    '.chBand.hold .chTrack{animation-play-state:paused}',
    '@keyframes chMq{to{transform:translateX(-50%)}}',
    '.chB{flex:none;display:flex;flex-direction:column;align-items:center;width:62px;border:0;padding:0;background:none;color:#fff;font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.chB i,.home .chB i{display:block;width:52px;height:52px;border-radius:50%!important;background:#1a161c center 18%/cover no-repeat;box-shadow:0 0 0 1.5px rgba(10,8,12,.9),0 0 0 2.5px var(--c);transition:transform .2s}',
    '.chB:active i{transform:scale(.92)}',
    '.chB b{margin-top:7px;font-size:12px;font-weight:700;white-space:nowrap}',
    '.chB small{margin-top:1px;font-size:10px;color:rgba(255,255,255,.55);white-space:nowrap}',
    '.chB.me i{box-shadow:0 0 0 1.5px rgba(10,8,12,.9),0 0 0 3px #e3b866}',
    '.chB.me b{color:#e3b866}',
    '@media (prefers-reduced-motion:reduce){.chTrack{animation:none}.chBand{overflow-x:auto}}'
  ].join('\n');

  function card(id){ var c=C[id], m=mine(), isMine=c.el&&c.el===m&&((c.yin&&face()==='yin')||(c.yang&&face()!=='yin'));
    var tw=''; if(c.yang) tw='<i class="tw" style="background-image:url(\''+C[id+'_y'].img+'\')"></i>';
    return '<button type="button" class="chC" data-c="'+id+'" style="--c:'+c.c+';background-image:url(\''+c.img+'\')">'+(isMine?'<span class="mk">나의 수호신</span>':'')+tw+
      '<span class="tx"><b>'+c.n+'</b><small>'+c.role+'</small></span><span class="ln"></span></button>'; }

  function talkOrder(){ var m=mine(), f=face(), first=m?(f==='yin'?m+'_y':m):null;
    var list=['seoha','taeo'].concat(EL).concat(['halmae']);
    if(first){ list=list.filter(function(x){ return x!==first; }); list.unshift(first); }
    return list; }

  /* 10/3 은주: 상담 썸네일이 다 얼굴로 꽉 차서 이상함 → 영상 속 상반신 · 테이블까지 보이는 컷을 섞음(img/thumb, 위치 따로) */
  var TH={seoha:['img/thumb/seoha.jpg','50% 62%'],wood:['img/thumb/wood.jpg','50% 30%'],fire:['img/thumb/fire.jpg','50% 42%'],earth:['img/thumb/earth.jpg','50% 34%'],metal:['img/thumb/metal.jpg','50% 40%'],water:['img/thumb/water.jpg','50% 40%'],halmae:['img/thumb/halmae.jpg','50% 46%']};
  function mini(id){ var c=C[id], m=mine(), isMine=c.el&&c.el===m, sy=!!(c.yang&&isMine&&face()==='yin'), k=sy?id+'_y':id, f=C[k];
    return '<button type="button" class="chM'+(isMine?' me':'')+'" data-c="'+k+'"><span class="ph" style="background-image:url(\''+(TH[k]?TH[k][0]:f.img)+'\')'+(TH[k]?';background-position:'+TH[k][1]:'')+'"></span>'+(isMine?'<span class="mk">나의 수호신</span>':'')+'<span class="nm"><b>'+f.n+'</b><small>'+c.role+'</small></span></button>'; }
  function chip(id,dup){ var c=C[id], m=mine(), isMine=c.el&&c.el===m, sy=!!(c.yang&&isMine&&face()==='yin'), k=sy?id+'_y':id, f=C[k];
    return '<button type="button" class="chB'+(isMine?' me':'')+'" data-c="'+k+'" style="--c:'+c.c+'"'+(dup?' aria-hidden="true" tabindex="-1"':'')+'><i style="background-image:url(\''+f.img+'\')"></i><b>'+f.n+'</b><small>'+c.role+'</small></button>'; }
  function renderRows(){
    var bd=$('chBandT'); if(bd){ var m0=mine(), l0=['seoha','taeo'].concat(EL).concat(['halmae']); if(m0){ l0=l0.filter(function(x){ return x!==m0; }); l0.unshift(m0); } bd.innerHTML=l0.map(function(x){ return chip(x,false); }).join('')+l0.map(function(x){ return chip(x,true); }).join(''); }
    var r=$('chRow'); if(r){ var m=mine(), list=['seoha','taeo'].concat(EL).concat(['halmae']); if(m){ list=list.filter(function(x){ return x!==m; }); list.unshift(m); } r.innerHTML=list.map(mini).join(''); }
    var y=$('yinRow'); if(y){ y.innerHTML=EL.map(function(e){ return card(e+'_y'); }).join(''); }
  }

  /* ---------- 소개 화면 ---------- */
  var cur=null, snd=true;
  var cssOn=false; function css(){ if(cssOn) return; cssOn=true; var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st); }
  function build(){
    css();
    var p=document.createElement('div'); p.className='prf'; p.id='prf'; p.setAttribute('aria-hidden','true');
    p.innerHTML='<div class="pv" id="pfV"><video id="pfVid" playsinline preload="none"></video>'+
      '<button type="button" class="pbtn x" id="pfX" aria-label="닫기"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg></button>'+
      '<button type="button" class="pbtn s" id="pfS" aria-label="소리"></button></div>'+
      '<div class="pb"><div class="pk" id="pfK"></div><h2 id="pfN"></h2><p class="pq" id="pfQ"></p><p class="pd" id="pfD"></p><div class="ptg" id="pfT"></div>'+
      '<div class="ptw" id="pfTw" hidden><h4 id="pfTwH"></h4><p id="pfTwP"></p><div class="two" id="pfTwB"></div></div>'+
      '<div class="pact"><button type="button" class="pgo" id="pfGo"></button><button type="button" class="pmn" id="pfMn"></button></div>'+
      '<div class="poth"><small>다른 얼굴도 만나 보기</small><div class="chRow" id="pfOth"></div></div></div>';
    var host=document.querySelector('.stage'); if(!host){ host=document.body; p.style.position='fixed'; p.style.maxWidth='430px'; p.style.margin='0 auto'; }
    host.appendChild(p);
    $('pfX').onclick=close;
    $('pfS').onclick=function(){ snd=!snd; var v=$('pfVid'); v.muted=!snd; if(snd&&v.paused&&cur){ v.currentTime=0; v.play().catch(function(){}); } sIcon(); };
    $('pfOth').onclick=function(e){ var b=e.target.closest('[data-c]'); if(b) open(b.dataset.c); };
    $('pfTwB').onclick=function(e){ var b=e.target.closest('[data-c]'); if(b&&b.dataset.c!==cur) open(b.dataset.c,true); };
    $('pfGo').onclick=function(){ go('chat.html?h='+cur); };
    $('pfMn').onclick=function(){ var m=C[cur].menu, el=m[1]&&$(m[1]); close(); setTimeout(function(){ if(el&&el.onclick) el.click(); else if(m[2]) go(m[2]); else if(el) el.click(); },260); };
  }
  function sIcon(){ $('pfS').innerHTML=snd?'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/></svg>':'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 10l4 4M21 10l-4 4"/></svg>'; }
  function open(id, keepScroll){
    if(!$('prf')) build();
    var c=C[id]; if(!c) return; cur=id;
    var p=$('prf'), v=$('pfVid'), m=mine();
    p.style.setProperty('--pc',c.c);
    $('pfV').style.backgroundImage='url("'+c.img+'")';
    $('pfK').textContent=c.k;
    var isMine=c.el&&c.el===m;
    $('pfN').innerHTML=c.n+(isMine?'<span class="pmk">나의 수호신</span>':'');
    $('pfQ').textContent='"'+c.q+'"';
    $('pfD').textContent=c.d;
    $('pfT').innerHTML='<span>'+c.t.join('</span><span>')+'</span>';
    var tw=$('pfTw');
    if(c.el){ var a=C[c.el], b=C[c.el+'_y'], bs=BEAST[c.el];
      tw.hidden=false;
      $('pfTwH').textContent='같은 '+bs[1]+', 두 얼굴';
      $('pfTwP').textContent=a.n+(jong(a.n)?'과 ':'와 ')+b.n+(jong(b.n)?'은 ':'는 ')+'같은 '+bs[1]+'의 기운에서 나온 두 얼굴이에요. 지켜 주는 힘은 같고, 곁에 있는 방식만 달라요.';
      $('pfTwB').innerHTML=[c.el,c.el+'_y'].map(function(k){ var x=C[k]; return '<button type="button" data-c="'+k+'" class="'+(k===id?'on':'')+'"><i style="background-image:url(\''+x.img+'\')"></i><span><b>'+x.n+'</b><small>'+(x.yin?'음':'양')+' · '+x.hj+' '+x.im+'</small></span></button>'; }).join('');
    } else tw.hidden=true;
    $('pfGo').textContent=c.n+(jong(c.n)?'과':'와')+' 상담하기';
    $('pfMn').textContent=c.menu[0];
    var oth=(c.yin?EL.map(function(e){return e+'_y';}):talkOrder()).filter(function(x){ return x!==id; });
    $('pfOth').innerHTML=oth.map(card).join('');
    // 영상
    v.pause(); v.classList.remove('on'); v.removeAttribute('src'); v.load();
    v.src=c.v; v.poster=''; v.muted=!snd||(c.maleMute&&isMale());
    v.onplaying=function(){ v.classList.add('on'); };
    v.onended=function(){ v.classList.remove('on'); bgm(false); };
    v.ontimeupdate=function(){ if(c.vEnd&&v.currentTime>=c.vEnd){ v.pause(); v.classList.remove('on'); bgm(false); } };
    var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){ v.muted=true; v.play().catch(function(){}); });
    if(!v.muted) bgm(true);
    sIcon();
    if(!keepScroll) p.scrollTop=0; else p.scrollTo({top:0,behavior:'smooth'});
    p.classList.add('on'); p.setAttribute('aria-hidden','false');
  }
  function close(){ var p=$('prf'); if(!p) return; var v=$('pfVid'); try{ v.pause(); }catch(e){} v.classList.remove('on'); p.classList.remove('on'); p.setAttribute('aria-hidden','true'); bgm(false); cur=null; }
  window.ObChar={open:open,close:close,data:C};

  /* ---------- 홈에 끼우기 ---------- */
  function mount(){
    var talk=$('secTalk'); if(!talk) return;
    css();
    var rowHTML=window.CH_BAND?'<div class="chBand" id="chBand"><div class="chTrack" id="chBandT"></div></div>':'<div class="chMini" id="chRow"></div>';
    talk.innerHTML='<div class="sh"><small>캐릭터 상담</small><b>오늘은 누구한테 털어놓을래</b></div>'+rowHTML+
      '<button type="button" class="yinLn" id="yinLn"><span><em>음의 현신</em>같은 기운의 여신 다섯도 만나 보기</span><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button>';
    var mem=$('secMem'); if(mem) mem.style.display='none';
    renderRows();
    var band=$('chBand'); if(band){ var ht=0; var hold=function(){ band.classList.add('hold'); clearTimeout(ht); }, rel=function(){ clearTimeout(ht); ht=setTimeout(function(){ band.classList.remove('hold'); },2200); };
      band.addEventListener('pointerdown',hold); band.addEventListener('pointerup',rel); band.addEventListener('pointercancel',rel); band.addEventListener('mouseenter',hold); band.addEventListener('mouseleave',rel); }
    document.addEventListener('click', function(e){ if(e.target.closest('#yinLn')){ e.preventDefault(); open((mine()||'water')+'_y'); return; } var b=e.target.closest('#chRow [data-c], #chBand [data-c]'); if(!b) return; e.preventDefault(); open(b.dataset.c); });
    // 홈이 다시 보일 때(내 수호신 · 얼굴 선택이 바뀌었을 수 있음) 줄 다시 그림
    var home=$('home'); if(home) new MutationObserver(function(){ if(home.classList.contains('on')) renderRows(); }).observe(home,{attributes:true,attributeFilter:['class']});
    window.addEventListener('pageshow', renderRows);
  }
  if(document.getElementById('secTalk')||document.readyState!=='loading') mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
