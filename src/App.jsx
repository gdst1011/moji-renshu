import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const SUUJI = ["0","1","2","3","4","5","6","7","8","9"];
const HIRAGANA = ["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん"];
const KATAKANA = ["ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン"];

const H_GRID=[["あ","い","う","え","お"],["か","き","く","け","こ"],["さ","し","す","せ","そ"],["た","ち","つ","て","と"],["な","に","ぬ","ね","の"],["は","ひ","ふ","へ","ほ"],["ま","み","む","め","も"],["や","","ゆ","","よ"],["ら","り","る","れ","ろ"],["わ","","","","を"],["ん","","","",""]];
const K_GRID=[["ア","イ","ウ","エ","オ"],["カ","キ","ク","ケ","コ"],["サ","シ","ス","セ","ソ"],["タ","チ","ツ","テ","ト"],["ナ","ニ","ヌ","ネ","ノ"],["ハ","ヒ","フ","ヘ","ホ"],["マ","ミ","ム","メ","モ"],["ヤ","","ユ","","ヨ"],["ラ","リ","ル","レ","ロ"],["ワ","","","","ヲ"],["ン","","","",""]];
const S_GRID=[["0","1","2","3","4"],["5","6","7","8","9"]];
const H_LABELS=["あ","か","さ","た","な","は","ま","や","ら","わ",""];
const K_LABELS=["ア","カ","サ","タ","ナ","ハ","マ","ヤ","ラ","ワ",""];

const STORAGE_KEY="moji-renshu-data";
const GOAL=5;
const MASTERY=3;
const C_MSG=["すごい！","やったね！","せいかい！","ばっちり！","いいね！"];
const W_MSG=["おしい！","つぎ がんばろう！","だいじょうぶ！","もういっかい！"];
const ICONS=[{e:"🐰",l:"うさぎ"},{e:"🐱",l:"ねこ"},{e:"🐻",l:"くま"},{e:"🐧",l:"ぺんぎん"},{e:"🐶",l:"いぬ"},{e:"🐼",l:"ぱんだ"},{e:"🦁",l:"らいおん"},{e:"🐸",l:"かえる"}];

