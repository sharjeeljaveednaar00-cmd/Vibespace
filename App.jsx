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
  UserX, Siren, Info, TrendingUp, HeartHandshake, Hourglass
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('lounges');
  const [activeRoom, setActiveRoom] = useState(null);
  const [ghostMode, setGhostMode] = useState(false);
  const [showPanic, setShowPanic] = useState(false);
  const [showWhyMatch, setShowWhyMatch] = useState(false);
  const [toast, setToast] = useState(null);

  const fireToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const [netStats, setNetStats] = useState({ ping: 18, fps: 60 });
  const [ultraPerformanceMode, setUltraPerformanceMode] = useState(true);

  const [userProfile, setUserProfile] = useState({
    name: 'Alex Vance',
    level: 22,
    xp: 7800,
    nextLevelXp: 10000,
    vibesCount: 3850,
    verified: true,
    activeBadge: 'Vibe Creator Supreme',
    badges: [
      { id: 1, name: 'Vibe Creator Supreme', icon: '👑', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Hosted 150+ Audio/Video Stages' },
      { id: 2, name: 'Omegle Legend', icon: '⚡', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', desc: 'Met 100+ Strangers in VibeRoulette' },
      { id: 3, name: 'Vault Keeper', icon: '🔒', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', desc: 'Saved 25+ Moments in Memory Vault' },
      { id: 4, name: 'Trust Champion', icon: '🛡️', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Zero reports, 200+ clean sessions' },
      { id: 5, name: 'Mindful Vibes', icon: '🌙', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', desc: 'Took 10 wellbeing breaks' }
    ]
  });

  // Digital Wellbeing
  const [screenSeconds, setScreenSeconds] = useState(37 * 60);
  const [dailyLimitMin, setDailyLimitMin] = useState(90);
  const [dndSchedule, setDndSchedule] = useState({ enabled: true, from: '22:30', to: '07:30' });
  const [showBreakNudge, setShowBreakNudge] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setScreenSeconds((s) => {
        const next = s + 15;
        if (Math.floor(next / 60) === dailyLimitMin - 15 && Math.floor(s / 60) < dailyLimitMin - 15) {
          setShowBreakNudge(true);
        }
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

  const [selectedFilter, setSelectedFilter] = useState('neon_bunny');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Omegle / VibeRoulette + Safety
  const [omegleState, setOmegleState] = useState('idle');
  const [omegleTags] = useState(['#Gaming', '#Anime', '#DeepTalks', '#Music', '#Chill']);
  const [selectedTag, setSelectedTag] = useState('#Gaming');
  const [strangerInfo, setStrangerInfo] = useState(null);
  const [chemistryScore, setChemistryScore] = useState(30);
  const [isBlindMasked, setIsBlindMasked] = useState(true);
  const [matchCooldown, setMatchCooldown] = useState(0);
  const [matchesThisSession, setMatchesThisSession] = useState(0);
  const [liveModStatus, setLiveModStatus] = useState('clear'); // clear, scanning

  useEffect(() => {
    if (matchCooldown <= 0) return;
    const t = setInterval(() => setMatchCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [matchCooldown]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [roomReactions, setRoomReactions] = useState([]);
  const [activeGameInRoom, setActiveGameInRoom] = useState(null);

  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);

  const drawCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ec4899');

  const [quizQuestion] = useState({
    q: 'Which feature protects you from non-consensual reveals in VibeRoulette?',
    options: ['Blind Chemistry Mask', 'Neon Bunny Filter', 'Gold Crown', 'Soundboard'],
    answer: 0
  });
  const [quizAnswered, setQuizAnswered] = useState(false);

  const [lounges] = useState([
    { id: '1', title: 'WePlay Party: Truth or Dare & Liar Game', host: 'Kira_Host', listeners: 142, tag: '🎮 Games Live', game: 'truth_wheel' },
    { id: '2', title: 'Draw & Guess Speed Championship', host: 'ArtStudio', listeners: 98, tag: '🎨 Skribbl', game: 'draw_guess' },
    { id: '3', title: 'Liar Game: Find the Secret Impostor', host: 'Detective_Vibe', listeners: 180, tag: '🕵️ Impostor', game: 'liar_bluff' },
    { id: '4', title: 'Rapid Quiz Showdown & Trivia', host: 'MasterQuiz', listeners: 210, tag: '⚡ Speed Quiz', game: 'quiz_battle' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetStats({
        ping: Math.floor(Math.random() * 8) + 12,
        fps: ultraPerformanceMode ? 60 : 45
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [ultraPerformanceMode]);

  useEffect(() => {
    let animId;
    if (activeTab === 'camera' || activeTab === 'omegle' || (activeRoom && activeRoom.type === 'video')) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
      cancelAnimationFrame(animId);
    };
  }, [activeTab, activeRoom, selectedFilter, isBlindMasked, chemistryScore]);

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        requestAnimationFrame(renderFilterCanvas);
      }
    } catch (err) {
      requestAnimationFrame(renderFilterCanvas);
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  const renderFilterCanvas = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      applySnapFilter(ctx, canvas.width, canvas.height, selectedFilter);
    } else {
      canvas.width = 640;
      canvas.height = 480;
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 75, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      applySnapFilter(ctx, canvas.width, canvas.height, selectedFilter);
    }

    if (isCameraActive || activeTab === 'camera' || activeTab === 'omegle' || activeRoom) {
      requestAnimationFrame(renderFilterCanvas);
    }
  };

  const applySnapFilter = (ctx, w, h, filter) => {
    const cx = w / 2;
    const cy = h / 2 - 30;

    if (activeTab === 'omegle' && isBlindMasked) {
      const maskAlpha = Math.max(0.1, (100 - chemistryScore) / 100);
      ctx.fillStyle = `rgba(15, 23, 42, ${maskAlpha})`;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`🎭 BLIND MASK DISSOLVING (${chemistryScore}% CHEMISTRY)`, cx - 150, 40);
    }

    if (activeTab === 'omegle') {
      ctx.fillStyle = liveModStatus === 'clear' ? '#34d399' : '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(liveModStatus === 'clear' ? '🛡️ AI Safety Scan: Clear' : '🛡️ Scanning...', 10, h - 12);
    }

    switch (filter) {
      case 'neon_bunny':
        ctx.strokeStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.ellipse(cx - 50, cy - 110, 22, 65, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx + 50, cy - 110, 22, 65, 0.2, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'cyber_visor':
        ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.strokeStyle = '#22d3ee';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(cx - 95, cy - 35, 190, 55, 14);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText(`VIBE ENGINE // 0-LAG ACTIVE`, cx - 80, cy + 2);
        break;
      case 'golden_crown':
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(cx - 60, cy - 70);
        ctx.lineTo(cx - 70, cy - 120);
        ctx.lineTo(cx - 30, cy - 90);
        ctx.lineTo(cx, cy - 130);
        ctx.lineTo(cx + 30, cy - 90);
        ctx.lineTo(cx + 70, cy - 120);
        ctx.lineTo(cx + 60, cy - 70);
        ctx.closePath();
        ctx.fill();
        break;
      case 'spooky_neon':
        ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.strokeStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 25;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, 85, 0, Math.PI * 2);
        ctx.stroke();
        break;
      default:
        break;
    }
    ctx.shadowBlur = 0;
  };

  const captureSnapToVault = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const newMemory = {
      id: 'v' + Date.now(),
      title: `AR Snap (${selectedFilter.replace('_', ' ')})`,
      date: 'Just Now',
      category: 'Snap Filter',
      tags: ['#Snap', '#Camera'],
      image: dataUrl,
      locked: false
    };
    setVaultMemories([newMemory, ...vaultMemories]);
    setUserProfile((p) => ({ ...p, xp: p.xp + 100, vibesCount: p.vibesCount + 20 }));
    fireToast('✨ Snapshot saved to your Vibe Vault');
  };

  const mockStrangers = [
    { name: 'Kira_Cyber', location: 'Tokyo, JP', tags: ['#Anime', '#Gaming'], sharedTags: ['#Gaming'], verified: true, safetyScore: 98, avatarColor: 'from-pink-500 to-rose-600' },
    { name: 'Marcus_Vibe', location: 'London, UK', tags: ['#Music', '#Chill'], sharedTags: ['#Chill'], verified: true, safetyScore: 95, avatarColor: 'from-cyan-500 to-blue-600' },
    { name: 'Elena_R', location: 'Berlin, DE', tags: ['#DeepTalks', '#Chill'], sharedTags: ['#DeepTalks'], verified: false, safetyScore: 88, avatarColor: 'from-purple-500 to-indigo-600' }
  ];

  const startOmegleMatch = () => {
    if (matchCooldown > 0) {
      fireToast(`Mindful pause active — ${matchCooldown}s left before your next match`);
      return;
    }
    setOmegleState('searching');
    setLiveModStatus('scanning');
    setChemistryScore(25);
    setTimeout(() => {
      const s = mockStrangers[Math.floor(Math.random() * mockStrangers.length)];
      setStrangerInfo(s);
      setOmegleState('connected');
      setLiveModStatus('clear');
      setMatchesThisSession((m) => m + 1);
    }, 1400);
  };

  const nextOmegleMatch = () => {
    const nextCount = matchesThisSession + 1;
    // Problem-solving: mandatory mindful cooldown every 6 rapid re-rolls to curb compulsive swiping
    if (nextCount % 6 === 0) {
      setMatchCooldown(20);
      setOmegleState('idle');
      setStrangerInfo(null);
      fireToast('🌙 Quick mindful pause — 20s before your next stranger');
      return;
    }
    setOmegleState('searching');
    setTimeout(() => startOmegleMatch(), 700);
  };

  const reportAndBlock = (name) => {
    setOmegleState('idle');
    setStrangerInfo(null);
    fireToast(`🚫 ${name} blocked & reported. Our safety team reviews within 15 minutes.`);
  };

  const spinTruthWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);
    setWheelAngle(wheelAngle + 1440 + Math.floor(Math.random() * 360));
    setTimeout(() => {
      const prompts = [
        'What is the biggest lie you ever told a crush?',
        'If you could trade places with someone in this call, who?',
        'Sing 10 seconds of a song or do 5 pushups on camera!',
        'What is your guilty pleasure video game?'
      ];
      setWheelResult(prompts[Math.floor(Math.random() * prompts.length)]);
      setWheelSpinning(false);
      setUserProfile((p) => ({ ...p, xp: p.xp + 80, vibesCount: p.vibesCount + 15 }));
    }, 2000);
  };

  const handleDrawStart = (e) => {
    setIsDrawing(true);
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const handleDrawMove = (e) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };
  const handleDrawEnd = () => setIsDrawing(false);

  const submitQuizAnswer = (idx) => {
    if (quizAnswered) return;
    setQuizAnswered(true);
    if (idx === quizQuestion.answer) {
      setUserProfile((p) => ({ ...p, xp: p.xp + 150, vibesCount: p.vibesCount + 25 }));
    }
  };

  const triggerSoundFX = (soundName) => sendReaction(`🔊 ${soundName}`);
  const sendReaction = (emoji) => {
    const id = Date.now();
    setRoomReactions((prev) => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
    setTimeout(() => setRoomReactions((prev) => prev.filter((r) => r.id !== id)), 2500);
  };

  const screenMin = Math.floor(screenSeconds / 60);
  const screenPct = Math.min(100, Math.round((screenMin / dailyLimitMin) * 100));

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none relative">

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 border border-purple-500/40 text-slate-100 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-pulse">
          <Info className="w-4 h-4 text-purple-400" />
          {toast}
        </div>
      )}

      {showBreakNudge && (
        <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-8 max-w-sm text-center space-y-4">
            <Moon className="w-10 h-10 text-indigo-300 mx-auto" />
            <h3 className="font-bold text-lg">Time for a mindful break?</h3>
            <p className="text-xs text-slate-400">You're at {screenMin} min of your {dailyLimitMin} min daily goal. Stepping away for a bit keeps VibeSpace feeling good, not draining.</p>
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
            <p className="text-xs text-slate-400">You've instantly left the call, blocked this user, and our Trust & Safety team has been alerted with a session recording clip for review.</p>
            <button onClick={() => { setShowPanic(false); setActiveRoom(null); setOmegleState('idle'); setStrangerInfo(null); }} className="bg-rose-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl w-full">Done — I'm safe</button>
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
            <p className="text-xs text-slate-400">Full transparency — no hidden algorithm. Here's exactly why {strangerInfo.name} showed up:</p>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Shared interest tag: <span className="text-cyan-300 font-bold">{strangerInfo.sharedTags.join(', ')}</span></li>
              <li>• Safety Score: <span className="text-emerald-300 font-bold">{strangerInfo.safetyScore}/100</span></li>
              <li>• Identity: <span className={strangerInfo.verified ? 'text-emerald-300 font-bold' : 'text-amber-300 font-bold'}>{strangerInfo.verified ? 'Liveness Verified ✅' : 'Unverified — proceed with caution'}</span></li>
              <li>• Region proximity: {strangerInfo.location}</li>
            </ul>
          </div>
        </div>
      )}

      {/* NAVIGATION SIDEBAR */}
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between p-3 md:p-4 z-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">VIBESPACE</h1>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>0-LAG ENGINE ({netStats.ping}ms)</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'lounges', label: 'Audio & Video Stages', icon: Radio, badge: 'WEPLAY' },
              { id: 'omegle', label: '1-on-1 VibeRoulette', icon: RefreshCw, highlight: true, badge: 'OMEGLE' },
              { id: 'games', label: '4 Party Mini-Games', icon: Gamepad2, badge: 'PLAY' },
              { id: 'camera', label: 'Snapchat AR Filters', icon: Camera },
              { id: 'vault', label: 'Vibe Vault Memories', icon: HardDrive, highlight: true, badge: 'SAVED' },
              { id: 'safety', label: 'Trust & Safety Center', icon: Shield, badge: 'NEW' },
              { id: 'wellbeing', label: 'Digital Wellbeing', icon: HeartHandshake, badge: 'NEW' },
              { id: 'profile', label: 'Trophies & Badges', icon: Trophy }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all relative ${
                    isActive ? 'bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-transparent text-purple-300 border border-purple-500/30 shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-400'} ${item.highlight ? 'text-pink-400 animate-pulse' : ''}`} />
                  <span className="hidden md:block flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="hidden md:inline-block text-[9px] font-black px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => { setGhostMode(!ghostMode); fireToast(ghostMode ? 'Ghost Mode off — you\'re visible again' : '👻 Ghost Mode on — browse invisibly'); }}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border ${ghostMode ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' : 'bg-slate-800/50 text-slate-400 border-slate-700/60'}`}
          >
            <Ghost className="w-4 h-4" />
            <span className="hidden md:inline">{ghostMode ? 'Ghost Mode: ON' : 'Ghost Mode: OFF'}</span>
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
              <button onClick={() => setUltraPerformanceMode(!ultraPerformanceMode)} className={`px-2 py-0.5 rounded-md font-black uppercase ${ultraPerformanceMode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-700 text-slate-400'}`}>
                {ultraPerformanceMode ? 'ON (60FPS)' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-y-auto">
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              {activeTab === 'lounges' && 'WePlay Stages & Audio Circles'}
              {activeTab === 'omegle' && 'Omegle-Style 1-on-1 VibeRoulette'}
              {activeTab === 'games' && 'WePlay Party Games Arcade'}
              {activeTab === 'camera' && 'Snapchat AR Filters & Photo Studio'}
              {activeTab === 'vault' && 'Vibe Vault (Memories & Time Capsules)'}
              {activeTab === 'safety' && 'Trust & Safety Center'}
              {activeTab === 'wellbeing' && 'Digital Wellbeing Dashboard'}
              {activeTab === 'profile' && 'User Level, Badges & Trophies'}
            </h2>
            <p className="text-xs text-slate-400">
              {activeTab === 'vault' && 'Save photos, filter snaps, voice notes, and secret future time capsules.'}
              {activeTab === 'omegle' && 'Consent-first matching with liveness checks, safety scores, and mindful pacing.'}
              {activeTab === 'games' && 'Play Truth Wheel, Skribbl, Liar Game, and Quiz Showdown.'}
              {activeTab === 'safety' && 'The controls other apps hide — all in one place.'}
              {activeTab === 'wellbeing' && 'Real usage data so VibeSpace works for you, not the other way around.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-xs shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{userProfile.vibesCount} Vibe Sparks</span>
            </div>
            <button onClick={() => fireToast('Lounge creation opened')} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all">
              <Plus className="w-4 h-4" />
              <span>Host Lounge</span>
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
                    <button onClick={() => { setActiveRoom(room); setActiveGameInRoom(room.game); }} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
                      <span>Join Stage</span>
                      <Play className="w-3 h-3 fill-current" />
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
                <p className="text-xs text-slate-400 mt-1">Every match is liveness-checked and safety-scored before you connect.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {omegleTags.map((tag) => (
                  <button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${selectedTag === tag ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{tag}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 aspect-video min-h-[380px]">
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded-xl text-xs font-bold text-purple-300">You</span>
              </div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {omegleState === 'idle' && matchCooldown === 0 && (
                  <button onClick={startOmegleMatch} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-lg">Start Random Match</button>
                )}
                {matchCooldown > 0 && (
                  <div className="space-y-2 text-center">
                    <Hourglass className="w-8 h-8 text-indigo-300 mx-auto animate-pulse" />
                    <p className="text-xs text-indigo-300 font-bold">Mindful pause: {matchCooldown}s</p>
                    <p className="text-[10px] text-slate-500 max-w-[200px]">Built to stop compulsive re-rolling — a real problem on random-match apps.</p>
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
              <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex gap-2">
                  <button onClick={() => setIsBlindMasked(!isBlindMasked)} className="bg-purple-600/30 text-purple-300 border border-purple-500/40 px-4 py-2 rounded-xl text-xs font-bold">🎭 Blind Mask: {isBlindMasked ? 'ON' : 'OFF'}</button>
                  <button onClick={() => reportAndBlock(strangerInfo.name)} className="bg-slate-800 text-rose-300 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><UserX className="w-3.5 h-3.5" /> Block & Report</button>
                  <button onClick={() => setShowPanic(true)} className="bg-rose-600/20 text-rose-400 border border-rose-500/50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Panic Exit</button>
                </div>
                <button onClick={nextOmegleMatch} className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2">
                  <SkipForward className="w-4 h-4" />
                  <span>Next Stranger</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* GAMES */}
        {activeTab === 'games' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'truth_wheel', name: 'Truth Wheel', icon: '🎡' },
                { id: 'draw_guess', name: 'Skribbl Draw', icon: '🎨' },
                { id: 'liar_bluff', name: "Liar's Bluff", icon: '🕵️' },
                { id: 'quiz_battle', name: 'Rapid Quiz', icon: '⚡' }
              ].map((g) => (
                <button key={g.id} onClick={() => setActiveGameInRoom(g.id)} className={`p-4 rounded-2xl border text-center transition-all ${activeGameInRoom === g.id ? 'bg-purple-600/30 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                  <div className="text-3xl mb-1">{g.icon}</div>
                  <div className="text-xs font-bold">{g.name}</div>
                </button>
              ))}
            </div>

            {activeGameInRoom && (
              <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6">
                {activeGameInRoom === 'truth_wheel' && (
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-bold text-purple-300">🎡 Truth or Spin Wheel</h3>
                    <div className="w-48 h-48 rounded-full border-8 border-purple-500 border-t-pink-500 border-b-cyan-500 mx-auto flex items-center justify-center text-4xl shadow-2xl transition-transform duration-1000" style={{ transform: `rotate(${wheelAngle}deg)` }}>🎯</div>
                    {wheelResult && <p className="bg-purple-900/30 border border-purple-500/40 p-3 rounded-xl text-xs font-bold text-slate-200 max-w-md mx-auto">{wheelResult}</p>}
                    <button onClick={spinTruthWheel} disabled={wheelSpinning} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs px-8 py-3 rounded-xl">{wheelSpinning ? 'Spinning...' : 'Spin Wheel (+80 XP)'}</button>
                  </div>
                )}
                {activeGameInRoom === 'draw_guess' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-pink-400">Secret Word: CYBERPUNK</span>
                      <div className="flex gap-2">
                        {['#ec4899', '#38bdf8', '#eab308', '#22c55e', '#ffffff'].map((c) => (
                          <button key={c} onClick={() => setDrawColor(c)} className="w-5 h-5 rounded-full border border-slate-700" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl h-64 overflow-hidden">
                      <canvas ref={drawCanvasRef} width={600} height={256} onMouseDown={handleDrawStart} onMouseMove={handleDrawMove} onMouseUp={handleDrawEnd} className="w-full h-full cursor-crosshair" />
                    </div>
                  </div>
                )}
                {activeGameInRoom === 'liar_bluff' && (
                  <div className="text-center space-y-3">
                    <h3 className="text-lg font-bold text-amber-300">🕵️ Liar's Bluff</h3>
                    <p className="text-xs text-slate-400">Everyone gets a role. Find the impostor before time runs out.</p>
                    <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 text-xs font-bold text-amber-300">Your role: Civilian</div>
                  </div>
                )}
                {activeGameInRoom === 'quiz_battle' && (
                  <div className="space-y-4 text-center">
                    <h3 className="text-lg font-bold text-amber-300">⚡ Rapid Quiz Battle</h3>
                    <p className="text-sm font-bold text-slate-100">{quizQuestion.q}</p>
                    <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                      {quizQuestion.options.map((opt, i) => (
                        <button key={i} onClick={() => submitQuizAnswer(i)} className="bg-slate-800 hover:bg-purple-600 text-slate-200 text-xs font-bold py-3 rounded-xl">{opt}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CAMERA */}
        {activeTab === 'camera' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row gap-6 items-center">
              <div className="relative w-full md:w-2/3 aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <canvas ref={canvasRef} className="w-full h-full object-cover" />
                <button onClick={captureSnapToVault} className="absolute bottom-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  <span>Save Snap to Vault</span>
                </button>
              </div>
              <div className="w-full md:w-1/3 space-y-3">
                <h4 className="text-sm font-bold text-slate-200">Snapchat Lenses</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'neon_bunny', name: 'Neon Bunny', icon: '🐰' },
                    { id: 'cyber_visor', name: 'Cyber Visor', icon: '🥽' },
                    { id: 'golden_crown', name: 'Gold Crown', icon: '👑' },
                    { id: 'spooky_neon', name: 'Spooky Glow', icon: '👻' }
                  ].map((f) => (
                    <button key={f.id} onClick={() => setSelectedFilter(f.id)} className={`p-3 rounded-xl border text-center transition-all ${selectedFilter === f.id ? 'bg-purple-600/30 border-purple-500 text-purple-200' : 'bg-slate-800/50 border-slate-700/60 text-slate-400'}`}>
                      <div className="text-2xl">{f.icon}</div>
                      <div className="text-xs font-semibold mt-1">{f.name}</div>
                    </button>
                  ))}
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
                <p className="text-xs text-slate-400">Your protected memory bank for filter snaps, audio notes, and secret future time capsules.</p>
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
                      <img src={mem.image} alt={mem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

        {/* SAFETY CENTER — solves: catfishing, harassment, no recourse, opacity */}
        {activeTab === 'safety' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm">Liveness Verified</h4>
                <p className="text-[10px] text-slate-400">A quick face-match scan confirms you're a real, unique person — no catfish, no bots.</p>
              </div>
              <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 text-center space-y-2">
                <Ghost className="w-8 h-8 text-indigo-300 mx-auto" />
                <h4 className="font-bold text-sm">Ghost Mode</h4>
                <p className="text-[10px] text-slate-400">Browse lounges and vaults invisibly — no read receipts, no "last seen".</p>
              </div>
              <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 text-center space-y-2">
                <Siren className="w-8 h-8 text-rose-400 mx-auto" />
                <h4 className="font-bold text-sm">One-Tap Panic Exit</h4>
                <p className="text-[10px] text-slate-400">Instantly leave, block, and flag a session for human review — no menus to dig through.</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2"><MessageCircleWarning className="w-4 h-4 text-amber-400" /> Report History & Response Times</h3>
              <div className="space-y-2">
                {[
                  { label: 'Harassment report — @Toxic_Guy99', status: 'Actioned in 8 min', color: 'text-emerald-400' },
                  { label: 'Unwanted exposure attempt — blocked automatically', status: 'AI auto-blocked instantly', color: 'text-emerald-400' },
                  { label: 'Impersonation report — under review', status: 'In review (avg 15 min)', color: 'text-amber-400' }
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs">
                    <span className="text-slate-300">{r.label}</span>
                    <span className={`font-bold ${r.color}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Do Not Disturb Hours</h3>
                <p className="text-xs text-slate-400 mt-1">Auto-mutes match requests and stage invites {dndSchedule.from}–{dndSchedule.to}.</p>
              </div>
              <button onClick={() => setDndSchedule({ ...dndSchedule, enabled: !dndSchedule.enabled })} className={`px-4 py-2 rounded-xl text-xs font-bold border ${dndSchedule.enabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {dndSchedule.enabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        )}

        {/* WELLBEING — solves: doomscrolling, compulsive re-matching, no usage transparency */}
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
              <p className="text-[11px] text-slate-500">Unlike infinite-scroll apps, VibeSpace shows you this bar everywhere so you always know where you stand.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="font-bold text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4 text-pink-400" /> Mindful Match Pacing</h4>
                <p className="text-xs text-slate-400">After 6 rapid re-rolls in VibeRoulette, a short 20s pause kicks in automatically — {matchesThisSession} matches this session.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="font-bold text-sm flex items-center gap-2"><Moon className="w-4 h-4 text-indigo-300" /> Do Not Disturb</h4>
                <p className="text-xs text-slate-400">Quiet hours {dndSchedule.from}–{dndSchedule.to} silence invites and notifications automatically.</p>
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
                  <div>
                    <h5 className="font-bold text-sm text-slate-100">{b.name}</h5>
                    <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* WEPLAY ACTIVE STAGE OVERLAY */}
      {activeRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <div>
                <h3 className="font-bold text-lg text-slate-100">{activeRoom.title}</h3>
                <p className="text-xs text-slate-400">Host: {activeRoom.host}</p>
              </div>
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
                    {sp.name[0]}
                    {sp.isHost && <span className="absolute -top-1 -right-1 text-xs">👑</span>}
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

          {roomReactions.map((r) => (
            <span key={r.id} className="fixed bottom-24 text-2xl animate-bounce pointer-events-none" style={{ left: `${r.left}%` }}>{r.emoji}</span>
          ))}
        </div>
      )}
    </div>
  );
}
