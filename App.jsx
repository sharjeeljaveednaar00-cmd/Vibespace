import React, { useState, useEffect, useRef } from 'react';
import {
  Video, Mic, MicOff, VideoOff, Users, Shield, ShieldCheck, ShieldAlert,
  Sparkles, Camera, PhoneOff, Settings, Volume2, Plus, Zap, Heart,
  Radio, Globe, Flame, Lock, Trophy, Star, Music,
  Compass, Share2, Play, Grid, RefreshCw, Send, Gift, SkipForward,
  Gamepad2, HelpCircle, Palette, VolumeX, RotateCw, Crown,
  Image, Folder, HardDrive, Clock, Bookmark, Wifi, Activity, Download,
  CheckCircle2, AlertCircle, Eye, EyeOff, Smile, ChevronRight, X, Trash2,
  Ghost, BellOff, Timer, BatteryCharging, Moon, MessageCircleWarning,
  UserX, Siren, Info, TrendingUp, HeartHandshake, Hourglass, Mic2,
  ThumbsUp, ThumbsDown, Swords, Dices, Puzzle, PartyPopper
} from 'lucide-react';

// ---------- Shared AR filter renderer (used everywhere a camera shows up) ----------
const applySnapFilter = (ctx, w, h, filter) => {
  const cx = w / 2;
  const cy = h / 2 - 30;
  switch (filter) {
    case 'neon_bunny':
      ctx.strokeStyle = '#ec4899'; ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 20; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.ellipse(cx - 50, cy - 110, 22, 65, -0.2, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + 50, cy - 110, 22, 65, 0.2, 0, Math.PI * 2); ctx.stroke();
      break;
    case 'cyber_visor':
      ctx.fillStyle = 'rgba(6, 182, 212, 0.45)'; ctx.strokeStyle = '#22d3ee'; ctx.shadowColor = '#06b6d4'; ctx.shadowBlur = 20; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(cx - 95, cy - 35, 190, 55, 14); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#ffffff'; ctx.font = '12px monospace'; ctx.fillText('VIBE ENGINE // 0-LAG ACTIVE', cx - 80, cy + 2);
      break;
    case 'golden_crown':
      ctx.fillStyle = '#f59e0b'; ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy - 70); ctx.lineTo(cx - 70, cy - 120); ctx.lineTo(cx - 30, cy - 90);
      ctx.lineTo(cx, cy - 130); ctx.lineTo(cx + 30, cy - 90); ctx.lineTo(cx + 70, cy - 120);
      ctx.lineTo(cx + 60, cy - 70); ctx.closePath(); ctx.fill();
      break;
    case 'spooky_neon':
      ctx.fillStyle = 'rgba(168, 85, 247, 0.3)'; ctx.strokeStyle = '#a855f7'; ctx.shadowColor = '#a855f7'; ctx.shadowBlur = 25; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(cx, cy - 20, 85, 0, Math.PI * 2); ctx.stroke();
      break;
    case 'dreamy_sparkle':
      ctx.fillStyle = 'rgba(244, 114, 182, 0.15)'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fef3c7'; ctx.shadowColor = '#fef3c7'; ctx.shadowBlur = 15;
      for (let i = 0; i < 6; i++) {
        const sx = cx + Math.sin(i * 2 + Date.now() * 0.001) * 120;
        const sy = cy - 60 + Math.cos(i * 2 + Date.now() * 0.001) * 90;
        ctx.beginPath(); ctx.arc(sx, sy, 4, 0, Math.PI * 2); ctx.fill();
      }
      break;
    case 'dog_ears':
      ctx.fillStyle = '#a16207'; ctx.shadowColor = '#78350f'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.ellipse(cx - 60, cy - 100, 25, 55, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + 60, cy - 100, 25, 55, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1f2937'; ctx.beginPath(); ctx.arc(cx, cy + 30, 8, 0, Math.PI * 2); ctx.fill();
      break;
    default:
      break;
  }
  ctx.shadowBlur = 0;
};

const FILTERS = [
  { id: 'none', name: 'No Filter', icon: '🚫' },
  { id: 'neon_bunny', name: 'Neon Bunny', icon: '🐰' },
  { id: 'cyber_visor', name: 'Cyber Visor', icon: '🥽' },
  { id: 'golden_crown', name: 'Gold Crown', icon: '👑' },
  { id: 'spooky_neon', name: 'Spooky Glow', icon: '👻' },
  { id: 'dreamy_sparkle', name: 'Dreamy Sparkle', icon: '✨' },
  { id: 'dog_ears', name: 'Puppy Ears', icon: '🐶' }
];