const ANIMALS=[
  {name:"うさぎ",message:"やったね！ うさぎさんも よろこんでるよ！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="140" rx="50" ry="45" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><circle cx="100" cy="85" r="35" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><ellipse cx="78" cy="35" rx="12" ry="32" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><ellipse cx="78" cy="35" rx="6" ry="22" fill="#FFB6C1"/><ellipse cx="122" cy="35" rx="12" ry="32" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/><ellipse cx="122" cy="35" rx="6" ry="22" fill="#FFB6C1"/><circle cx="87" cy="80" r="5" fill="#333"/><circle cx="113" cy="80" r="5" fill="#333"/><circle cx="89" cy="78" r="2" fill="#FFF"/><circle cx="115" cy="78" r="2" fill="#FFF"/><ellipse cx="100" cy="90" rx="4" ry="3" fill="#FFB6C1"/><path d="M94 95 Q100 102 106 95" fill="none" stroke="#FFADD2" strokeWidth="1.5" strokeLinecap="round"/><circle cx="75" cy="90" r="8" fill="#FFD1DC" opacity="0.5"/><circle cx="125" cy="90" r="8" fill="#FFD1DC" opacity="0.5"/><path d="M55 125 Q35 110 30 95" fill="none" stroke="#FFADD2" strokeWidth="3" strokeLinecap="round"/><path d="M145 125 Q165 110 170 95" fill="none" stroke="#FFADD2" strokeWidth="3" strokeLinecap="round"/></svg>},
  {name:"ねこ",message:"にゃー！ ねこさんも おめでとうって！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="145" rx="48" ry="40" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><circle cx="100" cy="90" r="38" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><polygon points="68,62 58,28 85,52" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><polygon points="68,58 62,36 80,52" fill="#FFB6C1"/><polygon points="132,62 142,28 115,52" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/><polygon points="132,58 138,36 120,52" fill="#FFB6C1"/><ellipse cx="85" cy="85" rx="6" ry="7" fill="#333"/><ellipse cx="115" cy="85" rx="6" ry="7" fill="#333"/><circle cx="87" cy="83" r="2.5" fill="#FFF"/><circle cx="117" cy="83" r="2.5" fill="#FFF"/><polygon points="100,94 96,98 104,98" fill="#FFB6C1"/><path d="M96 100 Q100 106 104 100" fill="none" stroke="#FFD580" strokeWidth="1.5" strokeLinecap="round"/><circle cx="73" cy="97" r="8" fill="#FFD1DC" opacity="0.4"/><circle cx="127" cy="97" r="8" fill="#FFD1DC" opacity="0.4"/><path d="M148 150 Q175 130 165 105" fill="none" stroke="#FFD580" strokeWidth="4" strokeLinecap="round"/></svg>},
  {name:"くま",message:"がおー！ くまさんも ぱちぱち してるよ！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="148" rx="50" ry="40" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="100" cy="90" r="40" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="65" cy="58" r="16" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="65" cy="58" r="9" fill="#D4A574"/><circle cx="135" cy="58" r="16" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/><circle cx="135" cy="58" r="9" fill="#D4A574"/><ellipse cx="100" cy="100" rx="18" ry="14" fill="#F5E6D3"/><circle cx="84" cy="84" r="5" fill="#333"/><circle cx="116" cy="84" r="5" fill="#333"/><circle cx="86" cy="82" r="2" fill="#FFF"/><circle cx="118" cy="82" r="2" fill="#FFF"/><ellipse cx="100" cy="96" rx="6" ry="4" fill="#333"/><path d="M94 102 Q100 109 106 102" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round"/><circle cx="72" cy="96" r="8" fill="#FFD1DC" opacity="0.4"/><circle cx="128" cy="96" r="8" fill="#FFD1DC" opacity="0.4"/><path d="M52 135 Q38 120 42 108" fill="none" stroke="#C9A96E" strokeWidth="4" strokeLinecap="round"/><path d="M148 135 Q162 120 158 108" fill="none" stroke="#C9A96E" strokeWidth="4" strokeLinecap="round"/></svg>},
  {name:"ぺんぎん",message:"ぺんぎんさんも パタパタ おめでとう！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="130" rx="45" ry="55" fill="#2D3748" stroke="#1A202C" strokeWidth="2"/><ellipse cx="100" cy="140" rx="30" ry="40" fill="#F7FAFC"/><circle cx="100" cy="72" r="32" fill="#2D3748" stroke="#1A202C" strokeWidth="2"/><circle cx="88" cy="68" r="7" fill="#FFF"/><circle cx="112" cy="68" r="7" fill="#FFF"/><circle cx="89" cy="69" r="4" fill="#333"/><circle cx="113" cy="69" r="4" fill="#333"/><circle cx="90" cy="67" r="1.5" fill="#FFF"/><circle cx="114" cy="67" r="1.5" fill="#FFF"/><polygon points="100,76 93,83 107,83" fill="#F6AD55"/><circle cx="78" cy="78" r="6" fill="#FFD1DC" opacity="0.5"/><circle cx="122" cy="78" r="6" fill="#FFD1DC" opacity="0.5"/><path d="M56 115 Q35 100 30 85" fill="none" stroke="#2D3748" strokeWidth="8" strokeLinecap="round"/><path d="M144 115 Q165 100 170 85" fill="none" stroke="#2D3748" strokeWidth="8" strokeLinecap="round"/><ellipse cx="82" cy="185" rx="14" ry="6" fill="#F6AD55"/><ellipse cx="118" cy="185" rx="14" ry="6" fill="#F6AD55"/></svg>},
  {name:"いぬ",message:"わんわん！ いぬさんが しっぽ ふってるよ！",render:()=><svg viewBox="0 0 200 200" width="180" height="180"><ellipse cx="100" cy="148" rx="48" ry="38" fill="#FFF0E0" stroke="#E8C9A0" strokeWidth="2"/><circle cx="100" cy="88" r="38" fill="#FFF0E0" stroke="#E8C9A0" strokeWidth="2"/><ellipse cx="62" cy="72" rx="16" ry="28" fill="#D4A574" stroke="#C9A06E" strokeWidth="2" transform="rotate(-15 62 72)"/><ellipse cx="138" cy="72" rx="16" ry="28" fill="#D4A574" stroke="#C9A06E" strokeWidth="2" transform="rotate(15 138 72)"/><circle cx="82" cy="82" r="14" fill="#D4A574" opacity="0.5"/><circle cx="84" cy="83" r="5.5" fill="#333"/><circle cx="116" cy="83" r="5.5" fill="#333"/><circle cx="86" cy="81" r="2" fill="#FFF"/><circle cx="118" cy="81" r="2" fill="#FFF"/><ellipse cx="100" cy="95" rx="7" ry="5" fill="#333"/><path d="M93 100 Q100 108 107 100" fill="none" stroke="#E8C9A0" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="100" cy="107" rx="5" ry="7" fill="#FF9999"/><circle cx="72" cy="95" r="7" fill="#FFD1DC" opacity="0.4"/><circle cx="128" cy="95" r="7" fill="#FFD1DC" opacity="0.4"/><path d="M148 140 Q170 120 160 100" fill="none" stroke="#D4A574" strokeWidth="5" strokeLinecap="round"/></svg>},
];
function randAnimal(){return ANIMALS[Math.floor(Math.random()*ANIMALS.length)];}
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function classify(c){if(SUUJI.includes(c))return"suuji";if(HIRAGANA.includes(c))return"hiragana";if(KATAKANA.includes(c))return"katakana";return"suuji";}
function allNig(u){if(!u?.nigate)return[];return[...u.nigate.suuji,...u.nigate.hiragana,...u.nigate.katakana];}
function newUser(id,n,ic){return{id,name:n,icon:ic,nigate:{suuji:[],hiragana:[],katakana:[]},cc:{suuji:{},hiragana:{},katakana:{}},mastered:{suuji:[],hiragana:[],katakana:[]}};}
function loadData(){try{const r=localStorage.getItem(STORAGE_KEY);if(r){const d=JSON.parse(r);if(d.users)return d;}const o=localStorage.getItem("moji-renshu-nigate");if(o){const u=newUser("user_1","プレイヤー1","🐰");u.nigate=JSON.parse(o);return{users:[u],last:"user_1"};}}catch{}return{users:[],last:null};}
function saveData(d){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}catch{}}

function getCtx(){if(!getCtx._c)getCtx._c=new(window.AudioContext||window.webkitAudioContext)();const c=getCtx._c;if(c.state==="suspended")c.resume();return c;}
function sndCorrect(){try{const c=getCtx(),n=c.currentTime;[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.3,n+i*0.1);g.gain.exponentialRampToValueAtTime(0.001,n+i*0.1+0.35);o.connect(g).connect(c.destination);o.start(n+i*0.1);o.stop(n+i*0.1+0.4);});}catch{}}
function sndWrong(){try{const c=getCtx(),n=c.currentTime;[330,262].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(0.2,n+i*0.2);g.gain.exponentialRampToValueAtTime(0.001,n+i*0.2+0.3);o.connect(g).connect(c.destination);o.start(n+i*0.2);o.stop(n+i*0.2+0.35);});}catch{}}
function sndClear(){try{const c=getCtx(),n=c.currentTime;[523.25,659.25,783.99,659.25,783.99,1046.5].forEach((f,i)=>{const t=[0,0.12,0.24,0.42,0.54,0.66][i],d=[0.1,0.1,0.15,0.1,0.1,0.5][i];const o=c.createOscillator(),g=c.createGain();o.type="square";o.frequency.value=f;g.gain.setValueAtTime(0.15,n+t);g.gain.exponentialRampToValueAtTime(0.001,n+t+d+0.3);o.connect(g).connect(c.destination);o.start(n+t);o.stop(n+t+d+0.35);});}catch{}}
function sndMaster(){try{const c=getCtx(),n=c.currentTime;[784,988,1175,1568].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0.2,n+i*0.08);g.gain.exponentialRampToValueAtTime(0.001,n+i*0.08+0.4);o.connect(g).connect(c.destination);o.start(n+i*0.08);o.stop(n+i*0.08+0.45);});}catch{}}

