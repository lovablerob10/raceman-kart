import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getClassificacaoAtual, CLASSIFICACAO_FALLBACK } from '../lib/documentos';

const navLinks = [
  { label: 'Calendário', href: '/calendario' },
  { label: 'Categorias', href: '/categorias' },
  { label: 'Classificação', href: '/classificacao' },
  { label: 'Campeões', href: '/campeoes' },
  { label: 'Instagram', href: '/instagram' },
  { label: 'Patrocinadores', href: '/patrocinadores' },
  { label: 'Inscrição', href: '/inscricao2027' },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  // O PDF da classificacao e trocado pelo painel admin, entao a url vem do
  // Storage. O arquivo embutido no build fica como reserva: se a consulta
  // falhar, o botao continua funcionando com a ultima versao publicada.
  const [classificacaoUrl, setClassificacaoUrl] = useState(CLASSIFICACAO_FALLBACK);

  useEffect(() => {
    let ativo = true;
    getClassificacaoAtual()
      .then((doc) => { if (ativo && doc) setClassificacaoUrl(doc.url); })
      .catch(() => { /* mantem o fallback embutido */ });
    return () => { ativo = false; };
  }, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // A area do piloto ainda nao existe. O botao fica visivel para anunciar,
  // e ao ser clicado avisa que esta por vir em vez de nao fazer nada.
  const [avisoPiloto, setAvisoPiloto] = useState(false);

  const clicarAreaPiloto = () => {
    setAvisoPiloto(true);
    setIsMobileMenuOpen(false);
    setTimeout(() => setAvisoPiloto(false), 2200);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initial animation
    gsap.fromTo(
      '.nav-item',
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.5,
        ease: 'power3.out'
      }
    );
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // Links que nao sao ancora (#) sao rotas: navega em vez de rolar a pagina
    if (!href.startsWith('#')) {
      setIsMobileMenuOpen(false);
      navigate(href);
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-[#2D2D2D]/95 backdrop-blur-md shadow-lg py-1'
          : 'bg-transparent py-4'
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a
              href="#"
              className="nav-item flex items-center group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img
                src="/images/logo-rkt.png"
                alt="RKT Raceman Kart"
                className={`transition-all duration-300 ${isScrolled ? 'h-12 md:h-14' : 'h-16 md:h-20'} object-contain`}
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="nav-item relative px-2 py-2 text-white font-display uppercase tracking-wide text-lg xl:text-xl group overflow-hidden"
                  style={{ fontFamily: 'Teko, sans-serif' }}
                >
                  <span className="relative z-10 transition-colors group-hover:text-[#F5B500]">
                    {link.label}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5B500] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="absolute inset-0 bg-white/5 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-0" />
                </a>
              ))}
            </div>

            {/* Area do Piloto (em construcao) */}
            <button
              onClick={clicarAreaPiloto}
              title="Em breve"
              className="hidden xl:flex items-center whitespace-nowrap bg-[#F5B500] hover:bg-[#ffc633] text-[#2D2D2D] px-4 py-2 text-sm font-display uppercase font-bold transition-all duration-300 rounded skew-x-[-10deg] shadow-lg shadow-[#F5B500]/20 mr-2"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              <span className="block skew-x-[10deg] tracking-wide">
                {avisoPiloto ? 'Em breve' : 'Área do Piloto'}
              </span>
            </button>

 .             {/* Documentos em PDF */}
            <div className="hidden xl:flex items-center gap-2">
              <a
                href="/documentos/regulamento-raceman-2026.pdf?v=2"
                download="Regulamento Raceman 2026.pdf"
                className="nav-item whitespace-nowrap bg-transparent border-2 border-white/50 hover:border-[#F5B500] text-white px-3 py-2 text-sm font-display uppercase hover:bg-[#F5B500] hover:text-[#2D2D2D] transition-all duration-300 rounded skew-x-[-10deg]"
                style={{ fontFamily: 'Teko, sans-serif' }}
              >
                <span className="block skew-x-[10deg]">Regulamento</span>
              </a>
              <a
                href={classificacaoUrl}
                download="Classificacao Raceman Kart.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-item whitespace-nowrap bg-transparent border-2 border-white/50 hover:border-[#F5B500] text-white px-3 py-2 text-sm font-display uppercase hover:bg-[#F5B500] hover:text-[#2D2D2D] transition-all duration-300 rounded skew-x-[-10deg]"
                style={{ fontFamily: 'Teko, sans-serif' }}
              >
                <span className="block skew-x-[10deg]">PDF Classificação</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden nav-item text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Racing stripe decoration */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            background: 'linear-gradient(90deg, #2E6A9C 0%, #2E6A9C 30%, white 30%, white 35%, #F5B500 35%, #F5B500 100%)'
          }}
        />
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#2D2D2D]/98 backdrop-blur-lg transition-all duration-500 xl:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6 px-8 text-center">
          <img
            src="/images/logo-rkt.png"
            alt="RKT logo"
            className="h-24 mb-6"
          />
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white font-display uppercase text-3xl tracking-wide hover:text-[#F5B500] transition-colors"
              style={{
                fontFamily: 'Teko, sans-serif',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={clicarAreaPiloto}
            className="mt-8 bg-[#F5B500] text-[#2D2D2D] px-8 py-4 text-xl font-bold italic uppercase rounded flex items-center gap-2 transition-all"
            style={{ fontFamily: 'Teko, sans-serif' }}
          >
            {avisoPiloto ? 'Em breve' : 'Área do Piloto'}
          </button>

 .           <a
            href="/documentos/regulamento-raceman-2026.pdf?v=2"
            download="Regulamento Raceman 2026.pdf"
            className="mt-8 bg-[#F5B500] text-[#2D2D2D] px-8 py-4 text-xl font-bold italic uppercase rounded flex items-center gap-2 group transition-all"
            style={{ fontFamily: 'Teko, sans-serif' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Regulamento
          </a>
          <a
            href={classificacaoUrl}
            download="Classificacao Raceman Kart.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#F5B500] text-[#2D2D2D] px-8 py-4 text-xl font-bold italic uppercase rounded flex items-center gap-2 group transition-all"
            style={{ fontFamily: 'Teko, sans-serif' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            PDF Classificação
          </a>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#F5B500]" />
        <div className="absolute top-1/4 left-4 w-1 h-32 bg-white/20" />
        <div className="absolute top-1/3 right-4 w-1 h-24 bg-white/20" />
      </div>
    </>
  );
}

export default Navigation;
