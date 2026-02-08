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
      className="bg-[#2D2D2D] text-white py-12 md:py-16 relative overflow-hidden"
    >
      {/* Top border decoration */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#2E6A9C]" />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #000 10px,
            #000 20px
          )`
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {/* Brand Column */}
          <div className="footer-column lg:col-span-2">
            <div
              className="font-display font-bold text-4xl md:text-5xl italic tracking-wider mb-4"
              style={{ fontFamily: 'Teko, sans-serif' }}
            >
              RKT RACEMAN KART
            </div>
            <p className="text-white/80 max-w-sm mb-6 leading-relaxed">
              O campeonato de kart mais emocionante do interior paulista.
              Paixão, velocidade e amizade nas pistas desde 2006.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="mailto:contato@racemankart.com.br"
                className="flex items-center gap-3 text-white/70 hover:text-[#F5B500] transition-colors"
              >
                <Mail size={18} />
                contato@racemankart.com.br
              </a>
              <a
                href="tel:+5 Brasil"
                className="flex items-center gap-3 text-white/70 hover:text-[#F5B500] transition-colors"
              >
                <Phone size={18} />
                (11) 97415-4676
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <MapPin size={18} />
                Paulínia, SP - Brasil
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4 className="font-bold uppercase mb-4 text-white/90 text-lg">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-white/70 hover:text-white hover:underline transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-white transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="footer-column">
            <h4 className="font-bold uppercase mb-4 text-white/90 text-lg">
              Siga-nos
            </h4>
            <div className="flex space-x-3 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 text-white/80 text-sm hover:text-white hover:underline transition-colors"
            >
              Entre em contato
              <ArrowUp size={14} className="rotate-45" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60 text-center md:text-left">
            © 2026 RKT Raceman Kart. Todos os direitos reservados.
          </p>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/60 hover:text-[#F5B500] transition-colors group"
          >
            <span className="text-sm">Voltar ao topo</span>
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-[#F5B500] group-hover:text-black transition-colors">
              <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Side decorations */}
      <div className="absolute left-0 top-1/3 w-1 h-20 bg-white/20" />
      <div className="absolute right-0 bottom-1/3 w-1 h-16 bg-white/10" />
    </footer>
  );
}

export default Footer;
