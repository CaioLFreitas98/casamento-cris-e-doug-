import { useEffect, useRef, useState } from "react";
import { Gift, Heart, Package, CheckCircle2, Copy } from "lucide-react";

// A chave Pix é pública por natureza (aparece para todos os convidados).
// As variáveis de ambiente têm prioridade; o valor padrão garante que o
// Pix apareça mesmo se o ambiente de build não tiver as variáveis.
const PIX_KEY = import.meta.env.VITE_PIX_KEY || "silvafreitas252@gmail.com";
const PIX_RECEIVER = import.meta.env.VITE_PIX_RECEIVER || "Cris e Doug";

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // cai no método alternativo abaixo
  }
  // Alternativa para navegadores embutidos (WhatsApp, Instagram etc.)
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export default function ModalReserva({ presente, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState("idle"); // idle | copied | failed
  const [giftMethod, setGiftMethod] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const keyRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, loading]);

  const handleCopyPix = async () => {
    if (!PIX_KEY) return;
    const ok = await copyText(PIX_KEY);
    setCopyStatus(ok ? "copied" : "failed");
    if (!ok && keyRef.current) {
      const range = document.createRange();
      range.selectNodeContents(keyRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleSubmit = async () => {
    if (loading || !nome.trim() || !giftMethod) return;
    setLoading(true);
    setErro("");
    try {
      await onConfirm(presente.id, nome.trim());
      onClose();
    } catch (error) {
      setErro(error?.message || "Não foi possível reservar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const methodClass = (method) =>
    `p-5 rounded-2xl border text-left transition-all ${giftMethod === method ? "bg-[#8A3343] border-[#8A3343] text-white shadow-md" : "bg-[#fdfbfb] border-[#F0E8E9] text-[#4A4243] hover:border-[#CBA1A6]"}`;
  const methodHint = (method) => `block text-sm ${giftMethod === method ? "text-white/85" : "text-[#4A4243]"}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/50 px-4 py-4 sm:py-6 overflow-y-auto" onClick={() => !loading && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-reserva-titulo"
        className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[90dvh] overflow-y-auto overscroll-contain"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#fdfbfb] rounded-full flex items-center justify-center text-[#8A3343] mx-auto mb-4 border border-[#F0E8E9]">
            <Gift size={28} strokeWidth={1.5} />
          </div>
          <h3 id="modal-reserva-titulo" className="text-2xl font-serif text-[#301B1E] italic mb-1">Como você prefere presentear?</h3>
          <p className="text-[#4A4243]">Você está reservando: <strong>{presente.nome}</strong></p>
        </div>
        <div className="mb-6">
          <label htmlFor="modal-reserva-nome" className="block text-sm font-semibold text-[#4A4243] uppercase tracking-wider mb-2">Seu nome</label>
          <input
            id="modal-reserva-nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
            className="w-full px-5 py-4 bg-[#fdfbfb] border border-[#F0E8E9] rounded-xl focus:ring-2 focus:ring-[#8A3343] focus:border-[#8A3343] outline-none"
            placeholder="Ex: Tia Maria"
            autoFocus
          />
          <p className="text-[#8A3343] text-xs mt-2">Esse nome é apenas para controle dos noivos e não aparece no site.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button type="button" aria-pressed={giftMethod === "pix"} onClick={() => setGiftMethod("pix")} className={methodClass("pix")}>
            <Heart size={22} className="mb-3" strokeWidth={1.5} />
            <span className="block font-semibold mb-1">Mandar Pix</span>
            <span className={methodHint("pix")}>Enviar o valor pela chave Pix.</span>
          </button>
          <button type="button" aria-pressed={giftMethod === "buy"} onClick={() => setGiftMethod("buy")} className={methodClass("buy")}>
            <Package size={22} className="mb-3" strokeWidth={1.5} />
            <span className="block font-semibold mb-1">Vou comprar</span>
            <span className={methodHint("buy")}>Comprar o presente por conta própria.</span>
          </button>
        </div>
        {giftMethod === "pix" && (
          <div className="bg-[#fdfbfb] border border-[#F0E8E9] rounded-2xl p-5 mb-6">
            <p className="text-xs uppercase tracking-wider text-[#8A3343] font-semibold mb-1">Favorecido</p>
            <p className="text-[#301B1E] font-medium mb-4">{PIX_RECEIVER}</p>
            <p className="text-xs uppercase tracking-wider text-[#8A3343] font-semibold mb-1">Chave Pix</p>
            <p ref={keyRef} className="text-[#4A4243] break-all mb-4 select-all">{PIX_KEY || "Chave Pix em breve"}</p>
            <button
              type="button"
              onClick={handleCopyPix}
              disabled={!PIX_KEY}
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#8A3343] border border-[#F0E8E9] px-5 py-3 rounded-xl hover:bg-[#fff8f8] transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {copyStatus === "copied" ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              {copyStatus === "copied" ? "Chave copiada!" : "Copiar chave Pix"}
            </button>
            {copyStatus === "failed" && (
              <p className="text-[#8A3343] text-xs mt-2 text-center" role="status">Não foi possível copiar automaticamente. A chave foi selecionada acima: toque e segure para copiar.</p>
            )}
          </div>
        )}
        {giftMethod === "buy" && (
          <div className="bg-[#fff8f8] border border-[#FADBD8] rounded-2xl p-4 mb-6 text-center">
            <p className="text-[#4A4243] text-sm leading-relaxed">Combinado! Ao confirmar, este item ficará reservado para você comprar e entregar aos noivos.</p>
          </div>
        )}
        {erro && (
          <p className="bg-[#fff8f8] border border-[#FADBD8] rounded-xl p-3 mb-4 text-sm text-[#8A3343] text-center" role="alert">{erro}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={onClose} disabled={loading} className="w-full sm:flex-1 py-4 border border-[#F0E8E9] rounded-xl text-[#4A4243] hover:bg-[#fdfbfb] transition-colors font-medium disabled:opacity-60">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !giftMethod || !nome.trim()}
            className="w-full sm:flex-1 py-4 bg-[#8A3343] text-white rounded-xl hover:bg-[#6B2533] transition-colors font-semibold disabled:opacity-60"
          >
            {loading ? "Reservando..." : "Confirmar reserva"}
          </button>
        </div>
      </div>
    </div>
  );
}
