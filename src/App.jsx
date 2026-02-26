import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const SUUJI = ["0","1","2","3","4","5","6","7","8","9"];
const HIRAGANA = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"];
const TANGO=[
  "いぬ","ねこ","うし","うま","さる","とり","くま","しか","いか","たこ",
  "あり","はち","かめ","こい","わし","たか","きつね","たぬき","あひる","せみ",
  "はと","うに","ふな","えい","かに","つる","わに","たい","あゆ","さめ",
  "いも","かき","くり","なし","もも","みかん","うめ","まめ","こめ","にく",
  "のり","みそ","しお","こな","もち","あめ","ちゃ","さけ","なす","にら",
  "しそ","ねき","かふ","むき","すいか","いちこ","すし","うり","けし","はす",
  "やま","かわ","うみ","そら","もり","はな","くさ","つち","いし","ほし",
  "つき","ひる","あさ","よる","なつ","ふゆ","はる","あき","ゆき","かせ",
  "にし","きた","なみ","しま","おか","いけ","さか","みね","あわ","しも",
  "かお","あし","みみ","くち","うて","ほね","つめ","こし","むね","かた",
  "ひさ","ゆひ","あたま","せなか","おなか","ひよ",
  "いえ","にわ","やね","まく","ふた","なへ","さら","わん","はこ","かん",
  "いす","つくえ","かさ","くつ","ふく","ひも","いと","ぬの","かみ","ふえ",
  "たま","まり","おゆ","ふろ","くし","めし","はし","おわん","すな","みす",
  "かま","おの","やり","たて","ゆか","みの","のき","わら","まつ","たけ",
  "ひと","こえ","なまえ","ゆめ","ちえ","ちから","こころ","なかま","おれい",
  "せんせい","おや","ちち","はは","あに","あね",
  "おはよう","おやすみ","おかえり",
  "まち","みち","えき","てら","しろ","むら","みなと","くに","のら","はら",
  "さと","たに","おく","みさき","すみ","うち",
  "おおきい","ちいさい","ふとい","ほそい","あつい","さむい","あまい","からい",
  "しろい","あかい","あおい","きいろい","ひろい","せまい","はやい","おそい",
  "つよい","よわい","あかるい","くらい","たかい","やすい","あたらしい","ふるい",
  "わかい","おもい","かるい","かたい","まるい","ちかい","とおい","ふかい","あさい",
  "ほしい","あたたかい","つめたい",
  "ひとつ","ふたつ","みっつ","よっつ","いつつ","むっつ","ななつ","やっつ","ここのつ","とお",
  "いろ","おと","うた","えほん","かたち","ひかり","さむさ","ねつ","ちり",
  "はれ","くもり","まえ","うしろ","よこ","うえ","した","なか","そと","いま",
  "むかし","あさひ","ゆうひ","すき","いき","ひま","きり","れい",
  "にもつ","よあけ","はなみ","おまつり","いわ","みき","たね","ゆり","きく","ます",
  "しる","あせ","のみ","ふね","おに","くも","ほたる","すす",
  "みせ","ひつ","にわとり","すすき","いなか","くるま","ひまわり","おはし","おちゃ",
  "おかし","かわら","しまうま","うすい","ぬるい","ひくい","こわい","うまい",
  "えらい","けむり","はたけ","いなほ","すみれ","おもちゃ","おし","まわり",
  "のし","ひね","ねし","いなり","えんとつ",
];
const TANGO_GOAL=3;const GOAL=5;
const NIGATE_KEY="moji-renshu-nigate";
const C_MSG=["すごい！","やったね！","せいかい！","ばっちり！","いいね！"];
const W_MSG=["おしい！","つぎ がんばろう！","だいじょうぶ！","もういっかい！"];

function loadNigate(){try{const r=localStorage.getItem(NIGATE_KEY);if(r)return JSON.parse(r);}catch{}return{suuji:[],hiragana:[]};}
function saveNigate(d){try{localStorage.setItem(NIGATE_KEY,JSON.stringify(d));}catch{}}
function allNig(d){return[...d.suuji,...d.hiragana];}