function Confetti(){const p=useMemo(()=>{const cl=["#FF6B6B","#FFE66D","#4ECDC4","#45B7D1","#96CEB4","#FF8ED4","#F9A826","#A78BFA"];return Array.from({length:50},(_,i)=>({id:i,left:Math.random()*100,delay:Math.random()*1.5,dur:2+Math.random()*2,color:cl[i%cl.length],size:8+Math.random()*12,rot:Math.random()*360}));},[]);return<div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:1000,overflow:"hidden"}}>{p.map(p=><div key={p.id} style={{position:"absolute",left:`${p.left}%`,top:"-20px",width:p.size,height:p.size*0.6,backgroundColor:p.color,borderRadius:"2px",transform:`rotate(${p.rot}deg)`,animation:`confettiFall ${p.dur}s ease-in ${p.delay}s forwards`}}/>)}</div>;}
function StarBurst(){const s=useMemo(()=>Array.from({length:12},(_,i)=>({id:i,a:(i/12)*360,d:60+Math.random()*80,sz:14+Math.random()*18,dl:Math.random()*0.15})),[]);return<div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:10}}>{s.map(s=><div key={s.id} style={{position:"absolute",left:"50%",top:"50%",fontSize:s.sz,animation:`starBurst 0.7s ease-out ${s.dl}s forwards`,opacity:0,transform:"translate(-50%,-50%)","--angle":`${s.a}deg`,"--dist":`${s.d}px`}}>⭐</div>)}</div>;}

