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
  Upload, Sliders, Type, StickyNote, Search, UserPlus, Lock as LockIcon,
  MapPin, ChevronDown, MessageSquare, AtSign, PartyPopper, Award, Rss
} from 'lucide-react';
import { supabase } from './supabaseClient';

// =========================================================================
// SHARED AR RENDERING — used by live camera views AND the Lens Studio editor
// =========================================================================
const applySnapFilter = (ctx, w, h, filter) => {
  const cx = w / 2, cy = h / 2 - 30;
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
      break;
    case 'spatial_aura':
      ctx.strokeStyle = '#8b5cf6'; ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 30; ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(cx, cy, 90 + i * 22, 0, Math.PI * 2); ctx.stroke(); }
      break;
    default: break;
  }
  ctx.shadowBlur = 0;
};

const FILTERS = [
  { id: 'none', name: 'No Filter', icon: '🚫' },
  { id: 'neon_bunny', name: 'Glowing Bunny Ears', icon: '🐰' },
  { id: 'cyber_visor', name: 'Neon Cyberpunk Visor', icon: '🥽' },
  { id: 'golden_crown', name: 'Golden Imperial Crown', icon: '👑' },
  { id: 'spooky_neon', name: 'Spooky Glow', icon: '👻' },
  { id: 'dreamy_sparkle', name: 'Dreamy Sparkle', icon: '✨' },
  { id: 'dog_ears', name: 'Puppy Ears', icon: '🐶' },
  { id: 'spatial_aura', name: 'Spatial Aura', icon: '🌌' }
];

