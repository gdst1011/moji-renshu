import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/* ─────────────────────────────────────────────
   データ定義
   ───────────────────────────────────────────── */
const SUUJI = ["0","1","2","3","4","5","6","7","8","9"];
const HIRAGANA = [
  "あ","い","う","え","お","か","き","く","け","こ",
  "さ","し","す","せ","そ","た","ち","つ","て","と",
  "な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ",
  "ま","み","む","め","も","や","ゆ","よ",
  "ら","り","る","れ","ろ","わ","を","ん"
];
const KATAKANA = [
  "ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ",
  "サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト",
  "ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ",
  "マ","ミ","ム","メ","モ","ヤ","ユ","ヨ",
  "ラ","リ","ル","レ","ロ","ワ","ヲ","ン"
];

const STORAGE_KEY = "moji-renshu-nigate";
const GOAL = 5;

const CORRECT_MESSAGES = ["すごい！","やったね！","せいかい！","ばっちり！","いいね！"];
const WRONG_MESSAGES = ["おしい！","つぎ がんばろう！","だいじょうぶ！","もういっかい！"];

/* ─────────────────────────────────────────────
   動物イラスト（SVG）
   ───────────────────────────────────────────── */
const ANIMALS = [
  {
    name: "うさぎ",
    message: "やったね！ うさぎさんも よろこんでるよ！",
    render: () => (
      <svg viewBox="0 0 200 200" width="180" height="180">
        {/* Body */}
        <ellipse cx="100" cy="140" rx="50" ry="45" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/>
        {/* Head */}
        <circle cx="100" cy="85" r="35" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/>
        {/* Left ear */}
        <ellipse cx="78" cy="35" rx="12" ry="32" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/>
        <ellipse cx="78" cy="35" rx="6" ry="22" fill="#FFB6C1"/>
        {/* Right ear */}
        <ellipse cx="122" cy="35" rx="12" ry="32" fill="#FFF0F5" stroke="#FFADD2" strokeWidth="2"/>
        <ellipse cx="122" cy="35" rx="6" ry="22" fill="#FFB6C1"/>
        {/* Eyes */}
        <circle cx="87" cy="80" r="5" fill="#333"/>
        <circle cx="113" cy="80" r="5" fill="#333"/>
        <circle cx="89" cy="78" r="2" fill="#FFF"/>
        <circle cx="115" cy="78" r="2" fill="#FFF"/>
        {/* Nose */}
        <ellipse cx="100" cy="90" rx="4" ry="3" fill="#FFB6C1"/>
        {/* Mouth */}
        <path d="M94 95 Q100 102 106 95" fill="none" stroke="#FFADD2" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Cheeks */}
        <circle cx="75" cy="90" r="8" fill="#FFD1DC" opacity="0.5"/>
        <circle cx="125" cy="90" r="8" fill="#FFD1DC" opacity="0.5"/>
        {/* Arms waving */}
        <path d="M55 125 Q35 110 30 95" fill="none" stroke="#FFADD2" strokeWidth="3" strokeLinecap="round"/>
        <path d="M145 125 Q165 110 170 95" fill="none" stroke="#FFADD2" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "ねこ",
    message: "にゃー！ ねこさんも おめでとうって！",
    render: () => (
      <svg viewBox="0 0 200 200" width="180" height="180">
        {/* Body */}
        <ellipse cx="100" cy="145" rx="48" ry="40" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/>
        {/* Head */}
        <circle cx="100" cy="90" r="38" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/>
        {/* Left ear */}
        <polygon points="68,62 58,28 85,52" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/>
        <polygon points="68,58 62,36 80,52" fill="#FFB6C1"/>
        {/* Right ear */}
        <polygon points="132,62 142,28 115,52" fill="#FFF8E7" stroke="#FFD580" strokeWidth="2"/>
        <polygon points="132,58 138,36 120,52" fill="#FFB6C1"/>
        {/* Eyes */}
        <ellipse cx="85" cy="85" rx="6" ry="7" fill="#333"/>
        <ellipse cx="115" cy="85" rx="6" ry="7" fill="#333"/>
        <circle cx="87" cy="83" r="2.5" fill="#FFF"/>
        <circle cx="117" cy="83" r="2.5" fill="#FFF"/>
        {/* Nose */}
        <polygon points="100,94 96,98 104,98" fill="#FFB6C1"/>
        {/* Mouth */}
        <path d="M96 100 Q100 106 104 100" fill="none" stroke="#FFD580" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Whiskers */}
        <line x1="60" y1="92" x2="78" y2="95" stroke="#FFD580" strokeWidth="1.2"/>
        <line x1="58" y1="98" x2="78" y2="98" stroke="#FFD580" strokeWidth="1.2"/>
        <line x1="122" y1="95" x2="140" y2="92" stroke="#FFD580" strokeWidth="1.2"/>
        <line x1="122" y1="98" x2="142" y2="98" stroke="#FFD580" strokeWidth="1.2"/>
        {/* Cheeks */}
        <circle cx="73" cy="97" r="8" fill="#FFD1DC" opacity="0.4"/>
        <circle cx="127" cy="97" r="8" fill="#FFD1DC" opacity="0.4"/>
        {/* Tail */}
        <path d="M148 150 Q175 130 165 105" fill="none" stroke="#FFD580" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "くま",
    message: "がおー！ くまさんも ぱちぱち してるよ！",
    render: () => (
      <svg viewBox="0 0 200 200" width="180" height="180">
        {/* Body */}
        <ellipse cx="100" cy="148" rx="50" ry="40" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/>
        {/* Head */}
        <circle cx="100" cy="90" r="40" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/>
        {/* Left ear */}
        <circle cx="65" cy="58" r="16" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/>
        <circle cx="65" cy="58" r="9" fill="#D4A574"/>
        {/* Right ear */}
        <circle cx="135" cy="58" r="16" fill="#E8D5B7" stroke="#C9A96E" strokeWidth="2"/>
        <circle cx="135" cy="58" r="9" fill="#D4A574"/>
        {/* Muzzle */}
        <ellipse cx="100" cy="100" rx="18" ry="14" fill="#F5E6D3"/>
        {/* Eyes */}
        <circle cx="84" cy="84" r="5" fill="#333"/>
        <circle cx="116" cy="84" r="5" fill="#333"/>
        <circle cx="86" cy="82" r="2" fill="#FFF"/>
        <circle cx="118" cy="82" r="2" fill="#FFF"/>
        {/* Nose */}
        <ellipse cx="100" cy="96" rx="6" ry="4" fill="#333"/>
        {/* Mouth */}
        <path d="M94 102 Q100 109 106 102" fill="none" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Cheeks */}
        <circle cx="72" cy="96" r="8" fill="#FFD1DC" opacity="0.4"/>
        <circle cx="128" cy="96" r="8" fill="#FFD1DC" opacity="0.4"/>
        {/* Arms clapping */}
        <path d="M52 135 Q38 120 42 108" fill="none" stroke="#C9A96E" strokeWidth="4" strokeLinecap="round"/>
        <path d="M148 135 Q162 120 158 108" fill="none" stroke="#C9A96E" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "ぺんぎん",
    message: "ぺんぎんさんも パタパタ おめでとう！",
    render: () => (
      <svg viewBox="0 0 200 200" width="180" height="180">
        {/* Body */}
        <ellipse cx="100" cy="130" rx="45" ry="55" fill="#2D3748" stroke="#1A202C" strokeWidth="2"/>
        {/* Belly */}
        <ellipse cx="100" cy="140" rx="30" ry="40" fill="#F7FAFC"/>
        {/* Head */}
        <circle cx="100" cy="72" r="32" fill="#2D3748" stroke="#1A202C" strokeWidth="2"/>
        {/* Eyes */}
        <circle cx="88" cy="68" r="7" fill="#FFF"/>
        <circle cx="112" cy="68" r="7" fill="#FFF"/>
        <circle cx="89" cy="69" r="4" fill="#333"/>
        <circle cx="113" cy="69" r="4" fill="#333"/>
        <circle cx="90" cy="67" r="1.5" fill="#FFF"/>
        <circle cx="114" cy="67" r="1.5" fill="#FFF"/>
        {/* Beak */}
        <polygon points="100,76 93,83 107,83" fill="#F6AD55"/>
        {/* Cheeks */}
        <circle cx="78" cy="78" r="6" fill="#FFD1DC" opacity="0.5"/>
        <circle cx="122" cy="78" r="6" fill="#FFD1DC" opacity="0.5"/>
        {/* Flippers waving */}
        <path d="M56 115 Q35 100 30 85" fill="none" stroke="#2D3748" strokeWidth="8" strokeLinecap="round"/>
        <path d="M144 115 Q165 100 170 85" fill="none" stroke="#2D3748" strokeWidth="8" strokeLinecap="round"/>
        {/* Feet */}
        <ellipse cx="82" cy="185" rx="14" ry="6" fill="#F6AD55"/>
        <ellipse cx="118" cy="185" rx="14" ry="6" fill="#F6AD55"/>
      </svg>
    ),
  },
  {
    name: "いぬ",
    message: "わんわん！ いぬさんが しっぽ ふってるよ！",
    render: () => (
      <svg viewBox="0 0 200 200" width="180" height="180">
        {/* Body */}
        <ellipse cx="100" cy="148" rx="48" ry="38" fill="#FFF0E0" stroke="#E8C9A0" strokeWidth="2"/>
        {/* Head */}
        <circle cx="100" cy="88" r="38" fill="#FFF0E0" stroke="#E8C9A0" strokeWidth="2"/>
        {/* Left ear (floppy) */}
        <ellipse cx="62" cy="72" rx="16" ry="28" fill="#D4A574" stroke="#C9A06E" strokeWidth="2" transform="rotate(-15 62 72)"/>
        {/* Right ear (floppy) */}
        <ellipse cx="138" cy="72" rx="16" ry="28" fill="#D4A574" stroke="#C9A06E" strokeWidth="2" transform="rotate(15 138 72)"/>
        {/* Eye patch */}
        <circle cx="82" cy="82" r="14" fill="#D4A574" opacity="0.5"/>
        {/* Eyes */}
        <circle cx="84" cy="83" r="5.5" fill="#333"/>
        <circle cx="116" cy="83" r="5.5" fill="#333"/>
        <circle cx="86" cy="81" r="2" fill="#FFF"/>
        <circle cx="118" cy="81" r="2" fill="#FFF"/>
        {/* Nose */}
        <ellipse cx="100" cy="95" rx="7" ry="5" fill="#333"/>
        <circle cx="98" cy="93" r="1.5" fill="#555"/>
        {/* Mouth */}
        <path d="M93 100 Q100 108 107 100" fill="none" stroke="#E8C9A0" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Tongue */}
        <ellipse cx="100" cy="107" rx="5" ry="7" fill="#FF9999"/>
        {/* Cheeks */}
        <circle cx="72" cy="95" r="7" fill="#FFD1DC" opacity="0.4"/>
        <circle cx="128" cy="95" r="7" fill="#FFD1DC" opacity="0.4"/>
        {/* Tail wagging */}
        <path d="M148 140 Q170 120 160 100" fill="none" stroke="#D4A574" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function getRandomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

/* ─────────────────────────────────────────────
   ユーティリティ
   ───────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function classifyChar(ch) {
  if (SUUJI.includes(ch)) return "suuji";
  if (HIRAGANA.includes(ch)) return "hiragana";
  if (KATAKANA.includes(ch)) return "katakana";
  return "suuji";
}

function loadNigate() {
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { suuji: [], hiragana: [], katakana: [] };
}

function saveNigate(data) {
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function getAllNigate(data) {
  return [...data.suuji, ...data.hiragana, ...data.katakana];
}

/* ─────────────────────────────────────────────
   Web Audio 効果音
   ───────────────────────────────────────────── */
function getAudioCtx() {
  if (!getAudioCtx._ctx) {
    getAudioCtx._ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = getAudioCtx._ctx;
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playCorrectSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    // Cheerful ascending arpeggio
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  } catch {}
}

function playWrongSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    // Gentle two-tone descending
    [330, 262].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, now + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.2);
      osc.stop(now + i * 0.2 + 0.35);
    });
  } catch {}
}

