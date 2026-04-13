import { useState, useEffect, useCallback } from "react";
import { Heart, Calendar, MapPin, Clock, Gift, CheckCircle2, ChevronDown, Camera, Music, ImagePlus, ChevronLeft, ChevronRight, Sparkles, MessageSquare, Bed, Quote, Globe, Package, User, Lock, Unlock } from "lucide-react";

// ── Supabase config ──────────────────────────────────────────────
const SUPABASE_URL = "https://eycmdlmlslljzhzqbfio.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y21kbG1sc2xsanpoenFiZmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NzAzNTQsImV4cCI6MjA5MTE0NjM1NH0.YHQcvf1tilt4W33lSQUfO8q4KF1daXsaVBAFu56KJfA";

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
};

async function sbGet(table, params = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?order=created_at.desc${params}`, { headers });
  return res.json();
}

async function sbInsert(table, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  return res.json();
}

async function sbUpdate(table, id, data) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── Countdown ────────────────────────────────────────────────────
const weddingDate = new Date("2027-01-09T17:00:00");

function calcTimeLeft() {
  const diff = +weddingDate - +new Date();
  if (diff <= 0) return {};
  return {
    dias: Math.floor(diff / 86400000),
    horas: Math.floor((diff / 3600000) % 24),
    minutos: Math.floor((diff / 60000) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

// ── Modal Reserva ────────────────────────────────────────────────
function ModalReserva({ presente, onClose, onConfirm }) {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim()) return;
    setLoading(true);
    await onConfirm(presente.id, nome.trim());
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-4 border border-[#F0E8E9]">
            <Gift size={28} strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-serif text-[#301B1E] italic mb-1">Reservar Presente</h3>
          <p className="text-[#4A4243]">Você está reservando: <strong>{presente.nome}</strong></p>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#4A4243] uppercase tracking-wider mb-2">Seu nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none"
            placeholder="Ex: Tia Maria"
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 border border-[#F0E8E9] rounded-xl text-[#4A4243] hover:bg-[#fdfbfb] transition-colors font-medium">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !nome.trim()}
            className="flex-1 py-4 bg-[#8A3343] text-white rounded-xl hover:bg-[#6B2533] transition-colors font-semibold disabled:opacity-60"
          >
            {loading ? "Reservando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente Principal ─────────────────────────────────────────
export default function App() {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());
  const [rsvpStatus, setRsvpStatus] = useState("idle");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Recados
  const [recados, setRecados] = useState([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoMsg, setNovoMsg] = useState("");
  const [sendingRecado, setSendingRecado] = useState(false);

  // Presentes
  const [presentes, setPresentes] = useState([]);
  const [loadingPresentes, setLoadingPresentes] = useState(true);
  const [presenteModal, setPresenteModal] = useState(null);

  // RSVP fields
  const [rsvpNome, setRsvpNome] = useState("");
  const [rsvpPresenca, setRsvpPresenca] = useState("");
  const [rsvpAdultos, setRsvpAdultos] = useState("1");
  const [rsvpObs, setRsvpObs] = useState("");

  const fotosCasal = ["image_b486b8.jpeg", "image_b489a0.jpeg", "image_b489e2.jpeg"];

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load recados
  const loadRecados = useCallback(async () => {
    const data = await sbGet("recados");
    if (Array.isArray(data)) setRecados(data);
  }, []);

  // Load presentes
  const loadPresentes = useCallback(async () => {
    setLoadingPresentes(true);
    const data = await sbGet("presentes", "&order=id.asc");
    if (Array.isArray(data)) setPresentes(data);
    setLoadingPresentes(false);
  }, []);

  useEffect(() => {
    loadRecados();
    loadPresentes();
  }, [loadRecados, loadPresentes]);

  const nextSlide = () => setCurrentSlide((p) => (p === fotosCasal.length - 1 ? 0 : p + 1));
  const prevSlide = () => setCurrentSlide((p) => (p === 0 ? fotosCasal.length - 1 : p - 1));

  // RSVP submit
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setRsvpStatus("submitting");
    await sbInsert("rsvp", {
      nome: rsvpNome,
      presenca: rsvpPresenca === "yes",
      adultos: parseInt(rsvpAdultos),
      observacoes: rsvpObs || null,
    });
    setRsvpStatus("success");
  };

  // Recado submit
  const handleRecadoSubmit = async (e) => {
    e.preventDefault();
    setSendingRecado(true);
    const res = await sbInsert("recados", { nome: novoNome, mensagem: novoMsg });
    if (Array.isArray(res) && res[0]) {
      setRecados((prev) => [res[0], ...prev]);
    }
    setNovoNome("");
    setNovoMsg("");
    setSendingRecado(false);
  };

  // Reservar presente
  const handleReservar = async (id, nome) => {
    await sbUpdate("presentes", id, { reservado: true, reservado_por: nome });
    setPresentes((prev) => prev.map((p) => (p.id === id ? { ...p, reservado: true, reservado_por: nome } : p)));
  };

  const navLinks = [
    { name: "A Nossa História", href: "#historia" },
    { name: "Galeria", href: "#galeria" },
    { name: "O Casamento", href: "#detalhes" },
    { name: "Manual", href: "#manual" },
    { name: "Hotéis", href: "#hoteis" },
    { name: "Fotos", href: "#fotos" },
    { name: "Recados", href: "#recados" },
    { name: "Presentes", href: "#presentes" },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#301B1E] font-sans selection:bg-[#CBA1A6] selection:text-white">

      {/* Modal */}
      {presenteModal && (
        <ModalReserva
          presente={presenteModal}
          onClose={() => setPresenteModal(null)}
          onConfirm={handleReservar}
        />
      )}

      {/* Nav */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? "bg-[#fdfbfb]/95 backdrop-blur-md border-b border-[#F0E8E9] shadow-sm py-2" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`text-3xl md:text-4xl font-serif tracking-wider italic transition-colors duration-500 relative z-50 ${isScrolled || isMenuOpen ? "text-[#8A3343]" : "text-white drop-shadow-md"}`}>C & D</div>
            <div className={`hidden lg:flex items-center space-x-5 text-xs xl:text-sm uppercase tracking-[0.15em] font-medium transition-colors duration-500 ${isScrolled ? "text-[#4A4243]" : "text-white drop-shadow-md"}`}>
              {navLinks.map((l) => (
                <a key={l.name} href={l.href} className={`relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full ${isScrolled ? "hover:text-[#8A3343] after:bg-[#8A3343]" : "hover:text-white/80 after:bg-white"}`}>{l.name}</a>
              ))}
              <a href="#rsvp" className={`px-5 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${isScrolled ? "bg-[#8A3343] text-white hover:bg-[#6B2533] shadow-md" : "bg-white/20 text-white backdrop-blur-sm border border-white/50 hover:bg-white hover:text-[#8A3343]"}`}>
                Confirmar Presença
              </a>
            </div>
            <button className={`lg:hidden p-2 relative z-50 transition-colors duration-500 ${isScrolled || isMenuOpen ? "text-[#4A4243]" : "text-white drop-shadow-md"}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        <div className={`lg:hidden fixed inset-0 bg-[#fdfbfb] z-40 transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
          <div className="flex flex-col items-center space-y-5 text-center text-sm uppercase tracking-[0.2em] text-[#4A4243]">
            {navLinks.map((l) => (
              <a key={l.name} href={l.href} onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">{l.name}</a>
            ))}
            <a href="#rsvp" onClick={() => setIsMenuOpen(false)} className="bg-[#8A3343] text-white px-10 py-4 rounded-full mt-4 shadow-md tracking-widest">RSVP</a>
          </div>
          <div className="absolute bottom-8 text-center">
            <Heart className="mx-auto text-[#CBA1A6] mb-2" size={20} strokeWidth={1.5} />
            <p className="text-[#8A3343] font-serif italic text-lg">Cris & Doug</p>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070" alt="Casamento" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#301B1E]/40 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 flex flex-col items-center mt-16">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-6 font-light drop-shadow-md">Nós vamos casar!</p>
          <h1 className="text-6xl md:text-9xl font-serif mb-4 drop-shadow-lg italic">Cris & Doug</h1>
          <p className="text-xl md:text-3xl font-light tracking-wide mb-12 drop-shadow-md">09 de Janeiro de 2027 &bull; Três Lagoas, MS</p>
          <div className="flex gap-3 md:gap-8 text-center backdrop-blur-md bg-white/15 p-6 md:p-8 rounded-2xl border border-white/30 shadow-2xl">
            {Object.keys(timeLeft).length ? (
              Object.entries(timeLeft).map(([k, v]) => (
                <div key={k} className="flex flex-col items-center w-16 md:w-24">
                  <span className="text-4xl md:text-6xl font-serif mb-2 drop-shadow-sm">{v}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium opacity-90">{k}</span>
                </div>
              ))
            ) : (
              <span className="text-3xl font-serif">O grande dia chegou!</span>
            )}
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown size={36} className="opacity-80 drop-shadow-md" />
        </div>
      </section>

      {/* História */}
      <section id="historia" className="py-24 px-4 bg-[#fdfbfb]">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="mx-auto text-[#8A3343] mb-6" size={36} strokeWidth={1.2} />
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-10 italic">A Nossa História</h2>
          <div className="grid md:grid-cols-2 gap-12 text-left mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E8E9]">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-4">Como tudo começou</h3>
              <p className="text-[#4A4243] leading-relaxed text-lg">O que parecia ser apenas mais um dia comum acabou por ser o início de algo extraordinário. Nossos caminhos cruzaram-se, as conversas fluíram como se nos conhecêssemos há anos e, desde esse momento, não nos largámos mais.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E8E9]">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-4">O Pedido</h3>
              <p className="text-[#4A4243] leading-relaxed text-lg">Após meses de aventuras, viagens e de construirmos uma vida juntos, decidimos dar o próximo passo. Com muita emoção e a certeza de que somos o porto seguro um do outro, o "Sim" foi dito com o coração cheio de alegria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section id="galeria" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Nossos Momentos</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-12 italic">Galeria de Fotos</h2>
          <div className="relative max-w-4xl mx-auto group">
            <div className="overflow-hidden rounded-2xl shadow-lg aspect-[4/3] md:aspect-[16/10] relative bg-[#f9f8f8] border border-[#F0E8E9] flex items-center justify-center">
              <img src={fotosCasal[currentSlide]} alt={`Foto ${currentSlide + 1}`} className="w-full h-full object-contain transition-opacity duration-500" />
            </div>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#8A3343] p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md transform hover:scale-110 border border-[#F0E8E9]"><ChevronLeft size={24} /></button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#8A3343] p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md transform hover:scale-110 border border-[#F0E8E9]"><ChevronRight size={24} /></button>
            <div className="flex justify-center gap-3 mt-8">
              {fotosCasal.map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-300 ${i === currentSlide ? "bg-[#8A3343]" : "bg-[#F0E8E9] hover:bg-[#CBA1A6]"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detalhes */}
      <section id="detalhes" className="py-24 px-4 bg-[#fdfbfb] border-t border-[#F0E8E9] relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Quando & Onde</p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-4 italic">O Casamento</h2>
          </div>
          <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-lg border border-[#F0E8E9] flex flex-col items-center text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0E8E9] rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F0E8E9] rounded-tr-full opacity-50"></div>
            <div className="w-24 h-24 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] shadow-sm mb-8 relative z-10 border border-[#F0E8E9]">
              <MapPin size={40} strokeWidth={1.2} />
            </div>
            <h3 className="text-3xl md:text-4xl font-serif text-[#301B1E] mb-2 relative z-10">Recanto Sonho Meu Eventos</h3>
            <p className="text-[#8A3343] mb-10 pb-10 border-b border-[#F0E8E9] w-full max-w-2xl italic text-lg relative z-10">Cerimônia e Festa</p>
            <div className="grid md:grid-cols-2 gap-10 md:gap-4 w-full max-w-2xl mb-12 divide-y md:divide-y-0 md:divide-x divide-[#F0E8E9] relative z-10">
              <div className="flex flex-col items-center pt-4 md:pt-0 md:pr-4">
                <Calendar size={28} className="text-[#CBA1A6] mb-4" strokeWidth={1.5} />
                <h4 className="font-serif text-2xl text-[#301B1E] mb-2">A Cerimônia</h4>
                <div className="flex items-center text-[#4A4243] text-lg bg-[#fdfbfb] px-4 py-2 rounded-full shadow-sm border border-[#F0E8E9] mb-2"><Clock size={18} className="mr-2 text-[#CBA1A6]" />17:00</div>
                <p className="text-[#8A3343] text-sm italic">Chegada a partir das 15:00</p>
              </div>
              <div className="flex flex-col items-center pt-10 md:pt-0 md:pl-4">
                <Camera size={28} className="text-[#CBA1A6] mb-4" strokeWidth={1.5} />
                <h4 className="font-serif text-2xl text-[#301B1E] mb-2">A Festa</h4>
                <div className="flex items-center text-[#4A4243] text-lg bg-[#fdfbfb] px-4 py-2 rounded-full shadow-sm border border-[#F0E8E9]"><Clock size={18} className="mr-2 text-[#CBA1A6]" />19:00</div>
              </div>
            </div>
            <a href="https://share.google/yU46iZuGmQB90Trw2" target="_blank" rel="noopener noreferrer" className="relative z-10 inline-flex items-center gap-3 bg-[#8A3343] text-white px-8 py-4 rounded-full hover:bg-[#6B2533] transition-all transform hover:scale-105 uppercase tracking-[0.1em] text-sm font-semibold shadow-md">
              <MapPin size={18} /> Ver Rota no Mapa
            </a>
          </div>
        </div>
      </section>

      {/* Manual */}
      <section id="manual" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <Sparkles size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Guia para o grande dia</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">Manual do Convidado</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-16 max-w-2xl mx-auto">Preparámos estas dicas com muito carinho para que a nossa celebração seja fluida, harmoniosa e inesquecível para todos.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Seja Pontual", text: "A cerimônia é um momento único e delicado. Chegar a tempo nos permitirá compartilhar essa alegria sem interrupções. Contamos com sua pontualidade!" },
              { title: "Participe da Cerimônia", text: "A cerimônia é um dos momentos mais significativos para os noivos, e sua presença faz toda a diferença. Pedimos que evitem sair e que participem da celebração!" },
              { title: "Código de Vestimenta", text: "Sugerimos o estilo esporte fino. Homens podem optar por camisa e calça social, e mulheres por vestidos midi ou longos fluidos." },
              { title: "Não use Branco!", text: "Essa cor (e tons como off-white e bege claro) é reservada para a noiva. Pedimos também que evitem Verde e Marsala, que são as cores exclusivas das madrinhas. 🍷😅", highlight: true },
              { title: "Convidado Não Convida", text: "Sabemos que é natural querer compartilhar esse momento, mas pedimos que respeitem nossa lista de convidados. Cada nome foi pensado com muito carinho!" },
              { title: "Confirme Presença", text: "Sua presença é muito importante para nós! Por isso, pedimos que nos avise com antecedência se poderá comparecer para nos ajudar a organizar tudo da melhor forma." },
            ].map((item) => (
              <div key={item.title} className={`${item.highlight ? "bg-[#FFF5F5] border-[#FADBD8]" : "bg-[#fdfbfb] border-[#F0E8E9]"} p-10 rounded-2xl border shadow-sm transform transition-transform hover:-translate-y-1 flex flex-col items-center text-center`}>
                <Quote size={32} className={`${item.highlight ? "text-[#8A3343]" : "text-[#CBA1A6]"} mb-6`} />
                <h3 className={`text-xl font-serif ${item.highlight ? "text-[#8A3343]" : "text-[#301B1E]"} mb-4 uppercase tracking-widest`}>{item.title}</h3>
                <p className="text-[#4A4243] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotéis */}
      <section id="hoteis" className="py-24 px-4 bg-[#fdfbfb] border-t border-[#F0E8E9]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <Bed size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Para quem vem de fora</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">Onde Ficar</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-12 max-w-2xl mx-auto">Se vêm de outra cidade para celebrar connosco, separamos excelentes opções de hotéis em Três Lagoas.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              { nome: "Taj Hotel", desc: "Uma das opções mais sofisticadas da cidade, com excelente infraestrutura e pequeno-almoço maravilhoso.", mapa: "https://www.google.com/maps/search/Taj+Hotel+Tres+Lagoas", site: "https://www.google.com/search?q=Taj+Hotel+Tres+Lagoas+site" },
              { nome: "Druds Express", desc: "Opção muito prática, moderna e com excelente custo-benefício. Ótima localização para quem procura conveniência.", mapa: "https://www.google.com/maps/search/Druds+Express+Hotel+Tres+Lagoas", site: "https://www.drudshotel.com.br/" },
              { nome: "Vila Romana Park", desc: "Perfeito para quem procura ambiente tranquilo, com bastante área verde e piscina para relaxar após a viagem.", mapa: "https://www.google.com/maps/search/Vila+Romana+Park+Hotel+Tres+Lagoas", site: "https://www.vilaromanaparkhotel.com.br/" },
              { nome: "Hotel OT", desc: "Um clássico da cidade! Fica em frente à Lagoa Maior, com vista privilegiada e excelente área de lazer.", mapa: "https://www.google.com/maps/search/Hotel+OT+Tres+Lagoas", site: "https://www.hotelot.com.br/" },
              { nome: "Mura Hotel", desc: "Moderno e elegante, com quartos novos, ótimo atendimento e localização central que facilita o acesso.", mapa: "https://www.google.com/maps/search/Mura+Hotel+Tres+Lagoas", site: "https://www.murahotel.com.br/" },
              { nome: "Tokyos Hotel", desc: "Estadia tradicional e acolhedora com serviço atencioso. Perfeito para famílias que buscam tranquilidade.", mapa: "https://www.google.com/maps/search/Tokyos+Hotel+Tres+Lagoas", site: "https://www.tokyoshotel.com.br/" },
            ].map((h) => (
              <div key={h.nome} className="bg-white p-8 rounded-2xl border border-[#F0E8E9] shadow-sm flex flex-col h-full transform transition-transform hover:-translate-y-1">
                <h3 className="text-2xl font-serif text-[#8A3343] mb-3">{h.nome}</h3>
                <p className="text-[#4A4243] text-base mb-6 flex-grow">{h.desc}</p>
                <div className="flex flex-wrap gap-4 mt-auto">
                  <a href={h.mapa} target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2"><MapPin size={16} /> Mapa</a>
                  <a href={h.site} target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2"><Globe size={16} /> Site</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fotos */}
      <section id="fotos" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <ImagePlus size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Capturem cada momento</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">O Nosso Álbum Partilhado</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-10 max-w-2xl mx-auto">Queremos ver o nosso grande dia através dos vossos olhos! Criámos um álbum digital onde todos podem partilhar as fotografias e os vídeos.</p>
          <div className="bg-[#fdfbfb] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F0E8E9] max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-[#8A3343] mb-4">Como partilhar?</h3>
            <p className="text-[#4A4243] mb-8 text-lg">Basta clicar no botão abaixo para aceder à nossa pasta partilhada.</p>
            <a href="https://photos.app.goo.gl/kNKMBfftRUVmTab38" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#CBA1A6] text-[#301B1E] px-10 py-4 rounded-full hover:bg-[#b88c91] transition-colors uppercase tracking-[0.1em] text-sm font-semibold shadow-md">
              Adicionar Fotos ao Álbum
            </a>
          </div>
        </div>
      </section>

      {/* Playlist */}
      <section id="playlist" className="py-24 px-4 bg-[#fdfbfb] border-t border-[#F0E8E9]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <Music size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">No ritmo da festa</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">A Nossa Trilha Sonora</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-10 max-w-2xl mx-auto">A festa é nossa, mas a música também é de vocês! Adicione aquelas músicas que não podem faltar para animar a pista de dança.</p>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#F0E8E9] max-w-2xl mx-auto mb-8 bg-[#f5f3f3]">
            <iframe style={{ borderRadius: "16px" }} src="https://open.spotify.com/embed/playlist/6EE7EDNFBIQ83oVaNnm77R?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify Playlist" />
          </div>
          <a href="https://open.spotify.com/playlist/6EE7EDNFBIQ83oVaNnm77R?si=5704811e91724e9b" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#8A3343] text-white px-10 py-4 rounded-full hover:bg-[#6B2533] transition-colors uppercase tracking-[0.1em] text-sm font-semibold shadow-md">
            Adicionar Músicas no Spotify
          </a>
        </div>
      </section>

      {/* Recados */}
      <section id="recados" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <MessageSquare size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Deixem o vosso carinho</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">Mural de Recados</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-12 max-w-2xl mx-auto">A vossa presença e as vossas palavras são muito importantes para nós. Deixem uma mensagem!</p>
          <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
            {recados.slice(0, 6).map((r) => (
              <div key={r.id} className="bg-[#fdfbfb] p-8 rounded-2xl border border-[#F0E8E9] shadow-sm relative transform transition-transform hover:-translate-y-1">
                <Heart size={20} className="absolute top-6 right-6 text-[#CBA1A6]/30 fill-[#CBA1A6]/10" />
                <p className="text-[#4A4243] italic mb-6 text-lg">"{r.mensagem}"</p>
                <p className="text-[#8A3343] font-medium font-serif">— {r.nome}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#fdfbfb] p-8 md:p-12 rounded-[2rem] shadow-sm border border-[#F0E8E9] max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-[#8A3343] mb-8 text-center">Escreva uma mensagem</h3>
            <form onSubmit={handleRecadoSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-semibold text-[#4A4243] uppercase tracking-wider mb-2">O Seu Nome</label>
                <input type="text" required value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full px-5 py-4 bg-white border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none transition-all shadow-sm" placeholder="Ex: Tio João e Tia Maria" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4A4243] uppercase tracking-wider mb-2">Mensagem aos Noivos</label>
                <textarea required rows="4" value={novoMsg} onChange={(e) => setNovoMsg(e.target.value)} className="w-full px-5 py-4 bg-white border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none resize-none transition-all shadow-sm" placeholder="Deixem os vossos votos e carinho aqui..." />
              </div>
              <button type="submit" disabled={sendingRecado} className="w-full bg-[#CBA1A6] text-[#301B1E] py-5 rounded-xl hover:bg-[#b88c91] transition-all transform hover:-translate-y-0.5 uppercase tracking-widest font-semibold disabled:opacity-70 disabled:transform-none shadow-md mt-4">
                {sendingRecado ? "A enviar..." : "Publicar Mensagem"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Lista de Presentes ──────────────────────────────────────── */}
      <section id="presentes" className="py-24 px-4 bg-[#fdfbfb] border-t border-[#F0E8E9]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <Gift size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Mimo aos noivos</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-4 italic">Lista de Presentes</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-12 max-w-2xl mx-auto">
            A presença de cada um de vocês é o nosso maior presente! Se desejarem abençoar o nosso novo lar, preparámos uma lista especial. Clique em <strong>Quero dar este presente</strong> para reservar um item — assim evitamos presentes repetidos! 🎁
          </p>

          {loadingPresentes ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-10 h-10 border-4 border-[#F0E8E9] border-t-[#8A3343] rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Estatísticas */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <div className="bg-white px-6 py-4 rounded-2xl border border-[#F0E8E9] shadow-sm text-center">
                  <p className="text-3xl font-serif text-[#8A3343]">{presentes.length}</p>
                  <p className="text-sm text-[#4A4243] uppercase tracking-wider mt-1">Total de itens</p>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl border border-[#F0E8E9] shadow-sm text-center">
                  <p className="text-3xl font-serif text-[#8A3343]">{presentes.filter((p) => p.reservado).length}</p>
                  <p className="text-sm text-[#4A4243] uppercase tracking-wider mt-1">Já reservados</p>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl border border-[#F0E8E9] shadow-sm text-center">
                  <p className="text-3xl font-serif text-[#8A3343]">{presentes.filter((p) => !p.reservado).length}</p>
                  <p className="text-sm text-[#4A4243] uppercase tracking-wider mt-1">Disponíveis</p>
                </div>
              </div>

              {/* Grid de presentes */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {presentes.map((p) => (
                  <div key={p.id} className={`bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${p.reservado ? "border-[#F0E8E9] opacity-75" : "border-[#F0E8E9] hover:shadow-md hover:-translate-y-1"}`}>
                    {/* Imagem ou placeholder */}
                    <div className="w-full h-40 bg-gradient-to-br from-[#fdfbfb] to-[#F0E8E9] flex items-center justify-center relative">
                      {p.imagem_url ? (
                        <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={48} className="text-[#CBA1A6]" strokeWidth={1} />
                      )}
                      {p.reservado && (
                        <div className="absolute inset-0 bg-[#301B1E]/40 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full px-4 py-2 flex items-center gap-2 text-[#8A3343] font-semibold text-sm">
                            <Lock size={14} /> Reservado
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-serif text-[#301B1E] mb-2">{p.nome}</h3>
                      {p.descricao && <p className="text-[#4A4243] text-sm mb-4 flex-grow">{p.descricao}</p>}
                      {p.preco_estimado && (
                        <p className="text-[#8A3343] font-semibold text-sm mb-4">
                          ~R$ {Number(p.preco_estimado).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                        </p>
                      )}

                      {p.reservado ? (
                        <div className="flex items-center gap-2 text-[#4A4243] text-sm bg-[#fdfbfb] px-4 py-3 rounded-xl border border-[#F0E8E9]">
                          <User size={14} className="text-[#CBA1A6]" />
                          <span>Reservado por <strong>{p.reservado_por}</strong></span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPresenteModal(p)}
                          className="w-full flex items-center justify-center gap-2 bg-[#8A3343] text-white py-3 rounded-xl hover:bg-[#6B2533] transition-all font-semibold text-sm uppercase tracking-wider shadow-sm"
                        >
                          <Unlock size={15} />
                          Quero dar este presente
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-4 italic">RSVP</h2>
            <p className="text-[#8A3343] text-lg">Por favor, confirme a sua presença até 09 de Dezembro de 2026.</p>
          </div>
          {rsvpStatus === "success" ? (
            <div className="bg-white p-12 rounded-[2rem] border border-[#F0E8E9] shadow-lg text-center">
              <CheckCircle2 size={64} className="text-[#8A3343] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="text-3xl font-serif text-[#301B1E] mb-4 italic">Muito Obrigado!</h3>
              <p className="text-[#4A4243] text-lg">A sua confirmação foi recebida com sucesso. Estamos ansiosos para celebrar este dia consigo!</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-[2rem] shadow-xl text-[#301B1E] border border-[#F0E8E9]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Nome Completo</label>
                <input type="text" required value={rsvpNome} onChange={(e) => setRsvpNome(e.target.value)} className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] transition-all outline-none" placeholder="Ex: João Silva" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Você irá ao evento?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 flex items-center justify-center gap-3 p-5 border border-[#F0E8E9] rounded-xl cursor-pointer hover:bg-[#fdfbfb] transition-colors">
                    <input type="radio" name="attending" value="yes" required onChange={(e) => setRsvpPresenca(e.target.value)} className="w-5 h-5 text-[#8A3343]" />
                    <span className="font-medium">Sim, com certeza!</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-3 p-5 border border-[#F0E8E9] rounded-xl cursor-pointer hover:bg-red-50 transition-colors">
                    <input type="radio" name="attending" value="no" required onChange={(e) => setRsvpPresenca(e.target.value)} className="w-5 h-5 text-red-500" />
                    <span className="font-medium">Não poderei ir</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Quantos adultos (incluindo você)?</label>
                <select value={rsvpAdultos} onChange={(e) => setRsvpAdultos(e.target.value)} className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none">
                  {["1","2","3","4","5"].map((n) => <option key={n} value={n}>{n === "5" ? "5 ou mais" : `${n} Adulto${n !== "1" ? "s" : ""}`}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Restrições Alimentares / Mensagem</label>
                <textarea rows="4" value={rsvpObs} onChange={(e) => setRsvpObs(e.target.value)} className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none resize-none" placeholder="Deixe uma mensagem carinhosa ou informe-nos sobre alergias..." />
              </div>
              <button type="submit" disabled={rsvpStatus === "submitting"} className="w-full bg-[#8A3343] text-white py-5 rounded-xl hover:bg-[#6B2533] transition-all transform hover:-translate-y-0.5 uppercase tracking-widest font-semibold disabled:opacity-70 shadow-md mt-4">
                {rsvpStatus === "submitting" ? <span className="animate-pulse">A enviar...</span> : "Confirmar Presença"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 text-center border-t border-[#F0E8E9]">
        <h2 className="text-4xl font-serif text-[#8A3343] mb-6 italic">Cris & Doug</h2>
        <p className="text-[#4A4243] uppercase tracking-widest text-sm mb-3">Com amor, e até breve.</p>
        <p className="text-[#CBA1A6] text-sm">© 2027. Três Lagoas, MS.</p>
      </footer>
    </div>
  );
}