function ARVideoPanel({ filter, label, showFilterStrip, onChangeFilter, className }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    let stream, raf, alive = true;
    const render = () => {
      if (!alive) return;
      const video = videoRef.current, canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 480;
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
      } catch (e) {}
      raf = requestAnimationFrame(render);
    })();
    return () => { alive = false; cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, [filter]);

  return (
    <div className={`relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-end ${className || 'min-h-[220px]'}`}>
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="w-full h-full object-cover absolute inset-0" />
      {label && <span className="relative z-10 m-3 self-start bg-slate-950/80 px-3 py-1 rounded-xl text-xs font-bold text-purple-300">{label}</span>}
      {showFilterStrip && (
        <div className="relative z-10 flex gap-1.5 p-2 bg-slate-950/70 overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => onChangeFilter(f.id)} className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold border ${filter === f.id ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800/80 border-slate-700 text-slate-300'}`}>{f.icon} {f.name}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// A big equal-size tile for a call participant (self = live camera, others = avatar w/ speaking pulse)
function ParticipantTile({ name, isSelf, filter, onChangeFilter, speaking }) {
  if (isSelf) return <ARVideoPanel filter={filter} label={`${name} (You)`} showFilterStrip onChangeFilter={onChangeFilter} className="aspect-video" />;
  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
      <div className={`w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white ${speaking ? 'ring-4 ring-emerald-400 animate-pulse' : ''}`}>{name[0]}</div>
      <span className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">{name}</span>
    </div>
  );
}

function VoiceVibeBar({ onSendVoice, onSendVibe }) {
  const [recording, setRecording] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const [showVibes, setShowVibes] = useState(false);
  const vibeOptions = ['🔥 On Fire', '💯 Real Talk', '😂 Dead', '💖 Sweet', '👀 Sus', '🎉 Let\'s Go'];
  useEffect(() => { if (!recording) return; const t = setInterval(() => setRecordSec((s) => s + 1), 1000); return () => clearInterval(t); }, [recording]);
  const startRecording = () => { setRecording(true); setRecordSec(0); };
  const stopRecording = () => { setRecording(false); if (recordSec > 0) onSendVoice(recordSec); setRecordSec(0); };
  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center gap-2">
      <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold ${recording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
        <Mic2 className="w-4 h-4" />{recording ? `Recording... ${recordSec}s` : 'Hold to send Voice Message'}
      </button>
      <div className="relative">
        <button onClick={() => setShowVibes(!showVibes)} className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-3 py-2.5 rounded-xl"><Sparkles className="w-4 h-4" /> Vibe</button>
        {showVibes && (
          <div className="absolute bottom-full right-0 mb-2 bg-slate-900 border border-slate-700 rounded-2xl p-2 grid grid-cols-2 gap-1.5 w-56 shadow-2xl z-20">
            {vibeOptions.map((v) => (<button key={v} onClick={() => { onSendVibe(v); setShowVibes(false); }} className="bg-slate-800 hover:bg-purple-600/40 text-slate-200 text-[11px] font-bold px-2 py-2 rounded-lg text-left">{v}</button>))}
          </div>
        )}
      </div>
    </div>
  );
}

// Generic playable shell for the 20 new concept games (chase / hide / race / puzzle / deduction / arena / rhythm / bomb)
function ConceptGameShell({ game, onWin }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('ready');
  const copy = {
    chase: { action: 'Run!', scene: '🏃💨🏚️', flavor: 'Outrun the chaser through the block before time runs out.' },
    hide: { action: 'Hide!', scene: '🙈🏠🔦', flavor: 'Find the best hiding spot before the seeker counts down.' },
    race: { action: 'Boost!', scene: '🏎️💨🌆', flavor: 'Race through the 3D neon track — tap to boost.' },
    puzzle: { action: 'Solve', scene: '🧩🔐💡', flavor: 'Crack the puzzle before your rivals do.' },
    deduction: { action: 'Accuse', scene: '🕵️🌙🔍', flavor: 'Figure out who\'s hiding the secret role.' },
    arena: { action: 'Strike!', scene: '⚔️🎯💥', flavor: 'Last one standing in the arena wins.' },
    rhythm: { action: 'Move!', scene: '🎵💃🕺', flavor: 'Stay on beat and don\'t get caught freezing.' },
    bomb: { action: 'Pass It', scene: '💣⏱️🔥', flavor: 'Answer fast and pass the bomb before it blows.' }
  }[game.mechanic] || { action: 'Go!', scene: '✨🎮✨', flavor: 'Play the round.' };

  const act = () => {
    if (status === 'done') return;
    setStatus('playing');
    setProgress((p) => {
      const next = Math.min(100, p + Math.floor(Math.random() * 22) + 12);
      if (next >= 100) { setStatus('done'); onWin(game.name); }
      return next;
    });
  };

  return (
    <div className="text-center space-y-4">
      <p className="text-5xl">{copy.scene}</p>
      <p className="text-xs text-slate-400 max-w-sm mx-auto">{copy.flavor}</p>
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden max-w-md mx-auto"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${progress}%` }} /></div>
      <button onClick={act} disabled={status === 'done'} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs px-8 py-3 rounded-xl disabled:opacity-50">{status === 'done' ? 'Finished!' : copy.action}</button>
    </div>
  );
}

// =========================================================================
// GAME CATALOG — 14 original + 20 new VibeSpace-original concept games
// =========================================================================
const GAMES = [
  { id: 'truth_wheel', name: 'Vibe Truth Wheel', icon: '🎡', desc: 'Spin for a dare or a truth prompt', mechanic: 'custom' },
  { id: 'draw_guess', name: 'Vibe Sketch & Guess', icon: '🎨', desc: 'Draw the secret word, others guess', mechanic: 'custom' },
  { id: 'liar_bluff', name: "Liar's Bluff", icon: '🕵️', desc: 'Find the impostor among your friends', mechanic: 'custom' },
  { id: 'quiz_battle', name: 'Rapid Vibe Quiz', icon: '⚡', desc: 'Fast trivia, highest score wins', mechanic: 'custom' },
  { id: 'never_have_i', name: 'Never Have I Ever', icon: '🙈', desc: 'Confess or pass, live group tally', mechanic: 'custom' },
  { id: 'most_likely', name: 'Most Likely To', icon: '👉', desc: 'Vote who fits the prompt best', mechanic: 'custom' },
  { id: 'would_you_rather', name: 'Would You Rather', icon: '⚖️', desc: 'Pick a side, watch the room split', mechanic: 'custom' },
  { id: 'emoji_charades', name: 'Emoji Charades', icon: '🎭', desc: 'Guess the movie/show from emojis', mechanic: 'custom' },
  { id: 'word_chain', name: 'Word Chain Blitz', icon: '🔤', desc: 'Type a word before the timer hits 0', mechanic: 'custom' },
  { id: 'trivia_royale', name: 'Trivia Royale', icon: '🏆', desc: 'Elimination trivia — last one standing', mechanic: 'custom' },
  { id: 'bluff_poker', name: 'Bluff Poker Chips', icon: '🃏', desc: 'Bet chips, call bluffs, win the pot', mechanic: 'custom' },
  { id: 'doodle_relay', name: 'Speed Doodle Relay', icon: '✏️', desc: 'Pass-the-canvas drawing relay', mechanic: 'custom' },
  { id: 'vibe_match', name: 'Vibe Match Compatibility', icon: '💘', desc: 'Answer & reveal your % match', mechanic: 'custom' },
  { id: 'karaoke_battle', name: 'Karaoke Quick Battle', icon: '🎤', desc: 'Sing a quick clip, room rates it', mechanic: 'custom' },
  { id: 'shadow_chase', name: 'Shadow Chase', icon: '🏃', desc: 'Catch-me-if-you-can street chase', mechanic: 'chase' },
  { id: 'hide_and_vibe', name: 'Hide & Vibe', icon: '🙈', desc: 'Classic hide and seek, VibeSpace style', mechanic: 'hide' },
  { id: 'neon_maze', name: 'Neon Maze Runner', icon: '🌀', desc: '3D-style neon maze race', mechanic: 'race' },
  { id: 'parkour_dash', name: 'Vibe Parkour Dash', icon: '🤸', desc: 'Obstacle course speed run', mechanic: 'race' },
  { id: 'zombie_outbreak', name: 'Zombie Outbreak Arena', icon: '🧟', desc: 'Survive the horde chase', mechanic: 'chase' },
  { id: 'sky_battle', name: 'Sky Battle Royale', icon: '🪂', desc: 'Last player standing in the sky arena', mechanic: 'arena' },
  { id: 'vault_heist', name: 'Treasure Vault Heist', icon: '💰', desc: 'Co-op puzzle heist against the clock', mechanic: 'puzzle' },
  { id: 'mystery_manor', name: 'Mystery Manor Escape', icon: '🏚️', desc: 'Escape room clue-solving', mechanic: 'puzzle' },
  { id: 'racing_rivals', name: 'Racing Rivals 3D', icon: '🏎️', desc: '3D-style kart race against rivals', mechanic: 'race' },
  { id: 'sumo_bounce', name: 'Sumo Bounce Arena', icon: '🥊', desc: 'Physics battle — knock rivals out', mechanic: 'arena' },
  { id: 'werewolf_midnight', name: 'Werewolf Midnight', icon: '🐺', desc: 'Hidden wolf social deduction', mechanic: 'deduction' },
  { id: 'spy_vs_spy', name: 'Spy vs Spy', icon: '🎩', desc: 'Stealth hidden-role mission', mechanic: 'deduction' },
  { id: 'musical_chairs', name: 'Musical Chairs Rush', icon: '🪑', desc: 'Classic musical chairs, VibeSpace remix', mechanic: 'rhythm' },
  { id: 'freeze_dance', name: 'Freeze Dance Off', icon: '🕺', desc: 'Dance until the music stops', mechanic: 'rhythm' },
  { id: 'balloon_pop', name: 'Balloon Pop Duel', icon: '🎈', desc: 'Quick-tap balloon popping duel', mechanic: 'arena' },
  { id: 'tower_stack', name: 'Tower Stack Blitz', icon: '🏗️', desc: 'Stack fast without toppling', mechanic: 'puzzle' },
  { id: 'riddle_escape', name: 'Riddle Escape Room', icon: '🗝️', desc: 'Solve riddles to unlock the exit', mechanic: 'puzzle' },
  { id: 'trivia_bomb', name: 'Trivia Time Bomb', icon: '💣', desc: 'Answer fast, pass the bomb before it pops', mechanic: 'bomb' },
  { id: 'vibe_paintball', name: 'Vibe Arena Paintball', icon: '🎯', desc: 'Shooter-lite party arena', mechanic: 'arena' },
  { id: 'become_a_star', name: 'Become a Star', icon: '⭐', desc: 'The flagship singing competition', mechanic: 'sing' },
  { id: 'flirt_me', name: 'Flirt Me (18+)', icon: '💋', desc: 'Spin, pair up, and trade playful flirty prompts', mechanic: 'flirt' },
  { id: 'qa_arena', name: 'Q&A Arena', icon: '🃏', desc: 'Truth or Dare, Deep Secrets, Would You Rather & Quiz Battles', mechanic: 'qa' }
];

// A representative sample catalog — production would connect to a full licensed
// library of thousands of tracks; this demonstrates the search/browse UX.
const SONG_CATALOG = [
  { title: 'Tum Hi Ho', artist: 'Bollywood Romantic', genre: 'Bollywood' },
  { title: 'Kesariya', artist: 'Bollywood Romantic', genre: 'Bollywood' },
  { title: 'Kal Ho Naa Ho', artist: 'Bollywood Classic', genre: 'Bollywood' },
  { title: 'Zinda', artist: 'Bollywood Rock', genre: 'Bollywood' },
  { title: 'Chaiyya Chaiyya', artist: 'Bollywood Classic', genre: 'Bollywood' },
  { title: 'Gerua', artist: 'Bollywood Romantic', genre: 'Bollywood' },
  { title: 'Malhari', artist: 'Bollywood Dance', genre: 'Bollywood' },
  { title: 'Shape of You (cover)', artist: 'Pop Hits', genre: 'Hollywood/Pop' },
  { title: 'Blinding Lights (cover)', artist: 'Pop Hits', genre: 'Hollywood/Pop' },
  { title: 'Perfect (cover)', artist: 'Pop Hits', genre: 'Hollywood/Pop' },
  { title: 'Levitating (cover)', artist: 'Pop Hits', genre: 'Hollywood/Pop' },
  { title: 'Someone Like You (cover)', artist: 'Pop Ballads', genre: 'Hollywood/Pop' },
  { title: 'Uptown Funk (cover)', artist: 'Pop Dance', genre: 'Hollywood/Pop' },
  { title: 'See You Again (cover)', artist: 'Film Anthems', genre: 'Hollywood/Pop' },
  { title: 'Naatu Naatu', artist: 'Tollywood Dance', genre: 'Bollywood' },
  { title: 'Apna Time Aayega', artist: 'Bollywood Hip-Hop', genre: 'Bollywood' },
  { title: 'Senorita (cover)', artist: 'Pop Duets', genre: 'Hollywood/Pop' },
  { title: 'Rewrite the Stars (cover)', artist: 'Film Anthems', genre: 'Hollywood/Pop' },
  { title: 'Ilahi', artist: 'Bollywood Travel', genre: 'Bollywood' },
  { title: 'Channa Mereya', artist: 'Bollywood Heartbreak', genre: 'Bollywood' },
  { title: 'Havana (cover)', artist: 'Pop Hits', genre: 'Hollywood/Pop' },
  { title: 'Believer (cover)', artist: 'Rock Anthems', genre: 'Hollywood/Pop' },
  { title: 'Ghungroo', artist: 'Bollywood Dance', genre: 'Bollywood' },
  { title: 'London Thumakda', artist: 'Bollywood Wedding', genre: 'Bollywood' }
];

const COUNTRIES = ['Anywhere in the World', 'United States', 'United Kingdom', 'India', 'Japan', 'Germany', 'Brazil', 'Australia', 'UAE', 'Philippines'];
const MOCK_USERS = ['KiraX', 'DevSam', 'Luna', 'Marcus_Vibe', 'Elena_R', 'Priya_S', 'JayJay', 'RiverTone'];
const RELATIONSHIP_TYPES = ['Friend', 'Best Friend', 'Best Friend Forever', 'Family', 'Partner', 'Engaged To', 'Committed To'];
const GIFT_CATALOG = [
  { id: 'rose', name: 'Rose', icon: '🌹', cost: 10 },
  { id: 'fire', name: 'Fire', icon: '🔥', cost: 25 },
  { id: 'crown', name: 'Crown', icon: '👑', cost: 100 },
  { id: 'rocket', name: 'Rocket', icon: '🚀', cost: 250 },
  { id: 'diamond', name: 'Diamond', icon: '💎', cost: 500 }
];

// Flirt Me — kept playful/PG-13 rather than explicit, so it's viable for real app-store review.
const FLIRT_PROMPTS = [
  "Compliment your match's smile without using the word 'smile'.",
  "Give your best (worst) cheesy pickup line and let them rate it 1-10.",
  "Describe your ideal first date in exactly 6 words.",
  "Send a playful wink reaction and explain what it means.",
  "What's your most embarrassing celebrity crush?",
  "Rate your flirting skills honestly, then prove it.",
  "Compliment someone using only emojis.",
  "What's the corniest thing you've ever said to a crush?"
];
const QA_CATEGORIES = {
  'Truth or Dare': ['Truth: What\'s a secret you\'ve never told anyone here?', 'Dare: Do your best impression of another player.'],
  'Deep Secrets': ['What\'s something you\'ve never admitted out loud?', 'What\'s a fear you rarely talk about?'],
  'Would You Rather': ['Would you rather always know when someone is lying, or always get away with lying?', 'Would you rather lose all your money or all your photos?'],
  'Personality Quiz': ['Are you more of a planner or a "figure it out later" person?', 'Do you recharge alone or with people?']
};
const ZODIAC_SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const ZODIAC_TRAITS = {
  Aries: 'Bold Aries', Taurus: 'Grounded Taurus', Gemini: 'Curious Gemini', Cancer: 'Empathetic Cancer',
  Leo: 'Passionate Leo', Virgo: 'Thoughtful Virgo', Libra: 'Balanced Libra', Scorpio: 'Passionate Scorpio',
  Sagittarius: 'Adventurous Sagittarius', Capricorn: 'Ambitious Capricorn', Aquarius: 'Visionary Aquarius', Pisces: 'Dreamy Pisces'
};
const AVATAR_OPTIONS = {
  face: ['🙂', '😊', '😎', '🥰', '🤨'],
  hair: ['Short', 'Long', 'Curly', 'Buzzed', 'Braided'],
  outfit: ['Streetwear', 'Formal', 'Cyberpunk', 'Cozy', 'Glam'],
  aura: ['None', 'Neon Pink', 'Golden', 'Cyan Glow', 'Violet Mist']
};
const REACTIONS = [
  { id: 'heart', icon: '❤️', label: 'Love' },
  { id: 'hug', icon: '🤗', label: 'Hug' },
  { id: 'kiss', icon: '😘', label: 'Kiss' },
  { id: 'mindblown', icon: '🤯', label: 'Mind-Blown' },
  { id: 'fire', icon: '🔥', label: 'Fire' },
  { id: 'slap', icon: '🖐️', label: 'Slap' },
  { id: 'shoe', icon: '👞', label: 'Shoe Throw' },
  { id: 'curse', icon: '🤬', label: 'Censored Curse' }
];

export default function App() {
  // ---------------- Auth / Onboarding ----------------
  // signup -> profile -> verify -> done   |   login -> done
  const [authStep, setAuthStep] = useState('signup');
  const [signupMethod, setSignupMethod] = useState(null);
  const [profileDraft, setProfileDraft] = useState({ name: '', bio: '', interests: [] });
  const [verifyProgress, setVerifyProgress] = useState(0);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [session, setSession] = useState(null);

  // Merge the Supabase `profiles` row into the existing mock profile shape,
  // so the rest of the UI — which still expects the mock fields — keeps working.
  const applyServerProfile = (profile) => {
    if (!profile) return;
    setUserProfile((p) => ({
      ...p,
      name: profile.name || p.name,
      bio: profile.bio ?? p.bio,
      level: profile.level ?? p.level,
      xp: profile.xp ?? p.xp,
    }));
    setVibeCoins(profile.vibe_coins ?? 500);
  };

  const loadProfile = async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error) applyServerProfile(data);
  };

  const loadFeed = async () => {
    setFeedLoading(true);
    const { data: posts, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(50);
    if (error || !posts) { setFeedLoading(false); return; }
    const postIds = posts.map((p) => p.id);
    const { data: reactions } = await supabase.from('post_reactions').select('post_id, reaction').in('post_id', postIds.length ? postIds : ['00000000-0000-0000-0000-000000000000']);
    const counted = posts.map((p) => {
      const mine = (reactions || []).filter((r) => r.post_id === p.id);
      const reactionCounts = {};
      mine.forEach((r) => { reactionCounts[r.reaction] = (reactionCounts[r.reaction] || 0) + 1; });
      return { id: p.id, user: p.author_name, text: p.text, comments: p.comments, mentions: p.mentions || [], reactions: reactionCounts };
    });
    setFeedPosts(counted);
    setFeedLoading(false);
  };

  // Restore session on load, and react to login/logout/OAuth-redirect events.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s) { loadProfile(s.user.id); loadFeed(); setAuthStep('done'); }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) { loadProfile(s.user.id); loadFeed(); setAuthStep('done'); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleEmailSignup = async () => {
    setAuthError('');
    if (!authEmail || !authPassword) return setAuthError('Enter an email and password.');
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword,
        options: { data: { full_name: profileDraft.name || authEmail.split('@')[0] } },
      });
      if (error) throw error;
      // If email confirmation is required, there's no session yet — tell the user to check inbox.
      if (!data.session) {
        setAuthError('Account created — check your email to confirm, then log in.');
        setAuthStep('login');
        return;
      }
      if (profileDraft.bio || profileDraft.interests.length) {
        await supabase.from('profiles').update({ bio: profileDraft.bio, interests: profileDraft.interests }).eq('id', data.user.id);
      }
      setAuthStep('verify');
      setVerifyProgress(0);
    } catch (e) {
      setAuthError(e.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!authEmail || !authPassword) return setAuthError('Enter your email and password.');
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
      if (error) throw error;
      // onAuthStateChange picks up the session and moves authStep to 'done'.
    } catch (e) {
      setAuthError(e.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    if (authStep !== 'verify') return;
    const t = setInterval(() => setVerifyProgress((p) => Math.min(100, p + 8)), 200);
    return () => clearInterval(t);
  }, [authStep]);

  useEffect(() => {
    if (verifyProgress >= 100 && authStep === 'verify') {
      const to = setTimeout(() => setAuthStep('done'), 500);
      return () => clearTimeout(to);
    }
  }, [verifyProgress, authStep]);

  const [activeTab, setActiveTab] = useState('vibestage');
  const [activeRoom, setActiveRoom] = useState(null);
  const [activeGame, setActiveGame] = useState(null);
  const [gameCallMode, setGameCallMode] = useState('video');
  const [gameFilter, setGameFilter] = useState('none');
  const [gameChat, setGameChat] = useState([]);
  const [ghostMode, setGhostMode] = useState(false);
  const [showPanic, setShowPanic] = useState(false);
  const [showWhyMatch, setShowWhyMatch] = useState(false);
  const [toast, setToast] = useState(null);
  const [winnerModal, setWinnerModal] = useState(null);
  const [giftLog, setGiftLog] = useState([]);

  const fireToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const [netStats, setNetStats] = useState({ ping: 18, fps: 60 });
  const [ultraPerformanceMode, setUltraPerformanceMode] = useState(true);
  const [vibeCoins, setVibeCoins] = useState(1200);

  const [userProfile, setUserProfile] = useState({
    name: 'Alex Vance', level: 22, xp: 7800, nextLevelXp: 10000, vibesCount: 3850, verified: true,
    activeBadge: 'Vibe Creator Supreme',
    badges: [
      { id: 1, name: 'Vibe Creator Supreme', icon: '👑', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Hosted 150+ Audio/Video Stages' },
      { id: 2, name: 'VibeRoulette Legend', icon: '⚡', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', desc: 'Met 100+ people in VibeRoulette' },
      { id: 3, name: 'Vault Keeper', icon: '🔒', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', desc: 'Saved 25+ moments in Memory Vault' },
      { id: 4, name: 'Trust Champion', icon: '🛡️', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Zero reports, 200+ clean sessions' },
      { id: 5, name: 'Mindful Vibes', icon: '🌙', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', desc: 'Took 10 wellbeing breaks' }
    ],
    relationships: [{ user: 'Luna', tag: 'Best Friend Forever' }, { user: 'DevSam', tag: 'Friend' }]
  });

  const [screenSeconds, setScreenSeconds] = useState(37 * 60);
  const [dailyLimitMin, setDailyLimitMin] = useState(90);
  const [showBreakNudge, setShowBreakNudge] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setScreenSeconds((s) => {
      const next = s + 15;
      if (Math.floor(next / 60) === dailyLimitMin - 15 && Math.floor(s / 60) < dailyLimitMin - 15) setShowBreakNudge(true);
      return next;
    }), 4000);
    return () => clearInterval(t);
  }, [dailyLimitMin]);

  const [vaultMemories, setVaultMemories] = useState([
    { id: 'v1', title: 'Midnight Cyber DJ Stream', date: 'Yesterday at 2:14 AM', category: 'Snap Filter', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80', locked: false },
    { id: 'v2', title: 'VibeRoulette Blind Match with @Kira', date: '3 days ago', category: 'VibeRoulette', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', locked: false },
    { id: 'v3', title: 'New Year 2027 Time Capsule', date: 'Unlocks Jan 1, 2027', category: 'Time Capsule', image: null, locked: true }
  ]);
  const [selectedVaultTag, setSelectedVaultTag] = useState('All');
  const [selfieCount, setSelfieCount] = useState(3284);
  const [selectedFilter, setSelectedFilter] = useState('neon_bunny');

  // ---------------- Lens Studio (photo editor) ----------------
  const [lensImage, setLensImage] = useState(null);
  const [lensFilter, setLensFilter] = useState('none');
  const [lensBrightness, setLensBrightness] = useState(100);
  const [lensContrast, setLensContrast] = useState(100);
  const [lensSaturate, setLensSaturate] = useState(100);
  const [lensStickers, setLensStickers] = useState([]);
  const [lensText, setLensText] = useState('');
  const [lensBeauty, setLensBeauty] = useState(0);
  const [lensWarmth, setLensWarmth] = useState(0);
  const [lensBackdrop, setLensBackdrop] = useState('none');
  const lensCanvasRef = useRef(null);
  const lensImgRef = useRef(null);

  useEffect(() => {
    const canvas = lensCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 500; canvas.height = 500;
    const warmthDeg = lensWarmth * 1.2;
    ctx.filter = `brightness(${lensBrightness}%) contrast(${lensContrast}%) saturate(${lensSaturate}%) blur(${lensBeauty * 0.06}px) sepia(${Math.max(0, lensWarmth)}%) hue-rotate(-${warmthDeg}deg)`;
    if (lensImgRef.current) {
      ctx.drawImage(lensImgRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#1e1b3a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#64748b'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Import a photo to start editing', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'left';
    }
    ctx.filter = 'none';
    if (lensBackdrop !== 'none') { ctx.fillStyle = lensBackdrop; ctx.globalAlpha = 0.18; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.globalAlpha = 1; }
    applySnapFilter(ctx, canvas.width, canvas.height, lensFilter);
    lensStickers.forEach((s) => { ctx.font = '48px serif'; ctx.fillText(s.emoji, s.x, s.y); });
    if (lensText) { ctx.fillStyle = '#ffffff'; ctx.font = 'bold 28px sans-serif'; ctx.shadowColor = '#000'; ctx.shadowBlur = 6; ctx.fillText(lensText, 24, canvas.height - 24); ctx.shadowBlur = 0; }
  }, [lensImage, lensFilter, lensBrightness, lensContrast, lensSaturate, lensStickers, lensText, lensBeauty, lensWarmth, lensBackdrop]);

  const handleLensUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => { lensImgRef.current = img; setLensImage(ev.target.result); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  const addLensSticker = (emoji) => setLensStickers((s) => [...s, { emoji, x: 60 + Math.random() * 350, y: 80 + Math.random() * 300 }]);
  const saveLensToVault = () => {
    const canvas = lensCanvasRef.current;
    const dataUrl = canvas ? canvas.toDataURL('image/png') : null;
    setVaultMemories((v) => [{ id: 'v' + Date.now(), title: 'Lens Studio Creation', date: 'Just Now', category: 'Snap Filter', image: dataUrl, locked: false }, ...v]);
    fireToast('🎨 Saved your edit to the Vibe Vault');
  };

  // ---------------- VibeRoulette ----------------
  const [omegleState, setOmegleState] = useState('idle');
  const [omegleTags] = useState(['#Gaming', '#Anime', '#DeepTalks', '#Music', '#Chill']);
  const [selectedTag, setSelectedTag] = useState('#Gaming');
  const [strangerInfo, setStrangerInfo] = useState(null);
  const [chemistryScore, setChemistryScore] = useState(30);
  const [isBlindMasked, setIsBlindMasked] = useState(true);
  const [matchCooldown, setMatchCooldown] = useState(0);
  const [matchesThisSession, setMatchesThisSession] = useState(0);
  const [omegleChat, setOmegleChat] = useState([]);
  const [matchRegion, setMatchRegion] = useState('Anywhere in the World');
  const [matchMode, setMatchMode] = useState('auto'); // auto | custom | partner
  const [customOpposite, setCustomOpposite] = useState(false);

  useEffect(() => {
    if (matchCooldown <= 0) return;
    const t = setInterval(() => setMatchCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [matchCooldown]);

  const [roomReactions, setRoomReactions] = useState([]);

  // ---------------- Existing 14 games' state ----------------
  const [wheelAngle, setWheelAngle] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const drawCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#ec4899');
  const [relayTimer, setRelayTimer] = useState(15);
  const [relayTurn, setRelayTurn] = useState('You');
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [triviaLives, setTriviaLives] = useState(3);
  const [triviaRound, setTriviaRound] = useState(1);
  const quizQuestion = { q: 'Which feature protects you from non-consensual reveals in VibeRoulette?', options: ['Blind Chemistry Mask', 'Neon Bunny Filter', 'Gold Crown', 'Soundboard'], answer: 0 };
  const [nheTally, setNheTally] = useState({ have: 4, haveNot: 9 });
  const [mostLikelyVotes, setMostLikelyVotes] = useState({ You: 1, KiraX: 5, DevSam: 2, Luna: 3 });
  const [wyrVotes, setWyrVotes] = useState({ a: 12, b: 8 });
  const [charadeGuess, setCharadeGuess] = useState('');
  const [wordChainInput, setWordChainInput] = useState('');
  const [wordChainTimer, setWordChainTimer] = useState(10);
  const [wordChainWords, setWordChainWords] = useState(['NEON', 'NIGHT']);
  const [karaokeRating, setKaraokeRating] = useState(0);
  const [pokerChips, setPokerChips] = useState(500);
  const [pokerPot, setPokerPot] = useState(120);
  const [vibeMatchStep, setVibeMatchStep] = useState(0);
  const [vibeMatchResult, setVibeMatchResult] = useState(null);

  // ---------------- Become a Star (singing) ----------------
  const [starSongSearch, setStarSongSearch] = useState('');
  const [starSelectedSong, setStarSelectedSong] = useState(null);
  const [starStage, setStarStage] = useState('pick'); // pick -> lobby -> performing -> result
  const [starCallMode, setStarCallMode] = useState('video');
  const [starGifts, setStarGifts] = useState([]);
  const [starScore, setStarScore] = useState(null);
  const [starLanguage, setStarLanguage] = useState('All');
  const [starDuration, setStarDuration] = useState(60);
  const [starIntermission, setStarIntermission] = useState(0);
  const [starCanResing, setStarCanResing] = useState(true);
  const [voiceRefs, setVoiceRefs] = useState([]);

  useEffect(() => {
    if (starStage !== 'intermission' || starIntermission <= 0) return;
    const t = setInterval(() => setStarIntermission((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [starStage, starIntermission]);

  // ---------------- Flirt Me ----------------
  const [flirtWheelAngle, setFlirtWheelAngle] = useState(0);
  const [flirtSpinning, setFlirtSpinning] = useState(false);
  const [flirtTarget, setFlirtTarget] = useState(null);
  const [flirtPrompt, setFlirtPrompt] = useState(null);

  // ---------------- Q&A Arena ----------------
  const [qaCategory, setQaCategory] = useState('Truth or Dare');
  const [qaCardFlipped, setQaCardFlipped] = useState(false);
  const [qaCurrentPrompt, setQaCurrentPrompt] = useState(QA_CATEGORIES['Truth or Dare'][0]);
  const [qaPoll, setQaPoll] = useState({ yes: 6, no: 3 });

  // ---------------- Avatar Studio ----------------
  const [avatar, setAvatar] = useState({ face: '🙂', hair: 'Short', outfit: 'Streetwear', aura: 'None' });

  // ---------------- Dating Hub ----------------
  const [datingProfile, setDatingProfile] = useState({
    zodiac: 'Leo', relationshipGoal: 'Long-term', lifestyleTags: ['#Fitness', '#Foodie'],
    bio: 'Adventure-seeker who loves deep conversations and karaoke nights.',
    privacy: { zodiac: true, goal: true, bio: true }
  });
  const [zodiacCompareSign, setZodiacCompareSign] = useState('Scorpio');

  // ---------------- Communities & Feed ----------------
  const [communities, setCommunities] = useState([
    { id: 'c1', name: 'Late Night Gamers', type: 'public', members: 4820, desc: 'Anyone can join and drop in.' },
    { id: 'c2', name: 'Vance Family & Close Friends', type: 'private', members: 12, desc: 'Invite-only circle.' },
    { id: 'c3', name: 'Bollywood Karaoke Club', type: 'public', members: 2310, desc: 'Sing, vote, repeat.' }
  ]);
  const [showCreateCommunity, setShowCreateCommunity] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: '', type: 'public' });

  const [feedPosts, setFeedPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [openCommentsFor, setOpenCommentsFor] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentDraft, setCommentDraft] = useState('');
  const [commentMentions, setCommentMentions] = useState([]);
  const [commentUploading, setCommentUploading] = useState(false);
  const commentFileRef = useRef(null);
  const [postDraft, setPostDraft] = useState('');
  const [postMentions, setPostMentions] = useState([]);

  const [lounges] = useState([
    { id: '1', title: 'Vibe Truth Wheel Party & Liar Game Night', host: 'Kira_Host', listeners: 142, tag: '🎮 Games Live', game: 'truth_wheel' },
    { id: '2', title: 'Vibe Sketch Speed Championship', host: 'ArtStudio', listeners: 98, tag: '🎨 Sketch', game: 'draw_guess' },
    { id: '3', title: "Liar's Bluff: Find the Impostor", host: 'Detective_Vibe', listeners: 180, tag: '🕵️ Impostor', game: 'liar_bluff' },
    { id: '4', title: 'Become a Star — Live Semifinals', host: 'MasterQuiz', listeners: 310, tag: '⭐ Singing', game: 'become_a_star' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => setNetStats({ ping: Math.floor(Math.random() * 8) + 12, fps: ultraPerformanceMode ? 60 : 45 }), 2000);
    return () => clearInterval(interval);
  }, [ultraPerformanceMode]);

  useEffect(() => { if (!activeGame || relayTimer <= 0) return; const t = setInterval(() => setRelayTimer((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, [activeGame, relayTimer]);
  useEffect(() => { if (!activeGame || wordChainTimer <= 0) return; const t = setInterval(() => setWordChainTimer((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, [activeGame, wordChainTimer]);

  const announceWinner = (gameName) => {
    const xp = Math.floor(Math.random() * 150) + 100;
    const coins = Math.floor(Math.random() * 80) + 40;
    const badge = Math.random() > 0.55 ? `Champion of ${gameName}` : null;
    setUserProfile((p) => ({ ...p, xp: p.xp + xp, vibesCount: p.vibesCount + coins, badges: badge ? [...p.badges, { id: Date.now(), name: badge, icon: '🏆', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: `Won ${gameName}` }] : p.badges }));
    setVibeCoins((c) => c + coins);
    setWinnerModal({ name: userProfile.name, xp, coins, badge, gameName });
  };

  const captureSnapToVault = (selector) => {
    const canvas = document.querySelector(selector);
    const dataUrl = canvas ? canvas.toDataURL('image/png') : null;
    setVaultMemories((v) => [{ id: 'v' + Date.now(), title: `AR Selfie #${selfieCount + 1}`, date: 'Just Now', category: 'Snap Filter', image: dataUrl, locked: false }, ...v]);
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
    setOmegleState('searching'); setChemistryScore(25); setOmegleChat([]);
    setTimeout(() => {
      const s = mockStrangers[Math.floor(Math.random() * mockStrangers.length)];
      setStrangerInfo(s); setOmegleState('connected');
      setMatchesThisSession((m) => m + 1);
    }, 1400);
  };
  const nextOmegleMatch = () => {
    const nextCount = matchesThisSession + 1;
    if (nextCount % 6 === 0) { setMatchCooldown(20); setOmegleState('idle'); setStrangerInfo(null); fireToast('🌙 Quick mindful pause — 20s before your next match'); return; }
    setOmegleState('searching'); setTimeout(() => startOmegleMatch(), 700);
  };
  const reportAndBlock = (name) => { setOmegleState('idle'); setStrangerInfo(null); fireToast(`🚫 ${name} blocked & reported. Safety team reviews within 15 minutes.`); };

  const spinTruthWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true); setWheelResult(null);
    setWheelAngle((a) => a + 1440 + Math.floor(Math.random() * 360));
    setTimeout(() => {
      const prompts = ['What is the biggest lie you ever told a crush?', 'If you could trade places with someone here, who?', 'Sing 10 seconds of a song or do 5 pushups!', 'What is your guilty pleasure video game?'];
      setWheelResult(prompts[Math.floor(Math.random() * prompts.length)]);
      setWheelSpinning(false);
      announceWinner('Vibe Truth Wheel');
    }, 2000);
  };

  const handleDrawStart = (e) => { setIsDrawing(true); const c = drawCanvasRef.current; if (!c) return; const ctx = c.getContext('2d'); const r = c.getBoundingClientRect(); ctx.beginPath(); ctx.moveTo(e.clientX - r.left, e.clientY - r.top); };
  const handleDrawMove = (e) => { if (!isDrawing) return; const c = drawCanvasRef.current; if (!c) return; const ctx = c.getContext('2d'); const r = c.getBoundingClientRect(); ctx.strokeStyle = drawColor; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineTo(e.clientX - r.left, e.clientY - r.top); ctx.stroke(); };
  const handleDrawEnd = () => setIsDrawing(false);

  const submitQuizAnswer = (idx) => { if (quizAnswered) return; setQuizAnswered(true); if (idx === quizQuestion.answer) announceWinner('Rapid Vibe Quiz'); };
  const answerTrivia = (correct) => { if (correct) { setTriviaRound((r) => r + 1); if (triviaRound >= 3) announceWinner('Trivia Royale'); } else setTriviaLives((l) => Math.max(0, l - 1)); };
  const triggerSoundFX = (n) => sendReaction(`🔊 ${n}`);
  const sendReaction = (emoji) => { const id = Date.now(); setRoomReactions((p) => [...p, { id, emoji, left: Math.random() * 80 + 10 }]); setTimeout(() => setRoomReactions((p) => p.filter((r) => r.id !== id)), 2500); };
  const sendGameVoice = (sec) => { setGameChat((c) => [...c, { id: Date.now(), type: 'voice', label: `🎙️ Voice message (${sec}s)` }]); fireToast('Voice message sent'); };
  const sendGameVibe = (label) => { setGameChat((c) => [...c, { id: Date.now(), type: 'vibe', label }]); sendReaction(label.split(' ')[0]); };
  const sendOmegleVoice = (sec) => setOmegleChat((c) => [...c, { id: Date.now(), type: 'voice', label: `🎙️ Voice message (${sec}s)` }]);
  const sendOmegleVibe = (label) => setOmegleChat((c) => [...c, { id: Date.now(), type: 'vibe', label }]);

  const openGame = (game) => {
    setActiveGame(game); setGameChat([]); setWheelResult(null); setQuizAnswered(false);
    setTriviaLives(3); setTriviaRound(1); setRelayTimer(15); setWordChainTimer(10);
    setKaraokeRating(0); setPokerChips(500); setVibeMatchStep(0); setVibeMatchResult(null);
    if (game.id === 'become_a_star') { setStarStage('pick'); setStarSelectedSong(null); setStarScore(null); setStarGifts([]); }
  };
  const runVibeMatchStep = () => { if (vibeMatchStep < 2) setVibeMatchStep((s) => s + 1); else { const r = Math.floor(Math.random() * 30) + 65; setVibeMatchResult(r); if (r > 80) announceWinner('Vibe Match Compatibility'); } };

  const buyAndSendGift = (gift, context) => {
    if (vibeCoins < gift.cost) { fireToast('Not enough Vibe Coins — visit the Gift Store to top up'); return; }
    setVibeCoins((c) => c - gift.cost);
    const entry = { id: Date.now(), label: `${gift.icon} sent a ${gift.name}` };
    if (context === 'star') setStarGifts((g) => [...g, entry]); else setGameChat((g) => [...g, { id: entry.id, type: 'gift', label: entry.label }]);
    sendReaction(gift.icon);
  };

  const finishPerformance = () => {
    const score = Math.floor(Math.random() * 30) + 70;
    setStarScore(score); setStarStage('result');
    if (score >= 85) announceWinner('Become a Star');
  };

  const toggleMention = (name) => setPostMentions((m) => m.includes(name) ? m.filter((n) => n !== name) : [...m, name]);
  const submitPost = async () => {
    if (!postDraft.trim() || !session) return;
    const text = postDraft;
    const mentions = postMentions;
    setPostDraft(''); setPostMentions([]);
    const { data, error } = await supabase
      .from('posts')
      .insert({ author_id: session.user.id, author_name: userProfile.name, text, mentions })
      .select()
      .single();
    if (error) { fireToast('Could not post — try again'); return; }
    setFeedPosts((p) => [{ id: data.id, user: data.author_name, text: data.text, comments: 0, mentions: data.mentions || [], reactions: {} }, ...p]);
  };
  const addPostReaction = async (postId, reactionId) => {
    if (!session) return;
    // Optimistic update first, since the UI expects an instant response.
    setFeedPosts((fp) => fp.map((x) => x.id === postId ? { ...x, reactions: { ...x.reactions, [reactionId]: (x.reactions[reactionId] || 0) + 1 } } : x));
    const { error } = await supabase.from('post_reactions').insert({ post_id: postId, user_id: session.user.id, reaction: reactionId });
    if (error) {
      // Most likely they already reacted with this emoji (unique constraint) — revert the optimistic bump.
      setFeedPosts((fp) => fp.map((x) => x.id === postId ? { ...x, reactions: { ...x.reactions, [reactionId]: Math.max(0, (x.reactions[reactionId] || 1) - 1) } } : x));
    }
  };

  // ---------------- Comments (mentions, reactions, media) ----------------
  const loadComments = async (postId) => {
    const { data: comments, error } = await supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    if (error || !comments) return;
    const commentIds = comments.map((c) => c.id);
    const { data: reactions } = await supabase.from('comment_reactions').select('comment_id, reaction').in('comment_id', commentIds.length ? commentIds : ['00000000-0000-0000-0000-000000000000']);
    const withReactions = comments.map((c) => {
      const mine = (reactions || []).filter((r) => r.comment_id === c.id);
      const reactionCounts = {};
      mine.forEach((r) => { reactionCounts[r.reaction] = (reactionCounts[r.reaction] || 0) + 1; });
      return { ...c, reactionCounts };
    });
    setCommentsByPost((m) => ({ ...m, [postId]: withReactions }));
  };

  const toggleCommentsFor = (postId) => {
    if (openCommentsFor === postId) { setOpenCommentsFor(null); return; }
    setOpenCommentsFor(postId);
    if (!commentsByPost[postId]) loadComments(postId);
  };

  const toggleCommentMention = (name) => setCommentMentions((m) => m.includes(name) ? m.filter((n) => n !== name) : [...m, name]);

  const handleCommentFileSelect = async (e, postId) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !session) return;
    if (file.size > 25 * 1024 * 1024) { fireToast('File too big — 25MB max'); return; }
    const mediaType = file.type.startsWith('video') ? 'video' : file.type === 'image/gif' ? 'gif' : 'image';
    setCommentUploading(true);
    const path = `${session.user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('comment-media').upload(path, file);
    if (uploadError) { fireToast('Upload failed — try again'); setCommentUploading(false); return; }
    const { data: urlData } = supabase.storage.from('comment-media').getPublicUrl(path);
    await submitComment(postId, { mediaUrl: urlData.publicUrl, mediaType });
    setCommentUploading(false);
  };

  const submitComment = async (postId, media) => {
    if (!session) return;
    if (!commentDraft.trim() && !media) return;
    const text = commentDraft;
    const mentions = commentMentions;
    setCommentDraft(''); setCommentMentions([]);
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: session.user.id,
        author_name: userProfile.name,
        text,
        mentions,
        media_url: media?.mediaUrl || null,
        media_type: media?.mediaType || null,
      })
      .select()
      .single();
    if (error) { fireToast('Could not comment — try again'); return; }
    setCommentsByPost((m) => ({ ...m, [postId]: [...(m[postId] || []), { ...data, reactionCounts: {} }] }));
    setFeedPosts((fp) => fp.map((p) => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
  };

  const addCommentReaction = async (postId, commentId, reactionId) => {
    if (!session) return;
    setCommentsByPost((m) => ({
      ...m,
      [postId]: (m[postId] || []).map((c) => c.id === commentId ? { ...c, reactionCounts: { ...c.reactionCounts, [reactionId]: (c.reactionCounts[reactionId] || 0) + 1 } } : c),
    }));
    const { error } = await supabase.from('comment_reactions').insert({ comment_id: commentId, user_id: session.user.id, reaction: reactionId });
    if (error) {
      setCommentsByPost((m) => ({
        ...m,
        [postId]: (m[postId] || []).map((c) => c.id === commentId ? { ...c, reactionCounts: { ...c.reactionCounts, [reactionId]: Math.max(0, (c.reactionCounts[reactionId] || 1) - 1) } } : c),
      }));
    }
  };

  const assignRelationship = (user, tag) => setUserProfile((p) => ({ ...p, relationships: [...p.relationships.filter((r) => r.user !== user), { user, tag }] }));

  const screenMin = Math.floor(screenSeconds / 60);
  const screenPct = Math.min(100, Math.round((screenMin / dailyLimitMin) * 100));
  const filteredSongs = SONG_CATALOG.filter((s) => s.title.toLowerCase().includes(starSongSearch.toLowerCase()) || s.genre.toLowerCase().includes(starSongSearch.toLowerCase()));

  // =========================================================================
  // AUTH / ONBOARDING GATE
  // =========================================================================
  if (authStep !== 'done') {
    return (
      <div className="h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-purple-500/30"><Sparkles className="w-8 h-8 text-white" /></div>
            <h1 className="font-extrabold text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">VIBESPACE</h1>
          </div>

          {authStep === 'signup' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 text-center">Sign up to connect with real, verified people.</p>
              <button onClick={handleGoogleAuth} className="w-full bg-slate-900 border border-slate-700 hover:border-purple-500/50 text-slate-100 font-bold text-sm py-3 rounded-xl">Continue with Google</button>
              {['Facebook', 'TikTok'].map((m) => (
                <button key={m} disabled title="OAuth not wired up yet" className="w-full bg-slate-900 border border-slate-800 text-slate-500 font-bold text-sm py-3 rounded-xl cursor-not-allowed">Continue with {m} (coming soon)</button>
              ))}
              <button onClick={() => { setAuthError(''); setSignupMethod('Email'); setAuthStep('profile'); }} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm py-3 rounded-xl">Continue with Email</button>
              <button onClick={() => { setAuthError(''); setAuthStep('login'); }} className="w-full text-slate-400 text-xs font-semibold text-center underline underline-offset-2">Already have an account? Log in</button>
              <p className="text-[10px] text-slate-500 text-center">By continuing you agree we'll verify you're a real, unique person before you can join calls, games, or VibeRoulette.</p>
            </div>
          )}

          {authStep === 'login' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 text-center">Log in to your VibeSpace account.</p>
              <input value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
              <input value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
              {authError && <p className="text-xs text-rose-400 text-center">{authError}</p>}
              <button onClick={handleLogin} disabled={authLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm py-3 rounded-xl disabled:opacity-50">{authLoading ? 'Logging in...' : 'Log In'}</button>
              <button onClick={() => { setAuthError(''); setAuthStep('signup'); }} className="w-full text-slate-400 text-xs font-semibold text-center underline underline-offset-2">Need an account? Sign up</button>
            </div>
          )}

          {authStep === 'profile' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 text-center">Signed up with {signupMethod}. Now create your account.</p>
              <input value={profileDraft.name} onChange={(e) => setProfileDraft({ ...profileDraft, name: e.target.value })} placeholder="Full name" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
              <input value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="Email" type="email" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
              <input value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="Password (min 8 characters)" type="password" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm" />
              <textarea value={profileDraft.bio} onChange={(e) => setProfileDraft({ ...profileDraft, bio: e.target.value })} placeholder="Short bio" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm h-20" />
              <div className="flex flex-wrap gap-2">
                {['#Gaming', '#Music', '#Anime', '#DeepTalks', '#Chill', '#Dating'].map((i) => (
                  <button key={i} onClick={() => setProfileDraft((p) => ({ ...p, interests: p.interests.includes(i) ? p.interests.filter((x) => x !== i) : [...p.interests, i] }))} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${profileDraft.interests.includes(i) ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{i}</button>
                ))}
              </div>
              {authError && <p className="text-xs text-rose-400 text-center">{authError}</p>}
              <button onClick={handleEmailSignup} disabled={!profileDraft.name || !authEmail || !authPassword || authLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm py-3 rounded-xl disabled:opacity-40">{authLoading ? 'Creating account...' : 'Create Account & Continue to Verification'}</button>
            </div>
          )}

          {authStep === 'verify' && (
            <div className="space-y-4 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-base">Liveness & Identity Check</h3>
              <p className="text-xs text-slate-400">We scan your face on camera to confirm you're a real, unique person — this keeps VibeSpace free of bots and catfish.</p>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${verifyProgress}%` }} /></div>
              <p className="text-[10px] text-slate-500">{verifyProgress < 100 ? 'Scanning...' : 'Verified ✅'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none relative">
      {toast && (<div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 border border-purple-500/40 text-slate-100 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-pulse"><Info className="w-4 h-4 text-purple-400" />{toast}</div>)}

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
            <div className="flex items-center justify-between"><h3 className="font-bold text-base flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cyan-400" /> Why this match?</h3><button onClick={() => setShowWhyMatch(false)}><X className="w-4 h-4 text-slate-500" /></button></div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• Shared interest tag: <span className="text-cyan-300 font-bold">{strangerInfo.sharedTags.join(', ')}</span></li>
              <li>• Safety Score: <span className="text-emerald-300 font-bold">{strangerInfo.safetyScore}/100</span></li>
              <li>• Identity: <span className={strangerInfo.verified ? 'text-emerald-300 font-bold' : 'text-amber-300 font-bold'}>{strangerInfo.verified ? 'Liveness Verified ✅' : 'Unverified — proceed with caution'}</span></li>
              <li>• Region: {strangerInfo.location} ({matchRegion})</li>
              <li>• Match mode: {matchMode === 'auto' ? 'Auto Compatibility' : matchMode === 'partner' ? 'Partner Finder' : 'Custom Search'}</li>
            </ul>
          </div>
        </div>
      )}

      {winnerModal && (
        <div className="fixed inset-0 z-[120] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-amber-400/60 rounded-3xl p-8 max-w-sm text-center space-y-3 relative overflow-hidden">
            <p className="text-4xl">🎉🏆🎊</p>
            <h3 className="font-black text-xl text-amber-300">You Won {winnerModal.gameName}!</h3>
            <div className="flex justify-center gap-4 text-xs font-bold">
              <span className="text-purple-300">+{winnerModal.xp} XP</span>
              <span className="text-amber-300">+{winnerModal.coins} Vibe Coins</span>
            </div>
            {winnerModal.badge && <p className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-4 py-2 rounded-xl">🏅 New badge unlocked: {winnerModal.badge}</p>}
            <button onClick={() => setWinnerModal(null)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl w-full">Nice!</button>
          </div>
        </div>
      )}

      {showCreateCommunity && (
        <div className="fixed inset-0 z-[105] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-7 max-w-sm w-full space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-bold text-base">Create Community</h3><button onClick={() => setShowCreateCommunity(false)}><X className="w-4 h-4 text-slate-500" /></button></div>
            <input value={newCommunity.name} onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })} placeholder="Community name" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm" />
            <div className="flex gap-2">
              <button onClick={() => setNewCommunity({ ...newCommunity, type: 'public' })} className={`flex-1 text-xs font-bold py-2.5 rounded-xl border ${newCommunity.type === 'public' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>🌐 Public — anyone can join</button>
              <button onClick={() => setNewCommunity({ ...newCommunity, type: 'private' })} className={`flex-1 text-xs font-bold py-2.5 rounded-xl border ${newCommunity.type === 'private' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>🔒 Private — invite only</button>
            </div>
            <button onClick={() => { if (newCommunity.name) { setCommunities((c) => [...c, { id: 'c' + Date.now(), name: newCommunity.name, type: newCommunity.type, members: 1, desc: 'Just created' }]); setShowCreateCommunity(false); setNewCommunity({ name: '', type: 'public' }); } }} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-2.5 rounded-xl">Create</button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between p-3 md:p-4 z-20 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-purple-500/30"><Sparkles className="w-6 h-6 text-white" /></div>
            <div className="hidden md:block">
              <h1 className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">VIBESPACE</h1>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400"><Wifi className="w-3 h-3 text-emerald-400" /><span>0-LAG ENGINE ({netStats.ping}ms)</span></div>
            </div>
          </div>
          <nav className="space-y-1">
            {[
              { id: 'vibestage', label: 'VibeStage Circles', icon: Radio },
              { id: 'omegle', label: 'VibeRoulette 1-on-1', icon: RefreshCw, highlight: true },
              { id: 'games', label: '36 VibeSpace Games', icon: Gamepad2, badge: 'PLAY' },
              { id: 'lens', label: 'AR Lens Studio', icon: Camera },
              { id: 'avatar', label: 'Avatar Studio', icon: Smile, badge: 'NEW' },
              { id: 'dating', label: 'Dating Hub', icon: Heart, badge: 'NEW' },
              { id: 'feed', label: 'Feed & Posts', icon: Rss },
              { id: 'communities', label: 'Communities', icon: Users },
              { id: 'vault', label: 'Vibe Vault', icon: HardDrive, highlight: true },
              { id: 'store', label: 'Gift Store', icon: Gift },
              { id: 'safety', label: 'Trust & Safety', icon: Shield },
              { id: 'wellbeing', label: 'Digital Wellbeing', icon: HeartHandshake },
              { id: 'profile', label: 'Profile & Badges', icon: Trophy }
            ].map((item) => {
              const Icon = item.icon; const isActive = activeTab === item.id;
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all relative ${isActive ? 'bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-transparent text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-slate-400'} ${item.highlight ? 'text-pink-400 animate-pulse' : ''}`} />
                  <span className="hidden md:block flex-1 text-left">{item.label}</span>
                  {item.badge && <span className="hidden md:inline-block text-[9px] font-black px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">{item.badge}</span>}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="space-y-2">
          <button onClick={() => { setGhostMode(!ghostMode); fireToast(ghostMode ? 'Ghost Mode off' : '👻 Ghost Mode on'); }} className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border ${ghostMode ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40' : 'bg-slate-800/50 text-slate-400 border-slate-700/60'}`}><Ghost className="w-4 h-4" /><span className="hidden md:inline">{ghostMode ? 'Ghost Mode: ON' : 'Ghost Mode: OFF'}</span></button>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white border-2 border-purple-400">{userProfile.name[0]}</div>
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1 rounded-full border border-slate-900">L{userProfile.level}</span>
                {userProfile.verified && <ShieldCheck className="w-4 h-4 text-emerald-400 absolute -top-1 -right-1 bg-slate-900 rounded-full" />}
              </div>
              <div className="hidden md:block overflow-hidden flex-1"><p className="text-sm font-bold truncate text-slate-200">{userProfile.name}</p><p className="text-xs text-amber-400 font-medium truncate">🪙 {vibeCoins} Coins</p></div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 relative overflow-y-auto">
        <header className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              {activeTab === 'vibestage' && 'VibeStage Circles'}
              {activeTab === 'omegle' && 'VibeRoulette 1-on-1'}
              {activeTab === 'games' && '36 VibeSpace Games'}
              {activeTab === 'lens' && 'AR Lens Studio'}
              {activeTab === 'avatar' && 'Avatar Studio'}
              {activeTab === 'dating' && 'Dating Hub & Compatibility'}
              {activeTab === 'feed' && 'Feed & Posts'}
              {activeTab === 'communities' && 'Communities'}
              {activeTab === 'vault' && 'Vibe Vault'}
              {activeTab === 'store' && 'Gift Store'}
              {activeTab === 'safety' && 'Trust & Safety Center'}
              {activeTab === 'wellbeing' && 'Digital Wellbeing Dashboard'}
              {activeTab === 'profile' && 'Profile, Relationships & Badges'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-xs"><Sparkles className="w-4 h-4 fill-amber-400" /><span>{userProfile.vibesCount} Vibe Sparks</span></div>
          </div>
        </header>

        {/* VIBESTAGE */}
        {activeTab === 'vibestage' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {lounges.map((room) => (
                <div key={room.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between group">
                  <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-slate-800 text-purple-400 border border-slate-700">{room.tag}</span><span className="text-xs text-emerald-400 font-medium">● {room.listeners} Active</span></div>
                  <div><h3 className="font-bold text-lg text-slate-100">{room.title}</h3><p className="text-xs text-slate-400 mt-1">Host: {room.host}</p></div>
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between"><span className="text-xs text-slate-400">{room.game}</span><button onClick={() => setActiveRoom(room)} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5"><span>Join Stage</span><Play className="w-3 h-3 fill-current" /></button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OMEGLE / VIBEROULETTE */}
        {activeTab === 'omegle' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div><h3 className="text-xl font-bold text-slate-100">VibeRoulette</h3><p className="text-xs text-slate-400 mt-1">Liveness-checked, safety-scored, and fully AR-filtered.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Region</label>
                  <select value={matchRegion} onChange={(e) => setMatchRegion(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 mt-1">
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase">Match Mode</label>
                  <select value={matchMode} onChange={(e) => setMatchMode(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 mt-1">
                    <option value="auto">Auto Compatibility Match</option>
                    <option value="partner">Partner Finder (relationship-focused)</option>
                    <option value="custom">Custom Search (choose interests)</option>
                  </select>
                </div>
                {matchMode === 'custom' && (
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Personality</label>
                    <button onClick={() => setCustomOpposite(!customOpposite)} className={`w-full mt-1 text-xs font-bold py-2 rounded-xl border ${customOpposite ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{customOpposite ? 'Opposite interests welcome' : 'Similar interests preferred'}</button>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">{omegleTags.map((tag) => (<button key={tag} onClick={() => setSelectedTag(tag)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${selectedTag === tag ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{tag}</button>))}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[380px]">
              <ARVideoPanel filter={selectedFilter} label="You" showFilterStrip onChangeFilter={setSelectedFilter} className="min-h-[380px]" />
              <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center min-h-[380px]">
                {omegleState === 'idle' && matchCooldown === 0 && (<button onClick={startOmegleMatch} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs px-8 py-3.5 rounded-2xl shadow-lg">Start Random Match</button>)}
                {matchCooldown > 0 && (<div className="space-y-2 text-center"><Hourglass className="w-8 h-8 text-indigo-300 mx-auto animate-pulse" /><p className="text-xs text-indigo-300 font-bold">Mindful pause: {matchCooldown}s</p></div>)}
                {omegleState === 'searching' && (<div className="space-y-3"><div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" /><p className="text-xs text-pink-300 font-bold">Matching on {selectedTag} in {matchRegion}...</p></div>)}
                {omegleState === 'connected' && strangerInfo && (
                  <div className="my-auto text-center space-y-2">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-tr ${strangerInfo.avatarColor} flex items-center justify-center text-3xl font-black text-white mx-auto shadow-xl relative`}>{strangerInfo.name[0]}{strangerInfo.verified && <ShieldCheck className="w-5 h-5 text-emerald-400 bg-slate-900 rounded-full absolute -top-1 -right-1" />}</div>
                    <h4 className="font-bold text-lg text-slate-100">{strangerInfo.name}</h4><p className="text-xs text-slate-400">{strangerInfo.location}</p>
                    <button onClick={() => setShowWhyMatch(true)} className="text-[10px] text-cyan-300 underline flex items-center gap-1 mx-auto"><Info className="w-3 h-3" /> Why this match?</button>
                  </div>
                )}
              </div>
            </div>

            {omegleState === 'connected' && (
              <>
                <VoiceVibeBar onSendVoice={sendOmegleVoice} onSendVibe={sendOmegleVibe} />
                {omegleChat.length > 0 && (<div className="flex flex-wrap gap-2">{omegleChat.slice(-6).map((m) => (<span key={m.id} className={`text-[11px] font-bold px-3 py-1.5 rounded-xl ${m.type === 'voice' ? 'bg-slate-800 text-slate-300' : 'bg-purple-600/30 text-purple-200 border border-purple-500/40'}`}>{m.label}</span>))}</div>)}
                <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setIsBlindMasked(!isBlindMasked)} className="bg-purple-600/30 text-purple-300 border border-purple-500/40 px-4 py-2 rounded-xl text-xs font-bold">🎭 Blind Mask: {isBlindMasked ? 'ON' : 'OFF'}</button>
                    <button onClick={() => reportAndBlock(strangerInfo.name)} className="bg-slate-800 text-rose-300 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><UserX className="w-3.5 h-3.5" /> Block & Report</button>
                    <button onClick={() => setShowPanic(true)} className="bg-rose-600/20 text-rose-400 border border-rose-500/50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Panic Exit</button>
                  </div>
                  <button onClick={nextOmegleMatch} className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2"><SkipForward className="w-4 h-4" /><span>Next</span></button>
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

        {/* AR LENS STUDIO */}
        {activeTab === 'lens' && (
          <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-200">Live Camera + AR Filters</h3>
                <div className="snap-canvas"><ARVideoPanel filter={selectedFilter} showFilterStrip onChangeFilter={setSelectedFilter} className="aspect-video" /></div>
                <button onClick={() => captureSnapToVault('.snap-canvas canvas')} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center justify-center gap-2"><Camera className="w-4 h-4" /><span>Snap Selfie ({selfieCount.toLocaleString()} taken)</span></button>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-200">Lens Studio Photo Editor</h3>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <canvas ref={lensCanvasRef} className="w-full rounded-xl border border-slate-800" />
                  <label className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold py-2.5 rounded-xl cursor-pointer">
                    <Upload className="w-4 h-4" /> Import Photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleLensUpload} />
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto">{FILTERS.map((f) => (<button key={f.id} onClick={() => setLensFilter(f.id)} className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold border ${lensFilter === f.id ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>{f.icon} {f.name}</button>))}</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-slate-400" /><span className="text-[10px] text-slate-400 w-16">Brightness</span><input type="range" min="50" max="150" value={lensBrightness} onChange={(e) => setLensBrightness(Number(e.target.value))} className="flex-1 accent-purple-500" /></div>
                    <div className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-slate-400" /><span className="text-[10px] text-slate-400 w-16">Contrast</span><input type="range" min="50" max="150" value={lensContrast} onChange={(e) => setLensContrast(Number(e.target.value))} className="flex-1 accent-purple-500" /></div>
                    <div className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-slate-400" /><span className="text-[10px] text-slate-400 w-16">Saturation</span><input type="range" min="0" max="200" value={lensSaturate} onChange={(e) => setLensSaturate(Number(e.target.value))} className="flex-1 accent-purple-500" /></div>
                    <div className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-slate-400" /><span className="text-[10px] text-slate-400 w-16">Beauty</span><input type="range" min="0" max="100" value={lensBeauty} onChange={(e) => setLensBeauty(Number(e.target.value))} className="flex-1 accent-purple-500" /></div>
                    <div className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-slate-400" /><span className="text-[10px] text-slate-400 w-16">Warmth</span><input type="range" min="0" max="60" value={lensWarmth} onChange={(e) => setLensWarmth(Number(e.target.value))} className="flex-1 accent-purple-500" /></div>
                  </div>
                  <div className="flex gap-2 items-center"><Type className="w-3.5 h-3.5 text-slate-400" /><input value={lensText} onChange={(e) => setLensText(e.target.value)} placeholder="Add caption text" className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs" /></div>
                  <div className="flex gap-1.5 flex-wrap">{['✨', '🔥', '💖', '👑', '🐰', '🎉'].map((e) => (<button key={e} onClick={() => addLensSticker(e)} className="bg-slate-800 hover:bg-purple-600/40 text-lg px-2 py-1 rounded-lg">{e}</button>))}</div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500">Backdrop tint</p>
                    <div className="flex gap-1.5">{['none', '#a855f7', '#ec4899', '#f59e0b', '#06b6d4'].map((c) => (<button key={c} onClick={() => setLensBackdrop(c)} className={`w-6 h-6 rounded-full border-2 ${lensBackdrop === c ? 'border-white' : 'border-slate-700'}`} style={{ backgroundColor: c === 'none' ? '#1e293b' : c }} />))}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setLensStickers([]); setLensText(''); setLensBeauty(0); setLensWarmth(0); setLensBackdrop('none'); }} className="flex-1 bg-slate-800 text-xs font-bold py-2.5 rounded-xl">Reset Edits</button>
                    <button onClick={saveLensToVault} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-2.5 rounded-xl">Save to Vault</button>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center">More layers, adjustments, and sticker packs than the usual lens apps — all reusable across VibeRoulette, dating matches, games, and stages.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AVATAR STUDIO */}
        {activeTab === 'avatar' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex items-center justify-center">
                <div className={`relative w-48 h-48 rounded-full flex items-center justify-center text-7xl ${avatar.aura !== 'None' ? 'ring-8' : ''} ${avatar.aura === 'Neon Pink' ? 'ring-pink-500' : avatar.aura === 'Golden' ? 'ring-amber-400' : avatar.aura === 'Cyan Glow' ? 'ring-cyan-400' : avatar.aura === 'Violet Mist' ? 'ring-purple-500' : ''}`} style={{ background: 'radial-gradient(circle, #312e81, #1e1b4b)' }}>
                  {avatar.face}
                </div>
              </div>
              <div className="space-y-4">
                <div><p className="text-xs font-bold text-slate-300 mb-1.5">Face Expression</p><div className="flex gap-2 flex-wrap">{AVATAR_OPTIONS.face.map((f) => (<button key={f} onClick={() => setAvatar({ ...avatar, face: f })} className={`text-2xl p-2 rounded-xl border ${avatar.face === f ? 'bg-purple-600/30 border-purple-500' : 'bg-slate-800 border-slate-700'}`}>{f}</button>))}</div></div>
                <div><p className="text-xs font-bold text-slate-300 mb-1.5">Hair Style</p><div className="flex gap-2 flex-wrap">{AVATAR_OPTIONS.hair.map((h) => (<button key={h} onClick={() => setAvatar({ ...avatar, hair: h })} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border ${avatar.hair === h ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{h}</button>))}</div></div>
                <div><p className="text-xs font-bold text-slate-300 mb-1.5">Outfit</p><div className="flex gap-2 flex-wrap">{AVATAR_OPTIONS.outfit.map((o) => (<button key={o} onClick={() => setAvatar({ ...avatar, outfit: o })} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border ${avatar.outfit === o ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{o}</button>))}</div></div>
                <div><p className="text-xs font-bold text-slate-300 mb-1.5">Glowing Aura</p><div className="flex gap-2 flex-wrap">{AVATAR_OPTIONS.aura.map((a) => (<button key={a} onClick={() => setAvatar({ ...avatar, aura: a })} className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border ${avatar.aura === a ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{a}</button>))}</div></div>
                <button onClick={() => fireToast('Avatar saved to your profile')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-2.5 rounded-xl">Save Avatar</button>
                <p className="text-[10px] text-slate-500">This is a stylized 2D layered avatar. A true sculpted 3D avatar (like Ready Player Me) needs a real 3D engine integration — this demonstrates the full customization flow.</p>
              </div>
            </div>
          </div>
        )}

        {/* DATING HUB */}
        {activeTab === 'dating' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-100">Your Dating Profile</h3>
              <div className="flex items-center justify-between"><label className="text-xs text-slate-400">Zodiac Sign</label><select value={datingProfile.zodiac} onChange={(e) => setDatingProfile({ ...datingProfile, zodiac: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">{ZODIAC_SIGNS.map((z) => <option key={z}>{z}</option>)}</select></div>
              <div className="flex items-center justify-between"><label className="text-xs text-slate-400">Relationship Goal</label><select value={datingProfile.relationshipGoal} onChange={(e) => setDatingProfile({ ...datingProfile, relationshipGoal: e.target.value })} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">{['Long-term', 'Something casual', 'Not sure yet', 'Friends first'].map((g) => <option key={g}>{g}</option>)}</select></div>
              <textarea value={datingProfile.bio} onChange={(e) => setDatingProfile({ ...datingProfile, bio: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm h-20" />
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Privacy — make each field public or hidden</p>
                {['zodiac', 'goal', 'bio'].map((f) => (
                  <div key={f} className="flex justify-between items-center"><span className="text-xs text-slate-400 capitalize">{f}</span><button onClick={() => setDatingProfile({ ...datingProfile, privacy: { ...datingProfile.privacy, [f]: !datingProfile.privacy[f] } })} className={`text-[10px] font-bold px-3 py-1 rounded-lg border ${datingProfile.privacy[f] ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{datingProfile.privacy[f] ? 'Public' : 'Hidden'}</button></div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-100">Zodiac Compatibility</h3>
              <div className="flex items-center gap-3"><span className="text-xs text-slate-400">Compare with:</span><select value={zodiacCompareSign} onChange={(e) => setZodiacCompareSign(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">{ZODIAC_SIGNS.map((z) => <option key={z}>{z}</option>)}</select></div>
              {(() => {
                const idxA = ZODIAC_SIGNS.indexOf(datingProfile.zodiac), idxB = ZODIAC_SIGNS.indexOf(zodiacCompareSign);
                const score = 100 - (Math.abs(idxA - idxB) * 6) % 45;
                return (
                  <div className="text-center space-y-2">
                    <p className="text-4xl font-black text-pink-400">{score}%</p>
                    <p className="text-xs text-slate-400">{ZODIAC_TRAITS[datingProfile.zodiac]} + {ZODIAC_TRAITS[zodiacCompareSign]}</p>
                    <span className="inline-block bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-xl">{ZODIAC_TRAITS[datingProfile.zodiac]}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* FEED */}
        {activeTab === 'feed' && (
          <div className="p-6 max-w-2xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <textarea value={postDraft} onChange={(e) => setPostDraft(e.target.value)} placeholder="Share an update, a feeling, a photo caption..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm h-20" />
              <div className="flex items-center gap-2 flex-wrap"><AtSign className="w-4 h-4 text-slate-500" /><span className="text-[10px] text-slate-500">Tag people:</span>{MOCK_USERS.map((u) => (<button key={u} onClick={() => toggleMention(u)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${postMentions.includes(u) ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>@{u}</button>))}</div>
              <button onClick={submitPost} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-2.5 rounded-xl">Post</button>
            </div>
            <div className="space-y-4">
              {feedLoading && <p className="text-xs text-slate-500 text-center">Loading feed...</p>}
              {!feedLoading && feedPosts.length === 0 && <p className="text-xs text-slate-500 text-center">No posts yet — be the first to share something.</p>}
              {feedPosts.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">{p.user[0]}</div><span className="text-sm font-bold text-slate-200">{p.user}</span></div>
                  <p className="text-sm text-slate-300">{p.text}</p>
                  {p.mentions.length > 0 && <p className="text-[10px] text-cyan-300">Tagged: {p.mentions.map((m) => `@${m}`).join(', ')}</p>}
                  {Object.keys(p.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">{Object.entries(p.reactions).map(([rid, count]) => { const r = REACTIONS.find((x) => x.id === rid); return <span key={rid} className="text-[10px] font-bold bg-slate-800 px-2 py-1 rounded-lg text-slate-300">{r ? r.icon : ''} {count}</span>; })}</div>
                  )}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex flex-wrap gap-1">{REACTIONS.map((r) => (<button key={r.id} title={r.label} onClick={() => addPostReaction(p.id, r.id)} className="text-base hover:scale-125 transition-transform">{r.icon}</button>))}</div>
                    <button onClick={() => toggleCommentsFor(p.id)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300"><MessageSquare className="w-3.5 h-3.5" /> {p.comments}</button>
                  </div>

                  {openCommentsFor === p.id && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
                      {(commentsByPost[p.id] || []).map((c) => (
                        <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5">
                          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">{c.author_name[0]}</div><span className="text-xs font-bold text-slate-200">{c.author_name}</span></div>
                          {c.text && <p className="text-xs text-slate-300">{c.text}</p>}
                          {c.mentions?.length > 0 && <p className="text-[10px] text-cyan-300">Tagged: {c.mentions.map((m) => `@${m}`).join(', ')}</p>}
                          {c.media_url && c.media_type === 'video' && <video src={c.media_url} controls className="rounded-lg max-h-52 w-full object-cover" />}
                          {c.media_url && c.media_type !== 'video' && <img src={c.media_url} alt="comment media" className="rounded-lg max-h-52 w-full object-cover" />}
                          {Object.keys(c.reactionCounts || {}).length > 0 && (
                            <div className="flex flex-wrap gap-1.5">{Object.entries(c.reactionCounts).map(([rid, count]) => { const r = REACTIONS.find((x) => x.id === rid); return <span key={rid} className="text-[9px] font-bold bg-slate-800 px-1.5 py-0.5 rounded-lg text-slate-300">{r ? r.icon : ''} {count}</span>; })}</div>
                          )}
                          <div className="flex flex-wrap gap-1">{REACTIONS.map((r) => (<button key={r.id} title={r.label} onClick={() => addCommentReaction(p.id, c.id, r.id)} className="text-xs hover:scale-125 transition-transform">{r.icon}</button>))}</div>
                        </div>
                      ))}
                      {(commentsByPost[p.id] || []).length === 0 && <p className="text-[10px] text-slate-500">No comments yet — say something.</p>}

                      <div className="space-y-2">
                        <textarea value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} placeholder="Write a comment..." className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs h-14" />
                        <div className="flex items-center gap-2 flex-wrap"><AtSign className="w-3.5 h-3.5 text-slate-500" />{MOCK_USERS.map((u) => (<button key={u} onClick={() => toggleCommentMention(u)} className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${commentMentions.includes(u) ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>@{u}</button>))}</div>
                        <input ref={commentFileRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => handleCommentFileSelect(e, p.id)} />
                        <div className="flex items-center gap-2">
                          <button onClick={() => commentFileRef.current?.click()} disabled={commentUploading} className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold px-3 py-2 rounded-xl disabled:opacity-50">{commentUploading ? 'Uploading...' : '📎 Photo / GIF / Video'}</button>
                          <button onClick={() => submitComment(p.id)} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold py-2 rounded-xl">Comment</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMMUNITIES */}
        {activeTab === 'communities' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="flex justify-between items-center"><p className="text-xs text-slate-400">Public communities anyone can join, or private ones just for friends & family.</p><button onClick={() => setShowCreateCommunity(true)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Create</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communities.map((c) => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex justify-between items-start"><h4 className="font-bold text-sm text-slate-100">{c.name}</h4>{c.type === 'private' ? <LockIcon className="w-4 h-4 text-amber-400" /> : <Globe className="w-4 h-4 text-emerald-400" />}</div>
                  <p className="text-xs text-slate-400">{c.desc}</p>
                  <div className="flex justify-between items-center pt-2"><span className="text-[10px] text-slate-500">{c.members.toLocaleString()} members</span><button onClick={() => fireToast(c.type === 'private' ? 'Request sent to community admins' : `Joined ${c.name}`)} className="bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">{c.type === 'private' ? 'Request to Join' : 'Join'}</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VAULT */}
        {activeTab === 'vault' && (
          <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <h3 className="text-lg font-bold text-slate-100">🔒 Vibe Vault</h3>
              <div className="flex items-center gap-2 flex-wrap">{['All', 'Snap Filter', 'VibeRoulette', 'Time Capsule'].map((t) => (<button key={t} onClick={() => setSelectedVaultTag(t)} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedVaultTag === t ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>{t}</button>))}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {vaultMemories.filter((m) => selectedVaultTag === 'All' || m.category === selectedVaultTag).map((mem) => (
                <div key={mem.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group flex flex-col justify-between">
                  {mem.locked ? (<div className="h-44 bg-slate-950 flex flex-col items-center justify-center p-6 text-center"><Lock className="w-8 h-8 text-amber-400 mb-2 animate-bounce" /><h4 className="font-bold text-sm text-slate-200">{mem.title}</h4><p className="text-xs text-amber-400 mt-1 font-semibold">{mem.date}</p></div>)
                    : (<div className="h-44 bg-slate-950 relative overflow-hidden">{mem.image ? <img src={mem.image} alt={mem.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">📸</div>}<span className="absolute top-3 left-3 bg-slate-950/80 text-purple-300 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-800">{mem.category}</span></div>)}
                  <div className="p-4"><h4 className="font-bold text-sm text-slate-100">{mem.title}</h4><p className="text-[10px] text-slate-400 mt-0.5">{mem.date}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GIFT STORE */}
        {activeTab === 'store' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 flex justify-between items-center"><p className="text-sm font-bold text-slate-200">Your balance</p><p className="text-2xl font-black text-amber-300">🪙 {vibeCoins}</p></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[100, 500, 1200].map((amt) => (<button key={amt} onClick={() => { setVibeCoins((c) => c + amt); fireToast(`Purchased ${amt} Vibe Coins (mock)`); }} className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 text-center"><p className="text-2xl font-black text-purple-300">{amt}</p><p className="text-[10px] text-slate-500">Vibe Coins</p></button>))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {GIFT_CATALOG.map((g) => (<div key={g.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-1"><p className="text-3xl">{g.icon}</p><p className="text-xs font-bold text-slate-200">{g.name}</p><p className="text-[10px] text-amber-400">{g.cost} coins</p></div>))}
            </div>
          </div>
        )}

        {/* SAFETY */}
        {activeTab === 'safety' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2"><ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" /><h4 className="font-bold text-sm">Liveness Verified</h4><p className="text-[10px] text-slate-400">Every profile passes a face-match scan.</p></div>
              <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 text-center space-y-2"><Ghost className="w-8 h-8 text-indigo-300 mx-auto" /><h4 className="font-bold text-sm">Ghost Mode</h4><p className="text-[10px] text-slate-400">Browse invisibly, no read receipts.</p></div>
              <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 text-center space-y-2"><Siren className="w-8 h-8 text-rose-400 mx-auto" /><h4 className="font-bold text-sm">One-Tap Panic Exit</h4><p className="text-[10px] text-slate-400">Instantly leave, block, and flag for review.</p></div>
            </div>
          </div>
        )}

        {/* WELLBEING */}
        {activeTab === 'wellbeing' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between"><h3 className="font-bold text-base flex items-center gap-2"><Timer className="w-4 h-4 text-indigo-300" /> Today's Screen Time</h3><span className="text-xs font-bold text-slate-300">{screenMin} / {dailyLimitMin} min</span></div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full ${screenPct > 90 ? 'bg-rose-500' : screenPct > 60 ? 'bg-amber-400' : 'bg-emerald-400'} transition-all`} style={{ width: `${screenPct}%` }} /></div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3"><h3 className="font-bold text-sm">Adjust your daily goal</h3><input type="range" min="30" max="240" step="15" value={dailyLimitMin} onChange={(e) => setDailyLimitMin(Number(e.target.value))} className="w-full accent-purple-500" /><p className="text-xs text-slate-400">Goal: {dailyLimitMin} minutes/day</p></div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-6 flex-wrap">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-black text-white shadow-xl relative">{userProfile.name[0]}{userProfile.verified && <ShieldCheck className="w-6 h-6 text-emerald-400 bg-slate-900 rounded-full absolute -bottom-1 -right-1" />}</div>
              <div className="flex-1"><h3 className="text-xl font-bold text-slate-100">{userProfile.name}</h3><p className="text-xs text-purple-400 mt-1">{userProfile.activeBadge}</p></div>
              <button
                onClick={handleLogout}
                className="bg-slate-800 border border-slate-700 hover:border-rose-500/50 text-rose-300 text-xs font-bold px-4 py-2 rounded-xl"
              >Log Out</button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-pink-400" /> Your People</h3>
              {userProfile.relationships.map((r) => (<div key={r.user} className="flex justify-between items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs"><span className="text-slate-300">{r.user}</span><span className="text-pink-300 font-bold">{r.tag}</span></div>))}
              <div className="flex gap-2 flex-wrap pt-2">
                {MOCK_USERS.slice(0, 4).map((u) => (
                  <div key={u} className="flex items-center gap-1">
                    <select onChange={(e) => e.target.value && assignRelationship(u, e.target.value)} defaultValue="" className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] text-slate-300">
                      <option value="" disabled>Tag {u} as...</option>
                      {RELATIONSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.badges.map((b) => (<div key={b.id} className={`p-4 rounded-2xl border ${b.color} flex items-center gap-4`}><div className="text-3xl bg-slate-950/40 p-3 rounded-2xl">{b.icon}</div><div><h5 className="font-bold text-sm text-slate-100">{b.name}</h5><p className="text-xs text-slate-400 mt-0.5">{b.desc}</p></div></div>))}
            </div>
          </div>
        )}
      </main>

      {/* VIBESTAGE OVERLAY */}
      {activeRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" /><div><h3 className="font-bold text-lg text-slate-100">{activeRoom.title}</h3><p className="text-xs text-slate-400">Host: {activeRoom.host}</p></div></div>
            <div className="flex gap-2"><button onClick={() => setShowPanic(true)} className="bg-slate-900 border border-rose-500/40 text-rose-400 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Panic</button><button onClick={() => setActiveRoom(null)} className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl">Leave Stage</button></div>
          </div>
          <div className="my-auto max-w-4xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ name: activeRoom.host, isSelf: false }, { name: userProfile.name, isSelf: true }, { name: 'DevSam', isSelf: false }, { name: 'Luna', isSelf: false }].map((sp, idx) => (
              <ParticipantTile key={idx} name={sp.name} isSelf={sp.isSelf} filter={selectedFilter} onChangeFilter={setSelectedFilter} speaking={idx === 0} />
            ))}
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {[{ name: 'Airhorn', emoji: '📢' }, { name: 'Cheer', emoji: '🎉' }, { name: 'Laugh', emoji: '😂' }, { name: 'Drumroll', emoji: '🥁' }].map((s) => (<button key={s.name} onClick={() => triggerSoundFX(s.name)} className="bg-slate-900 border border-slate-800 text-xs font-bold px-3 py-2 rounded-xl text-slate-300">{s.emoji} {s.name}</button>))}
          </div>
          {roomReactions.map((r) => (<span key={r.id} className="fixed bottom-24 text-2xl animate-bounce pointer-events-none" style={{ left: `${r.left}%` }}>{r.emoji}</span>))}
        </div>
      )}

      {/* GAME ROOM OVERLAY */}
      {activeGame && (
        <div className="fixed inset-0 z-50 bg-slate-950/97 backdrop-blur-xl flex flex-col p-4 md:p-6 overflow-y-auto">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-3"><span className="text-2xl">{activeGame.icon}</span><div><h3 className="font-bold text-lg text-slate-100">{activeGame.name}</h3><p className="text-xs text-slate-400">{activeGame.desc}</p></div></div>
            <div className="flex gap-2 items-center flex-wrap">
              <button onClick={() => setGameCallMode(gameCallMode === 'video' ? 'voice' : 'video')} className="bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5">{gameCallMode === 'video' ? <Video className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}{gameCallMode === 'video' ? 'Video Chat ON' : 'Voice Only'}</button>
              <button onClick={() => setShowPanic(true)} className="bg-slate-900 border border-rose-500/40 text-rose-400 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"><Siren className="w-3.5 h-3.5" /> Panic</button>
              <button onClick={() => setActiveGame(null)} className="bg-rose-600 text-white font-bold text-xs px-4 py-2 rounded-xl">Leave Game</button>
            </div>
          </div>

          {/* Large "everyone's face" video/voice grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <ParticipantTile name={userProfile.name} isSelf filter={gameFilter} onChangeFilter={setGameFilter} />
            {gameCallMode === 'video' ? (
              ['KiraX', 'DevSam', 'Luna'].map((n) => <ParticipantTile key={n} name={n} filter={gameFilter} speaking={n === 'KiraX'} />)
            ) : (
              ['KiraX', 'DevSam', 'Luna'].map((n) => (
                <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl aspect-video flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg font-black text-white">{n[0]}</div>
                  <span className="text-[10px] text-slate-400 font-bold">{n} • voice only</span>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
            <div className="lg:col-span-1 space-y-3">
              <VoiceVibeBar onSendVoice={sendGameVoice} onSendVibe={sendGameVibe} />
              <div className="flex flex-wrap gap-1.5">{GIFT_CATALOG.slice(0, 3).map((g) => (<button key={g.id} onClick={() => buyAndSendGift(g, 'game')} className="bg-slate-900 border border-slate-800 text-[10px] font-bold px-2 py-1.5 rounded-lg text-slate-300">{g.icon} {g.cost}</button>))}</div>
              {gameChat.length > 0 && (<div className="flex flex-wrap gap-2">{gameChat.slice(-8).map((m) => (<span key={m.id} className={`text-[11px] font-bold px-3 py-1.5 rounded-xl ${m.type === 'voice' ? 'bg-slate-800 text-slate-300' : 'bg-purple-600/30 text-purple-200 border border-purple-500/40'}`}>{m.label}</span>))}</div>)}
            </div>

            <div className="lg:col-span-2 bg-slate-900 border border-purple-500/30 rounded-3xl p-6 flex flex-col justify-center">
              {activeGame.id === 'truth_wheel' && (
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 rounded-full border-8 border-purple-500 border-t-pink-500 border-b-cyan-500 mx-auto flex items-center justify-center text-4xl shadow-2xl transition-transform duration-1000" style={{ transform: `rotate(${wheelAngle}deg)` }}>🎯</div>
                  {wheelResult && <p className="bg-purple-900/30 border border-purple-500/40 p-3 rounded-xl text-xs font-bold text-slate-200 max-w-md mx-auto">{wheelResult}</p>}
                  <button onClick={spinTruthWheel} disabled={wheelSpinning} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs px-8 py-3 rounded-xl">{wheelSpinning ? 'Spinning...' : 'Spin Wheel'}</button>
                </div>
              )}
              {(activeGame.id === 'draw_guess' || activeGame.id === 'doodle_relay') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs flex-wrap gap-2"><span className="font-bold text-pink-400">{activeGame.id === 'doodle_relay' ? `Relay turn: ${relayTurn} — ${relayTimer}s left` : 'Secret Word: CYBERPUNK'}</span><div className="flex gap-2">{['#ec4899', '#38bdf8', '#eab308', '#22c55e', '#ffffff'].map((c) => (<button key={c} onClick={() => setDrawColor(c)} className="w-5 h-5 rounded-full border border-slate-700" style={{ backgroundColor: c }} />))}</div></div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl h-64 overflow-hidden"><canvas ref={drawCanvasRef} width={600} height={256} onMouseDown={handleDrawStart} onMouseMove={handleDrawMove} onMouseUp={handleDrawEnd} className="w-full h-full cursor-crosshair" /></div>
                  {activeGame.id === 'doodle_relay' && relayTimer === 0 && (<button onClick={() => { setRelayTurn(relayTurn === 'You' ? 'KiraX' : 'You'); setRelayTimer(15); announceWinner('Speed Doodle Relay'); }} className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl w-full">Pass Canvas / Finish</button>)}
                </div>
              )}
              {activeGame.id === 'liar_bluff' && (<div className="text-center space-y-3"><p className="text-xs text-slate-400">Find the impostor before time runs out.</p><div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 text-xs font-bold text-amber-300">Your role: Civilian</div><div className="grid grid-cols-3 gap-2">{['KiraX', 'DevSam', 'Luna'].map((n) => (<button key={n} onClick={() => { fireToast(`Voted ${n}`); announceWinner("Liar's Bluff"); }} className="bg-slate-800 hover:bg-rose-600/40 text-xs font-bold py-2 rounded-xl text-slate-200">Vote {n}</button>))}</div></div>)}
              {activeGame.id === 'quiz_battle' && (<div className="space-y-4 text-center"><p className="text-sm font-bold text-slate-100">{quizQuestion.q}</p><div className="grid grid-cols-2 gap-3 max-w-md mx-auto">{quizQuestion.options.map((opt, i) => (<button key={i} onClick={() => submitQuizAnswer(i)} className="bg-slate-800 hover:bg-purple-600 text-slate-200 text-xs font-bold py-3 rounded-xl">{opt}</button>))}</div>{quizAnswered && <p className="text-xs text-emerald-400 font-bold">Answer locked in!</p>}</div>)}
              {activeGame.id === 'never_have_i' && (<div className="text-center space-y-4"><p className="text-sm font-bold text-slate-100">"Never have I ever... texted an ex at 2am"</p><div className="flex justify-center gap-3"><button onClick={() => setNheTally((t) => ({ ...t, have: t.have + 1 }))} className="bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold px-5 py-3 rounded-xl">🙋 I Have ({nheTally.have})</button><button onClick={() => setNheTally((t) => ({ ...t, haveNot: t.haveNot + 1 }))} className="bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-5 py-3 rounded-xl">🙅 Never ({nheTally.haveNot})</button></div></div>)}
              {activeGame.id === 'most_likely' && (<div className="space-y-3 text-center"><p className="text-sm font-bold text-slate-100">"Most likely to fall asleep on a call"</p>{Object.entries(mostLikelyVotes).map(([n, v]) => (<div key={n} className="flex items-center gap-3"><button onClick={() => setMostLikelyVotes((m) => ({ ...m, [n]: m[n] + 1 }))} className="text-xs font-bold text-slate-300 w-20 text-left">{n}</button><div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${v * 10}%` }} /></div><span className="text-xs text-slate-400 w-6">{v}</span></div>))}</div>)}
              {activeGame.id === 'would_you_rather' && (<div className="space-y-4 text-center"><p className="text-sm font-bold text-slate-100">Would you rather...</p><div className="grid grid-cols-2 gap-3"><button onClick={() => setWyrVotes((v) => ({ ...v, a: v.a + 1 }))} className="bg-slate-800 hover:bg-cyan-600/30 border border-slate-700 text-xs font-bold py-4 rounded-xl text-slate-200">🌍 Travel with no money<br /><span className="text-cyan-300">{wyrVotes.a} votes</span></button><button onClick={() => setWyrVotes((v) => ({ ...v, b: v.b + 1 }))} className="bg-slate-800 hover:bg-pink-600/30 border border-slate-700 text-xs font-bold py-4 rounded-xl text-slate-200">🏠 Stay home, unlimited money<br /><span className="text-pink-300">{wyrVotes.b} votes</span></button></div></div>)}
              {activeGame.id === 'emoji_charades' && (<div className="space-y-4 text-center"><p className="text-3xl">🦁👑🌍</p><input value={charadeGuess} onChange={(e) => setCharadeGuess(e.target.value)} placeholder="Type your guess..." className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 w-full max-w-xs mx-auto" /><button onClick={() => { const correct = charadeGuess.toLowerCase().includes('lion king'); fireToast(correct ? '🎉 Correct!' : 'Not quite'); if (correct) announceWinner('Emoji Charades'); setCharadeGuess(''); }} className="bg-purple-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl">Submit Guess</button></div>)}
              {activeGame.id === 'word_chain' && (<div className="space-y-4 text-center"><p className="text-xs text-slate-400">Last word: <span className="font-bold text-purple-300">{wordChainWords[wordChainWords.length - 1]}</span> — start with "{wordChainWords[wordChainWords.length - 1].slice(-1)}"</p><p className={`text-2xl font-black ${wordChainTimer <= 3 ? 'text-rose-400' : 'text-slate-200'}`}>{wordChainTimer}s</p><div className="flex gap-2 justify-center"><input value={wordChainInput} onChange={(e) => setWordChainInput(e.target.value.toUpperCase())} className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 w-40" /><button onClick={() => { if (wordChainInput) { setWordChainWords((w) => [...w, wordChainInput]); setWordChainInput(''); setWordChainTimer(10); announceWinner('Word Chain Blitz'); } }} className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl">Play Word</button></div></div>)}
              {activeGame.id === 'trivia_royale' && (<div className="space-y-4 text-center"><p className="text-xs text-slate-400">Round {triviaRound} • Lives: {'❤️'.repeat(triviaLives)}{'🖤'.repeat(3 - triviaLives)}</p><p className="text-sm font-bold text-slate-100">Which lens boosts chemistry?</p><div className="grid grid-cols-2 gap-3 max-w-md mx-auto"><button onClick={() => answerTrivia(true)} className="bg-slate-800 hover:bg-emerald-600 text-slate-200 text-xs font-bold py-3 rounded-xl">Cyber Visor</button><button onClick={() => answerTrivia(false)} className="bg-slate-800 hover:bg-rose-600 text-slate-200 text-xs font-bold py-3 rounded-xl">Gold Crown</button></div>{triviaLives === 0 && <p className="text-xs text-rose-400 font-bold">Eliminated at round {triviaRound}</p>}</div>)}
              {activeGame.id === 'bluff_poker' && (<div className="space-y-4 text-center"><p className="text-xs text-slate-400">Chips: <span className="text-amber-300 font-bold">{pokerChips}</span> • Pot: <span className="text-purple-300 font-bold">{pokerPot}</span></p><div className="flex justify-center gap-2"><button onClick={() => { setPokerChips((c) => c - 50); setPokerPot((p) => p + 50); }} className="bg-slate-800 hover:bg-purple-600 text-xs font-bold px-4 py-2.5 rounded-xl text-slate-200">Bet 50</button><button onClick={() => { fireToast('You called the bluff!'); announceWinner('Bluff Poker Chips'); }} className="bg-slate-800 hover:bg-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl text-slate-200">Call Bluff</button><button onClick={() => fireToast('You folded')} className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl text-slate-200">Fold</button></div></div>)}
              {activeGame.id === 'vibe_match' && (<div className="space-y-4 text-center">{vibeMatchResult === null ? (<><p className="text-sm font-bold text-slate-100">Q{vibeMatchStep + 1}/3: {['Night owl or early bird?', 'Adventure or cozy night in?', 'Deep talks or playful banter?'][vibeMatchStep]}</p><div className="grid grid-cols-2 gap-3 max-w-md mx-auto"><button onClick={runVibeMatchStep} className="bg-slate-800 hover:bg-pink-600/40 text-xs font-bold py-3 rounded-xl text-slate-200">Option A</button><button onClick={runVibeMatchStep} className="bg-slate-800 hover:bg-purple-600/40 text-xs font-bold py-3 rounded-xl text-slate-200">Option B</button></div></>) : (<><p className="text-4xl font-black text-pink-400">{vibeMatchResult}%</p><p className="text-xs text-slate-400">Vibe Match with the room</p></>)}</div>)}
              {activeGame.id === 'karaoke_battle' && (<div className="space-y-4 text-center"><p className="text-xs text-slate-400">Unmute and sing a quick clip — the room rates it live.</p><div className="flex justify-center gap-1">{[1, 2, 3, 4, 5].map((s) => (<button key={s} onClick={() => { setKaraokeRating(s); if (s >= 4) announceWinner('Karaoke Quick Battle'); }}><Star className={`w-7 h-7 ${s <= karaokeRating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} /></button>))}</div></div>)}
              {activeGame.id === 'become_a_star' && (
                <div className="space-y-4">
                  {starStage === 'pick' && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-center text-slate-100">Star Stage — pick your song</h4>
                      <div className="flex gap-1.5 flex-wrap justify-center">{['All', 'Bollywood', 'Hollywood/Pop'].map((l) => (<button key={l} onClick={() => setStarLanguage(l)} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${starLanguage === l ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{l}</button>))}</div>
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2"><Search className="w-4 h-4 text-slate-500" /><input value={starSongSearch} onChange={(e) => setStarSongSearch(e.target.value)} placeholder="Search 1,000s of songs (sample library shown)" className="flex-1 bg-transparent text-xs text-slate-200 outline-none" /></div>
                      <div className="max-h-56 overflow-y-auto space-y-1.5">
                        {filteredSongs.filter((s) => starLanguage === 'All' || s.genre === starLanguage).map((s) => (<button key={s.title} onClick={() => { setStarSelectedSong(s); setStarStage('lobby'); }} className="w-full flex justify-between items-center bg-slate-950 hover:bg-purple-600/20 border border-slate-800 rounded-xl px-3 py-2 text-left"><span className="text-xs font-bold text-slate-200">{s.title}</span><span className="text-[10px] text-slate-500">{s.genre}</span></button>))}
                      </div>
                      <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"><span className="text-[10px] text-slate-500">Turn length</span><div className="flex gap-1.5">{[30, 60, 90].map((d) => (<button key={d} onClick={() => setStarDuration(d)} className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${starDuration === d ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{d}s</button>))}</div></div>
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2"><Mic2 className="w-3.5 h-3.5 text-slate-500" /><button onClick={() => { setVoiceRefs((v) => [...v, { id: Date.now(), label: `Voice reference for ${starSelectedSong ? starSelectedSong.title : 'a song'}` }]); fireToast('Voice reference clip saved to your catalog'); }} className="text-[10px] font-bold text-purple-300">Record a voice reference clip</button></div>
                    </div>
                  )}
                  {starStage === 'lobby' && starSelectedSong && (
                    <div className="text-center space-y-3">
                      <p className="text-sm font-bold text-slate-100">Performing: {starSelectedSong.title} ({starDuration}s)</p>
                      <button onClick={() => setStarCallMode(starCallMode === 'video' ? 'voice' : 'video')} className="bg-slate-800 border border-slate-700 text-xs font-bold px-4 py-2 rounded-xl">{starCallMode === 'video' ? '📹 Video Chat before you go on' : '🎙️ Voice Only before you go on'}</button>
                      <p className="text-[10px] text-slate-500">Friends can join the pre-show chat, send messages, or hype you up before you perform.</p>
                      <button onClick={() => setStarStage('performing')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl w-full">Go On Stage</button>
                    </div>
                  )}
                  {starStage === 'performing' && (
                    <div className="text-center space-y-3">
                      <p className="text-[10px] text-slate-500">🔇 Audience mics auto-muted while you're on stage</p>
                      <p className="text-sm font-bold text-pink-300 animate-pulse">🎤 Now performing: {starSelectedSong.title}</p>
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-hidden h-12 flex items-center"><p className="text-xs text-cyan-300 whitespace-nowrap animate-pulse">♪ Synchronized lyrics scroll here for you and the audience ♪</p></div>
                      <div className="flex justify-center gap-1">{[...Array(8)].map((_, i) => (<div key={i} className="w-1.5 bg-purple-500 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 40}px` }} />))}</div>
                      <div className="flex justify-center gap-1.5 flex-wrap">{GIFT_CATALOG.map((g) => (<button key={g.id} onClick={() => buyAndSendGift(g, 'star')} className="bg-slate-800 text-[10px] font-bold px-2 py-1.5 rounded-lg text-slate-300">{g.icon} {g.cost}</button>))}</div>
                      {starGifts.length > 0 && <div className="flex flex-wrap justify-center gap-1.5">{starGifts.map((g) => (<span key={g.id} className="text-[10px] font-bold bg-purple-600/30 border border-purple-500/40 text-purple-200 px-2 py-1 rounded-lg">{g.label}</span>))}</div>}
                      <button onClick={() => { finishPerformance(); setStarIntermission(15); setStarStage('intermission'); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl w-full">Finish Performance</button>
                    </div>
                  )}
                  {starStage === 'intermission' && (
                    <div className="text-center space-y-3">
                      <p className="text-4xl font-black text-amber-300">{starScore}/100</p>
                      <p className="text-xs text-slate-400">15-second appreciation window — send reactions, gifts, or banter</p>
                      <p className="text-2xl font-black text-slate-200">{starIntermission}s</p>
                      <div className="flex justify-center gap-1.5 flex-wrap">{GIFT_CATALOG.slice(0, 3).map((g) => (<button key={g.id} onClick={() => buyAndSendGift(g, 'star')} className="bg-slate-800 text-[10px] font-bold px-2 py-1.5 rounded-lg text-slate-300">{g.icon} {g.cost}</button>))}</div>
                      <div className="flex gap-2">
                        {starCanResing && <button onClick={() => { setStarCanResing(false); setStarStage('performing'); }} className="flex-1 bg-slate-800 text-xs font-bold py-2.5 rounded-xl">Apply to Re-sing & Beat the Score</button>}
                        <button onClick={() => setStarStage('pick')} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold py-2.5 rounded-xl">Next Singer</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeGame.id === 'flirt_me' && (
                <div className="text-center space-y-4">
                  <p className="text-[10px] text-amber-400 font-bold uppercase">18+ • Playful & consensual only</p>
                  <div className="w-44 h-44 rounded-full border-8 border-pink-500 border-t-purple-500 border-b-rose-400 mx-auto flex items-center justify-center text-4xl shadow-2xl transition-transform duration-1000" style={{ transform: `rotate(${flirtWheelAngle}deg)` }}>💋</div>
                  {flirtTarget && <p className="text-xs font-bold text-pink-300">Paired with {flirtTarget}</p>}
                  {flirtPrompt && <p className="bg-pink-900/30 border border-pink-500/40 p-3 rounded-xl text-xs font-bold text-slate-200 max-w-md mx-auto">{flirtPrompt}</p>}
                  <button onClick={() => {
                    if (flirtSpinning) return;
                    setFlirtSpinning(true);
                    setFlirtWheelAngle((a) => a + 1440 + Math.floor(Math.random() * 360));
                    setTimeout(() => {
                      setFlirtTarget(MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]);
                      setFlirtPrompt(FLIRT_PROMPTS[Math.floor(Math.random() * FLIRT_PROMPTS.length)]);
                      setFlirtSpinning(false);
                      announceWinner('Flirt Me');
                    }, 1800);
                  }} disabled={flirtSpinning} className="bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold text-xs px-8 py-3 rounded-xl">{flirtSpinning ? 'Spinning...' : 'Spin the Bottle'}</button>
                  <div className="flex justify-center gap-2">{['😊 Blush', '🔥 Flame', '💥 Heart Burst'].map((r) => (<button key={r} onClick={() => sendReaction(r.split(' ')[0])} className="bg-slate-800 text-[10px] font-bold px-2 py-1.5 rounded-lg text-slate-300">{r}</button>))}</div>
                </div>
              )}
              {activeGame.id === 'qa_arena' && (
                <div className="space-y-4">
                  <div className="flex gap-1.5 flex-wrap justify-center">{Object.keys(QA_CATEGORIES).map((c) => (<button key={c} onClick={() => { setQaCategory(c); setQaCurrentPrompt(QA_CATEGORIES[c][0]); setQaCardFlipped(false); }} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${qaCategory === c ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{c}</button>))}</div>
                  <div className="flex justify-center">
                    <button onClick={() => setQaCardFlipped(!qaCardFlipped)} className="w-64 h-40 rounded-2xl border-2 border-purple-500/40 flex items-center justify-center text-center p-4 transition-transform duration-500" style={{ transformStyle: 'preserve-3d', transform: qaCardFlipped ? 'rotateY(180deg)' : 'rotateY(0)', background: qaCardFlipped ? 'linear-gradient(135deg,#7c3aed,#db2777)' : '#0f172a' }}>
                      <p className="text-xs font-bold text-white" style={{ transform: qaCardFlipped ? 'rotateY(180deg)' : 'none' }}>{qaCardFlipped ? qaCurrentPrompt : 'Tap to flip the card'}</p>
                    </button>
                  </div>
                  <div className="flex justify-center gap-2">
                    <button onClick={() => { const opts = QA_CATEGORIES[qaCategory]; setQaCurrentPrompt(opts[Math.floor(Math.random() * opts.length)]); setQaCardFlipped(true); announceWinner('Q&A Arena'); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl">Next Card</button>
                  </div>
                  <div className="max-w-xs mx-auto space-y-1.5">
                    <p className="text-[10px] text-slate-500 text-center">Audience poll: agree with the answer?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setQaPoll((p) => ({ ...p, yes: p.yes + 1 }))} className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${(qaPoll.yes / (qaPoll.yes + qaPoll.no)) * 100}%` }} /></button>
                      <button onClick={() => setQaPoll((p) => ({ ...p, no: p.no + 1 }))} className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: `${(qaPoll.no / (qaPoll.yes + qaPoll.no)) * 100}%` }} /></button>
                    </div>
                  </div>
                </div>
              )}
              {['shadow_chase', 'hide_and_vibe', 'neon_maze', 'parkour_dash', 'zombie_outbreak', 'sky_battle', 'vault_heist', 'mystery_manor', 'racing_rivals', 'sumo_bounce', 'werewolf_midnight', 'spy_vs_spy', 'musical_chairs', 'freeze_dance', 'balloon_pop', 'tower_stack', 'riddle_escape', 'trivia_bomb', 'vibe_paintball'].includes(activeGame.id) && (
                <ConceptGameShell game={activeGame} onWin={announceWinner} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
