import React, { useState, useEffect } from 'react';
import './App.css';

/*
  SurfSync App

  Features:
  - Home Screen: List sessions, + Log button, Filters
  - Log New Session Form: Full field set, mood picker, sliders, dropdowns
  - Session Detail View: View/Edit/Delete session
  - Stats Dashboard: Usage/mood/trends visualized (optional)
  - Oceanic themed styles, icons, accent hues
  - Daily reminder (demo: browser alert)
  - Demo/sample data & state logic

  File contains all required components for demonstration.
*/

// ---- Oceanic Colors ----
// :root primary: #3A8DAD, accent: #2EC4B6, sand: #F4E9D8

// ---- UTILS ----

const MOODS = [
  { label: 'Stoked', icon: '🌊', color: '#2EC4B6' },
  { label: 'Good', icon: '🏄‍♂️', color: '#3A8DAD' },
  { label: 'Okay', icon: '😊', color: '#FFD166' },
  { label: 'Frustrated', icon: '😡', color: '#E88741' },
  { label: 'Exhausted', icon: '😴', color: '#7766C6' }
];

const SPOTS = [
  'Pipeline',
  'Malibu',
  'Bells Beach',
  'Trestles',
  'Jaws (Peahi)',
];

const BOARDS = [
  { name: 'Shortboard', icon: '🏄' },
  { name: 'Longboard', icon: '🛶' },
  { name: 'Fish', icon: '🐟' },
  { name: 'Funboard', icon: '🦈' },
];

const SWELL_SIZES = [
  'Knee high',
  'Waist high',
  'Chest high',
  'Head high',
  'Overhead',
];

const WINDS = [
  'Offshore',
  'Onshore',
  'Sideshore',
  'Glass',
];