export default function MojiRenshu(){
  const[appData,setAppData]=useState(loadData);
  const[uid,setUid]=useState(()=>loadData().last);
  const[screen,setScreen]=useState(()=>loadData().users.length>0?"userSelect":"userRegister");
  const[regName,setRegName]=useState("");const[regIcon,setRegIcon]=useState("");const[regError,setRegError]=useState("");
  const[mode,setMode]=useState(null);const[queue,setQueue]=useState([]);const[curChar,setCurChar]=useState("");
  const[correct,setCorrect]=useState(0);const[sessWrong,setSessWrong]=useState([]);const[used,setUsed]=useState([]);
  const[fb,setFb]=useState(null);const[goal,setGoal]=useState(GOAL);const[isNig,setIsNig]=useState(false);
  const[clAnimal,setClAnimal]=useState(null);const[newMast,setNewMast]=useState(null);
  const fbT=useRef(null);const[mTab,setMTab]=useState("hiragana");
  const user=appData.users.find(u=>u.id===uid)||null;
  const nigCnt=user?allNig(user).length:0;
  const mastTotal=user?((user.mastered?.suuji?.length||0)+(user.mastered?.hiragana?.length||0)+(user.mastered?.katakana?.length||0)):0;
  const sv=useCallback(d=>{setAppData(d);saveData(d);},[]);
  const upUser=useCallback((id,fn)=>{setAppData(p=>{const n={...p,users:p.users.map(u=>u.id===id?fn(u):u)};saveData(n);return n;});},[]);

  const selUser=useCallback(id=>{setUid(id);sv({...appData,last:id});setScreen("top");},[appData,sv]);
  const regUser=useCallback(()=>{
    const t=regName.trim();if(!t||t.length>8){setRegError("1〜8もじで いれてね");return;}
    if(!regIcon){setRegError("どうぶつを えらんでね");return;}
    if(appData.users.some(u=>u.name===t)){setRegError("おなじ なまえが あるよ");return;}
    if(appData.users.length>=5){setRegError("5にんまで だよ");return;}
    const id="user_"+Date.now(),u=newUser(id,t,regIcon);
    sv({users:[...appData.users,u],last:id});setUid(id);setRegName("");setRegIcon("");setRegError("");setScreen("top");
  },[regName,regIcon,appData,sv]);
  const delUser=useCallback(id=>{
    sv({...appData,users:appData.users.filter(u=>u.id!==id),last:appData.last===id?null:appData.last});
    if(uid===id)setUid(null);
  },[appData,uid,sv]);

  const getPool=useCallback((m,u)=>{if(m==="nigate")return allNig(u);if(m==="suuji")return[...SUUJI];if(m==="hiragana")return[...HIRAGANA];if(m==="katakana")return[...KATAKANA];if(m==="random")return[...SUUJI,...HIRAGANA,...KATAKANA];return[];},[]);
  const pickN=useCallback((pool,u)=>{const a=pool.filter(c=>!u.includes(c));return a.length?pick(a):null;},[]);

  const startSess=useCallback(m=>{
    const d=loadData();setAppData(d);const u=d.users.find(x=>x.id===uid);if(!u)return;
    const nig=m==="nigate";setIsNig(nig);const pool=getPool(m,u);if(nig&&!pool.length)return;
    const g=nig?Math.min(GOAL,pool.length):GOAL;setGoal(g);setMode(m);setCorrect(0);setSessWrong([]);setUsed([]);setFb(null);setNewMast(null);
    const f=pick(pool);setCurChar(f);setUsed([f]);setQueue(pool);setScreen("game");
  },[uid,getPool]);

  const answer=useCallback(ok=>{
    if(fb||!user)return;const userId=user.id;
    if(ok){
      sndCorrect();const nc=correct+1;setCorrect(nc);setFb({type:"correct",msg:pick(C_MSG)});
      const cat=classify(curChar);let jm=null;
      upUser(userId,u=>{
        const cc={...u.cc};cc[cat]={...cc[cat]};const pv=cc[cat][curChar]||0;cc[cat][curChar]=pv+1;
        const ms={...u.mastered};if(pv+1>=MASTERY&&!u.mastered[cat].includes(curChar)){ms[cat]=[...u.mastered[cat],curChar];jm=curChar;}
        let ng=u.nigate;if(isNig)ng={...u.nigate,[cat]:u.nigate[cat].filter(c=>c!==curChar)};
        return{...u,cc,mastered:ms,nigate:ng};
      });
      if(jm){setNewMast(jm);sndMaster();}
      fbT.current=setTimeout(()=>{
        setFb(null);setNewMast(null);
        if(nc>=goal){sndClear();setClAnimal(randAnimal());setScreen("clear");}
        else{const ld=loadData(),lu=ld.users.find(x=>x.id===userId),pl=isNig?allNig(lu):queue,nx=pickN(pl,used);
        if(nx){setCurChar(nx);setUsed(p=>[...p,nx]);}else{sndClear();setClAnimal(randAnimal());setScreen("clear");}}
      },jm?1600:1000);
    }else{
      sndWrong();setFb({type:"wrong",msg:pick(W_MSG)});setSessWrong(p=>[...p,curChar]);
      if(!isNig){const cat=classify(curChar);upUser(userId,u=>{if(u.nigate[cat].includes(curChar))return u;return{...u,nigate:{...u.nigate,[cat]:[...u.nigate[cat],curChar]}};});}
      fbT.current=setTimeout(()=>{
        setFb(null);const ld=loadData(),lu=ld.users.find(x=>x.id===userId),pl=isNig?allNig(lu):queue,nx=pickN(pl,used);
        if(nx){setCurChar(nx);setUsed(p=>[...p,nx]);}else{const fr=pickN(pl,[]);if(fr){setCurChar(fr);setUsed([fr]);}}
      },1200);
    }
  },[fb,correct,goal,curChar,isNig,user,queue,used,pickN,upUser]);
  useEffect(()=>()=>{if(fbT.current)clearTimeout(fbT.current);},[]);
  const getMast=useCallback(cat=>{if(!user?.mastered?.[cat])return new Set();return new Set(user.mastered[cat]);},[user]);
  const getCnt=useCallback(ch=>{if(!user)return 0;const cat=classify(ch);return user.cc?.[cat]?.[ch]||0;},[user]);
  const mLabels={suuji:"すうじ",hiragana:"ひらがな",katakana:"カタカナ",random:"ランダム",nigate:"にがて"};

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
.ug{display:flex;flex-direction:column;gap:12px;width:100%;margin-bottom:20px;}
.uc{display:flex;align-items:center;gap:16px;background:white;border-radius:20px;padding:16px 20px;border:none;font-family:inherit;font-size:18px;font-weight:700;color:#1F2937;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.06);transition:transform 0.12s;text-align:left;width:100%;position:relative;}
.uc:active{transform:scale(0.97);}
.uc .ui{font-size:40px;}.uc .un{flex:1;}
.uc .db{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(0,0,0,0.05);border:none;border-radius:50%;width:32px;height:32px;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#9CA3AF;}
.uc .db:active{background:rgba(239,68,68,0.15);color:var(--red);}
.aub{border:3px dashed #D1D5DB;border-radius:20px;padding:18px;background:transparent;font-family:inherit;font-size:16px;font-weight:700;color:#9CA3AF;cursor:pointer;width:100%;transition:border-color 0.15s;}
.aub:active{border-color:var(--sky);}
.ig{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:20px;}
.io{width:64px;height:64px;border-radius:20px;border:3px solid #E5E7EB;background:white;font-size:32px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
.io.sel{border-color:var(--sky);background:#EBF8FF;transform:scale(1.1);box-shadow:0 4px 12px rgba(69,183,209,0.3);}
.io:active{transform:scale(0.95);}
.ni{width:100%;max-width:300px;padding:16px 20px;border:3px solid #E5E7EB;border-radius:16px;font-family:inherit;font-size:18px;font-weight:700;text-align:center;outline:none;transition:border-color 0.2s;margin-bottom:8px;}
.ni:focus{border-color:var(--sky);}.ni::placeholder{color:#D1D5DB;font-weight:400;}
.re{color:var(--coral);font-size:14px;font-weight:700;margin-bottom:12px;min-height:20px;}
.rs{border:none;border-radius:24px;padding:18px 48px;font-family:inherit;font-size:18px;font-weight:900;color:white;background:linear-gradient(135deg,var(--sky),var(--mint));cursor:pointer;box-shadow:0 6px 0 rgba(0,0,0,0.15);transition:transform 0.1s;}
.rs:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,0.15);}.rs:disabled{opacity:0.4;cursor:default;}
.th{display:flex;align-items:center;gap:12px;margin-bottom:4px;cursor:pointer;background:white;border-radius:16px;padding:8px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
.th .ti{font-size:28px;}.th .tn{font-size:16px;font-weight:700;color:#1F2937;}.th .ts{font-size:12px;color:#9CA3AF;margin-left:auto;}
.tt{font-size:clamp(32px,7vw,48px);font-weight:900;background:linear-gradient(135deg,var(--coral),var(--pink),var(--purp));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:4px;letter-spacing:4px;text-align:center;}
.st{font-size:clamp(14px,3vw,18px);color:#9CA3AF;margin-bottom:24px;text-align:center;}
.mg{display:grid;grid-template-columns:1fr 1fr;gap:16px;width:100%;max-width:380px;margin-bottom:16px;}
.mb{border:none;border-radius:24px;padding:20px 12px;font-family:inherit;font-size:clamp(16px,3.5vw,22px);font-weight:700;color:white;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:0 6px 0 rgba(0,0,0,0.15),0 8px 24px rgba(0,0,0,0.1);position:relative;overflow:hidden;}
.mb:active{transform:translateY(3px);box-shadow:0 3px 0 rgba(0,0,0,0.15),0 4px 12px rgba(0,0,0,0.1);}
.mb .em{font-size:32px;}
.mb.s1{background:linear-gradient(135deg,#45B7D1,#3A9EC0);}.mb.s2{background:linear-gradient(135deg,#FF8ED4,#E87BC3);}
.mb.s3{background:linear-gradient(135deg,#F9A826,#E89A1E);}.mb.s4{background:linear-gradient(135deg,#A78BFA,#9474E8);}
.bbs{display:flex;gap:12px;width:100%;max-width:380px;margin-bottom:8px;}
.bb{flex:1;border:3px solid;border-radius:20px;padding:14px 8px;font-family:inherit;font-size:clamp(13px,3vw,16px);font-weight:700;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;transition:transform 0.12s;}
.bb:active{transform:scale(0.97);}.bb.bn{border-color:var(--coral);color:var(--coral);}.bb.bm{border-color:var(--mint);color:#0D9488;}
.bb:disabled{opacity:0.35;cursor:default;}
.bb .bg{border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:12px;color:white;}
.bgc{background:var(--coral);}.bgm{background:var(--mint);}
.gh{width:100%;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.bk{border:none;background:rgba(0,0,0,0.06);border-radius:50%;width:44px;height:44px;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.15s;}.bk:active{background:rgba(0,0,0,0.12);}
.ml{font-size:clamp(14px,3vw,18px);font-weight:700;color:#6B7280;background:rgba(0,0,0,0.05);border-radius:20px;padding:6px 16px;}
.sr{display:flex;gap:8px;margin-bottom:20px;}
.st2{font-size:clamp(24px,5vw,36px);transition:transform 0.3s;}.st2.f{animation:starPop 0.4s ease-out;}.st2.e{opacity:0.25;filter:grayscale(1);}
.cda{position:relative;width:260px;height:260px;display:flex;align-items:center;justify-content:center;margin-bottom:28px;}
.cc{width:100%;height:100%;background:white;border-radius:40px;box-shadow:0 8px 32px rgba(0,0,0,0.08),0 2px 8px rgba(0,0,0,0.04);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.cc::before{content:"";position:absolute;inset:0;border-radius:40px;border:4px solid transparent;background:linear-gradient(135deg,var(--pink),var(--sky),var(--mint)) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;}
.ct{font-size:clamp(80px,22vw,128px);font-weight:700;color:#1F2937;line-height:1;animation:charAppear 0.35s ease-out;display:flex;align-items:center;justify-content:center;}
.cc.cf{animation:correctPulse 0.6s ease-out;}.cc.wf{animation:wrongShake 0.5s ease-out;}
.ft{position:absolute;bottom:-44px;left:50%;transform:translateX(-50%);font-size:clamp(20px,4.5vw,28px);font-weight:900;white-space:nowrap;animation:feedbackPop 0.4s ease-out;}
.ft.fc{color:var(--grn);}.ft.fw{color:var(--org);}
.mt{position:absolute;top:-52px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--yel),var(--org));color:white;padding:8px 20px;border-radius:20px;font-size:16px;font-weight:900;white-space:nowrap;animation:feedbackPop 0.4s ease-out;box-shadow:0 4px 12px rgba(249,168,38,0.4);}
.ab{display:flex;gap:20px;width:100%;max-width:380px;}
.an{flex:1;border:none;border-radius:24px;padding:20px 12px;font-family:inherit;font-size:clamp(18px,4vw,26px);font-weight:900;color:white;cursor:pointer;transition:transform 0.1s;box-shadow:0 6px 0 rgba(0,0,0,0.18);display:flex;align-items:center;justify-content:center;gap:8px;}
.an:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,0.18);}.an:disabled{opacity:0.5;cursor:default;}
.an.ac{background:linear-gradient(135deg,#22C55E,#16A34A);}.an.aw{background:linear-gradient(135deg,#EF4444,#DC2626);}
.clc{text-align:center;z-index:10;display:flex;flex-direction:column;align-items:center;}
.clt{font-size:clamp(32px,7vw,52px);font-weight:900;background:linear-gradient(135deg,var(--yel),var(--org));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px;animation:clearBounce 0.8s ease-out;}
.cls{font-size:clamp(15px,3.2vw,20px);color:#6B7280;margin-bottom:24px;line-height:1.6;}
.acl{animation:animalAppear 0.8s cubic-bezier(0.34,1.56,0.64,1);margin-bottom:12px;display:flex;justify-content:center;align-items:center;}
.acl svg{filter:drop-shadow(0 8px 24px rgba(0,0,0,0.1));animation:animalBounce 2s ease-in-out 0.8s infinite;}
.ws{background:white;border-radius:20px;padding:14px 20px;margin-bottom:24px;box-shadow:0 4px 16px rgba(0,0,0,0.06);display:inline-block;}
.wsl{font-size:13px;color:#9CA3AF;margin-bottom:4px;}.wsc{font-size:clamp(20px,4.5vw,28px);font-weight:700;color:var(--coral);letter-spacing:8px;}
.cbs{display:flex;flex-direction:column;gap:12px;width:100%;max-width:320px;margin:0 auto;}
.cb{border:none;border-radius:24px;padding:18px;font-family:inherit;font-size:clamp(15px,3.2vw,19px);font-weight:700;cursor:pointer;transition:transform 0.12s;box-shadow:0 4px 0 rgba(0,0,0,0.12);}
.cb:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,0.12);}
.cb.p{background:linear-gradient(135deg,var(--sky),var(--mint));color:white;}.cb.s{background:white;color:#6B7280;border:2px solid #E5E7EB;}
.tr{display:flex;gap:6px;margin-bottom:16px;background:rgba(0,0,0,0.04);border-radius:16px;padding:4px;}
.tb{border:none;border-radius:12px;padding:10px 16px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;background:transparent;color:#9CA3AF;transition:all 0.15s;}
.tb.a{background:white;color:#1F2937;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
.pbw{width:100%;background:rgba(0,0,0,0.06);border-radius:12px;height:12px;margin-bottom:8px;overflow:hidden;}
.pbf{height:100%;border-radius:12px;background:linear-gradient(90deg,var(--mint),var(--sky));transition:width 0.5s ease-out;}
.ptx{font-size:14px;color:#6B7280;margin-bottom:16px;font-weight:700;}
.gt{display:flex;flex-direction:column;gap:4px;width:100%;}
.gr{display:flex;gap:4px;align-items:center;}
.gl{width:28px;font-size:11px;color:#9CA3AF;font-weight:700;text-align:center;flex-shrink:0;}
.gc{flex:1;aspect-ratio:1;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:clamp(16px,4vw,22px);font-weight:700;position:relative;min-width:0;transition:all 0.2s;}
.gc.ge{background:transparent;}.gc.gn{background:rgba(0,0,0,0.04);color:#D1D5DB;}.gc.gm{background:linear-gradient(135deg,#ECFDF5,#D1FAE5);color:#059669;}
.gc .mk{position:absolute;top:-2px;right:-2px;font-size:12px;}.gc .cd{font-size:8px;color:#9CA3AF;margin-top:-2px;}
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

  {screen==="userSelect"&&<div className="sc">
    <div style={{fontSize:"48px",marginBottom:"8px",animation:"float 3s ease-in-out infinite"}}>👋</div>
    <h1 className="tt" style={{fontSize:"clamp(24px,6vw,38px)",marginBottom:"4px"}}>だれが れんしゅうする？</h1>
    <p className="st">なまえを えらんでね</p>
    <div className="ug">{appData.users.map(u=><div key={u.id} className="uc" onClick={()=>selUser(u.id)}>
      <span className="ui">{u.icon}</span><span className="un">{u.name}</span>
      <button className="db" onClick={e=>{e.stopPropagation();if(confirm(`「${u.name}」を けしても いい？`))delUser(u.id);}}>✕</button>
    </div>)}</div>
    {appData.users.length<5&&<button className="aub" onClick={()=>{setRegName("");setRegIcon("");setRegError("");setScreen("userRegister");}}>＋ あたらしく つくる</button>}
  </div>}

  {screen==="userRegister"&&<div className="sc">
    <div style={{fontSize:"48px",marginBottom:"12px"}}>🎨</div>
    <h2 className="tt" style={{fontSize:"clamp(22px,5.5vw,34px)",marginBottom:"4px"}}>なまえを とうろく</h2>
    <p className="st">どうぶつを えらんで なまえを いれてね</p>
    <div className="ig">{ICONS.map(o=><button key={o.e} className={`io ${regIcon===o.e?"sel":""}`} onClick={()=>setRegIcon(o.e)}>{o.e}</button>)}</div>
    <input className="ni" type="text" maxLength={8} placeholder="なまえを いれてね" value={regName} onChange={e=>{setRegName(e.target.value);setRegError("");}}/>
    <div className="re">{regError}</div>
    <div style={{display:"flex",gap:"12px"}}>
      {appData.users.length>0&&<button className="cb s" style={{padding:"14px 24px",fontSize:"15px"}} onClick={()=>setScreen("userSelect")}>もどる</button>}
      <button className="rs" onClick={regUser} disabled={!regName.trim()||!regIcon}>はじめる！</button>
    </div>
  </div>}

  {screen==="top"&&user&&<div className="sc">
    <div className="th" onClick={()=>setScreen("userSelect")}>
      <span className="ti">{user.icon}</span><span className="tn">{user.name}</span><span className="ts">きりかえ ▶</span>
    </div>
    <div style={{fontSize:"48px",marginBottom:"4px",animation:"float 3s ease-in-out infinite"}}>📝</div>
    <h1 className="tt">もじれんしゅう</h1>
    <p className="st">もじを よんで みよう！</p>
    <div className="mg">
      <button className="mb s1" onClick={()=>startSess("suuji")}><span className="em">🔢</span>すうじ</button>
      <button className="mb s2" onClick={()=>startSess("hiragana")}><span className="em">🌸</span>ひらがな</button>
      <button className="mb s3" onClick={()=>startSess("katakana")}><span className="em">⚡</span>カタカナ</button>
      <button className="mb s4" onClick={()=>startSess("random")}><span className="em">🎲</span>ランダム</button>
    </div>
    <div className="bbs">
      <button className="bb bn" disabled={nigCnt===0} onClick={()=>startSess("nigate")}>📖 にがて{nigCnt>0&&<span className="bg bgc">{nigCnt}</span>}</button>
      <button className="bb bm" onClick={()=>{setMTab("hiragana");setScreen("mastered");}}>📊 おぼえた<span className="bg bgm">{mastTotal}</span></button>
    </div>
  </div>}

  {screen==="mastered"&&user&&<div className="sc">
    <div className="gh"><button className="bk" onClick={()=>setScreen("top")}>←</button><span className="ml">📊 おぼえた もじ</span></div>
    <div className="tr">{[["hiragana","ひらがな"],["katakana","カタカナ"],["suuji","すうじ"]].map(([k,l])=>
      <button key={k} className={`tb ${mTab===k?"a":""}`} onClick={()=>setMTab(k)}>{l}</button>)}</div>
    {(()=>{
      const cat=mTab,total=cat==="suuji"?SUUJI.length:cat==="hiragana"?HIRAGANA.length:KATAKANA.length;
      const ms=getMast(cat),cnt=ms.size;
      const grid=cat==="suuji"?S_GRID:cat==="hiragana"?H_GRID:K_GRID;
      const labels=cat==="hiragana"?H_LABELS:cat==="katakana"?K_LABELS:null;
      return<>
        <div className="pbw"><div className="pbf" style={{width:`${total>0?(cnt/total)*100:0}%`}}/></div>
        <div className="ptx">おぼえた：{cnt} / {total} もじ</div>
        <div className="gt">{grid.map((row,ri)=><div key={ri} className="gr">
          {labels&&<div className="gl">{labels[ri]?labels[ri]+"ぎょう":""}</div>}
          {row.map((ch,ci)=>{
            if(!ch)return<div key={ci} className="gc ge"/>;
            const im=ms.has(ch),cn=getCnt(ch);
            return<div key={ci} className={`gc ${im?"gm":"gn"}`}>{ch}{im&&<span className="mk">⭕</span>}{!im&&cn>0&&<span className="cd">{cn}/{MASTERY}</span>}</div>;
          })}
        </div>)}</div>
      </>;
    })()}
  </div>}

  {screen==="game"&&<div className="sc">
    <div className="gh"><button className="bk" onClick={()=>setScreen("top")}>←</button><span className="ml">{mLabels[mode]||""}</span></div>
    <div className="sr">{Array.from({length:goal},(_,i)=><span key={i} className={`st2 ${i<correct?"f":"e"}`}>⭐</span>)}</div>
    <div className="cda">
      <div className={`cc ${fb?.type==="correct"?"cf":fb?.type==="wrong"?"wf":""}`}>
        <span className="ct" key={curChar} style={SUUJI.includes(curChar)?{fontFamily:"'Inter',sans-serif",fontWeight:700,marginTop:0}:{fontFamily:"'Noto Sans JP',sans-serif",fontWeight:700,marginTop:"-12px"}}>{curChar}</span>
      </div>
      {fb?.type==="correct"&&<StarBurst/>}
      {newMast&&<div className="mt">🎉 「{newMast}」おぼえた！</div>}
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
      <button className="cb s" onClick={()=>{setAppData(loadData());setScreen("top");}}>🏠 トップに もどる</button>
    </div>
  </div>}

  </div></>);
}