function playClearSound() {
  try {
    const ctx = getAudioCtx();
    const now = ctx.currentTime;
    // Fanfare
    const notes = [523.25, 659.25, 783.99, 659.25, 783.99, 1046.5];
    const timing = [0, 0.12, 0.24, 0.42, 0.54, 0.66];
    const durations = [0.1, 0.1, 0.15, 0.1, 0.1, 0.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, now + timing[i]);
      gain.gain.exponentialRampToValueAtTime(0.001, now + timing[i] + durations[i] + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + timing[i]);
      osc.stop(now + timing[i] + durations[i] + 0.35);
    });
  } catch {}
}

/* ─────────────────────────────────────────────
   紙吹雪コンポーネント
   ───────────────────────────────────────────── */
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#FF6B6B","#FFE66D","#4ECDC4","#45B7D1","#96CEB4","#FF8ED4","#F9A826","#A78BFA"];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      color: colors[i % colors.length],
      size: 8 + Math.random() * 12,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1000, overflow: "hidden" }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-20px",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: "2px",
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   星エフェクト
   ───────────────────────────────────────────── */
function StarBurst() {
  const stars = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * 360,
      dist: 60 + Math.random() * 80,
      size: 14 + Math.random() * 18,
      delay: Math.random() * 0.15,
    })), []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}>
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            fontSize: s.size,
            animation: `starBurst 0.7s ease-out ${s.delay}s forwards`,
            opacity: 0,
            transform: "translate(-50%,-50%)",
            ["--angle"]: `${s.angle}deg`,
            ["--dist"]: `${s.dist}px`,
          }}
        >
          ⭐
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   メインアプリ
   ───────────────────────────────────────────── */