const TIDES = [
  'Low',
  'Mid',
  'High',
  'Rising',
  'Falling',
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- SAMPLE DATA ----

const demoSessions = [
  {
    id: 1,
    date: '2024-06-06',
    spot: 'Pipeline',
    board: 'Shortboard',
    mood: 'Stoked',
    waves: 12,
    swell: 'Head high',
    wind: 'Offshore',
    tide: 'High',
    notes: 'Epic barrels, a bit crowded. Water warm. Caught best wave of the year!',
  },
  {
    id: 2,
    date: '2024-06-04',
    spot: 'Bells Beach',
    board: 'Longboard',
    mood: 'Good',
    waves: 8,
    swell: 'Waist high',
    wind: 'Glass',
    tide: 'Mid',
    notes: 'Easy logging, mellow session with friends.',
  },
  {
    id: 3,
    date: '2024-06-01',
    spot: 'Trestles',
    board: 'Fish',
    mood: 'Okay',
    waves: 5,
    swell: 'Chest high',
    wind: 'Onshore',
    tide: 'Low',
    notes: 'Messy but fun. Practiced cutbacks.',
  },
  {
    id: 4,
    date: '2024-05-30',
    spot: 'Pipeline',
    board: 'Shortboard',
    mood: 'Exhausted',
    waves: 10,
    swell: 'Overhead',
    wind: 'Sideshore',
    tide: 'Rising',
    notes: 'Challenging, duckdive city! Legs fried.',
  },
  {
    id: 5,
    date: '2024-05-28',
    spot: 'Malibu',
    board: 'Longboard',
    mood: 'Frustrated',
    waves: 2,
    swell: 'Knee high',
    wind: 'Onshore',
    tide: 'Falling',
    notes: 'Tiny and crowded, but still in the water.',
  },
];

// ---- ICON & UI HELPERS ----

function MoodIcon({ mood, size = 24, showLabel = false }) {
  const moodObj = MOODS.find(m => m.label === mood);
  if (!moodObj) return <span>❓</span>;
  return (
    <span title={moodObj.label} style={{ fontSize: size, color: moodObj.color, verticalAlign: 'middle', marginRight: showLabel ? 8 : 0 }}>
      {moodObj.icon} {showLabel && <span style={{ fontSize: size * 0.6 }}>{moodObj.label}</span>}
    </span>
  );
}

function BoardIcon({ board, size = 20 }) {
  const obj = BOARDS.find(b => b.name === board);
  if (!obj) return <span>🏄</span>;
  return <span title={obj.name} style={{ fontSize: size, marginRight: 2 }}>{obj.icon}</span>;
}

function OceanWaves({ style = {} }) {
  // SVG background accent for ocean theme
  return (
    <svg style={style} height="60" width="100%" viewBox="0 0 100 16" preserveAspectRatio="none">
      <path d="M0 9 Q 10 2, 20 9 T 40 9 T 60 9 T 80 9 T 100 9 V16 H0Z"
        fill="#3A8DAD" opacity="0.22" />
      <path d="M0 12 Q 10 7, 20 12 T 40 12 T 60 12 T 80 12 T 100 12 V16 H0Z"
        fill="#2EC4B6" opacity="0.14" />
    </svg>
  );
}

function formatDate(date) {
  // YYYY-MM-DD to readable
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// ---- NAVIGATION ----

const PAGE_HOME = 'home';
const PAGE_LOG = 'log';
const PAGE_DETAIL = 'detail';
const PAGE_STATS = 'stats';

// ---- MAIN APP ----

function App() {
  // Sessions state (simulate persistence)
  const [sessions, setSessions] = useState([...demoSessions]);
  const [page, setPage] = useState(PAGE_HOME);
  const [detailId, setDetailId] = useState(null);

  // Filters
  const [filterSpot, setFilterSpot] = useState('');
  const [filterBoard, setFilterBoard] = useState('');
  const [filterMood, setFilterMood] = useState('');
  
  // Reminder
  useEffect(() => {
    // Simulate daily reminder at app load/daily: for demo, alert on mount once.
    setTimeout(() => {
      alert('🌊 SurfSync: Did you surf today? Don't forget to log your session!');
    }, 800);
  }, []);

  // ---- Handlers ----
  const handleAddSession = (newEntry) => {
    setSessions([
      { ...newEntry, id: Math.max(0, ...sessions.map(s => s.id)) + 1 },
      ...sessions,
    ]);
    setPage(PAGE_HOME);
  };

  const handleEditSession = (id, values) => {
    setSessions(sessions => sessions.map(s => (s.id === id ? { ...s, ...values, id } : s)));
    setPage(PAGE_DETAIL); // Stay in detail after edit
    setDetailId(id);
  };

  const handleDeleteSession = (id) => {
    setSessions(sessions => sessions.filter(s => s.id !== id));
    setPage(PAGE_HOME);
  };

  // Filtered sessions for Home
  const filteredSessions = sessions.filter(s =>
    (!filterSpot || s.spot === filterSpot) &&
    (!filterBoard || s.board === filterBoard) &&
    (!filterMood || s.mood === filterMood)
  );

  // ---- Renderers for Each Page ----

  return (
    <div className="app surf-app">
      <nav className="navbar surf-navbar ocean-shadow">
        <div className="container">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width: '100%'}}>
            <div className="logo surf-logo">
              <span className="logo-symbol" role="img" aria-label="wave" style={{fontSize: 27, marginRight: 5}}>🌊</span>
              SurfSync
            </div>
            <div>
              <button
                className="btn"
                style={{
                  backgroundColor: page === PAGE_HOME ? 'var(--kavia-orange)' : 'var(--kavia-dark)',
                  color: page === PAGE_HOME ? '#fff' : '#3A8DAD',
                  marginRight: 8,
                  border: '1px solid rgba(58,141,173,0.18)',
                }}
                onClick={() => setPage(PAGE_HOME)}
              >Home</button>
              <button
                className="btn"
                style={{
                  backgroundColor: page === PAGE_STATS ? '#2EC4B6' : 'var(--kavia-dark)',
                  color: page === PAGE_STATS ? '#fff' : '#2EC4B6',
                  border: '1px solid #2EC4B6',
                }}
                onClick={() => setPage(PAGE_STATS)}
              >Stats</button>
            </div>
          </div>
        </div>
      </nav>
      <main style={{paddingTop: 80, minHeight: '86vh', background: 'linear-gradient(180deg,#3a8dad 0%,#2ec4b6 33%,#f4e9d8 100%)', }}>
        <div className="container">
          {/* Ocean background accent */}
          <OceanWaves style={{position: 'absolute', top:55, left:0, width:'100%', zIndex:0}} />
          {/* Pages */}
          {page === PAGE_HOME && (
            <HomeScreen
              sessions={filteredSessions}
              originalSessions={sessions}
              onAddNew={() => setPage(PAGE_LOG)}
              onViewSession={(sid) => { setPage(PAGE_DETAIL); setDetailId(sid);}}
              filterSpot={filterSpot}
              filterBoard={filterBoard}
              filterMood={filterMood}
              setFilterSpot={setFilterSpot}
              setFilterBoard={setFilterBoard}
              setFilterMood={setFilterMood}
            />
          )}
          {page === PAGE_LOG && (
            <LogSessionForm
              spots={SPOTS}
              boards={BOARDS}
              onSubmit={handleAddSession}
              onCancel={() => setPage(PAGE_HOME)}
            />
          )}
          {page === PAGE_DETAIL && (
            <SessionDetailView
              session={sessions.find(s=>s.id===detailId)}
              boards={BOARDS}
              onBack={() => setPage(PAGE_HOME)}
              onDelete={handleDeleteSession}
              onEdit={handleEditSession}
            />
          )}
          {page === PAGE_STATS && (
            <StatsDashboard allSessions={sessions} onBack={() => setPage(PAGE_HOME)} />
          )}
        </div>
      </main>
      <footer style={{
        textAlign:'center', fontSize:11, color:'#fff', letterSpacing:0.4, opacity:0.5,
        padding:'22px 0 6px 0',
        background: 'linear-gradient(90deg,#2ec4b6 0%,#3a8dad 100%)'
      }}>
        SurfSync &copy; 2024 · Demo App · The ocean is calling!<br />
      </footer>
    </div>
  );
}

// ---- COMPONENTS ----

// HOME SCREEN

function HomeScreen({
  sessions,
  originalSessions,
  onAddNew,
  onViewSession,
  filterSpot,
  filterBoard,
  filterMood,
  setFilterSpot,
  setFilterBoard,
  setFilterMood
}) {
  return (
    <div style={{padding:'0 0 48px 0'}}>
      <h2 style={{
        textAlign:'center',
        fontWeight:700,
        fontSize:'2.1rem',
        color:'#20506F',
        marginTop:0, marginBottom:6,
        letterSpacing:0.5
      }}>
        <span role="img" aria-label="surf log">🏄‍♂️</span> Surf Session Log
      </h2>
      <p style={{textAlign:'center', color:'#256B7A',margin:'8px 0 32px 0', fontSize:'1.07rem'}}>
        {sessions.length === 0
          ? 'No sessions. Hit "+ Log New Session" to add your first!'
          : `You have ${originalSessions.length} session${originalSessions.length>1?'s':''} logged.` }
      </p>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',marginBottom:'12px',gap:9,flexWrap:'wrap'}}>
        <button
          className="btn btn-large"
          onClick={onAddNew}
          style={{background: 'linear-gradient(90deg,#2ec4b6 40%,#3a8dad 100%)', fontWeight:600, fontSize:18, borderRadius: 24, boxShadow:'0 2px 6px rgba(58,141,173,0.12)',marginRight:7,letterSpacing:0.25}}
        >+ Log New Session
        </button>
        <div style={{display:'flex', gap:7, alignItems:'center', flexWrap:'wrap'}}>
          <select
            value={filterSpot}
            onChange={e=>setFilterSpot(e.target.value)}
            style={{borderRadius:8, border:'1px solid #2ec4b6', background:'#fff', color:'#2ec4b6',padding: '2px 7px'}}
            title="Filter by spot"
          >
            <option value="">All Spots</option>
            {SPOTS.map(spot=>(
              <option key={spot} value={spot}>{spot}</option>
            ))}
          </select>
          <select
            value={filterBoard}
            onChange={e=>setFilterBoard(e.target.value)}
            style={{borderRadius:8,border:'1px solid #3a8dad',background:'#fff', color:'#3a8dad',padding:'2px 7px'}}
            title="Filter by board"
          >
            <option value="">All Boards</option>
            {BOARDS.map(b=>(
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
          <select
            value={filterMood}
            onChange={e=>setFilterMood(e.target.value)}
            style={{borderRadius:8,border:'1px solid #ffd166',background:'#fff', color:'#ffd166',padding:'2px 7px'}}
            title="Filter by mood"
          >
            <option value="">All Moods</option>
            {MOODS.map(m=>(
              <option key={m.label} value={m.label}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{marginBottom:19, minHeight:1}}>
        {sessions.length === 0 && <div style={{textAlign:'center',color:'#888',fontSize:16,paddingTop:22}}>No matching sessions found.</div>}
      </div>
      <div style={{
        display:'grid', gap: '18px 18px',gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))',
        margin: '18px 0', zIndex: 1
      }}>
        {sessions.map(session => (
          <SessionCard key={session.id} session={session} onClick={()=>onViewSession(session.id)} />
        ))}
      </div>
    </div>
  );
}

// SESSION CARD

function SessionCard({ session, onClick }) {
  return (
    <div
      className="surf-card"
      style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 19,
        boxShadow:'0 2px 8px rgba(58,141,173,0.09)',
        padding:'23px 22px 14px 22px',
        cursor:'pointer',
        border: `2px solid ${MOODS.find(m=>m.label===session.mood)?.color || '#3a8dad'}`,
        minHeight: 180,
        transition: 'transform 0.12s',
        position: 'relative'
      }}
      onClick={onClick}
      tabIndex={0}
      aria-label="View session details"
    >
      <div style={{display:'flex',justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
        <span style={{fontSize:19, color:'#3a8dad', fontWeight:600,letterSpacing:0.15}}>{session.spot}</span>
        <BoardIcon board={session.board} size={26}/>
      </div>
      <div style={{display:'flex',alignItems:'center', marginBottom:8, gap:9,marginTop:-8}}>
        <span style={{color:'#888', fontSize:13}}>{formatDate(session.date)}</span>
        <span style={{marginLeft: 13}}><MoodIcon mood={session.mood} size={22}/></span>
      </div>
      <div style={{margin:'7px 0 8px 0', fontSize: 16, color:'#20506F'}}>
        Waves: <strong>{session.waves}</strong> <span style={{fontSize:13,color:'#2ec4b6'}}>{session.swell}</span>
      </div>
      <div style={{fontSize: 14, color:'#508297'}}>
        Wind: {session.wind}, Tide: {session.tide}
      </div>
      <div style={{marginTop:12, fontSize:14, color:'#256B7A',minHeight:26}}>
        {session.notes?.slice(0, 59)}{session.notes && session.notes.length > 60 ? '…' : ''}
      </div>
      <span style={{
        position:'absolute',
        bottom:10,
        right:18,
        background:'#2ec4b6',
        color:'#fff',
        fontSize:12,
        fontWeight:600,
        borderRadius: 8,
        padding:'1px 7px 0 7px',
        opacity:0.83
      }}>View</span>
    </div>
  );
}

// LOG SESSION FORM

function LogSessionForm({ spots, boards, onSubmit, onCancel, initial }) {
  // Form state
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0,10));
  const [spot, setSpot] = useState(initial?.spot || '');
  const [board, setBoard] = useState(initial?.board || '');
  const [mood, setMood] = useState(initial?.mood || 'Good');
  const [waves, setWaves] = useState(initial?.waves || 5);
  const [swell, setSwell] = useState(initial?.swell || 'Waist high');
  const [wind, setWind] = useState(initial?.wind || 'Offshore');
  const [tide, setTide] = useState(initial?.tide || 'Mid');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [touched, setTouched] = useState(false);

  const valid = spot && board && mood && date;
  const formTitle = initial ? 'Edit Session' : 'Log New Surf Session';

  const handleSubmit = e => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({
      date, spot, board, mood, waves: Number(waves), swell, wind, tide, notes,
      ...(initial?.id && {id: initial.id}),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="surf-form" style={{
      margin:'0 auto', background:'#f2fdff', padding:'34px 25px 28px 25px', borderRadius:22,
      maxWidth: 440, boxShadow:'0 4px 28px rgba(46,196,182,0.09)',
      border:'1.5px solid #3a8dad'
    }}>
      <h2 style={{textAlign:'center',marginTop:0,marginBottom:18,color:'#20506F',fontWeight:700,letterSpacing:0.16}}>
        <span role="img" aria-label="wave" style={{fontSize:26}}>🌊</span> {formTitle}
      </h2>
      {/* Date */}
      <label style={labelStyle}>Date
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={inputStyle} required />
      </label>
      {/* Spot */}
      <label style={labelStyle}>Surf Spot
        <select value={spot} onChange={e=>setSpot(e.target.value)} style={inputStyle}>
          <option value="">Choose a spot</option>
          {spots.map(s => <option value={s} key={s}>{s}</option>)}
        </select>
        {touched && !spot && <span style={requiredStyle}>Required</span>}
      </label>
      {/* Board */}
      <label style={labelStyle}>Board Used
        <select value={board} onChange={e=>setBoard(e.target.value)} style={inputStyle}>
          <option value="">Select board</option>
          {boards.map(b=>(
            <option value={b.name} key={b.name}>{b.icon+" "+b.name}</option>
          ))}
        </select>
        {touched && !board && <span style={requiredStyle}>Required</span>}
      </label>
      {/* Mood */}
      <label style={labelStyle}>Mood
        <div style={{display:'flex',gap:11,margin:'5px 0 2px'}}>
          {MOODS.map(m => (
            <button
              type="button"
              key={m.label}
              style={{
                fontSize:22,padding:'2px 9px',marginRight:2,background:mood===m.label?m.color+'33':'#fff',
                border: `2px solid ${mood===m.label?m.color:'#bbb'}`, borderRadius:8, color: m.color, cursor:'pointer'
              }}
              onClick={()=>setMood(m.label)}
              aria-label={m.label}
            >{m.icon}</button>
          ))}
        </div>
      </label>
      {/* Waves */}
      <label style={labelStyle}>Waves Caught: <b style={{color:"#3a8dad"}}>{waves}</b>
        <input type="range" min={0} max={25} value={waves} onChange={e=>setWaves(e.target.value)} style={{...inputStyle,margin:'9px 0 0'}}/>
      </label>
      {/* Swell */}
      <label style={labelStyle}>Swell Size
        <select value={swell} onChange={e=>setSwell(e.target.value)} style={inputStyle}>
          {SWELL_SIZES.map(sz=>(<option key={sz}>{sz}</option>))}
        </select>
      </label>
      {/* Wind */}
      <label style={labelStyle}>Wind
        <select value={wind} onChange={e=>setWind(e.target.value)} style={inputStyle}>
          {WINDS.map(w=>(<option key={w}>{w}</option>))}
        </select>
      </label>
      {/* Tide */}
      <label style={labelStyle}>Tide
        <select value={tide} onChange={e=>setTide(e.target.value)} style={inputStyle}>
          {TIDES.map(t=>(<option key={t}>{t}</option>))}
        </select>
      </label>
      {/* Notes */}
      <label style={labelStyle}>Notes
        <textarea
          value={notes}
          onChange={e=>setNotes(e.target.value)}
          rows={2}
          maxLength={150}
          placeholder='(Optional: thoughts, highlights, etc.)'
          style={{...inputStyle,minHeight:42,resize:'vertical'}}
        />
      </label>
      <div style={{display:'flex',justifyContent:'space-between', marginTop:31}}>
        <button type="button" className="btn" onClick={onCancel} style={{background:'#fff',color:'#2ec4b6',border: '1.5px solid #2ec4b6'}}>Cancel</button>
        <button type="submit" className="btn btn-large" disabled={!valid} style={{background:'#2ec4b6'}}>{initial?'Save':'Log Session'}</button>
      </div>
    </form>
  );
}

const labelStyle = { fontSize:15,fontWeight:600,marginTop:6,marginBottom:4,display:'block',color:'#3a8dad' };
const inputStyle = {fontSize:15,margin:'5px 0', padding:'5px 12px',borderRadius:8,border:'1px solid #2ec4b6',width:'100%',boxSizing:'border-box'};
const requiredStyle = {fontSize:11,color:'#e86a41',marginLeft:6,opacity:0.77,marginBottom:3};

// SESSION DETAIL + EDIT/DELETE

function SessionDetailView({ session, boards, onBack, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  if (!session) return <div style={{textAlign:'center',margin:'44px auto', color:'#d22'}}>Session not found!</div>;

  // If editing: show the log form prepopulated for edit
  if (editing) {
    return (
      <LogSessionForm
        spots={SPOTS}
        boards={boards}
        initial={session}
        onSubmit={sess => { onEdit(session.id, sess); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />
    );
  }
  return (
    <div style={{
      margin:'0 auto',maxWidth:480,background:'#f2fdff',padding:'34px 28px 30px 28px',borderRadius: 23,
      boxShadow:'0 6px 32px rgba(58,141,173,0.13)', border:'2px solid #2ec4b6'
    }}>
      <button onClick={onBack} style={{
        border:'none',background:'none',color:'#2ec4b6',fontWeight:600,fontSize:15,cursor:'pointer',marginBottom:3,letterSpacing:0.05
      }}>&larr; Back</button>
      <h2 style={{margin:'8px 0 10px 0',color:'#20506F'}}><MoodIcon mood={session.mood} size={30}/> {session.spot}</h2>
      <div style={{fontSize:14,color:'#256b7a',marginTop:2}}>
        <span style={{marginRight:17}}><b>Date:</b> {formatDate(session.date)}</span>
        <span><b>Board:</b> <BoardIcon board={session.board} size={20}/>{session.board}</span>
      </div>
      <hr style={{margin:'14px 0',border:'none',borderTop:'1.5px solid #2ec4b6',opacity:0.14}}/>
      <div style={{color:'#20506F',fontSize:17,marginBottom:5}}>
        <b>Waves Caught:</b> {session.waves}
      </div>
      <div style={{color:'#256b7a',fontSize:15,marginBottom:3}}>
        <b>Swell:</b> {session.swell}, <b>Wind:</b> {session.wind}, <b>Tide:</b> {session.tide}
      </div>
      <div style={{color:'#3A8DAD',fontSize:15,margin:'8px 0 13px 0'}}>
        <b>Mood:</b> <MoodIcon mood={session.mood} size={21} showLabel={true}/>
      </div>
      <div style={{
        background:'#DEF6FA',padding:'13px 14px',borderRadius:12,margin:'10px 0 13px 0',
        fontSize:14, borderLeft:'4px solid #2ec4b6', color:'#256B7A'
      }}>
        <b>Notes:</b> {session.notes || <span style={{opacity:0.4,fontStyle:'italic'}}>No notes</span>}
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:32,gap:12}}>
        <button className="btn" style={{background:'#fff',color:'#2ec4b6',border:'1px solid #2ec4b6'}} onClick={()=>setEditing(true)}>Edit</button>
        <button className="btn" style={{background:'#fff',color:'#e84141',border:'1.5px solid #e84141'}} onClick={()=>{if(window.confirm("Delete this session?"))onDelete(session.id)}}>Delete</button>
      </div>
    </div>
  )
}

// STATS DASHBOARD

function StatsDashboard({ allSessions, onBack }) {
  // Calculate stats: most visited spot, board use freq, mood trend

  // Board usage %:
  const boardCounts = {};
  BOARDS.forEach(b=>{boardCounts[b.name]=0;});
  allSessions.forEach(s=>{
    if (boardCounts[s.board]!==undefined) boardCounts[s.board]++;
  });
  const totalBoards = Object.values(boardCounts).reduce((a,b)=>a+b,0);

  // Mood sequence for chart
  const moodSeq = allSessions.map(s=>s.mood);

  const moodCounts = {};
  MOODS.forEach(m=>{moodCounts[m.label]=0;});
  allSessions.forEach(s=>{if(moodCounts[s.mood]!==undefined) moodCounts[s.mood]++;});

  // Most surfed spot
  const spotCounts = {};
  SPOTS.forEach(s=>{spotCounts[s]=0;});
  allSessions.forEach(s=>{spotCounts[s.spot]=(spotCounts[s.spot]||0)+1;});
  const favSpot = Object.entries(spotCounts).reduce((max,cur)=>cur[1]>max[1]?cur:max,Object.entries(spotCounts)[0]||['',0])[0];

  return (
    <div style={{
      margin:'0 auto',maxWidth:680,background:'#f2fdff',padding:'35px 29px 38px',borderRadius: 29,boxShadow:'0 3px 36px rgba(46,196,182,0.13)',border:'2px solid #2ec4b6'
    }}>
      <button onClick={onBack} style={{border:'none',background:'none',color:'#2ec4b6',fontWeight:600,fontSize:15,cursor:'pointer',marginBottom:3}}>&larr; Back</button>
      <h2 style={{textAlign:'center',color:'#20506F',margin:'9px 0 19px 0',fontWeight:700,letterSpacing:0.23}}>
        <span role="img" aria-label="stats" style={{fontSize:23}}>📈</span> Surf Stats Dashboard
      </h2>
      {/* Favorite spot */}
      <div style={{
        background:'#DEF6FA',padding:'13px 15px',borderRadius:13,margin:'0 0 20px',fontSize:16,
        borderLeft:'5px solid #3a8dad',color:'#20506F',maxWidth:380
      }}>
        <b>Favorite Surf Spot:</b> <span style={{color:'#3a8dad'}}>{favSpot || 'N/A'}</span>
        <span style={{fontSize:13,marginLeft:11,opacity:0.7}}>({spotCounts[favSpot] || 0} sessions)</span>
      </div>
      {/* Board usage */}
      <div style={{margin:'14px 0'}}>
        <b style={{color:'#3a8dad'}}>Boards Used:</b>
        <div style={{display:'flex',gap:22,marginTop:7,flexWrap:'wrap'}}>
          {BOARDS.map((b,i) => (
            <div key={b.name} style={{background:'#fff',border:'1.4px solid #2ec4b6',borderRadius:13,minWidth:90,padding:'6px 12px',textAlign:'center',boxShadow:'0 1px 6px #2ec4b622',color:'#20506F'}}>
              <BoardIcon board={b.name} size={27}/><br />
              <span style={{fontWeight:600,fontSize:15}}>{b.name}</span><br />
              <span style={{fontSize:13}}>{boardCounts[b.name]||0} sessions</span><br />
              <span style={{color:'#2ec4b6'}}>{totalBoards>0?((boardCounts[b.name]/totalBoards*100).toFixed(0)):'0'}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* Mood trend */}
      <div style={{margin:'24px 0 16px 0'}}>
        <b style={{color:'#3a8dad'}}>Mood Trends</b>
        <MoodTrendChart moods={moodSeq} />
      </div>
      {/* Mood Distribution Pie */}
      <div style={{margin:'13px 0'}}>
        <b style={{color:'#3a8dad'}}>Sessions by Mood:</b>
        <div style={{display:'flex',gap:11,marginTop:7}}>
        {MOODS.map((m) => (
          <span key={m.label} style={{display:'inline-flex',alignItems:'center',background:'#fff',borderRadius:8,padding:'2px 10px',border:'1.4px solid #2ec4b6'}}>
            <MoodIcon mood={m.label} size={18}/>
            <span style={{fontSize:14,marginLeft:5}}>{moodCounts[m.label]||0}</span>
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}

// MOOD TRENDS

function MoodTrendChart({ moods }) {
  // Bar/emoji chart by session order (most recent left)
  if (moods.length === 0) return <div style={{margin:'7px 0',color:'#888'}}>No sessions yet.</div>;
  return (
    <div style={{display:'flex',gap:7,alignItems:'end',margin:'11px 0',padding:'7px 0'}}>
      {moods.map((mood, idx) => {
        const moodObj = MOODS.find(x=>x.label===mood);
        return (
          <div key={idx} style={{textAlign:'center',marginTop:5}}>
            <span style={{fontSize:26,display:'inline-block'}}>{moodObj?.icon||'?'}</span><br/>
            <span style={{fontSize:10,color:'#20506F',opacity:0.7}}># {moods.length-idx}</span>
          </div>
        );
      })}
    </div>
  );
}

export default App;
