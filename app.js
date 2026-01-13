const { useState, useEffect, useRef } = React;
// Lucide Icons को ग्लोबल वेरिएबल से निकालना
const { Home, Star, ArrowLeft, Volume2, Sparkles, Eraser, Trophy, Brush } = lucide;

const KidsLearningApp = () => {
  const [screen, setScreen] = useState('home');
  const [subject, setSubject] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [voices, setVoices] = useState([]);
  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#EC4899');

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, lang = 'en-US') => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google') || v.lang.includes('hi-IN'));
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.pitch = 1.4;
    utterance.rate = 0.8;
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const subjects = [
    { id: 'english', name: 'English ABC', icon: '🅰️', color: 'from-blue-400 to-indigo-500' },
    { id: 'hindi', name: 'हिंदी वर्णमाला', icon: 'अ', color: 'from-orange-400 to-red-500' },
    { id: 'punjabi', name: 'ਪੰਜਾਬੀ', icon: 'ੳ', color: 'from-yellow-400 to-orange-600' },
    { id: 'maths', name: 'Counting', icon: '🔢', color: 'from-green-400 to-teal-500' },
    { id: 'animals', name: 'Animals', icon: '🦁', color: 'from-amber-400 to-orange-600' },
    { id: 'birds', name: 'Birds', icon: '🦜', color: 'from-emerald-400 to-teal-600' },
    { id: 'flowers', name: 'Flowers', icon: '🌸', color: 'from-pink-400 to-rose-500' },
    { id: 'art', name: 'Painting', icon: '🎨', color: 'from-purple-400 to-fuchsia-600' },
    { id: 'quiz', name: 'Mega Quiz', icon: '🏆', color: 'from-yellow-300 to-yellow-600' }
  ];

  const contentData = {
    english: Array.from({ length: 26 }, (_, i) => ({ l: String.fromCharCode(65 + i), w: "Letter", voice: `${String.fromCharCode(65 + i)} for Apple` })),
    hindi: ["अ", "आ", "इ", "ई", "उ", "ऊ", "क", "ख", "ग", "घ"].map(char => ({ l: char, w: "स्वर/व्यंजन", voice: `${char} से अनार` })),
    punjabi: ["ੳ", "ਅ", "ੲ", "ਸ", "ਹ"].map(char => ({ l: char, w: "Gurmukhi", voice: char })),
    maths: Array.from({ length: 20 }, (_, i) => ({ l: i + 1, w: "Number", voice: `${i + 1}` })),
    animals: [{ l: "🦁", w: "Lion", voice: "Lion! The King of the Jungle. Roar!" }, { l: "🐘", w: "Elephant", voice: "Elephant! Trumpet!" }, { l: "🐶", w: "Dog", voice: "Dog! Woof Woof!" }],
    birds: [{ l: "🦜", w: "Parrot", voice: "Parrot! Kaa Kaa!" }, { l: "🦆", w: "Duck", voice: "Duck! Quack Quack!" }],
    flowers: [{ l: "🌹", w: "Rose", voice: "Rose! Red Flower" }, { l: "🌻", w: "Sunflower", voice: "Sunflower! Yellow Flower" }]
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-indigo-50 relative font-sans overflow-x-hidden">
      {screen === 'home' && <div className="w-full h-20 bg-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-bold">ADVERTISEMENT (320x100)</div>}

      <header className="bg-white p-4 flex items-center justify-between shadow-lg rounded-b-[30px] sticky top-0 z-50">
        <button onClick={() => setScreen('home')} className="p-2 bg-indigo-100 rounded-full text-indigo-500 active:scale-90"><Home size={20} /></button>
        <h1 className="text-lg font-black text-indigo-600 flex items-center"><Sparkles className="text-yellow-400 mr-1 animate-pulse" size={16} /> KIDS MEGA APP</h1>
        <div className="bg-yellow-400 px-3 py-1 rounded-full text-white font-bold flex items-center text-sm"><Star size={14} className="mr-1 fill-current" /> {quizScore}</div>
      </header>

      <main className="p-4">
        {screen === 'home' && (
          <div className="grid grid-cols-2 gap-3">
            {subjects.map((s) => (
              <button key={s.id} onClick={() => { setSubject(s.id); setScreen(s.id === 'quiz' ? 'quiz' : s.id === 'art' ? 'drawing' : 'learning'); }}
                className={`bg-gradient-to-br ${s.color} p-4 rounded-[30px] shadow-lg text-white transform active:scale-95 transition-all flex flex-col items-center`}>
                <span className="text-4xl mb-1">{s.icon}</span>
                <span className="font-bold text-[12px] uppercase">{s.name}</span>
              </button>
            ))}
          </div>
        )}

        {screen === 'learning' && (
          <div className="grid grid-cols-2 gap-3">
            {contentData[subject]?.map((item, idx) => (
              <button key={idx} onClick={() => speak(item.voice, subject === 'hindi' ? 'hi-IN' : 'en-US')}
                className="bg-white p-5 rounded-[30px] shadow-sm flex flex-col items-center active:bg-yellow-50 active:scale-90 transition-all">
                <span className="text-5xl mb-1">{item.l}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">{item.w}</span>
              </button>
            ))}
          </div>
        )}

        {screen === 'drawing' && (
          <div className="flex flex-col items-center bg-white p-3 rounded-[30px] shadow-xl">
            <canvas ref={canvasRef} width={280} height={350} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)} className="bg-slate-50 rounded-2xl border border-indigo-50 touch-none" />
            <div className="flex gap-2 mt-4">
              {['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'].map(c => <button key={c} onClick={() => setBrushColor(c)} className={`w-8 h-8 rounded-full border-2 ${brushColor === c ? 'border-indigo-600' : 'border-white'}`} style={{backgroundColor: c}} />)}
              <button onClick={() => canvasRef.current.getContext('2d').clearRect(0,0,280,350)} className="p-2 bg-gray-100 rounded-full"><Eraser size={18}/></button>
            </div>
          </div>
        )}

        {screen === 'quiz' && (
          <div className="bg-white p-6 rounded-[35px] shadow-xl text-center border-t-8 border-yellow-400">
            <div className="text-6xl mb-4">🦁</div>
            <h2 className="text-lg font-black text-gray-700 mb-6">Who is the King of Jungle?</h2>
            <div className="grid gap-2">
              {['Cat', 'Lion', 'Dog'].map(opt => (
                <button key={opt} onClick={() => { if(opt === 'Lion') { speak("Excellent!"); setQuizScore(s => s + 10); } else { speak("Try again!"); } }} className="bg-indigo-50 p-3 rounded-xl font-bold text-indigo-600 active:bg-indigo-600 active:text-white transition-all">{opt}</button>
              ))}
            </div>
          </div>
        )}
      </main>

      {screen !== 'home' && (
        <button onClick={() => setScreen('home')} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-indigo-600 px-8 py-2 rounded-full shadow-2xl font-black border-2 border-indigo-100 z-50 flex items-center active:scale-95 transition-all">
          <ArrowLeft size={18} className="mr-2" /> HOME
        </button>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<KidsLearningApp />);