export default function MojiRenshu() {
  const [screen, setScreen] = useState("top");
  const [mode, setMode] = useState(null);
  const [nigate, setNigate] = useState(loadNigate);

  // Game state
  const [queue, setQueue] = useState([]);
  const [currentChar, setCurrentChar] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionWrong, setSessionWrong] = useState([]);
  const [usedChars, setUsedChars] = useState([]);
  const [feedback, setFeedback] = useState(null); // {type:"correct"|"wrong", message}
  const [goalForSession, setGoalForSession] = useState(GOAL);
  const feedbackTimer = useRef(null);
  const [isNigateMode, setIsNigateMode] = useState(false);
  const [clearAnimal, setClearAnimal] = useState(null);

  const nigateCount = getAllNigate(nigate).length;

  // Build character pool for mode
  const getPool = useCallback((m, nigateData) => {
    if (m === "nigate") return getAllNigate(nigateData);
    if (m === "suuji") return [...SUUJI];
    if (m === "hiragana") return [...HIRAGANA];
    if (m === "katakana") return [...KATAKANA];
    if (m === "random") return [...SUUJI, ...HIRAGANA, ...KATAKANA];
    return [];
  }, []);

  // Pick next character
  const pickNext = useCallback((pool, used) => {
    const available = pool.filter(c => !used.includes(c));
    if (available.length === 0) return null;
    return pickRandom(available);
  }, []);

  // Start a session
  const startSession = useCallback((m) => {
    const latest = loadNigate();
    setNigate(latest);
    const isNig = m === "nigate";
    setIsNigateMode(isNig);
    const pool = getPool(m, latest);
    if (isNig && pool.length === 0) return;
    const goal = isNig ? Math.min(GOAL, pool.length) : GOAL;
    setGoalForSession(goal);
    setMode(m);
    setCorrectCount(0);
    setSessionWrong([]);
    setUsedChars([]);
    setFeedback(null);
    const first = pickRandom(pool);
    setCurrentChar(first);
    setUsedChars([first]);
    setQueue(pool);
    setScreen("game");
  }, [getPool]);

  // Handle answer
  const handleAnswer = useCallback((isCorrect) => {
    if (feedback) return; // block during animation

    if (isCorrect) {
      playCorrectSound();
      const newCount = correctCount + 1;
      setCorrectCount(newCount);
      setFeedback({ type: "correct", message: pickRandom(CORRECT_MESSAGES) });

      // If nigate mode, remove from nigate
      if (isNigateMode) {
        const cat = classifyChar(currentChar);
        const updated = { ...nigate, [cat]: nigate[cat].filter(c => c !== currentChar) };
        setNigate(updated);
        saveNigate(updated);
      }

      feedbackTimer.current = setTimeout(() => {
        setFeedback(null);
        if (newCount >= goalForSession) {
          playClearSound();
          setClearAnimal(getRandomAnimal());
          setScreen("clear");
        } else {
          // Next question
          const pool = isNigateMode ? getAllNigate(loadNigate()) : queue;
          const newUsed = [...usedChars];
          const next = pickNext(pool, newUsed);
          if (next) {
            setCurrentChar(next);
            setUsedChars([...newUsed, next]);
          } else {
            // No more chars available
            playClearSound();
            setClearAnimal(getRandomAnimal());
            setScreen("clear");
          }
        }
      }, 1000);
    } else {
      playWrongSound();
      setFeedback({ type: "wrong", message: pickRandom(WRONG_MESSAGES) });
      setSessionWrong(prev => [...prev, currentChar]);

      // Add to nigate
      if (!isNigateMode) {
        const cat = classifyChar(currentChar);
        const updated = { ...nigate };
        if (!updated[cat].includes(currentChar)) {
          updated[cat] = [...updated[cat], currentChar];
          setNigate(updated);
          saveNigate(updated);
        }
      }

      feedbackTimer.current = setTimeout(() => {
        setFeedback(null);
        const pool = isNigateMode ? getAllNigate(loadNigate()) : queue;
        const newUsed = [...usedChars];
        const next = pickNext(pool, newUsed);
        if (next) {
          setCurrentChar(next);
          setUsedChars([...newUsed, next]);
        } else {
          // Exhausted pool — reset used list (except current)
          const fresh = pickNext(pool, []);
          if (fresh) {
            setCurrentChar(fresh);
            setUsedChars([fresh]);
          }
        }
      }, 1200);
    }
  }, [feedback, correctCount, goalForSession, currentChar, isNigateMode, nigate, queue, usedChars, pickNext]);

  // Cleanup timer
  useEffect(() => {
    return () => { if (feedbackTimer.current) clearTimeout(feedbackTimer.current); };
  }, []);

  // Reset nigate
  const clearAllNigate = useCallback(() => {
    const empty = { suuji: [], hiragana: [], katakana: [] };
    setNigate(empty);
    saveNigate(empty);
  }, []);

  /* ───── CSS ───── */
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700;900&family=Noto+Sans+JP:wght@700&family=Inter:wght@700&display=swap');

    :root {
      --bg-warm: #FFF8F0;
      --pink: #FF8ED4;
      --sky: #45B7D1;
      --mint: #4ECDC4;
      --yellow: #FFE66D;
      --coral: #FF6B6B;
      --purple: #A78BFA;
      --orange: #F9A826;
      --green-btn: #22C55E;
      --red-btn: #EF4444;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Zen Maru Gothic', sans-serif;
      background: var(--bg-warm);
      min-height: 100vh;
      overflow-x: hidden;
    }

    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      position: relative;
    }

    /* ── Background decoration ── */
    .bg-deco {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 0;
    }
    .bg-deco .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.12;
    }
    .bg-deco .c1 { width: 300px; height: 300px; background: var(--pink); top: -80px; right: -60px; }
    .bg-deco .c2 { width: 200px; height: 200px; background: var(--sky); bottom: -40px; left: -40px; }
    .bg-deco .c3 { width: 160px; height: 160px; background: var(--yellow); top: 40%; left: -50px; }
    .bg-deco .c4 { width: 240px; height: 240px; background: var(--mint); bottom: 10%; right: -80px; }

    /* ── Top Screen ── */
    .top-title {
      font-size: clamp(36px, 8vw, 56px);
      font-weight: 900;
      background: linear-gradient(135deg, var(--coral), var(--pink), var(--purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
      letter-spacing: 4px;
      text-align: center;
    }
    .top-subtitle {
      font-size: clamp(14px, 3vw, 18px);
      color: #9CA3AF;
      margin-bottom: 36px;
      text-align: center;
    }

    .mode-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      width: 100%;
      max-width: 380px;
      margin-bottom: 20px;
    }

    .mode-btn {
      border: none;
      border-radius: 24px;
      padding: 24px 12px;
      font-family: inherit;
      font-size: clamp(18px, 4vw, 24px);
      font-weight: 700;
      color: white;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      box-shadow: 0 6px 0 rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;
    }
    .mode-btn:active {
      transform: translateY(3px);
      box-shadow: 0 3px 0 rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.1);
    }
    .mode-btn .emoji { font-size: 36px; }
    .mode-btn.suuji { background: linear-gradient(135deg, #45B7D1, #3A9EC0); }
    .mode-btn.hiragana { background: linear-gradient(135deg, #FF8ED4, #E87BC3); }
    .mode-btn.katakana { background: linear-gradient(135deg, #F9A826, #E89A1E); }
    .mode-btn.random { background: linear-gradient(135deg, #A78BFA, #9474E8); }

    .nigate-btn {
      border: 3px dashed var(--coral);
      border-radius: 24px;
      padding: 18px 32px;
      font-family: inherit;
      font-size: clamp(16px, 3.5vw, 20px);
      font-weight: 700;
      color: var(--coral);
      background: white;
      cursor: pointer;
      width: 100%;
      max-width: 380px;
      transition: transform 0.15s, background 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .nigate-btn:active { transform: scale(0.97); }
    .nigate-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .nigate-btn .badge {
      background: var(--coral);
      color: white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .reset-btn {
      border: none;
      background: none;
      color: #9CA3AF;
      font-family: inherit;
      font-size: 13px;
      cursor: pointer;
      margin-top: 16px;
      text-decoration: underline;
    }

    /* ── Game Screen ── */
    .game-header {
      width: 100%;
      max-width: 420px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .back-btn {
      border: none;
      background: rgba(0,0,0,0.06);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    .back-btn:active { background: rgba(0,0,0,0.12); }

    .mode-label {
      font-size: clamp(14px, 3vw, 18px);
      font-weight: 700;
      color: #6B7280;
      background: rgba(0,0,0,0.05);
      border-radius: 20px;
      padding: 6px 16px;
    }

    .stars-row {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    .star {
      font-size: clamp(28px, 6vw, 40px);
      transition: transform 0.3s;
    }
    .star.filled {
      animation: starPop 0.4s ease-out;
    }
    .star.empty { opacity: 0.25; filter: grayscale(1); }

    .char-display-area {
      position: relative;
      width: 280px;
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
    }

    .char-card {
      width: 100%;
      height: 100%;
      background: white;
      border-radius: 40px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .char-card::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 40px;
      border: 4px solid transparent;
      background: linear-gradient(135deg, var(--pink), var(--sky), var(--mint)) border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    .char-text {
      font-size: clamp(80px, 22vw, 128px);
      font-weight: 900;
      color: #1F2937;
      line-height: 1;
      animation: charAppear 0.35s ease-out;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: -8px;
    }

    .char-card.correct-flash {
      animation: correctPulse 0.6s ease-out;
    }
    .char-card.wrong-flash {
      animation: wrongShake 0.5s ease-out;
    }

    .feedback-text {
      position: absolute;
      bottom: -48px;
      left: 50%;
      transform: translateX(-50%);
      font-size: clamp(22px, 5vw, 30px);
      font-weight: 900;
      white-space: nowrap;
      animation: feedbackPop 0.4s ease-out;
    }
    .feedback-text.correct { color: var(--green-btn); }
    .feedback-text.wrong { color: var(--orange); }

    .answer-buttons {
      display: flex;
      gap: 20px;
      width: 100%;
      max-width: 380px;
    }
    .answer-btn {
      flex: 1;
      border: none;
      border-radius: 24px;
      padding: 22px 12px;
      font-family: inherit;
      font-size: clamp(20px, 4.5vw, 28px);
      font-weight: 900;
      color: white;
      cursor: pointer;
      transition: transform 0.1s;
      box-shadow: 0 6px 0 rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .answer-btn:active {
      transform: translateY(4px);
      box-shadow: 0 2px 0 rgba(0,0,0,0.18);
    }
    .answer-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .answer-btn.correct-btn {
      background: linear-gradient(135deg, #22C55E, #16A34A);
    }
    .answer-btn.wrong-btn {
      background: linear-gradient(135deg, #EF4444, #DC2626);
    }

    /* ── Clear Screen ── */
    .clear-container {
      text-align: center;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .clear-title {
      font-size: clamp(32px, 7vw, 52px);
      font-weight: 900;
      background: linear-gradient(135deg, var(--yellow), var(--orange));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
      animation: clearBounce 0.8s ease-out;
    }
    .clear-subtitle {
      font-size: clamp(16px, 3.5vw, 22px);
      color: #6B7280;
      margin-bottom: 28px;
    }
    .animal-celebration {
      animation: animalAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
      margin-bottom: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .animal-celebration svg {
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.1));
      animation: animalBounce 2s ease-in-out 0.8s infinite;
    }

    .wrong-summary {
      background: white;
      border-radius: 20px;
      padding: 16px 24px;
      margin-bottom: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      display: inline-block;
    }
    .wrong-summary-label {
      font-size: 14px;
      color: #9CA3AF;
      margin-bottom: 6px;
    }
    .wrong-summary-chars {
      font-size: clamp(22px, 5vw, 32px);
      font-weight: 700;
      color: var(--coral);
      letter-spacing: 8px;
    }

    .clear-buttons {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
      max-width: 320px;
      margin: 0 auto;
    }
    .clear-btn {
      border: none;
      border-radius: 24px;
      padding: 20px;
      font-family: inherit;
      font-size: clamp(16px, 3.5vw, 20px);
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.12s;
      box-shadow: 0 4px 0 rgba(0,0,0,0.12);
    }
    .clear-btn:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 rgba(0,0,0,0.12);
    }
    .clear-btn.primary {
      background: linear-gradient(135deg, var(--sky), var(--mint));
      color: white;
    }
    .clear-btn.secondary {
      background: white;
      color: #6B7280;
      border: 2px solid #E5E7EB;
    }

    /* ── Keyframes ── */
    @keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes starBurst {
      0% { opacity: 1; transform: translate(-50%,-50%) rotate(0deg) translateX(0); }
      100% { opacity: 0; transform: translate(-50%,-50%) rotate(var(--angle)) translateX(var(--dist)); }
    }
    @keyframes charAppear {
      0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
      60% { transform: scale(1.1) rotate(2deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes correctPulse {
      0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
      50% { box-shadow: 0 0 0 20px rgba(34,197,94,0); transform: scale(1.05); }
      100% { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: scale(1); }
    }
    @keyframes wrongShake {
      0%, 100% { transform: translateX(0); }
      15% { transform: translateX(-12px); }
      30% { transform: translateX(10px); }
      45% { transform: translateX(-8px); }
      60% { transform: translateX(6px); }
      75% { transform: translateX(-3px); }
    }
    @keyframes starPop {
      0% { transform: scale(0.3); }
      50% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }
    @keyframes feedbackPop {
      0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
      60% { transform: translateX(-50%) scale(1.15); }
      100% { transform: translateX(-50%) scale(1); opacity: 1; }
    }
    @keyframes clearBounce {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.15); }
      70% { transform: scale(0.95); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes animalAppear {
      0% { transform: scale(0) rotate(-20deg); opacity: 0; }
      60% { transform: scale(1.15) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes animalBounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-10px) rotate(-3deg); }
      50% { transform: translateY(0) rotate(0deg); }
      75% { transform: translateY(-6px) rotate(3deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }
  `;

  /* ───── Mode labels ───── */
  const modeLabels = {
    suuji: "すうじ",
    hiragana: "ひらがな",
    katakana: "カタカナ",
    random: "ランダム",
    nigate: "にがて",
  };

  /* ───── Render ───── */
  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* Background Decorations */}
        <div className="bg-deco">
          <div className="circle c1" />
          <div className="circle c2" />
          <div className="circle c3" />
          <div className="circle c4" />
        </div>

        {/* ══════ TOP SCREEN ══════ */}
        {screen === "top" && (
          <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div style={{ fontSize: "56px", marginBottom: "8px", animation: "float 3s ease-in-out infinite" }}>
              📝
            </div>
            <h1 className="top-title">もじれんしゅう</h1>
            <p className="top-subtitle">もじを よんで みよう！</p>

            <div className="mode-grid">
              <button className="mode-btn suuji" onClick={() => startSession("suuji")}>
                <span className="emoji">🔢</span>
                すうじ
              </button>
              <button className="mode-btn hiragana" onClick={() => startSession("hiragana")}>
                <span className="emoji">🌸</span>
                ひらがな
              </button>
              <button className="mode-btn katakana" onClick={() => startSession("katakana")}>
                <span className="emoji">⚡</span>
                カタカナ
              </button>
              <button className="mode-btn random" onClick={() => startSession("random")}>
                <span className="emoji">🎲</span>
                ランダム
              </button>
            </div>

            <button
              className="nigate-btn"
              disabled={nigateCount === 0}
              onClick={() => startSession("nigate")}
            >
              {nigateCount > 0 ? (
                <>
                  📖 にがて もんだいしゅう
                  <span className="badge">{nigateCount}</span>
                </>
              ) : (
                "にがてな もじは ないよ！ 🎉"
              )}
            </button>

            {nigateCount > 0 && (
              <button className="reset-btn" onClick={clearAllNigate}>
                にがてリストを リセット
              </button>
            )}
          </div>
        )}

        {/* ══════ GAME SCREEN ══════ */}
        {screen === "game" && (
          <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div className="game-header">
              <button className="back-btn" onClick={() => setScreen("top")}>←</button>
              <span className="mode-label">{modeLabels[mode] || ""}</span>
            </div>

            {/* Stars */}
            <div className="stars-row">
              {Array.from({ length: goalForSession }, (_, i) => (
                <span key={i} className={`star ${i < correctCount ? "filled" : "empty"}`}>⭐</span>
              ))}
            </div>

            {/* Character Display */}
            <div className="char-display-area">
              <div
                className={`char-card ${
                  feedback?.type === "correct" ? "correct-flash" : 
                  feedback?.type === "wrong" ? "wrong-flash" : ""
                }`}
              >
                <span className="char-text" key={currentChar} style={
                  SUUJI.includes(currentChar)
                    ? { fontFamily: "'Inter', sans-serif", fontWeight: 700, marginTop: 0 }
                    : { fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700, marginTop: "-12px" }
                }>{currentChar}</span>
              </div>

              {feedback?.type === "correct" && <StarBurst />}

              {feedback && (
                <div className={`feedback-text ${feedback.type}`}>
                  {feedback.message}
                </div>
              )}
            </div>

            {/* Answer Buttons */}
            <div className="answer-buttons">
              <button
                className="answer-btn correct-btn"
                onClick={() => handleAnswer(true)}
                disabled={!!feedback}
              >
                ⭕ せいかい
              </button>
              <button
                className="answer-btn wrong-btn"
                onClick={() => handleAnswer(false)}
                disabled={!!feedback}
              >
                ✕ ざんねん
              </button>
            </div>
          </div>
        )}

        {/* ══════ CLEAR SCREEN ══════ */}
        {screen === "clear" && (
          <div className="clear-container" style={{ zIndex: 1 }}>
            <Confetti />
            <div className="animal-celebration">
              {clearAnimal && clearAnimal.render()}
            </div>
            <h2 className="clear-title">おめでとう！</h2>
            <p className="clear-subtitle">
              {clearAnimal ? clearAnimal.message : `${goalForSession}もん せいかい！ すごいね！`}
            </p>

            {sessionWrong.length > 0 && (
              <div className="wrong-summary">
                <div className="wrong-summary-label">にがてな もじ</div>
                <div className="wrong-summary-chars">
                  {[...new Set(sessionWrong)].join("　")}
                </div>
              </div>
            )}

            <div className="clear-buttons">
              <button className="clear-btn primary" onClick={() => startSession(mode)}>
                🔄 もういちど
              </button>
              <button className="clear-btn secondary" onClick={() => { setNigate(loadNigate()); setScreen("top"); }}>
                🏠 トップに もどる
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