// Reusable live camera + AR overlay panel — used in Camera studio, Omegle/VibeRoulette,
// dating-style matches, and every one of the 14 game rooms.
function ARVideoPanel({ filter, label, showFilterStrip, onChangeFilter, overlayTopLeft, overlayTopRight, muted }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let stream;
    let raf;
    let alive = true;

    const render = () => {
      if (!alive) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        } else {
          canvas.width = 640; canvas.height = 480;
          ctx.fillStyle = '#090d16'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2 - 20, 75, 0, Math.PI * 2);
          ctx.fillStyle = '#6366f1'; ctx.fill();
        }
        applySnapFilter(ctx, canvas.width, canvas.height, filter);
      }
      raf = requestAnimationFrame(render);
    };

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      } catch (e) { /* no camera permission — show placeholder */ }
      raf = requestAnimationFrame(render);
    })();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [filter]);

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-end">
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="w-full h-full object-cover absolute inset-0" />
      {muted && <div className="absolute top-3 right-3 bg-slate-950/80 p-1.5 rounded-lg"><MicOff className="w-3.5 h-3.5 text-rose-400" /></div>}
      {overlayTopLeft}
      {overlayTopRight}
      {label && <span className="relative z-10 m-3 self-start bg-slate-950/80 px-3 py-1 rounded-xl text-xs font-bold text-purple-300">{label}</span>}
      {showFilterStrip && (
        <div className="relative z-10 flex gap-1.5 p-2 bg-slate-950/70 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => onChangeFilter(f.id)}
              className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold border ${filter === f.id ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800/80 border-slate-700 text-slate-300'}`}
            >
              {f.icon} {f.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Voice message + Vibe message composer bar — used in Omegle calls and every game room.
function VoiceVibeBar({ onSendVoice, onSendVibe }) {
  const [recording, setRecording] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const vibeOptions = ['🔥 On Fire', '💯 Real Talk', '😂 Dead', '💖 Sweet', '👀 Sus', '🎉 Let\'s Go'];
  const [showVibes, setShowVibes] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecordSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const startRecording = () => { setRecording(true); setRecordSec(0); };
  const stopRecording = () => {
    setRecording(false);
    if (recordSec > 0) onSendVoice(recordSec);
    setRecordSec(0);
  };

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-2">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold ${recording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300'}`}
      >
        <Mic2 className="w-4 h-4" />
        {recording ? `Recording... ${recordSec}s (release to send)` : 'Hold to send Voice Message'}
      </button>
      <div className="relative">
        <button onClick={() => setShowVibes(!showVibes)} className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-2.5 rounded-xl">
          <Sparkles className="w-4 h-4" /> Vibe
        </button>
        {showVibes && (
          <div className="absolute bottom-full right-0 mb-2 bg-slate-900 border border-slate-700 rounded-2xl p-2 grid grid-cols-2 gap-1.5 w-56 shadow-2xl z-20">
            {vibeOptions.map((v) => (
              <button key={v} onClick={() => { onSendVibe(v); setShowVibes(false); }} className="bg-slate-800 hover:bg-purple-600/40 text-slate-200 text-[11px] font-bold px-2 py-2 rounded-lg text-left">{v}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- The 14 games ----------
const GAMES = [
  { id: 'truth_wheel', name: 'Truth or Spin Wheel', icon: '🎡', desc: 'Spin for a dare or a truth prompt' },
  { id: 'draw_guess', name: 'Skribbl Draw & Guess', icon: '🎨', desc: 'Draw the secret word, others guess' },
  { id: 'liar_bluff', name: "Liar's Bluff", icon: '🕵️', desc: 'Find the impostor among your friends' },
  { id: 'quiz_battle', name: 'Rapid Quiz Battle', icon: '⚡', desc: 'Fast trivia, highest score wins' },
  { id: 'never_have_i', name: 'Never Have I Ever', icon: '🙈', desc: 'Confess or pass, live group tally' },
  { id: 'most_likely', name: 'Most Likely To', icon: '👉', desc: 'Vote who fits the prompt best' },
  { id: 'would_you_rather', name: 'Would You Rather', icon: '⚖️', desc: 'Pick a side, watch the room split' },
  { id: 'emoji_charades', name: 'Emoji Charades', icon: '🎭', desc: 'Guess the movie/show from emojis' },
  { id: 'word_chain', name: 'Word Chain Blitz', icon: '🔤', desc: 'Type a word before the timer hits 0' },
  { id: 'karaoke_battle', name: 'Karaoke Battle', icon: '🎤', desc: 'Sing live, the room rates your run' },
  { id: 'trivia_royale', name: 'Trivia Royale', icon: '🏆', desc: 'Elimination trivia — last one standing' },
  { id: 'bluff_poker', name: 'Bluff Poker Chips', icon: '🃏', desc: 'Bet chips, call bluffs, win the pot' },
  { id: 'doodle_relay', name: 'Speed Doodle Relay', icon: '✏️', desc: 'Pass-the-canvas drawing relay' },
  { id: 'vibe_match', name: 'Vibe Match Compatibility', icon: '💘', desc: 'Answer & reveal your % match' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('lounges');
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeGame, setActiveGame] = useState(null); // one of GAMES, opened as its own room
  const [gameCallMode, setGameCallMode] = useState('video'); // 'video' | 'voice'
  const [gameFilter, setGameFilter] = useState('none');
  const [gameChat, setGameChat] = useState([]); // voice/vibe messages log inside a game room
  const [ghostMode, setGhostMode] = useState(false);
  const [showPanic, setShowPanic] = useState(false);
  const [showWhyMatch, setShowWhyMatch] = useState(false);
  const [toast, setToast] = useState(null);

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const [netStats, setNetStats] = useState({ ping: 18, fps: 60 });
  const [ultraPerformanceMode, setUltraPerformanceMode] = useState(true);

  const [userProfile, setUserProfile] = useState({
    name: 'Alex Vance', level: 22, xp: 7800, nextLevelXp: 10000, vibesCount: 3850, verified: true,
    activeBadge: 'Vibe Creator Supreme',
    badges: [
      { id: 1, name: 'Vibe Creator Supreme', icon: '👑', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Hosted 150+ Audio/Video Stages' },
      { id: 2, name: 'Omegle Legend', icon: '⚡', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', desc: 'Met 100+ Strangers in VibeRoulette' },
      { id: 3, name: 'Vault Keeper', icon: '🔒', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', desc: 'Saved 25+ Moments in Memory Vault' },
      { id: 4, name: 'Trust Champion', icon: '🛡️', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Zero reports, 200+ clean sessions' },
      { id: 5, name: 'Mindful Vibes', icon: '🌙', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', desc: 'Took 10 wellbeing breaks' },
      { id: 6, name: 'Game Night MVP', icon: '🏆', color: 'bg-pink-500/20 text-pink-300 border-pink-500/40', desc: 'Won 5 different mini-games' }
    ]
  });

  const [screenSeconds, setScreenSeconds] = useState(37 * 60);
  const [dailyLimitMin, setDailyLimitMin] = useState(90);
  const [dndSchedule, setDndSchedule] = useState({ enabled: true, from: '22:30', to: '07:30' });
  const [showBreakNudge, setShowBreakNudge] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setScreenSeconds((s) => {
        const next = s + 15;
        if (Math.floor(next / 60) === dailyLimitMin - 15 && Math.floor(s / 60) < dailyLimitMin - 15) setShowBreakNudge(true);
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, [dailyLimitMin]);

  const [vaultMemories, setVaultMemories] = useState([
    { id: 'v1', title: 'Midnight Cyber DJ Stream', date: 'Yesterday at 2:14 AM', category: 'Snap Filter', tags: ['#Music', '#Lofi'], image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80', locked: false },
    { id: 'v2', title: 'Omegle Blind Match with @Kira', date: '3 days ago', category: 'VibeRoulette', tags: ['#Chemistry', '#DeepTalks'], image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', locked: false },
    { id: 'v3', title: 'New Year 2027 Time Capsule', date: 'Unlocks Jan 1, 2027', category: 'Time Capsule', tags: ['#Future', '#Private'], image: null, locked: true }
  ]);
  const [selectedVaultTag, setSelectedVaultTag] = useState('All');
  const [selfieCount, setSelfieCount] = useState(3284);

  const [selectedFilter, setSelectedFilter] = useState('neon_bunny');

  // Omegle / VibeRoulette + Safety
  const [omegleState, setOmegleState] = useState('idle');
  const [omegleTags] = useState(['#Gaming', '#Anime', '#DeepTalks', '#Music', '#Chill']);
  const [selectedTag, setSelectedTag] = useState('#Gaming');
  const [strangerInfo, setStrangerInfo] = useState(null);
  const [chemistryScore, setChemistryScore] = useState(30);
  const [isBlindMasked, setIsBlindMasked] = useState(true);
  const [matchCooldown, setMatchCooldown] = useState(0);
  const [matchesThisSession, setMatchesThisSession] = useState(0);
  const [liveModStatus, setLiveModStatus] = useState('clear');
  const [omegleChat, setOmegleChat] = useState([]);

  useEffect(() => {
    if (matchCooldown <= 0) return;
    const t = setInterval(() => setMatchCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [matchCooldown]);

  const [roomReactions, setRoomReactions] = useState([]);

  // Truth Wheel state
  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);

  // Draw & Guess / Doodle Relay
  const drawCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ec4899');
  const [relayTimer, setRelayTimer] = useState(15);
  const [relayTurn, setRelayTurn] = useState('You');

  // Quiz / Trivia Royale
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [triviaLives, setTriviaLives] = useState(3);
  const [triviaRound, setTriviaRound] = useState(1);
  const quizQuestion = { q: 'Which feature protects you from non-consensual reveals in VibeRoulette?', options: ['Blind Chemistry Mask', 'Neon Bunny Filter', 'Gold Crown', 'Soundboard'], answer: 0 };

  // Never Have I Ever / Most Likely / Would You Rather
  const [nheTally, setNheTally] = useState({ have: 4, haveNot: 9 });
  const [mostLikelyVotes, setMostLikelyVotes] = useState({ You: 1, KiraX: 5, DevSam: 2, Luna: 3 });
  const [wyrVotes, setWyrVotes] = useState({ a: 12, b: 8 });

  // Emoji charades / word chain / karaoke / bluff poker / vibe match
  const [charadeGuess, setCharadeGuess] = useState('');
  const [wordChainInput, setWordChainInput] = useState('');
  const [wordChainTimer, setWordChainTimer] = useState(10);
  const [wordChainWords, setWordChainWords] = useState(['NEON', 'NIGHT']);
  const [karaokeRating, setKaraokeRating] = useState(0);
  const [pokerChips, setPokerChips] = useState(500);
  const [pokerPot, setPokerPot] = useState(120);
  const [vibeMatchStep, setVibeMatchStep] = useState(0);
  const [vibeMatchResult, setVibeMatchResult] = useState(null);

  const [lounges] = useState([
    { id: '1', title: 'WePlay Party: Truth or Dare & Liar Game', host: 'Kira_Host', listeners: 142, tag: '🎮 Games Live', game: 'truth_wheel' },
    { id: '2', title: 'Draw & Guess Speed Championship', host: 'ArtStudio', listeners: 98, tag: '🎨 Skribbl', game: 'draw_guess' },
    { id: '3', title: 'Liar Game: Find the Secret Impostor', host: 'Detective_Vibe', listeners: 180, tag: '🕵️ Impostor', game: 'liar_bluff' },
    { id: '4', title: 'Rapid Quiz Showdown & Trivia', host: 'MasterQuiz', listeners: 210, tag: '⚡ Speed Quiz', game: 'quiz_battle' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => setNetStats({ ping: Math.floor(Math.random() * 8) + 12, fps: ultraPerformanceMode ? 60 : 45 }), 2000);
    return () => clearInterval(interval);
  }, [ultraPerformanceMode]);

  useEffect(() => {
    if (!activeGame || relayTimer <= 0) return;
    const t = setInterval(() => setRelayTimer((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [activeGame, relayTimer]);

  useEffect(() => {
    if (!activeGame || wordChainTimer <= 0) return;
    const t = setInterval(() => setWordChainTimer((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [activeGame, wordChainTimer]);

  const captureSnapToVault = (fromCanvasSelector) => {
    const canvas = document.querySelector(fromCanvasSelector || '.snap-canvas canvas');
    const dataUrl = canvas ? canvas.toDataURL('image/png') : null;
    const newMemory = {
      id: 'v' + Date.now(), title: `AR Selfie #${selfieCount + 1}`, date: 'Just Now',
      category: 'Snap Filter', tags: ['#Snap', '#Camera'], image: dataUrl, locked: false
    };
    setVaultMemories((v) => [newMemory, ...v]);
    setSelfieCount((c) => c + 1);
    setUserProfile((p) => ({ ...p, xp: p.xp + 100, vibesCount: p.vibesCount + 20 }));
    fireToast('✨ Selfie saved to your Vibe Vault');
  };

  const mockStrangers = [
    { name: 'Kira_Cyber', location: 'Tokyo, JP', sharedTags: ['#Gaming'], verified: true, safetyScore: 98, avatarColor: 'from-pink-500 to-rose-600' },
    { name: 'Marcus_Vibe', location: 'London, UK', sharedTags: ['#Chill'], verified: true, safetyScore: 95, avatarColor: 'from-cyan-500 to-blue-600' },
    { name: 'Elena_R', location: 'Berlin, DE', sharedTags: ['#DeepTalks'], verified: false, safetyScore: 88, avatarColor: 'from-purple-500 to-indigo-600' }
  ];

  const startOmegleMatch = () => {
    if (matchCooldown > 0) { fireToast(`Mindful pause active — ${matchCooldown}s left`); return; }
    setOmegleState('searching'); setLiveModStatus('scanning'); setChemistryScore(25); setOmegleChat([]);
    setTimeout(() => {
      const s = mockStrangers[Math.floor(Math.random() * mockStrangers.length)];
      setStrangerInfo(s); setOmegleState('connected'); setLiveModStatus('clear');
      setMatchesThisSession((m) => m + 1);
    }, 1400);
  };

  const nextOmegleMatch = () => {
    const nextCount = matchesThisSession + 1;
    if (nextCount % 6 === 0) {
      setMatchCooldown(20); setOmegleState('idle'); setStrangerInfo(null);
      fireToast('🌙 Quick mindful pause — 20s before your next stranger');
      return;
    }
    setOmegleState('searching');
    setTimeout(() => startOmegleMatch(), 700);
  };

  const reportAndBlock = (name) => {
    setOmegleState('idle'); setStrangerInfo(null);
    fireToast(`🚫 ${name} blocked & reported. Safety team reviews within 15 minutes.`);
  };

  const spinTruthWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true); setWheelResult(null);
    setWheelAngle((a) => a + 1440 + Math.floor(Math.random() * 360));
    setTimeout(() => {
      const prompts = ['What is the biggest lie you ever told a crush?', 'If you could trade places with someone here, who?', 'Sing 10 seconds of a song or do 5 pushups on camera!', 'What is your guilty pleasure video game?'];
      setWheelResult(prompts[Math.floor(Math.random() * prompts.length)]);
      setWheelSpinning(false);
      setUserProfile((p) => ({ ...p, xp: p.xp + 80, vibesCount: p.vibesCount + 15 }));
    }, 2000);
  };

  const handleDrawStart = (e) => {
    setIsDrawing(true);
    const canvas = drawCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect();
    ctx.beginPath(); ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const handleDrawMove = (e) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = drawColor; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); ctx.stroke();
  };
  const handleDrawEnd = () => setIsDrawing(false);

  const submitQuizAnswer = (idx) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    if (idx === quizQuestion.answer) setUserProfile((p) => ({ ...p, xp: p.xp + 150, vibesCount: p.vibesCount + 25 }));
  };

  const answerTrivia = (correct) => {
    if (correct) { setTriviaRound((r) => r + 1); setUserProfile((p) => ({ ...p, xp: p.xp + 60 })); }
    else setTriviaLives((l) => Math.max(0, l - 1));
  };

  const triggerSoundFX = (soundName) => sendReaction(`🔊 ${soundName}`);
  const sendReaction = (emoji) => {
    const id = Date.now();
    setRoomReactions((prev) => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
    setTimeout(() => setRoomReactions((prev) => prev.filter((r) => r.id !== id)), 2500);
  };

  const sendGameVoice = (sec) => {
    setGameChat((c) => [...c, { id: Date.now(), type: 'voice', label: `🎙️ Voice message (${sec}s)` }]);
    fireToast('Voice message sent to the room');
  };
  const sendGameVibe = (label) => {
    setGameChat((c) => [...c, { id: Date.now(), type: 'vibe', label }]);
    sendReaction(label.split(' ')[0]);
  };
  const sendOmegleVoice = (sec) => setOmegleChat((c) => [...c, { id: Date.now(), type: 'voice', label: `🎙️ Voice message (${sec}s)` }]);
  const sendOmegleVibe = (label) => setOmegleChat((c) => [...c, { id: Date.now(), type: 'vibe', label }]);

  const openGame = (game) => {
    setActiveGame(game);
    setGameChat([]);
    setWheelResult(null);
    setQuizAnswered(false);
    setTriviaLives(3);
    setTriviaRound(1);
    setRelayTimer(15);
    setWordChainTimer(10);
    setKaraokeRating(0);
    setPokerChips(500);
    setVibeMatchStep(0);
    setVibeMatchResult(null);
  };

  const runVibeMatchStep = (choice) => {
    if (vibeMatchStep < 2) { setVibeMatchStep((s) => s + 1); }
    else { setVibeMatchResult(Math.floor(Math.random() * 30) + 65); }
  };

  const screenMin = Math.floor(screenSeconds / 60);
  const screenPct = Math.min(100, Math.round((screenMin / dailyLimitMin) * 100));

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none relative">

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 border border-purple-500/40 text-slate-100 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-pulse">
          <Info className="w-4 h-4 text-purple-400" />{toast}
        </div>
      )}

      {showBreakNudge && (
        <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-8 max-w-sm text-center space-y-4">
            <Moon className="w-10 h-10 text-indigo-300 mx-auto" />
            <h3 className="font-bold text-lg">Time for a mindful break?</h3>
            <p className="text-xs text-slate-400">You're at {screenMin} min of your {dailyLimitMin} min daily goal.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => { setShowBreakNudge(false); setDailyLimitMin(dailyLimitMin + 30); }} className="bg-slate-800 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl">+30 min today</button>
              <button onClick={() => setShowBreakNudge(false)} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl">Take a break</button>
            </div>
          </div>
        </div>
      )}

      {showPanic && (
        <div className="fixed inset-0 z-[110] bg-rose-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl p-8 max-w-sm text-center space-y-4">
            <Siren className="w-10 h-10 text-rose-400 mx-auto animate-pulse" />
            <h3 className="font-bold text-lg">Panic Button Activated</h3>
            <p className="text-xs text-slate-400">You've instantly left the call, blocked this user, and Trust & Safety has been alerted.</p>
            <button onClick={() => { setShowPanic(false); setActiveRoom(null); setActiveGame(null); setOmegleState('idle'); setStrangerInfo(null); }} className="bg-rose-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl w-full">Done — I'm safe</button>
          </div>
        </div>
      )}

      {showWhyMatch && strangerInfo && (
        <div className="fixed inset-0 z-[105] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-7 max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" /> Why this match?</h3>
              <button onClick={() => setShowWhyMatch(false)}><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Shared interest tag: <span className="text-cyan-300 font-bold">{strangerInfo.sharedTags.join(', ')}</span></li>
              <li>• Safety Score: <span className="text-emerald-300 font-bold">{strangerInfo.safetyScore}/100</span></li>
              <li>• Identity: <span className={strangerInfo.verified ? 'text-emerald-300 font-bold' : 'text-amber-300 font-bold'}>{strangerInfo.verified ? 'Liveness Verified ✅' : 'Unverified — proceed with caution'}</span></li>
              <li>• Region proximity: {strangerInfo.location}</li>
            </ul>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between p-3 md:p-4 z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">VIBESPACE</h1>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400">
                <Wifi className="w-3 h-3 text-emerald-400" /><span>0-LAG ENGINE ({netStats.ping}ms)</span>
              </div>
            </div>
          </div>
          <nav className="space-y-1.5">
            {[
              { id: 'lounges', label: 'Audio & Video Stages', icon: Radio, badge: 'WEPLAY' },
              { id: 'omegle', label: '1-on-1 VibeRoulette', icon: RefreshCw, highlight: true, badge: 'OMEGLE' },
              { id: 'games', label: '14 Party Games', icon: Gamepad2, badge: 'PLAY' },
              { id: 'camera', label: 'Snapchat AR Filters', icon: Camera },
              { id: 'vault', label: 'Vibe Vault Memories', icon: HardDrive, highlight: true, badge: 'SAVED' },
              { id: 'safety', label: 'Trust & Safety Center', icon: Shield, badge: 'NEW' },
              { id: 'wellbeing', label: 'Digital Wellbeing', icon: HeartHandshake, badge: 'NEW' },
              { id: 'profile', label: 'Trophies & Badges', icon: Trophy }
            ].map((item) => {
              const Icon = item.icon; const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all relative ${isActive ? 'bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-transparent text-purple-300 border border-purple-500/30 shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-400'} ${item.highlight ? 'text-pink-400 animate-pulse' : ''}`} />
                  <span className="hidden md:block flex-1 text-left">{item.label}</span>
                  {item.badge && <span className="hidden md:inline-block text-[9px] font-black px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">{item.badge}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="space-y-2">
          <button onClick={() => { setGhostMode(!ghostMode); fireToast(ghostMode ? 'Ghost Mode off' : '👻 Ghost Mode on'); }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border ${ghostMode ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' : 'bg-slate-800/50 text-slate-400 border-slate-700/60'}`}>
            <Ghost className="w-4 h-4" /><span className="hidden md:inline">{ghostMode ? 'Ghost Mode: ON' : 'Ghost Mode: OFF'}</span>
          </button>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white border-2 border-purple-400">{userProfile.name[0]}</div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1 rounded-full border border-slate-900">L{userProfile.level}</span>
                {userProfile.verified && <ShieldCheck className="w-4 h-4 text-emerald-400 absolute -top-1 -right-1 bg-slate-900 rounded-full" />}
              </div>
              <div className="hidden md:block overflow-hidden flex-1">
                <p className="text-sm font-bold truncate text-slate-200">{userProfile.name}</p>
                <p className="text-xs text-purple-400 font-medium truncate">{userProfile.activeBadge}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-between pt-2 border-t border-slate-800 text-[10px]">
              <span className="text-slate-400">Anti-Lag Boost</span>
              <button onClick={() => setUltraPerformanceMode(!ultraPerformanceMode)} className={`px-2 py-0.5 rounded-md font-black uppercase ${ultraPerformanceMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`}>{ultraPerformanceMode ? 'ON (60FPS)' : 'OFF'}</button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-y-auto">
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              {activeTab === 'lounges' && 'WePlay Stages & Audio Circles'}
              {activeTab === 'omegle' && 'Omegle-Style 1-on-1 VibeRoulette'}
              {activeTab === 'games' && '14 Party Games Arcade'}
              {activeTab === 'camera' && 'Snapchat AR Filters & Photo Studio'}
              {activeTab === 'vault' && 'Vibe Vault (Memories & Time Capsules)'}
              {activeTab === 'safety' && 'Trust & Safety Center'}
              {activeTab === 'wellbeing' && 'Digital Wellbeing Dashboard'}
              {activeTab === 'profile' && 'User Level, Badges & Trophies'}
            </h2>
            <p className="text-xs text-slate-400">
              {activeTab === 'vault' && 'Unlimited photo snaps, filter selfies, voice notes, and time capsules.'}
              {activeTab === 'omegle' && 'Consent-first matching with liveness checks, AR filters, and voice/vibe messages.'}
              {activeTab === 'games' && 'Every game runs with live video or voice chat, AR filters, and vibe messages.'}
              {activeTab === 'safety' && 'The controls other apps hide — all in one place.'}
              {activeTab === 'wellbeing' && 'Real usage data so VibeSpace works for you, not the other way around.'}
              {activeTab === 'camera' && `${selfieCount.toLocaleString()} selfies taken so far — snap as many as you want.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-xs shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" /><span>{userProfile.vibesCount} Vibe Sparks</span>
            </div>
            <button onClick={() => fireToast('Lounge creation opened')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" /><span>Host Lounge</span>
            </button>
          </div>
        </header>

        {/* LOUNGES */}
        {activeTab === 'lounges' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {lounges.map((room) => (
                <div key={room.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-800 text-purple-400 border border-slate-700">{room.tag}</span>
                    <span className="text-xs text-emerald-400 font-medium">● {room.listeners} Active</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-100 group-hover:text-purple-300 transition-colors">{room.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Host: {room.host}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 capitalize">{room.game || 'Voice Lounge'}</span>
                    <button onClick={() => setActiveRoom(room)} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
                      <span>Join Stage</span><Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OMEGLE */}
        {activeTab === 'omegle' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100">Omegle VibeRoulette</h3>
                <p className="text-xs text-slate-400 mt-1">Every match is liveness-checked and safety-scored. AR filters work here too.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {omegleTags.map((tag) => (
                  <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${selectedTag === tag ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{tag}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[420px]">
              <ARVideoPanel filter={selectedFilter} label="You" showFilterStrip onChangeFilter={setSelectedFilter} />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {omegleState === 'idle' && matchCooldown === 0 && (
                  <button onClick={startOmegleMatch} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-lg">Start Random Match</button>
                )}
                {matchCooldown > 0 && (
                  <div className="space-y-2 text-center">
                    <Hourglass className="w-8 h-8 text-indigo-300 mx-auto animate-pulse" />
                    <p className="text-xs text-indigo-300 font-bold">Mindful pause: {matchCooldown}s</p>
                  </div>
                )}
                {omegleState === 'searching' && (
                  <div className="space-y-3">
                    <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-pink-300 font-bold">Matching on {selectedTag}...</p>
                  </div>
                )}
                {omegleState === 'connected' && strangerInfo && (
                  <div className="my-auto text-center space-y-2">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${strangerInfo.avatarColor} flex items-center justify-center text-3xl font-black text-white mx-auto shadow-xl relative`}>
                      {strangerInfo.name[0]}
                      {strangerInfo.verified && <ShieldCheck className="w-5 h-5 text-emerald-400 bg-slate-900 rounded-full absolute -top-1 -right-1" />}
                    </div>
                    <h4 className="font-bold text-lg text-slate-100">{strangerInfo.name}</h4>
                    <p className="text-xs text-slate-400">{strangerInfo.location}</p>
                    <button onClick={() => setShowWhyMatch(true)} className="text-[10px] text-cyan-300 underline flex items-center gap-1 mx-auto"><Info className="w-3 h-3" /> Why this match?</button>
                  </div>
                )}
              </div>
            </div>

            {omegleState === 'connected' && (
              <>
                <VoiceVibeBar onSendVoice={sendOmegleVoice} onSendVibe={sendOmegleVibe} />
                {omegleChat.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {omegleChat.slice(-6).map((m) => (
                      <span key={m.id} className={`text-[11px] font-bold px-3 py-1.5 rounded-xl ${m.type === 'voice' ? 'bg-slate-800 text-slate-300' : 'bg-purple-600/30 text-purple-200 border border-purple-500/40'}`}>{m.label}</span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setIsBlindMasked(!isBlindMasked)} className="bg-purple-600/30 text-purple-300 border border-purple-500/40 px-4 py-2 rounded-xl text-xs font-bold">🎭 Blind Mask: {isBlindMasked ? 'ON' : 'OFF'}</button>
                    <button onClick={() => reportAndBlock(strangerInfo.name)} className="bg-slate-800 text-rose-300 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><UserX className="w-3.5 h-3.5" /> Block & Report</button>
                    <button onClick={() => setShowPanic(true)} className="bg-rose-600/20 text-rose-400 border border-rose-500/50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Panic Exit</button>
                  </div>
                  <button onClick={nextOmegleMatch} className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2">
                    <SkipForward className="w-4 h-4" /><span>Next Stranger</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* GAMES GRID */}
        {activeTab === 'games' && (
          <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {GAMES.map((g) => (
                <button key={g.id} onClick={() => openGame(g)} className="p-4 rounded-2xl border bg-slate-900 border-slate-800 text-slate-300 hover:border-purple-500/50 hover:bg-purple-600/10 text-center transition-all">
                  <div className="text-3xl mb-1">{g.icon}</div>
                  <div className="text-xs font-bold text-slate-100">{g.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CAMERA */}
        {activeTab === 'camera' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-full md:w-2/3 aspect-video snap-canvas">
                <ARVideoPanel filter={selectedFilter} showFilterStrip onChangeFilter={setSelectedFilter} />
                <button onClick={() => captureSnapToVault('.snap-canvas canvas')} className="absolute bottom-14 right-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-20">
                  <Camera className="w-4 h-4" /><span>Snap Selfie</span>
                </button>
              </div>
              <div className="w-full md:w-1/3 space-y-3">
                <h4 className="text-sm font-bold text-slate-200">Unlimited AR Selfies</h4>
                <p className="text-xs text-slate-400">Take as many filtered selfies as you want — every one saves straight to your Vibe Vault. Same lenses work in VibeRoulette, dating matches, and every game room too.</p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-purple-300">{selfieCount.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500">selfies taken so far</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VAULT */}
        {activeTab === 'vault' && (
          <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100">🔒 Personal & Shared Vibe Vault</h3>
                <p className="text-xs text-slate-400">Filter snaps, voice notes, and secret future time capsules.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {['All', 'Snap Filter', 'VibeRoulette', 'Time Capsule'].map((t) => (
                  <button key={t} onClick={() => setSelectedVaultTag(t)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedVaultTag === t ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {vaultMemories.filter((m) => selectedVaultTag === 'All' || m.category === selectedVaultTag).map((mem) => (
                <div key={mem.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col justify-between">
                  {mem.locked ? (
                    <div className="h-44 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                      <Lock className="w-8 h-8 text-amber-400 mb-2 animate-bounce" />
                      <h4 className="font-bold text-sm text-slate-200">{mem.title}</h4>
                      <p className="text-xs text-amber-400 mt-1 font-semibold">{mem.date}</p>
                    </div>
                  ) : (
                    <div className="h-44 bg-slate-950 relative overflow-hidden">
                      {mem.image ? <img src={mem.image} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-4xl">📸</div>}
                      <span className="absolute top-3 left-3 bg-slate-950/80 text-purple-300 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-800">{mem.category}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-slate-100">{mem.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{mem.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SAFETY CENTER */}
        {activeTab === 'safety' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm">Liveness Verified</h4>
                <p className="text-[10px] text-slate-400">A quick face-match scan confirms you're a real, unique person.</p>
              </div>
              <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 text-center space-y-2">
                <Ghost className="w-8 h-8 text-indigo-300 mx-auto" />
                <h4 className="font-bold text-sm">Ghost Mode</h4>
                <p className="text-[10px] text-slate-400">Browse invisibly — no read receipts, no "last seen".</p>
              </div>
              <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 text-center space-y-2">
                <Siren className="w-8 h-8 text-rose-400 mx-auto" />
                <h4 className="font-bold text-sm">One-Tap Panic Exit</h4>
                <p className="text-[10px] text-slate-400">Instantly leave, block, and flag a session for human review.</p>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2"><MessageCircleWarning className="w-4 h-4 text-amber-400" /> Report History & Response Times</h3>
              <div className="space-y-2">
                {[{ label: 'Harassment report — @Toxic_Guy99', status: 'Actioned in 8 min', color: 'text-emerald-400' },
                  { label: 'Unwanted exposure attempt — blocked automatically', status: 'AI auto-blocked instantly', color: 'text-emerald-400' },
                  { label: 'Impersonation report — under review', status: 'In review (avg 15 min)', color: 'text-amber-400' }].map((r, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs">
                    <span className="text-slate-300">{r.label}</span><span className={`font-bold ${r.color}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WELLBEING */}
        {activeTab === 'wellbeing' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2"><Timer className="w-4 h-4 text-indigo-300" /> Today's Screen Time</h3>
                <span className="text-xs font-bold text-slate-300">{screenMin} / {dailyLimitMin} min</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${screenPct > 90 ? 'bg-rose-500' : screenPct > 60 ? 'bg-amber-400' : 'bg-emerald-400'} transition-all`} style={{ width: `${screenPct}%` }} />
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="font-bold text-sm">Adjust your daily goal</h3>
              <input type="range" min="30" max="240" step="15" value={dailyLimitMin} onChange={(e) => setDailyLimitMin(Number(e.target.value))} className="w-full accent-purple-500" />
              <p className="text-xs text-slate-400">Goal: {dailyLimitMin} minutes/day</p>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 flex-wrap">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white shadow-xl relative">
                {userProfile.name[0]}
                {userProfile.verified && <ShieldCheck className="w-6 h-6 text-emerald-400 bg-slate-900 rounded-full absolute -bottom-1 -right-1" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-100">{userProfile.name}</h3>
                <p className="text-xs text-purple-400 mt-1">Active Rank: {userProfile.activeBadge}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.badges.map((b) => (
                <div key={b.id} className={`p-4 rounded-2xl border ${b.color} flex items-center gap-4`}>
                  <div className="text-3xl bg-slate-950/40 p-3 rounded-2xl">{b.icon}</div>
                  <div><h5 className="font-bold text-sm text-slate-100">{b.name}</h5><p className="text-xs text-slate-400 mt-0.5">{b.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* WEPLAY STAGE OVERLAY (audio/video lounges) */}
      {activeRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <div><h3 className="font-bold text-lg text-slate-100">{activeRoom.title}</h3><p className="text-xs text-slate-400">Host: {activeRoom.host}</p></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowPanic(true)} className="bg-slate-900 border border-rose-500/40 text-rose-400 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Panic</button>
              <button onClick={() => setActiveRoom(null)} className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl">Leave Stage</button>
            </div>
          </div>
          <div className="my-auto max-w-4xl mx-auto w-full">
            <h4 className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">WePlay Live Mic Stage</h4>
            <div className="grid grid-cols-4 gap-6">
              {[{ name: activeRoom.host, isHost: true }, { name: 'KiraX', isHost: false }, { name: 'DevSam', isHost: false }, { name: 'Luna', isHost: false }].map((sp, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-xl font-bold text-white relative border-2 border-purple-400 shadow-lg">
                    {sp.name[0]}{sp.isHost && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">{sp.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {[{ name: 'Airhorn', emoji: '📢' }, { name: 'Cheer', emoji: '🎉' }, { name: 'Laugh', emoji: '😂' }, { name: 'Drumroll', emoji: '🥁' }].map((s) => (
              <button key={s.name} onClick={() => triggerSoundFX(s.name)} className="bg-slate-900 border border-slate-800 text-xs font-bold px-3 py-2 rounded-xl text-slate-300">{s.emoji} {s.name}</button>
            ))}
          </div>
          {roomReactions.map((r) => (<span key={r.id} className="fixed bottom-24 text-2xl animate-bounce pointer-events-none" style={{ left: `${r.left}%` }}>{r.emoji}</span>))}
        </div>
      )}

      {/* GAME ROOM OVERLAY — every one of the 14 games opens here with video/voice + AR + voice/vibe messages */}
      {activeGame && (
        <div className="fixed inset-0 z-50 bg-slate-950/97 backdrop-blur-xl flex flex-col p-4 md:p-6 overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{activeGame.icon}</span>
              <div><h3 className="font-bold text-lg text-slate-100">{activeGame.name}</h3><p className="text-xs text-slate-400">{activeGame.desc}</p></div>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <button onClick={() => setGameCallMode(gameCallMode === 'video' ? 'voice' : 'video')} className="bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5">
                {gameCallMode === 'video' ? <Video className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {gameCallMode === 'video' ? 'Video Chat ON' : 'Voice Only'}
              </button>
              <button onClick={() => setShowPanic(true)} className="bg-slate-900 border border-rose-500/40 text-rose-400 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Panic</button>
              <button onClick={() => setActiveGame(null)} className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl">Leave Game</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
            {/* Live video/voice panel with AR filters — always visible during play */}
            <div className="lg:col-span-1 space-y-3">
              {gameCallMode === 'video' ? (
                <ARVideoPanel filter={gameFilter} label="You" showFilterStrip onChangeFilter={setGameFilter} />
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 min-h-[200px]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black text-white">{userProfile.name[0]}</div>
                  <p className="text-xs text-slate-400 font-bold">Voice-only mode — camera off</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                {['KiraX', 'DevSam', 'Luna'].map((n) => (
                  <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">{n[0]}</div>
                    <span className="text-[10px] text-slate-400 font-semibold">{n}</span>
                  </div>
                ))}
              </div>
              <VoiceVibeBar onSendVoice={sendGameVoice} onSendVibe={sendGameVibe} />
              {gameChat.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {gameChat.slice(-8).map((m) => (
                    <span key={m.id} className={`text-[11px] font-bold px-3 py-1.5 rounded-xl ${m.type === 'voice' ? 'bg-slate-800 text-slate-300' : 'bg-purple-600/30 text-purple-200 border border-purple-500/40'}`}>{m.label}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Game-specific play area */}
            <div className="lg:col-span-2 bg-slate-900 border border-purple-500/30 rounded-3xl p-6 flex flex-col justify-center">
              {activeGame.id === 'truth_wheel' && (
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 rounded-full border-8 border-purple-500 border-t-pink-500 border-b-cyan-500 mx-auto flex items-center justify-center text-4xl shadow-2xl transition-transform duration-1000" style={{ transform: `rotate(${wheelAngle}deg)` }}>🎯</div>
                  {wheelResult && <p className="bg-purple-900/30 border border-purple-500/40 p-3 rounded-xl text-xs font-bold text-slate-200 max-w-md mx-auto">{wheelResult}</p>}
                  <button onClick={spinTruthWheel} disabled={wheelSpinning} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs px-8 py-3 rounded-xl">{wheelSpinning ? 'Spinning...' : 'Spin Wheel (+80 XP)'}</button>
                </div>
              )}
              {(activeGame.id === 'draw_guess' || activeGame.id === 'doodle_relay') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                    <span className="font-bold text-pink-400">{activeGame.id === 'doodle_relay' ? `Relay turn: ${relayTurn} — ${relayTimer}s left` : 'Secret Word: CYBERPUNK'}</span>
                    <div className="flex gap-2">
                      {['#ec4899', '#38bdf8', '#eab308', '#22c55e', '#ffffff'].map((c) => (<button key={c} onClick={() => setDrawColor(c)} className="w-5 h-5 rounded-full border border-slate-700" style={{ backgroundColor: c }} />))}
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl h-64 overflow-hidden">
                    <canvas ref={drawCanvasRef} width={600} height={256} onMouseDown={handleDrawStart} onMouseMove={handleDrawMove} onMouseUp={handleDrawEnd} className="w-full h-full cursor-crosshair" />
                  </div>
                  {activeGame.id === 'doodle_relay' && relayTimer === 0 && (
                    <button onClick={() => { setRelayTurn(relayTurn === 'You' ? 'KiraX' : 'You'); setRelayTimer(15); }} className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl w-full">Pass Canvas to Next Player</button>
                  )}
                </div>
              )}
              {activeGame.id === 'liar_bluff' && (
                <div className="text-center space-y-3">
                  <p className="text-xs text-slate-400">Everyone gets a role. Find the impostor before time runs out.</p>
                  <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 text-xs font-bold text-amber-300">Your role: Civilian</div>
                  <div className="grid grid-cols-3 gap-2">
                    {['KiraX', 'DevSam', 'Luna'].map((n) => (<button key={n} onClick={() => fireToast(`Voted ${n} as the impostor`)} className="bg-slate-800 hover:bg-rose-600/40 text-xs font-bold py-2 rounded-xl text-slate-200">Vote {n}</button>))}
                  </div>
                </div>
              )}
              {activeGame.id === 'quiz_battle' && (
                <div className="space-y-4 text-center">
                  <p className="text-sm font-bold text-slate-100">{quizQuestion.q}</p>
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {quizQuestion.options.map((opt, i) => (<button key={i} onClick={() => submitQuizAnswer(i)} className="bg-slate-800 hover:bg-purple-600 text-slate-200 text-xs font-bold py-3 rounded-xl">{opt}</button>))}
                  </div>
                  {quizAnswered && <p className="text-xs text-emerald-400 font-bold">Answer locked in!</p>}
                </div>
              )}
              {activeGame.id === 'never_have_i' && (
                <div className="text-center space-y-4">
                  <p className="text-sm font-bold text-slate-100">"Never have I ever... texted an ex at 2am"</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => setNheTally((t) => ({ ...t, have: t.have + 1 }))} className="bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold px-5 py-3 rounded-xl">🙋 I Have ({nheTally.have})</button>
                    <button onClick={() => setNheTally((t) => ({ ...t, haveNot: t.haveNot + 1 }))} className="bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-5 py-3 rounded-xl">🙅 Never ({nheTally.haveNot})</button>
                  </div>
                </div>
              )}
              {activeGame.id === 'most_likely' && (
                <div className="space-y-3 text-center">
                  <p className="text-sm font-bold text-slate-100">"Most likely to fall asleep on a video call"</p>
                  {Object.entries(mostLikelyVotes).map(([n, v]) => (
                    <div key={n} className="flex items-center gap-3">
                      <button onClick={() => setMostLikelyVotes((m) => ({ ...m, [n]: m[n] + 1 }))} className="text-xs font-bold text-slate-300 w-20 text-left">{n}</button>
                      <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${v * 10}%` }} /></div>
                      <span className="text-xs text-slate-400 w-6">{v}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeGame.id === 'would_you_rather' && (
                <div className="space-y-4 text-center">
                  <p className="text-sm font-bold text-slate-100">Would you rather...</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setWyrVotes((v) => ({ ...v, a: v.a + 1 }))} className="bg-slate-800 hover:bg-cyan-600/30 border border-slate-700 text-xs font-bold py-4 rounded-xl text-slate-200">🌍 Travel the world with no money<br /><span className="text-cyan-300">{wyrVotes.a} votes</span></button>
                    <button onClick={() => setWyrVotes((v) => ({ ...v, b: v.b + 1 }))} className="bg-slate-800 hover:bg-pink-600/30 border border-slate-700 text-xs font-bold py-4 rounded-xl text-slate-200">🏠 Stay home with unlimited money<br /><span className="text-pink-300">{wyrVotes.b} votes</span></button>
                  </div>
                </div>
              )}
              {activeGame.id === 'emoji_charades' && (
                <div className="space-y-4 text-center">
                  <p className="text-3xl">🦁👑🌍</p>
                  <input value={charadeGuess} onChange={(e) => setCharadeGuess(e.target.value)} placeholder="Type your guess..." className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 w-full max-w-xs mx-auto" />
                  <button onClick={() => { fireToast(charadeGuess.toLowerCase().includes('lion king') ? '🎉 Correct! +100 XP' : 'Not quite — try again'); setCharadeGuess(''); }} className="bg-purple-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl">Submit Guess</button>
                </div>
              )}
              {activeGame.id === 'word_chain' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-400">Last word: <span className="font-bold text-purple-300">{wordChainWords[wordChainWords.length - 1]}</span> — next word must start with "{wordChainWords[wordChainWords.length - 1].slice(-1)}"</p>
                  <p className={`text-2xl font-black ${wordChainTimer <= 3 ? 'text-rose-400' : 'text-slate-200'}`}>{wordChainTimer}s</p>
                  <div className="flex gap-2 justify-center">
                    <input value={wordChainInput} onChange={(e) => setWordChainInput(e.target.value.toUpperCase())} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 w-40" />
                    <button onClick={() => { if (wordChainInput) { setWordChainWords((w) => [...w, wordChainInput]); setWordChainInput(''); setWordChainTimer(10); setUserProfile((p) => ({ ...p, xp: p.xp + 30 })); } }} className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Play Word</button>
                  </div>
                </div>
              )}
              {activeGame.id === 'karaoke_battle' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-400">Unmute and sing! The room rates your performance live.</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (<button key={s} onClick={() => setKaraokeRating(s)}><Star className={`w-7 h-7 ${s <= karaokeRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} /></button>))}
                  </div>
                  {karaokeRating > 0 && <p className="text-xs text-emerald-400 font-bold">Room rated your run {karaokeRating}/5 ⭐</p>}
                </div>
              )}
              {activeGame.id === 'trivia_royale' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-400">Round {triviaRound} • Lives: {'❤️'.repeat(triviaLives)}{'🖤'.repeat(3 - triviaLives)}</p>
                  <p className="text-sm font-bold text-slate-100">Which lens boosts chemistry in VibeRoulette?</p>
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    <button onClick={() => answerTrivia(true)} className="bg-slate-800 hover:bg-emerald-600 text-slate-200 text-xs font-bold py-3 rounded-xl">Cyber Visor</button>
                    <button onClick={() => answerTrivia(false)} className="bg-slate-800 hover:bg-rose-600 text-slate-200 text-xs font-bold py-3 rounded-xl">Gold Crown</button>
                  </div>
                  {triviaLives === 0 && <p className="text-xs text-rose-400 font-bold">Eliminated! Final round: {triviaRound}</p>}
                </div>
              )}
              {activeGame.id === 'bluff_poker' && (
                <div className="space-y-4 text-center">
                  <p className="text-xs text-slate-400">Chips: <span className="text-amber-300 font-bold">{pokerChips}</span> • Pot: <span className="text-purple-300 font-bold">{pokerPot}</span></p>
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { setPokerChips((c) => c - 50); setPokerPot((p) => p + 50); }} className="bg-slate-800 hover:bg-purple-600 text-xs font-bold px-4 py-2.5 rounded-xl text-slate-200">Bet 50</button>
                    <button onClick={() => fireToast('You called the bluff!')} className="bg-slate-800 hover:bg-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl text-slate-200">Call Bluff</button>
                    <button onClick={() => fireToast('You folded this round')} className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl text-slate-200">Fold</button>
                  </div>
                </div>
              )}
              {activeGame.id === 'vibe_match' && (
                <div className="space-y-4 text-center">
                  {vibeMatchResult === null ? (
                    <>
                      <p className="text-sm font-bold text-slate-100">Question {vibeMatchStep + 1}/3: {['Night owl or early bird?', 'Adventure or cozy night in?', 'Deep talks or playful banter?'][vibeMatchStep]}</p>
                      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                        <button onClick={() => runVibeMatchStep('a')} className="bg-slate-800 hover:bg-pink-600/40 text-xs font-bold py-3 rounded-xl text-slate-200">Option A</button>
                        <button onClick={() => runVibeMatchStep('b')} className="bg-slate-800 hover:bg-purple-600/40 text-xs font-bold py-3 rounded-xl text-slate-200">Option B</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl font-black text-pink-400">{vibeMatchResult}%</p>
                      <p className="text-xs text-slate-400">Vibe Match with the room</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
