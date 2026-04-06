import React, { useState, useEffect } from 'react';
import { Heart, Calendar, MapPin, Clock, Gift, CheckCircle2, ChevronDown, Camera, Music, ImagePlus, ChevronLeft, ChevronRight, Sparkles, AlertCircle, MessageSquare, Bed, Quote, Globe } from 'lucide-react';

// Data do casamento: 09 de Janeiro de 2027 às 17:00
const weddingDate = new Date('2027-01-09T17:00:00');

export default function App() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [rsvpStatus, setRsvpStatus] = useState('idle'); // idle, submitting, success
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Estado do Mural de Recados
  const [recados, setRecados] = useState([
    { id: 1, nome: 'Família Silva', mensagem: 'Que a felicidade a dois continue a ser o principal objetivo das vossas vidas! Amamos muito vocês.' },
    { id: 2, nome: 'João e Ana', mensagem: 'Mal podemos esperar para celebrar este dia tão especial! Que Deus abençoe grandemente esta união.' },
    { id: 3, nome: 'Tia Bete', mensagem: 'Casal lindo! Que a festa seja incrível e a vida de vocês mais ainda. Até dia 09!' },
  ]);
  const [novoRecadoNome, setNovoRecadoNome] = useState('');
  const [novoRecadoMensagem, setNovoRecadoMensagem] = useState('');
  const [isSubmittingRecado, setIsSubmittingRecado] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Utilizando os ficheiros de imagem que carregou diretamente no chat
  const fotosCasal = [
    'image_b486b8.jpeg',
    'image_b489a0.jpeg',
    'image_b489e2.jpeg'
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === fotosCasal.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? fotosCasal.length - 1 : prev - 1));
  };

  function calculateTimeLeft() {
    const difference = +weddingDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    setRsvpStatus('submitting');
    // Simular o envio do formulário
    setTimeout(() => {
      setRsvpStatus('success');
    }, 1500);
  };

  const handleRecadoSubmit = (e) => {
    e.preventDefault();
    setIsSubmittingRecado(true);
    
    // Simular o envio e publicação da mensagem
    setTimeout(() => {
      const novo = { id: Date.now(), nome: novoRecadoNome, mensagem: novoRecadoMensagem };
      setRecados([novo, ...recados]);
      setNovoRecadoNome('');
      setNovoRecadoMensagem('');
      setIsSubmittingRecado(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fdfbfb] text-[#301B1E] font-sans selection:bg-[#CBA1A6] selection:text-white">
      {/* Navegação */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#fdfbfb]/95 backdrop-blur-md border-b border-[#F0E8E9] shadow-sm py-2' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`text-3xl md:text-4xl font-serif tracking-wider italic transition-colors duration-500 relative z-50 ${isScrolled || isMenuOpen ? 'text-[#8A3343]' : 'text-white drop-shadow-md'}`}>C & D</div>
            
            {/* Menu Desktop */}
            <div className={`hidden lg:flex items-center space-x-6 text-xs xl:text-sm uppercase tracking-[0.15em] font-medium transition-colors duration-500 ${isScrolled ? 'text-[#4A4243]' : 'text-white drop-shadow-md'}`}>
              {[
                { name: 'A Nossa História', href: '#historia' },
                { name: 'Galeria', href: '#galeria' },
                { name: 'O Casamento', href: '#detalhes' },
                { name: 'Manual', href: '#manual' },
                { name: 'Hotéis', href: '#hoteis' },
                { name: 'Fotos', href: '#fotos' },
                { name: 'Recados', href: '#recados' },
                { name: 'Presentes', href: '#presentes' },
              ].map((link) => (
                <a key={link.name} href={link.href} className={`relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:transition-all after:duration-300 hover:after:w-full ${isScrolled ? 'hover:text-[#8A3343] after:bg-[#8A3343]' : 'hover:text-white/80 after:bg-white'}`}>
                  {link.name}
                </a>
              ))}
              <a href="#rsvp" className={`px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 ${isScrolled ? 'bg-[#8A3343] text-white hover:bg-[#6B2533] shadow-md' : 'bg-white/20 text-white backdrop-blur-sm border border-white/50 hover:bg-white hover:text-[#8A3343]'}`}>
                Confirmar Presença
              </a>
            </div>

            {/* Menu Mobile Button */}
            <button 
              className={`lg:hidden p-2 relative z-50 transition-colors duration-500 ${isScrolled || isMenuOpen ? 'text-[#4A4243]' : 'text-white drop-shadow-md'}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile Overlay (Full Screen) */}
        <div className={`lg:hidden fixed inset-0 bg-[#fdfbfb] z-40 transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex flex-col items-center space-y-5 text-center text-sm uppercase tracking-[0.2em] text-[#4A4243]">
              <a href="#historia" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">A Nossa História</a>
              <a href="#galeria" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">Galeria</a>
              <a href="#detalhes" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">O Casamento</a>
              <a href="#manual" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">Manual do Convidado</a>
              <a href="#hoteis" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">Hotéis</a>
              <a href="#fotos" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">Fotos</a>
              <a href="#playlist" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">Playlist</a>
              <a href="#recados" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">Recados</a>
              <a href="#presentes" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#8A3343] transition-colors">Presentes</a>
              <a href="#rsvp" onClick={() => setIsMenuOpen(false)} className="bg-[#8A3343] text-white px-10 py-4 rounded-full mt-4 shadow-md tracking-widest">RSVP</a>
          </div>
          <div className="absolute bottom-8 text-center">
             <Heart className="mx-auto text-[#CBA1A6] mb-2" size={20} strokeWidth={1.5} />
             <p className="text-[#8A3343] font-serif italic text-lg">Cris & Doug</p>
          </div>
        </div>
      </nav>

      {/* Secção Hero */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Imagem de fundo romântica */}
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2070" 
            alt="Decoração de Casamento" 
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay escuro/marsala para ler o texto */}
          <div className="absolute inset-0 bg-[#301B1E]/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 flex flex-col items-center mt-16">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-6 font-light drop-shadow-md">Nós vamos casar!</p>
          <h1 className="text-6xl md:text-9xl font-serif mb-4 drop-shadow-lg italic">Cris & Doug</h1>
          <p className="text-xl md:text-3xl font-light tracking-wide mb-12 drop-shadow-md">
            09 de Janeiro de 2027 &bull; Três Lagoas, MS
          </p>
          
          {/* Contagem Decrescente */}
          <div className="flex gap-3 md:gap-8 text-center backdrop-blur-md bg-white/15 p-6 md:p-8 rounded-2xl border border-white/30 shadow-2xl">
            {Object.keys(timeLeft).length ? (
              Object.entries(timeLeft).map(([interval, value]) => (
                <div key={interval} className="flex flex-col items-center w-16 md:w-24">
                  <span className="text-4xl md:text-6xl font-serif mb-2 drop-shadow-sm">{value}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium opacity-90">{interval}</span>
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

      {/* Secção A Nossa História */}
      <section id="historia" className="py-24 px-4 bg-[#fdfbfb]">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="mx-auto text-[#8A3343] mb-6" size={36} strokeWidth={1.2} />
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-10 italic">A Nossa História</h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-left mt-16">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E8E9]">
                <h3 className="text-2xl font-serif text-[#8A3343] mb-4">Como tudo começou</h3>
                <p className="text-[#4A4243] leading-relaxed text-lg">
                  O que parecia ser apenas mais um dia comum acabou por ser o início de algo extraordinário. Nossos caminhos cruzaram-se, as conversas fluíram como se nos conhecêssemos há anos e, desde esse momento, não nos largámos mais.
                </p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#F0E8E9]">
                <h3 className="text-2xl font-serif text-[#8A3343] mb-4">O Pedido</h3>
                <p className="text-[#4A4243] leading-relaxed text-lg">
                  Após meses de aventuras, viagens e de construirmos uma vida juntos, decidimos dar o próximo passo. Com muita emoção e a certeza de que somos o porto seguro um do outro, o "Sim" foi dito com o coração cheio de alegria.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Secção Galeria (Carrossel) */}
      <section id="galeria" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Nossos Momentos</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-12 italic">Galeria de Fotos</h2>

          <div className="relative max-w-4xl mx-auto group">
            {/* Imagem do Carrossel */}
            <div className="overflow-hidden rounded-2xl shadow-lg aspect-[4/3] md:aspect-[16/10] relative bg-[#f9f8f8] border border-[#F0E8E9] flex items-center justify-center">
              <img
                src={fotosCasal[currentSlide]}
                alt={`Momento especial ${currentSlide + 1}`}
                className="w-full h-full object-contain transition-opacity duration-500"
              />
            </div>

            {/* Controles do Carrossel */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#8A3343] p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md transform hover:scale-110 border border-[#F0E8E9]"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#8A3343] p-3 md:p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md transform hover:scale-110 border border-[#F0E8E9]"
              aria-label="Próxima foto"
            >
              <ChevronRight size={24} />
            </button>

            {/* Indicadores (Dots) */}
            <div className="flex justify-center gap-3 mt-8">
              {fotosCasal.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-colors duration-300 ${
                    currentSlide === index ? 'bg-[#8A3343]' : 'bg-[#F0E8E9] hover:bg-[#CBA1A6]'
                  }`}
                  aria-label={`Ir para a foto ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secção Detalhes do Evento */}
      <section id="detalhes" className="py-24 px-4 bg-[#fdfbfb] border-t border-[#F0E8E9] relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
           {/* Padrão subtil de fundo */}
           <div className="w-[800px] h-[800px] rounded-full bg-[#8A3343] blur-3xl absolute -top-40 -left-40"></div>
           <div className="w-[600px] h-[600px] rounded-full bg-[#CBA1A6] blur-3xl absolute bottom-0 right-0"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Quando & Onde</p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-4 italic">O Casamento</h2>
          </div>

          <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-lg border border-[#F0E8E9] flex flex-col items-center text-center max-w-4xl mx-auto transform transition-transform hover:-translate-y-1 relative overflow-hidden">
            {/* Elemento decorativo de fundo no cartão */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0E8E9] rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#F0E8E9] rounded-tr-full opacity-50"></div>

            <div className="w-24 h-24 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] shadow-sm mb-8 relative z-10 border border-[#F0E8E9]">
              <MapPin size={40} strokeWidth={1.2} />
            </div>

            <h3 className="text-3xl md:text-4xl font-serif text-[#301B1E] mb-2 relative z-10">Recanto Sonho Meu Eventos</h3>
            <p className="text-[#8A3343] mb-10 pb-10 border-b border-[#F0E8E9] w-full max-w-2xl italic text-lg relative z-10">
              Cerimônia e Festa 
            </p>
            
            <div className="grid md:grid-cols-2 gap-10 md:gap-4 w-full max-w-2xl mb-12 divide-y md:divide-y-0 md:divide-x divide-[#F0E8E9] relative z-10">
              {/* Cerimónia */}
              <div className="flex flex-col items-center pt-4 md:pt-0 md:pr-4">
                <Calendar size={28} className="text-[#CBA1A6] mb-4" strokeWidth={1.5} />
                <h4 className="font-serif text-2xl text-[#301B1E] mb-2">A Cerimônia</h4>
                <div className="flex items-center text-[#4A4243] text-lg bg-[#fdfbfb] px-4 py-2 rounded-full shadow-sm border border-[#F0E8E9] mb-2">
                  <Clock size={18} className="mr-2 text-[#CBA1A6]"/>
                  17:00
                </div>
                <p className="text-[#8A3343] text-sm italic">Chegada a partir das 15:00</p>
              </div>

              {/* Festa */}
              <div className="flex flex-col items-center pt-10 md:pt-0 md:pl-4">
                <Camera size={28} className="text-[#CBA1A6] mb-4" strokeWidth={1.5} />
                <h4 className="font-serif text-2xl text-[#301B1E] mb-2">A Festa</h4>
                <div className="flex items-center text-[#4A4243] text-lg bg-[#fdfbfb] px-4 py-2 rounded-full shadow-sm border border-[#F0E8E9]">
                  <Clock size={18} className="mr-2 text-[#CBA1A6]"/>
                  19:00
                </div>
              </div>
            </div>

            <a 
              href="https://share.google/yU46iZuGmQB90Trw2" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative z-10 inline-flex items-center gap-3 bg-[#8A3343] text-white px-8 py-4 rounded-full hover:bg-[#6B2533] transition-all transform hover:scale-105 uppercase tracking-[0.1em] text-sm font-semibold shadow-md"
            >
              <MapPin size={18} />
              Ver Rota no Mapa
            </a>
          </div>
        </div>
      </section>

      {/* Secção Manual do Convidado */}
      <section id="manual" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <Sparkles size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Guia para o grande dia</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">Manual do Convidado</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-16 max-w-2xl mx-auto">
            Preparámos estas dicas com muito carinho para que a nossa celebração seja fluida, harmoniosa e inesquecível para todos.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Regra 1: Pontualidade */}
            <div className="bg-[#fdfbfb] p-10 rounded-2xl border border-[#F0E8E9] shadow-sm transform transition-transform hover:-translate-y-1 flex flex-col items-center text-center">
              <Quote size={32} className="text-[#CBA1A6] mb-6" />
              <h3 className="text-xl font-serif text-[#301B1E] mb-4 uppercase tracking-widest">Seja Pontual</h3>
              <p className="text-[#4A4243] leading-relaxed">
                A cerimônia é um momento único e delicado. Chegar a tempo nos permitirá compartilhar essa alegria sem interrupções. Contamos com sua pontualidade!
              </p>
            </div>

            {/* Regra 2: Cerimónia */}
            <div className="bg-[#fdfbfb] p-10 rounded-2xl border border-[#F0E8E9] shadow-sm transform transition-transform hover:-translate-y-1 flex flex-col items-center text-center">
              <Quote size={32} className="text-[#CBA1A6] mb-6" />
              <h3 className="text-xl font-serif text-[#301B1E] mb-4 uppercase tracking-widest">Participe da Cerimônia</h3>
              <p className="text-[#4A4243] leading-relaxed">
                A cerimônia é um dos momentos mais significativos para os noivos, e sua presença faz toda a diferença. Pedimos que evitem sair e que participem da celebração!
              </p>
            </div>

            {/* Regra 3: Vestimenta */}
            <div className="bg-[#fdfbfb] p-10 rounded-2xl border border-[#F0E8E9] shadow-sm transform transition-transform hover:-translate-y-1 flex flex-col items-center text-center">
              <Quote size={32} className="text-[#CBA1A6] mb-6" />
              <h3 className="text-xl font-serif text-[#301B1E] mb-4 uppercase tracking-widest">Código de Vestimenta</h3>
              <p className="text-[#4A4243] leading-relaxed">
                Sugerimos o estilo <strong>esporte fino</strong>, que é ideal para este dia especial. Homens podem optar por camisa e calça social (ou sarja), e mulheres por vestidos midi ou longos fluidos.
              </p>
            </div>

            {/* Regra 4: Cores Proibidas */}
            <div className="bg-[#FFF5F5] p-10 rounded-2xl border border-[#FADBD8] shadow-sm transform transition-transform hover:-translate-y-1 flex flex-col items-center text-center">
              <Quote size={32} className="text-[#8A3343] mb-6" />
              <h3 className="text-xl font-serif text-[#8A3343] mb-4 uppercase tracking-widest">Não use Branco!</h3>
              <p className="text-[#4A4243] leading-relaxed">
                Essa cor (e tons como off-white e bege claro) é reservada para a noiva. Pedimos também que <strong>evitem Verde e Marsala</strong>, que são as cores exclusivas das madrinhas. A madrinha já tem a taça de vinho pronta! 🍷😅
              </p>
            </div>

            {/* Regra 5: Convidados */}
            <div className="bg-[#fdfbfb] p-10 rounded-2xl border border-[#F0E8E9] shadow-sm transform transition-transform hover:-translate-y-1 flex flex-col items-center text-center">
              <Quote size={32} className="text-[#CBA1A6] mb-6" />
              <h3 className="text-xl font-serif text-[#301B1E] mb-4 uppercase tracking-widest">Convidado Não Convida</h3>
              <p className="text-[#4A4243] leading-relaxed">
                Sabemos que é natural querer compartilhar esse momento com pessoas queridas, mas pedimos que respeitem nossa lista de convidados. Cada nome foi pensado com muito carinho!
              </p>
            </div>

            {/* Regra 6: RSVP */}
            <div className="bg-[#fdfbfb] p-10 rounded-2xl border border-[#F0E8E9] shadow-sm transform transition-transform hover:-translate-y-1 flex flex-col items-center text-center">
              <Quote size={32} className="text-[#CBA1A6] mb-6" />
              <h3 className="text-xl font-serif text-[#301B1E] mb-4 uppercase tracking-widest">Confirme Presença</h3>
              <p className="text-[#4A4243] leading-relaxed">
                Sua presença é muito importante para nós! Por isso, pedimos que nos avise com antecedência se poderá comparecer para nos ajudar a organizar tudo da melhor forma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secção Hotéis */}
      <section id="hoteis" className="py-24 px-4 bg-[#fdfbfb] border-t border-[#F0E8E9]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <Bed size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Para quem vem de fora</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">Onde Ficar</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-12 max-w-2xl mx-auto">
            Se vêm de outra cidade para celebrar connosco, separamos excelentes opções de hotéis em Três Lagoas para que possam descansar com todo o conforto.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {/* Hotel 1 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F0E8E9] shadow-sm flex flex-col h-full transform transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-3">Taj Hotel</h3>
              <p className="text-[#4A4243] text-base mb-6 flex-grow">
                Uma das opções mais sofisticadas da cidade, oferecendo excelente infraestrutura, muito conforto e um pequeno-almoço maravilhoso.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <a href="https://www.google.com/maps/search/Taj+Hotel+Tres+Lagoas" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <MapPin size={16} /> Mapa
                </a>
                <a href="https://www.google.com/search?q=Taj+Hotel+Tres+Lagoas+site" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <Globe size={16} /> Site
                </a>
              </div>
            </div>

            {/* Hotel 2 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F0E8E9] shadow-sm flex flex-col h-full transform transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-3">Druds Express</h3>
              <p className="text-[#4A4243] text-base mb-6 flex-grow">
                Uma opção muito prática, moderna e com excelente custo-benefício. Ótima localização para quem procura conveniência e agilidade.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <a href="https://www.google.com/maps/search/Druds+Express+Hotel+Tres+Lagoas" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <MapPin size={16} /> Mapa
                </a>
                <a href="https://www.drudshotel.com.br/" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <Globe size={16} /> Site
                </a>
              </div>
            </div>

            {/* Hotel 3 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F0E8E9] shadow-sm flex flex-col h-full transform transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-3">Vila Romana Park</h3>
              <p className="text-[#4A4243] text-base mb-6 flex-grow">
                Perfeito para quem procura um ambiente mais tranquilo, com bastante área verde e piscina para relaxar após a viagem.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <a href="https://www.google.com/maps/search/Vila+Romana+Park+Hotel+Tres+Lagoas" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <MapPin size={16} /> Mapa
                </a>
                <a href="https://www.vilaromanaparkhotel.com.br/" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <Globe size={16} /> Site
                </a>
              </div>
            </div>

            {/* Hotel 4 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F0E8E9] shadow-sm flex flex-col h-full transform transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-3">Hotel OT</h3>
              <p className="text-[#4A4243] text-base mb-6 flex-grow">
                Um clássico da cidade! Fica em frente à bela Lagoa Maior, oferecendo conforto com uma vista privilegiada e excelente área de lazer.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <a href="https://www.google.com/maps/search/Hotel+OT+Tres+Lagoas" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <MapPin size={16} /> Mapa
                </a>
                <a href="https://www.hotelot.com.br/" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <Globe size={16} /> Site
                </a>
              </div>
            </div>

            {/* Hotel 5 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F0E8E9] shadow-sm flex flex-col h-full transform transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-3">Mura Hotel</h3>
              <p className="text-[#4A4243] text-base mb-6 flex-grow">
                Uma opção moderna e elegante, com quartos novos, ótimo atendimento e uma localização central que facilita muito o acesso a tudo.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <a href="https://www.google.com/maps/search/Mura+Hotel+Tres+Lagoas" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <MapPin size={16} /> Mapa
                </a>
                <a href="https://www.murahotel.com.br/" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <Globe size={16} /> Site
                </a>
              </div>
            </div>

            {/* Hotel 6 */}
            <div className="bg-white p-8 rounded-2xl border border-[#F0E8E9] shadow-sm flex flex-col h-full transform transition-transform hover:-translate-y-1">
              <h3 className="text-2xl font-serif text-[#8A3343] mb-3">Tokyos Hotel</h3>
              <p className="text-[#4A4243] text-base mb-6 flex-grow">
                Uma estadia tradicional e muito acolhedora. Conta com um serviço atencioso e é perfeito para as famílias que procuram tranquilidade.
              </p>
              <div className="flex flex-wrap gap-4 mt-auto">
                <a href="https://www.google.com/maps/search/Tokyos+Hotel+Tres+Lagoas" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <MapPin size={16} /> Mapa
                </a>
                <a href="https://www.tokyoshotel.com.br/" target="_blank" rel="noopener noreferrer" className="text-[#8A3343] font-medium uppercase tracking-wider text-sm hover:text-[#CBA1A6] transition-colors flex items-center gap-2">
                  <Globe size={16} /> Site
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Secção Partilha de Fotos */}
      <section id="fotos" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <ImagePlus size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Capturem cada momento</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">O Nosso Álbum Partilhado</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-10 max-w-2xl mx-auto">
            Queremos ver o nosso grande dia através dos vossos olhos! Criámos um álbum digital onde todos podem partilhar as fotografias e os vídeos que tirarem durante a cerimónia e a festa.
          </p>
          
          <div className="bg-[#fdfbfb] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[#F0E8E9] max-w-2xl mx-auto relative overflow-hidden">
            <h3 className="text-2xl font-serif text-[#8A3343] mb-4">Como partilhar?</h3>
            <p className="text-[#4A4243] mb-8 text-lg">
              Basta clicar no botão abaixo para aceder à nossa pasta partilhada e enviar os vossos melhores registos diretamente do vosso telemóvel.
            </p>
            <a
              href="https://photos.app.goo.gl/kNKMBfftRUVmTab38" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#CBA1A6] text-[#301B1E] px-10 py-4 rounded-full hover:bg-[#b88c91] transition-colors uppercase tracking-[0.1em] text-sm font-semibold shadow-md"
            >
              Adicionar Fotos ao Álbum
            </a>
          </div>
        </div>
      </section>

      {/* Secção Playlist */}
      <section id="playlist" className="py-24 px-4 bg-[#fdfbfb] border-t border-[#F0E8E9]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <Music size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">No ritmo da festa</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">A Nossa Trilha Sonora</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-10 max-w-2xl mx-auto">
            A festa é nossa, mas a música também é de vocês! Criamos uma playlist colaborativa no Spotify. Adicione aquelas músicas que não podem faltar para animar a nossa pista de dança.
          </p>
          
          <div className="rounded-2xl overflow-hidden shadow-lg border border-[#F0E8E9] max-w-2xl mx-auto mb-8 bg-[#f5f3f3]">
            <iframe
              style={{ borderRadius: '16px' }}
              src="https://open.spotify.com/embed/playlist/6EE7EDNFBIQ83oVaNnm77R?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Playlist Colaborativa"
            ></iframe>
          </div>

          <a
            href="https://open.spotify.com/playlist/6EE7EDNFBIQ83oVaNnm77R?si=5704811e91724e9b"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#8A3343] text-white px-10 py-4 rounded-full hover:bg-[#6B2533] transition-colors uppercase tracking-[0.1em] text-sm font-semibold shadow-md"
          >
            Adicionar Músicas no Spotify
          </a>
        </div>
      </section>

      {/* Secção Mural de Recados */}
      <section id="recados" className="py-24 px-4 bg-white border-t border-[#F0E8E9]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-8 shadow-sm border border-[#F0E8E9]">
            <MessageSquare size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#8A3343] uppercase tracking-[0.2em] text-sm mb-3 font-medium">Deixem o vosso carinho</p>
          <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-6 italic">Mural de Recados</h2>
          <p className="text-[#4A4243] leading-relaxed text-lg mb-12 max-w-2xl mx-auto">
            A vossa presença e as vossas palavras são muito importantes para nós. Deixem uma mensagem para lermos e guardarmos com muito carinho!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
            {recados.map((recado) => (
              <div key={recado.id} className="bg-[#fdfbfb] p-8 rounded-2xl border border-[#F0E8E9] shadow-sm relative transform transition-transform hover:-translate-y-1">
                <Heart size={20} className="absolute top-6 right-6 text-[#CBA1A6]/30 fill-[#CBA1A6]/10" />
                <p className="text-[#4A4243] italic mb-6 text-lg">"{recado.mensagem}"</p>
                <p className="text-[#8A3343] font-medium font-serif">— {recado.nome}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#fdfbfb] p-8 md:p-12 rounded-[2rem] shadow-sm border border-[#F0E8E9] max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-[#8A3343] mb-8 text-center">Escreva uma mensagem</h3>
            <form onSubmit={handleRecadoSubmit} className="space-y-6 text-left">
              <div>
                <label className="block text-sm font-semibold text-[#4A4243] uppercase tracking-wider mb-2">O Seu Nome</label>
                <input
                  type="text"
                  required
                  value={novoRecadoNome}
                  onChange={(e) => setNovoRecadoNome(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none transition-all shadow-sm"
                  placeholder="Ex: Tio João e Tia Maria"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#4A4243] uppercase tracking-wider mb-2">Mensagem aos Noivos</label>
                <textarea
                  required
                  rows="4"
                  value={novoRecadoMensagem}
                  onChange={(e) => setNovoRecadoMensagem(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none resize-none transition-all shadow-sm"
                  placeholder="Deixem os vossos votos e carinho aqui..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmittingRecado}
                className="w-full bg-[#CBA1A6] text-[#301B1E] py-5 rounded-xl hover:bg-[#b88c91] transition-all transform hover:-translate-y-0.5 uppercase tracking-widest font-semibold disabled:opacity-70 disabled:transform-none shadow-md mt-4"
              >
                {isSubmittingRecado ? 'A enviar...' : 'Publicar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Secção Presentes */}
      <section id="presentes" className="py-24 px-4 bg-[#301B1E] text-[#fdfbfb]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#4A1F27] rounded-full flex items-center justify-center text-[#CBA1A6] mx-auto mb-8 shadow-inner">
            <Gift size={32} strokeWidth={1.5} />
          </div>
          <p className="text-[#CBA1A6] uppercase tracking-[0.2em] text-sm mb-3">Mimo aos noivos</p>
          <h2 className="text-4xl md:text-5xl font-serif mb-8 italic text-white">Lista de Presentes</h2>
          <p className="text-white/80 leading-relaxed text-lg mb-10 max-w-2xl mx-auto font-light">
            A presença de cada um de vocês é, sem dúvida, o nosso maior presente! Se ainda assim desejarem abençoar o nosso novo lar ou a nossa lua-de-mel, preparámos algumas sugestões com muito carinho.
          </p>
          <button className="bg-[#CBA1A6] text-[#301B1E] px-10 py-4 rounded-full hover:bg-white transition-colors uppercase tracking-[0.1em] text-sm font-semibold shadow-lg">
            Acessar Lista Virtual
          </button>
        </div>
      </section>

      {/* Secção RSVP */}
      <section id="rsvp" className="py-24 px-4 bg-[#fdfbfb]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-[#301B1E] mb-4 italic">RSVP</h2>
            <p className="text-[#8A3343] text-lg">Por favor, confirme a sua presença até 09 de Dezembro de 2026.</p>
          </div>

          {rsvpStatus === 'success' ? (
            <div className="bg-white p-12 rounded-[2rem] border border-[#F0E8E9] shadow-lg text-center animate-fade-in">
              <CheckCircle2 size={64} className="text-[#8A3343] mx-auto mb-6" strokeWidth={1.5} />
              <h3 className="text-3xl font-serif text-[#301B1E] mb-4 italic">Muito Obrigado!</h3>
              <p className="text-[#4A4243] text-lg">A sua confirmação foi recebida com sucesso. Estamos ansiosos para celebrar este dia consigo em Três Lagoas!</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="space-y-6 bg-white p-8 md:p-12 rounded-[2rem] shadow-xl text-[#301B1E] border border-[#F0E8E9]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Nome Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] transition-all outline-none"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Você irá ao evento?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 flex items-center justify-center gap-3 p-5 border border-[#F0E8E9] rounded-xl cursor-pointer hover:bg-[#fdfbfb] transition-colors focus-within:ring-2 focus-within:ring-[#8A3343] focus-within:border-[#8A3343]">
                    <input type="radio" name="attending" value="yes" required className="w-5 h-5 text-[#8A3343] focus:ring-[#8A3343]" />
                    <span className="font-medium">Sim, com certeza!</span>
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-3 p-5 border border-[#F0E8E9] rounded-xl cursor-pointer hover:bg-red-50 transition-colors focus-within:ring-2 focus-within:ring-red-400 focus-within:border-red-400">
                    <input type="radio" name="attending" value="no" required className="w-5 h-5 text-red-500 focus:ring-red-400" />
                    <span className="font-medium">Não poderei ir</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Quantos adultos (incluindo você)?</label>
                <select className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none">
                  <option>1 Adulto</option>
                  <option>2 Adultos</option>
                  <option>3 Adultos</option>
                  <option>4 Adultos</option>
                  <option>5 ou mais</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#4A4243] uppercase tracking-wider">Restrições Alimentares / Mensagem Aos Noivos</label>
                <textarea 
                  rows="4"
                  className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none resize-none"
                  placeholder="Deixe uma mensagem carinhosa ou informe-nos sobre alergias..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={rsvpStatus === 'submitting'}
                className="w-full bg-[#8A3343] text-white py-5 rounded-xl hover:bg-[#6B2533] transition-all transform hover:-translate-y-0.5 uppercase tracking-widest font-semibold disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-md mt-4"
              >
                {rsvpStatus === 'submitting' ? (
                  <span className="animate-pulse">A enviar...</span>
                ) : (
                  'Confirmar Presença'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-white py-16 text-center border-t border-[#F0E8E9]">
        <h2 className="text-4xl font-serif text-[#8A3343] mb-6 italic">Cris & Doug</h2>
        <p className="text-[#4A4243] uppercase tracking-widest text-sm mb-3">Com amor, e até breve.</p>
        <p className="text-[#CBA1A6] text-sm">© 2027. Três Lagoas, MS.</p>
      </footer>
    </div>
  );
}