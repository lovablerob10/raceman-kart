import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { label: 'Calendário', href: '#calendar' },
  { label: 'Categorias', href: '#categories' },
  { label: 'Classificação', href: '#standings' },
  { label: 'Notícias', href: '#news' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      // Footer reveal animation
      const columns = contentRef.current?.querySelectorAll('.footer-column');
      if (columns) {
        gsap.fromTo(
          columns,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footer,
              start: 'top 90%',
              once: true
            }
          }
        );
      }

    }, footer);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="bg-[#050505] text-white py-20 md:py-32 relative overflow-hidden border-t-4 border-[#F5B500]"
    >
      {/* Background Texture - Carbon Fiber */}
      <div className="absolute inset-0 opacity-[0.03] carbon-fiber pointer-events-none" />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#2E6A9C]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F5B500]/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20"
        >
          {/* Brand Column */}
          <div className="footer-column lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#2E6A9C] to-[#F5B500]" />
              <div
                className="font-display font-black text-6xl md:text-7xl italic tracking-tighter leading-none"
                style={{ fontFamily: 'Teko, sans-serif' }}
              >
                RKT <span className="text-[#F5B500]">RACEMAN</span> KART
              </div>
            </div>

            <p className="text-white/60 text-lg md:text-xl max-w-sm mb-10 leading-relaxed font-medium uppercase italic" style={{ fontFamily: 'Teko, sans-serif' }}>
              O campeonato de kart amador mais <span className="text-white">agressivo e emocionante</span> do interior paulista. Desde 2006 forjando lendas.
            </p>

            {/* Premium Social Icons */}
            <div className="flex space-x-5">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="group relative bg-white/5 p-4 rounded-2xl border border-white/10 transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:border-[#F5B500]/50 overflow-hidden"
                  >
                    <Icon size={24} className="relative z-10 transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#F5B500]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="footer-column">
            <h4 className="font-display font-black uppercase text-2xl mb-8 text-white/50 tracking-widest italic" style={{ fontFamily: 'Teko, sans-serif' }}>
              Navegação
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-white/60 text-xl font-display font-medium uppercase italic hover:text-[#F5B500] transition-all duration-300 flex items-center gap-4 group"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                  >
                    <div className="w-0 h-0.5 bg-[#F5B500] transition-all duration-300 group-hover:w-8" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info & Contact */}
          <div className="footer-column">
            <h4 className="font-display font-black uppercase text-2xl mb-8 text-white/50 tracking-widest italic" style={{ fontFamily: 'Teko, sans-serif' }}>
              QG Central
            </h4>
            <div className="space-y-6">
              <a
                href="mailto:contato@racemankart.com.br"
                className="group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 transition-all duration-300 group-hover:bg-[#F5B500]/10 group-hover:text-[#F5B500] group-hover:border-[#F5B500]/30">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">E-mail</div>
                  <div className="text-white/80 font-bold">contato@racemankart.com.br</div>
                </div>
              </a>

              <a
                href="tel:+5519974154676"
                className="group flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 transition-all duration-300 group-hover:bg-[#F5B500]/10 group-hover:text-[#F5B500] group-hover:border-[#F5B500]/30">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">WhatsApp</div>
                  <div className="text-white/80 font-bold">(19) 97415-4676</div>
                </div>
              </a>

              <div className="group flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Localização</div>
                  <div className="text-white/80 font-bold">Paulínia, SP - Brasil</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar - Tech Strip */}
        <div className="mt-24 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em]">
              © 2026 RKT RACEMAN KART • <span className="text-[#F5B500]">ELITE RACING TEAM</span>
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-white/20 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-[#F5B500] transition-colors">Termos</a>
              <div className="w-1 h-1 bg-white/20 rounded-full" />
              <a href="#" className="hover:text-[#F5B500] transition-colors">Privacidade</a>
            </div>
          </div>

          {/* Premium Scroll Top Button */}
          <button
            onClick={scrollToTop}
            className="group relative flex items-center gap-4 bg-white/5 border border-white/10 pl-8 pr-4 py-4 rounded-full transition-all duration-500 hover:bg-white/10 hover:border-[#F5B500]/50"
          >
            <span className="text-xs font-black uppercase tracking-[0.4em] text-white/50 group-hover:text-white transition-colors">VOLTAR AO TOPO</span>
            <div className="bg-[#F5B500] p-3 rounded-full text-black shadow-[0_0_20px_rgba(245,181,0,0.4)] transition-transform duration-500 group-hover:-translate-y-2">
              <ArrowUp size={20} />
            </div>
          </button>
        </div>
      </div>

      {/* Decorative Striped Siderails */}
      <div className="absolute left-0 bottom-1/4 w-2 h-48 bg-gradient-to-b from-[#2E6A9C] via-[#F5B500] to-transparent opacity-30" />
      <div className="absolute right-0 top-1/4 w-2 h-48 bg-gradient-to-t from-[#F5B500] via-[#2E6A9C] to-transparent opacity-30" />
    </footer>

  );
}

export default Footer;