const ANIMALS=[
  {name:"うさぎ",message:"やったね！ うさぎさんも よろこんでるよ！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="140" rx="50" ry="45" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><circle cx="100" cy="85" r="35" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><ellipse cx="78" cy="35" rx="12" ry="32" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><ellipse cx="78" cy="35" rx="6" ry="22" fill="#FFB6C1"/><ellipse cx="122" cy="35" rx="12" ry="32" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><ellipse cx="122" cy="35" rx="6" ry="22" fill="#FFB6C1"/><circle cx="87" cy="80" r="5" fill="#333"/><circle cx="113" cy="80" r="5" fill="#333"/><circle cx="89" cy="78" r="2" fill="#FFF"/><circle cx="115" cy="78" r="2" fill="#FFF"/><ellipse cx="100" cy="90" rx="4" ry="3" fill="#FFB6C1"/><path d="M94 95 Q100 102 106 95" fill="none" stroke="#FFADD2" strokeWidth="1.5" strokeLinecap="round"/><circle cx="75" cy="90" r="8" fill="#FFD1DC" opacity="0.5"/><circle cx="125" cy="90" r="8" fill="#FFD1DC" opacity="0.5"/><path d="M55 125 Q35 110 30 95" fill="none" stroke="#FFADD2" strokeWidth="3" strokeLinecap="round"/><path d="M145 125 Q165 110 170 95" fill="none" stroke="#FFADD2" strokeWidth="3" strokeLinecap="round"/></svg>},
  {name:"ねこ",message:"にゃー！ ねこさんも おめでとうって！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="145" rx="48" ry="40" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><circle cx="100" cy="90" r="38" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><polygon points="68,62 58,28 85,52" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><polygon points="68,58 62,36 80,52" fill="#FFB6C1"/><polygon points="132,62 142,28 115,52" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><polygon points="132,58 138,36 120,52" fill="#FFB6C1"/><ellipse cx="85" cy="85" rx="6" ry="7" fill="#333"/><ellipse cx="115" cy="85" rx="6" ry="7" fill="#333"/><circle cx="87" cy="83" r="2.5" fill="#FFF"/><circle cx="117" cy="83" r="2.5" fill="#FFF"/><polygon points="100,94 96,98 104,98" fill="#FFB6C1"/><path d="M96 100 Q100 106 104 100" fill="none" stroke="#FFD580" strokeWidth="1.5" strokeLinecap="round"/><circle cx="73" cy="97" r="8" fill="#FFD1DC" opacity="0.4"/><circle cx="127" cy="97" r="8" fill="#FFD1DC" opacity="0.4"/><path d="M148 150 Q175 130 165 105" fill="none" stroke="#FFD580" strokeWidth="4" strokeLinecap="round"/></svg>},
  {name:"くま",message:"がおー！ くまさんも ぱちぱち してるよ！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="148" rx="50" ry="40" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="100" cy="90" r="40" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="65" cy="58" r="16" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="65" cy="58" r="9" fill="#D4A574"/><circle cx="135" cy="58" r="16" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="135" cy="58" r="9" fill="#D4A574"/><ellipse cx="100" cy="100" rx="18" ry="14" fill="#F5E6D3"/><circle cx="84" cy="84" r="5" fill="#333"/><circle cx="116" cy="84" r="5" fill="#333"/><circle cx="86" cy="82" r="2" fill="#FFF"/><circle cx="118" cy="82" r="2" fill="#FFF"/><ellipse cx="100" cy="96" rx="6" ry="4" fill="#333"/><path d="M94 102 Q100 109 106 102" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round"/><circle cx="72" cy="96" r="8" fill="#FFD1DC" opacity="0.4"/><circle cx="128" cy="96" r="8" fill="#FFD1DC" opacity="0.4"/><path d="M52 135 Q38 120 42 108" fill="none" stroke="#C9A96E" strokeWidth="4" strokeLinecap="round"/><path d="M148 135 Q162 120 158 108" fill="none" stroke="#C9A96E" strokeWidth="4" strokeLinecap="round"/></svg>},
  {name:"ぺんぎん",message:"ぺんぎんさんも おめでとう！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="130" rx="45" ry="55" fill="#2D3748" stroke="#1A202C" strokeWidth="2"/><ellipse cx="100" cy="140" rx="30" ry="40" fill="#F7FAFC"/><circle cx="100" cy="72" r="32" fill="#2D3748" stroke="#1A202C" strokeWidth="2"/><circle cx="88" cy="68" r="7" fill="#FFF"/><circle cx="112" cy="68" r="7" fill="#FFF"/><circle cx="89" cy="69" r="4" fill="#333"/><circle cx="113" cy="69" r="4" fill="#333"/><circle cx="90" cy="67" r="1.5" fill="#FFF"/><circle cx="114" cy="67" r="1.5" fill="#FFF"/><polygon points="100,76 93,83 107,83" fill="#F6AD55"/><circle cx="78" cy="78" r="6" fill="#FFD1DC" opacity="0.5"/><circle cx="122" cy="78" r="6" fill="#FFD1DC" opacity="0.5"/><path d="M56 115 Q35 100 30 85" fill="none" stroke="#2D3748" strokeWidth="8" strokeLinecap="round"/><path d="M144 115 Q165 100 170 85" fill="none" stroke="#2D3748" strokeWidth="8" strokeLinecap="round"/><ellipse cx="82" cy="185" rx="14" ry="6" fill="#F6AD55"/><ellipse cx="118" cy="185" rx="14" ry="6" fill="#F6AD55"/></svg>},
  {name:"いぬ",message:"わんわん！ いぬさんが しっぽ ふってるよ！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="148" rx="48" ry="38" fill="#FFF0E0" stroke="#E8C9A0" strokeWidth="2"/><circle cx="100" cy="88" r="38" fill="#FFF0E0" stroke="#E8C9A0" strokeWidth="2"/><ellipse cx="62" cy="72" rx="16" ry="28" fill="#D4A574" stroke="#C9A06E" strokeWidth="2" transform="rotate(-15 62 72)"/><ellipse cx="138" cy="72" rx="16" ry="28" fill="#D4A574" stroke="#C9A06E" strokeWidth="2" transform="rotate(15 138 72)"/><circle cx="82" cy="82" r="14" fill="#D4A574" opacity="0.5"/><circle cx="84" cy="83" r="5.5" fill="#333"/><circle cx="116" cy="83" r="5.5" fill="#333"/><circle cx="86" cy="81" r="2" fill="#FFF"/><circle cx="118" cy="81" r="2" fill="#FFF"/><ellipse cx="100" cy="95" rx="7" ry="5" fill="#333"/><path d="M93 100 Q100 108 107 100" fill="none" stroke="#E8C9A0" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="100" cy="107" rx="5" ry="7" fill="#FF9999"/><circle cx="72" cy="95" r="7" fill="#FFD1DC" opacity="0.4"/><circle cx="128" cy="95" r="7" fill="#FFD1DC" opacity="0.4"/><path d="M148 140 Q170 120 160 100" fill="none" stroke="#D4A574" strokeWidth="5" strokeLinecap="round"/></svg>},
];
function randAnimal(){return ANIMALS[Math.floor(Math.random()*ANIMALS.length)];}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function classify(c){if(SUUJI.includes(c))return"suuji";return"hiragana";}
function getCtx(){if(!getCtx._c)getCtx._c=new(window.AudioContext||window.webkitAudioContext)();const c=getCtx._c;if(c.state==="suspended")c.resume();return c;}
function sndCorrect(){try{const c=getCtx(),n=c.currentTime;[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.3,n+i*0.1);g.gain.exponentialRampToValueAtTime(0.001,n+i*0.1+0.35);o.connect(g).connect(c.destination);o.start(n+i*0.1);o.stop(n+i*0.1+0.4);});}catch{}}
function sndWrong(){try{const c=getCtx(),n=c.currentTime;[330,262].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(0.2,n+i*0.2);g.gain.exponentialRampToValueAtTime(0.001,n+i*0.2+0.3);o.connect(g).connect(c.destination);o.start(n+i*0.2);o.stop(n+i*0.2+0.35);});}catch{}}
function sndClear(){try{const c=getCtx(),n=c.currentTime;[523.25,659.25,783.99,659.25,783.99,1046.5].forEach((f,i)=>{const t=[0,0.12,0.24,0.42,0.54,0.66][i],d=[0.1,0.1,0.15,0.1,0.1,0.5][i];const o=c.createOscillator(),g=c.createGain();o.type="square";o.frequency.value=f;g.gain.setValueAtTime(0.15,n+t);g.gain.exponentialRampToValueAtTime(0.001,n+t+d+0.3);o.connect(g).connect(c.destination);o.start(n+t);o.stop(n+t+d+0.35);});}catch{}}
function Confetti(){const p=useMemo(()=>{const cl=["#FF6B6B","#FFE66D","#4ECDC4","#45B7D1","#96CEB4","#FF8ED4","#F9A826","#A78BFA"];return Array.from({length:50},(_,i)=>({id:i,left:Math.random()*100,delay:Math.random()*1.5,dur:2+Math.random()*2,color:cl[i%cl.length],size:8+Math.random()*12,rot:Math.random()*360}));},[]);return<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1000,overflow:"hidden"}}>{p.map(p=><div key={p.id} style={{position:"absolute",left:`${p.left}%`,top:"-20px",width:p.size,height:p.size*0.6,backgroundColor:p.color,borderRadius:"2px",transform:`rotate(${p.rot}deg)`,animation:`confettiFall ${p.dur}s ease-in ${p.delay}s forwards`}}/>)}</div>;}
function StarBurst(){const s=useMemo(()=>Array.from({length:12},(_,i)=>({id:i,a:(i/12)*360,d:60+Math.random()*80,sz:14+Math.random()*18,dl:Math.random()*0.15})),[]);return<div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:10}}>{s.map(s=><div key={s.id} style={{position:"absolute",left:"50%",top:"50%",fontSize:s.sz,animation:`starBurst 0.7s ease-out ${s.dl}s forwards`,opacity:0,transform:"translate(-50%,-50%)","--angle":`${s.a}deg`,"--dist":`${s.d}px`}}>⭐</div>)}</div>;}

export default function MojiRenshu(){
  const[screen,setScreen]=useState("top");
  const[mode,setMode]=useState(null);const[queue,setQueue]=useState([]);const[curChar,setCurChar]=useState("");
  const[correct,setCorrect]=useState(0);const[sessWrong,setSessWrong]=useState([]);const[used,setUsed]=useState([]);
  const[fb,setFb]=useState(null);const[goal,setGoal]=useState(GOAL);const[isNig,setIsNig]=useState(false);
  const[clAnimal,setClAnimal]=useState(null);
  const[nigate,setNigate]=useState(loadNigate);
  const fbT=useRef(null);
  const nigCnt=allNig(nigate).length;

  const getPool=useCallback((m,nig)=>{if(m==="nigate")return allNig(nig);if(m==="suuji")return[...SUUJI];if(m==="hiragana")return[...HIRAGANA];if(m==="tango")return[...TANGO];if(m==="random")return[...SUUJI,...HIRAGANA];return[];},[]);
  const pickN=useCallback((pool,u)=>{const a=pool.filter(c=>!u.includes(c));return a.length?pick(a):null;},[]);

  const startSess=useCallback(m=>{
    const nig=loadNigate();setNigate(nig);
    const isN=m==="nigate";setIsNig(isN);const pool=getPool(m,nig);if(isN&&!pool.length)return;
    const isTg=m==="tango";
    const g=isN?Math.min(GOAL,pool.length):isTg?TANGO_GOAL:GOAL;
    setGoal(g);setMode(m);setCorrect(0);setSessWrong([]);setUsed([]);setFb(null);
    const f=pick(pool);setCurChar(f);setUsed([f]);setQueue(pool);setScreen("game");
  },[getPool]);

  const clearAllNigate=useCallback(()=>{if(confirm("にがてリストを リセットする？")){const d={suuji:[],hiragana:[]};setNigate(d);saveNigate(d);}},[]);

  const answer=useCallback(ok=>{
    if(fb)return;const isTg=mode==="tango";
    if(ok){
      sndCorrect();const nc=correct+1;setCorrect(nc);setFb({type:"correct",msg:pick(C_MSG)});
      if(!isTg&&isNig){
        const cat=classify(curChar);
        const nig={...nigate,[cat]:nigate[cat].filter(c=>c!==curChar)};
        setNigate(nig);saveNigate(nig);
      }
      fbT.current=setTimeout(()=>{
        setFb(null);
        if(nc>=goal){sndClear();setClAnimal(randAnimal());setScreen("clear");}
        else{const latNig=loadNigate();const pl=isNig?allNig(latNig):queue;const nx=pickN(pl,used);
        if(nx){setCurChar(nx);setUsed(p=>[...p,nx]);}else{sndClear();setClAnimal(randAnimal());setScreen("clear");}}
      },1000);
    }else{
      sndWrong();setFb({type:"wrong",msg:pick(W_MSG)});setSessWrong(p=>[...p,curChar]);
      if(!isTg&&!isNig){
        const cat=classify(curChar);
        if(!nigate[cat].includes(curChar)){const nig={...nigate,[cat]:[...nigate[cat],curChar]};setNigate(nig);saveNigate(nig);}
      }
      fbT.current=setTimeout(()=>{
        setFb(null);const latNig=loadNigate();const pl=isNig?allNig(latNig):queue;const nx=pickN(pl,used);
        if(nx){setCurChar(nx);setUsed(p=>[...p,nx]);}else{const fr=pickN(pl,[]);if(fr){setCurChar(fr);setUsed([fr]);}}
      },1200);
    }
  },[fb,correct,goal,curChar,isNig,mode,nigate,queue,used,pickN]);
  useEffect(()=>()=>{if(fbT.current)clearTimeout(fbT.current);},[]);
  const mLabels={suuji:"すうじ",hiragana:"ひらがな",tango:"たんご",random:"ランダム",nigate:"にがて"};

  const styles=`
@import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700;900&family=Noto+Sans+JP:wght@700&family=Inter:wght@700&display=swap');
:root{--bg:#FFF8F0;--pink:#FF8ED4;--sky:#45B7D1;--mint:#4ECDC4;--yel:#FFE66D;--coral:#FF6B6B;--purp:#A78BFA;--org:#F9A826;--grn:#22C55E;--red:#EF4444;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Zen Maru Gothic',sans-serif;background:var(--bg);min-height:100vh;overflow-x:hidden;}
.app{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;position:relative;}
.bgd{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0;}
.bgd .c{position:absolute;border-radius:50%;opacity:0.12;}
.bgd .c1{width:300px;height:300px;background:var(--pink);top:-80px;right:-60px;}
.bgd .c2{width:200px;height:200px;background:var(--sky);bottom:-40px;left:-40px;}
.bgd .c3{width:160px;height:160px;background:var(--yel);top:40%;left:-50px;}
.bgd .c4{width:240px;height:240px;background:var(--mint);bottom:10%;right:-80px;}
.sc{z-index:1;display:flex;flex-direction:column;align-items:center;width:100%;max-width:420px;}
.tt{font-size:clamp(36px,8vw,56px);font-weight:900;background:linear-gradient(135deg,var(--coral),var(--pink),var(--purp));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;letter-spacing:4px;text-align:center;}
.st{font-size:clamp(14px,3vw,18px);color:#9CA3AF;margin-bottom:28px;text-align:center;}
.mg{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:380px;margin-bottom:20px;}
.mb{border:none;border-radius:24px;padding:22px 12px;font-family:inherit;font-size:clamp(17px,3.8vw,24px);font-weight:700;color:white;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 6px 0 rgba(0,0,0,0.15),0 8px 24px rgba(0,0,0,0.1);position:relative;overflow:hidden;}
.mb:active{transform:translateY(3px);box-shadow:0 3px 0 rgba(0,0,0,0.15),0 4px 12px rgba(0,0,0,0.1);}
.mb .em{font-size:36px;}
.mb.s1{background:linear-gradient(135deg,#45B7D1,#3A9EC0);}.mb.s2{background:linear-gradient(135deg,#FF8ED4,#E87BC3);}
.mb.s3{background:linear-gradient(135deg,#F9A826,#E89A1E);}.mb.s4{background:linear-gradient(135deg,#A78BFA,#9474E8);}
.nib{border:3px dashed var(--coral);border-radius:24px;padding:18px 32px;font-family:inherit;font-size:clamp(16px,3.5vw,20px);font-weight:700;color:var(--coral);background:white;cursor:pointer;width:100%;max-width:380px;transition:transform 0.15s;display:flex;align-items:center;justify-content:center;gap:8px;}
.nib:active{transform:scale(0.97);}.nib:disabled{opacity:0.4;cursor:default;}
.nib .badge{background:var(--coral);color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;}
.rst{border:none;background:none;color:#9CA3AF;font-family:inherit;font-size:13px;cursor:pointer;margin-top:12px;text-decoration:underline;}
.gh{width:100%;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.bk{border:none;background:rgba(0,0,0,0.06);border-radius:50%;width:44px;height:44px;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s;}.bk:active{background:rgba(0,0,0,0.12);}
.ml{font-size:clamp(14px,3vw,18px);font-weight:700;color:#6B7280;background:rgba(0,0,0,0.05);border-radius:20px;padding:6px 16px;}
.sr{display:flex;gap:8px;margin-bottom:24px;}
.st2{font-size:clamp(28px,6vw,40px);transition:transform 0.3s;}.st2.f{animation:starPop 0.4s ease-out;}.st2.e{opacity:0.25;filter:grayscale(1);}
.cda{position:relative;width:260px;height:260px;display:flex;align-items:center;justify-content:center;margin-bottom:32px;}
.cda-tango{position:relative;width:340px;max-width:90vw;height:200px;display:flex;align-items:center;justify-content:center;margin-bottom:32px;}
.cc{width:100%;height:100%;background:white;border-radius:40px;box-shadow:0 8px 32px rgba(0,0,0,0.08),0 2px 8px rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.cc::before{content:"";position:absolute;inset:0;border-radius:40px;border:4px solid transparent;background:linear-gradient(135deg,var(--pink),var(--sky),var(--mint)) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;}
.ct{font-size:clamp(80px,22vw,128px);font-weight:700;color:#1F2937;line-height:1;animation:charAppear 0.35s ease-out;display:flex;align-items:center;justify-content:center;}
.ct-tango{font-size:clamp(48px,14vw,80px);font-weight:700;color:#1F2937;line-height:1;animation:charAppear 0.35s ease-out;display:flex;align-items:center;justify-content:center;letter-spacing:8px;font-family:'Noto Sans JP',sans-serif;}
.cc.cf{animation:correctPulse 0.6s ease-out;}.cc.wf{animation:wrongShake 0.5s ease-out;}
.ft{position:absolute;bottom:-48px;left:50%;transform:translateX(-50%);font-size:clamp(22px,5vw,30px);font-weight:900;white-space:nowrap;animation:feedbackPop 0.4s ease-out;}
.ft.fc{color:var(--grn);}.ft.fw{color:var(--org);}
.ab{display:flex;gap:20px;width:100%;max-width:380px;}
.an{flex:1;border:none;border-radius:24px;padding:22px 12px;font-family:inherit;font-size:clamp(20px,4.5vw,28px);font-weight:900;color:white;cursor:pointer;transition:transform 0.1s;box-shadow:0 6px 0 rgba(0,0,0,0.18);display:flex;align-items:center;justify-content:center;gap:8px;}
.an:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,0.18);}.an:disabled{opacity:0.5;cursor:default;}
.an.ac{background:linear-gradient(135deg,#22C55E,#16A34A);}.an.aw{background:linear-gradient(135deg,#EF4444,#DC2626);}
.clc{text-align:center;z-index:10;display:flex;flex-direction:column;align-items:center;}
.clt{font-size:clamp(32px,7vw,52px);font-weight:900;background:linear-gradient(135deg,var(--yel),var(--org));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;animation:clearBounce 0.8s ease-out;}
.cls{font-size:clamp(16px,3.5vw,22px);color:#6B7280;margin-bottom:28px;line-height:1.6;}
.acl{animation:animalAppear 0.8s cubic-bezier(0.34,1.56,0.64,1);margin-bottom:16px;display:flex;justify-content:center;align-items:center;}
.acl svg{filter:drop-shadow(0 8px 24px rgba(0,0,0,0.1));animation:animalBounce 2s ease-in-out 0.8s infinite;}
.ws{background:white;border-radius:20px;padding:16px 24px;margin-bottom:28px;box-shadow:0 4px 16px rgba(0,0,0,0.06);display:inline-block;}
.wsl{font-size:14px;color:#9CA3AF;margin-bottom:6px;}.wsc{font-size:clamp(22px,5vw,32px);font-weight:700;color:var(--coral);letter-spacing:8px;}
.cbs{display:flex;flex-direction:column;gap:14px;width:100%;max-width:320px;margin:0 auto;}
.cb{border:none;border-radius:24px;padding:20px;font-family:inherit;font-size:clamp(16px,3.5vw,20px);font-weight:700;cursor:pointer;transition:transform 0.12s;box-shadow:0 4px 0 rgba(0,0,0,0.12);}
.cb:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,0.12);}
.cb.p{background:linear-gradient(135deg,var(--sky),var(--mint));color:white;}.cb.s{background:white;color:#6B7280;border:2px solid #E5E7EB;}
@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(100vh) rotate(720deg);opacity:0;}}
@keyframes starBurst{0%{opacity:1;transform:translate(-50%,-50%) rotate(0deg) translateX(0);}100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist));}}
@keyframes charAppear{0%{transform:scale(0.3) rotate(-10deg);opacity:0;}60%{transform:scale(1.1) rotate(2deg);}100%{transform:scale(1) rotate(0deg);opacity:1;}}
@keyframes correctPulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,0.5);}50%{box-shadow:0 0 0 20px rgba(34,197,94,0);transform:scale(1.05);}100%{box-shadow:0 8px 32px rgba(0,0,0,0.08);transform:scale(1);}}
@keyframes wrongShake{0%,100%{transform:translateX(0);}15%{transform:translateX(-12px);}30%{transform:translateX(10px);}45%{transform:translateX(-8px);}60%{transform:translateX(6px);}75%{transform:translateX(-3px);}}
@keyframes starPop{0%{transform:scale(0.3);}50%{transform:scale(1.4);}100%{transform:scale(1);}}
@keyframes feedbackPop{0%{transform:translateX(-50%) scale(0.5);opacity:0;}60%{transform:translateX(-50%) scale(1.15);}100%{transform:translateX(-50%) scale(1);opacity:1;}}
@keyframes clearBounce{0%{transform:scale(0.3);opacity:0;}50%{transform:scale(1.15);}70%{transform:scale(0.95);}100%{transform:scale(1);opacity:1;}}
@keyframes animalAppear{0%{transform:scale(0) rotate(-20deg);opacity:0;}60%{transform:scale(1.15) rotate(5deg);}100%{transform:scale(1) rotate(0deg);opacity:1;}}
@keyframes animalBounce{0%,100%{transform:translateY(0) rotate(0deg);}25%{transform:translateY(-10px) rotate(-3deg);}50%{transform:translateY(0) rotate(0deg);}75%{transform:translateY(-6px) rotate(3deg);}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
`;

  return(
  <><style>{styles}</style>
  <div className="app">
  <div className="bgd"><div className="c c1"/><div className="c c2"/><div className="c c3"/><div className="c c4"/></div>

  {screen==="top"&&<div className="sc">
    <div style={{fontSize:"56px",marginBottom:"8px",animation:"float 3s ease-in-out infinite"}}>📝</div>
    <h1 className="tt">もじれんしゅう</h1>
    <p className="st">もじを よんで みよう！</p>
    <div className="mg">
      <button className="mb s1" onClick={()=>startSess("suuji")}><span className="em">🔢</span>すうじ</button>
      <button className="mb s2" onClick={()=>startSess("hiragana")}><span className="em">🌸</span>ひらがな</button>
      <button className="mb s3" onClick={()=>startSess("tango")}><span className="em">📖</span>たんご</button>
      <button className="mb s4" onClick={()=>startSess("random")}><span className="em">🎲</span>ランダム</button>
    </div>
    <button className="nib" disabled={nigCnt===0} onClick={()=>startSess("nigate")}>
      {nigCnt>0?<>📖 にがて もんだいしゅう<span className="badge">{nigCnt}</span></>:"にがてな もじは ないよ！ 🎉"}
    </button>
    {nigCnt>0&&<button className="rst" onClick={clearAllNigate}>にがてリストを リセット</button>}
  </div>}

  {screen==="game"&&<div className="sc">
    <div className="gh"><button className="bk" onClick={()=>setScreen("top")}>←</button><span className="ml">{mLabels[mode]||""}</span></div>
    <div className="sr">{Array.from({length:goal},(_,i)=><span key={i} className={`st2 ${i<correct?"f":"e"}`}>⭐</span>)}</div>
    <div className={mode==="tango"?"cda-tango":"cda"}>
      <div className={`cc ${fb?.type==="correct"?"cf":fb?.type==="wrong"?"wf":""}`}>
        {mode==="tango"
          ?<span className="ct-tango" key={curChar}>{curChar}</span>
          :<span className="ct" key={curChar} style={SUUJI.includes(curChar)?{fontFamily:"'Inter',sans-serif",fontWeight:700,marginTop:0}:{fontFamily:"'Noto Sans JP',sans-serif",fontWeight:700,marginTop:"-12px"}}>{curChar}</span>
        }
      </div>
      {fb?.type==="correct"&&<StarBurst/>}
      {fb&&<div className={`ft ${fb.type==="correct"?"fc":"fw"}`}>{fb.msg}</div>}
    </div>
    <div className="ab">
      <button className="an ac" onClick={()=>answer(true)} disabled={!!fb}>⭕ せいかい</button>
      <button className="an aw" onClick={()=>answer(false)} disabled={!!fb}>✕ ざんねん</button>
    </div>
  </div>}

  {screen==="clear"&&<div className="clc" style={{zIndex:1}}>
    <Confetti/>
    <div className="acl">{clAnimal&&clAnimal.render()}</div>
    <h2 className="clt">おめでとう！</h2>
    <p className="cls">{clAnimal?clAnimal.message:`${goal}もん せいかい！ すごいね！`}</p>
    {sessWrong.length>0&&<div className="ws"><div className="wsl">にがてな もじ</div><div className="wsc">{[...new Set(sessWrong)].join("　")}</div></div>}
    <div className="cbs">
      <button className="cb p" onClick={()=>startSess(mode)}>🔄 もういちど</button>
      <button className="cb s" onClick={()=>{setNigate(loadNigate());setScreen("top");}}>🏠 トップに もどる</button>
    </div>
  </div>}

  </div></>);
}
