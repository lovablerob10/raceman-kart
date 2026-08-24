import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ChevronRight, Menu, X, Trophy, Flag, Shield, Calendar, CreditCard, Gift, MapPin } from "lucide-react";

// Brand Assets
import logoRaceman from "@/assets/brand/rkt-color.png";
import logoRacemanWhite from "@/assets/brand/rkt-white.png";
import logoPanther from "@/assets/brand/panther-main.png";
import logoAro from "@/assets/brand/aro.png";
import logoAroWhite from "@/assets/brand/aro-white.png";
import logoLeofran from "@/assets/brand/leofran.png";
import logoTatu from "@/assets/brand/tatu.png";
import logoTechZ from "@/assets/brand/techz.png";
import logoFioraiz from "@/assets/brand/fioraiz.png";
import logoPobreJuan from "@/assets/brand/pobrejuan-new.svg";
import logoUlson from "@/assets/brand/ulson.png";
import photoDriver from "@/assets/brand/photo-driver-kart.jpg";

const formSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  whatsapp: z.string().min(8, "WhatsApp inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  city: z.string().optional(),
  birthYear: z.coerce
    .number()
    .min(1920, "Ano inválido")
    .max(2020, "Ano inválido")
    .optional()
    .or(z.literal(0).transform(() => undefined)),
  experienceLevel: z.enum([
    "intermediario",
    "avancado",
    "competidor",
  ]),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Inscricao2027() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [waLink, setWaLink] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [scrolled, setScrolled] = useState(false);
  const [showBottomCTA, setShowBottomCTA] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      whatsapp: "",
      email: "",
      city: "",
      birthYear: undefined,
      experienceLevel: "intermediario",
      message: "",
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const formElement = document.getElementById("inscricao");
      if (formElement) {
        const rect = formElement.getBoundingClientRect();
        const isFormVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setShowBottomCTA(!isFormVisible && window.scrollY > 300);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    const experienceLabels = {
      intermediario: "Intermediário",
      avancado: "Avançado",
      competidor: "Competidor Pro",
    };

    const linhas = [
      "Olá! Quero me inscrever na Copa Raceman Kart 2027.",
      "",
      `Nome: ${values.fullName}`,
      `WhatsApp: ${values.whatsapp}`,
    ];
    if (values.email) linhas.push(`E-mail: ${values.email}`);
    if (values.city) linhas.push(`Cidade: ${values.city}`);
    if (values.birthYear) linhas.push(`Ano de nascimento: ${values.birthYear}`);
    linhas.push(`Experiência: ${experienceLabels[values.experienceLevel]}`);
    if (values.message) linhas.push(`Observações: ${values.message}`);
    linhas.push("", "Aguardo o contato de vocês!");

    const msg = linhas.join("\n");
    const generatedWaLink = `https://wa.me/5519994173926?text=${encodeURIComponent(msg)}`;

    setWaLink(generatedWaLink);
    setWaMessage(msg);
    setIsSubmitting(false);
    setIsSuccess(true);

    try {
      window.open(generatedWaLink, "_blank");
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const NavLinks = () => (
    <>
      <button onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="text-sm font-semibold tracking-wide hover:text-brand-yellow transition-colors">PÁGINA INICIAL</button>
      <Button 
        onClick={() => scrollTo('inscricao')}
        className="bg-brand-yellow text-brand-navy hover:bg-brand-yellow/90 font-['Bricolage_Grotesque'] font-bold rounded-none uppercase text-xs tracking-wider"
      >
        Inscrição
      </Button>
    </>
  );

  if (isSuccess) {
    return (
      <div className="min-h-[100dvh] bg-brand-navy flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-brand-yellow rounded-none rotate-45 flex items-center justify-center mx-auto shadow-2xl animate-in zoom-in-50 delay-150 duration-500">
            <div className="-rotate-45">
              <Trophy className="w-12 h-12 text-brand-navy" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-['Bricolage_Grotesque'] font-black uppercase text-white leading-none">
              Falta só<br/><span className="text-brand-yellow">um passo!</span>
            </h1>
            <p className="text-[#8FAED5] text-lg leading-relaxed">
              Para concluir sua inscrição, envie a mensagem no WhatsApp da diretoria.
            </p>
            <div className="inline-block mt-2 font-['Bricolage_Grotesque'] font-bold text-sm tracking-[0.15em] bg-brand-yellow text-brand-navy px-4 py-1 uppercase">
              Sua inscrição só será analisada após o envio.
            </div>
            
            <div className="font-['Bricolage_Grotesque'] font-black text-2xl text-white tracking-[0.08em] my-6 border-y border-white/10 py-4">
              (19) 99417-3926
            </div>
          </div>

          <div className="space-y-4 pt-4 relative">
            {waLink && (
              <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-brand-navy font-['Bricolage_Grotesque'] font-bold text-[10px] tracking-widest px-3 py-1 uppercase z-10 whitespace-nowrap shadow-lg">
                  PASSO FINAL OBRIGATÓRIO
                </div>
                <Button 
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-16 font-['Bricolage_Grotesque'] font-bold tracking-widest text-[14px] rounded-none group hover:scale-[1.02] transition-transform shadow-2xl" 
                  size="lg"
                  onClick={() => window.open(waLink, "_blank")}
                >
                  <span className="flex items-center gap-2">
                    ENVIAR INSCRIÇÃO NO WHATSAPP
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            )}
            {waMessage && (
              <div className="space-y-2 mt-6">
                <Button
                  className="w-full text-white h-14 font-['Bricolage_Grotesque'] font-bold tracking-widest text-[13px] rounded-none shadow-lg group hover:scale-[1.02] transition-transform"
                  style={{ background: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)" }}
                  size="lg"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(waMessage);
                      setCopied(true);
                    } catch (e) {}
                    window.open("https://ig.me/m/racemankart", "_blank");
                  }}
                >
                  <span className="flex items-center gap-2">
                    ENVIAR PELO DIRECT DO INSTAGRAM
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
                <p className="text-[12px] text-[#8FAED5] leading-snug">
                  {copied
                    ? "Mensagem copiada! É só colar no Direct do @racemankart e enviar."
                    : "Ao tocar, seus dados são copiados — é só colar no Direct do @racemankart e enviar."}
                </p>
              </div>
            )}
            <Button 
              className="w-full mt-6 bg-transparent hover:bg-white/10 text-white h-14 font-['Bricolage_Grotesque'] font-bold border border-white/20 rounded-none tracking-widest" 
              size="lg"
              onClick={() => window.location.reload()}
            >
              VOLTAR AO INÍCIO
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-navy min-h-screen text-white font-['Outfit'] overflow-x-hidden selection:bg-brand-yellow selection:text-brand-navy">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-brand-navy/95 backdrop-blur-md shadow-xl py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <img src={logoRaceman} alt="Raceman Kart" className="h-10 cursor-pointer" onClick={() => window.scrollTo(0,0)} />
          
          <div className="hidden lg:flex items-center gap-8">
            <NavLinks />
          </div>

          <button className="lg:hidden text-white p-2" aria-label="Abrir menu" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-brand-navy border-t border-white/10 shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
            <NavLinks />
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={photoDriver} alt="Driver" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-brand-yellow"></div>
              <span className="font-['Bricolage_Grotesque'] font-bold tracking-[0.3em] text-brand-yellow text-sm uppercase">Campeonato Oficial</span>
            </div>
            
            <h1 className="font-['Bricolage_Grotesque'] font-black text-6xl lg:text-8xl leading-[0.9] uppercase tracking-tight mb-8">
              Copa<br/>Raceman<br/>Kart <span className="text-brand-yellow">2027</span>
            </h1>

            <p className="text-xl lg:text-2xl font-['Bricolage_Grotesque'] font-medium tracking-wide text-[#8FAED5] leading-relaxed mb-10 max-w-xl">
              MESMO MOTOR.<br/>
              MESMA CHANCE.<br/>
              <span className="text-white font-bold">VENÇA NA PILOTAGEM.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollTo('inscricao')}
                className="bg-brand-yellow hover:bg-brand-yellow/90 text-brand-navy h-14 px-8 rounded-none font-['Bricolage_Grotesque'] font-bold text-sm tracking-widest uppercase transition-transform hover:scale-[1.02]"
              >
                Quero garantir minha vaga
              </Button>
              <Button 
                onClick={() => scrollTo('campeonato')}
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 h-14 px-8 rounded-none font-['Bricolage_Grotesque'] font-bold text-sm tracking-widest uppercase"
              >
                Conhecer a Temporada
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-3 w-full bg-[#1C1C1C] flex">
        <div className="h-full w-1/3 bg-brand-yellow skew-x-[-45deg] origin-bottom -ml-4"></div>
      </div>

      {/* O Campeonato */}
      <section id="campeonato" className="py-24 bg-white text-brand-navy">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-['Bricolage_Grotesque'] font-black text-brand-blue/20 text-2xl">01</span>
              <h2 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-blue uppercase text-sm">O Campeonato</h2>
            </div>
            <h3 className="font-['Bricolage_Grotesque'] font-black text-5xl lg:text-6xl leading-[0.9] uppercase tracking-tight">
              Igualdade<br/>Técnica Absoluta
            </h3>
            <p className="mt-8 text-lg text-brand-graphite/80 leading-relaxed font-medium">
              A Copa Raceman Kart entra na temporada 2027 com o mesmo princípio que consolidou o campeonato: motor forte, regulamento técnico rígido e estrutura de padrão profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#F8FAFC] border border-[#E1E7EF] border-t-4 border-t-brand-blue p-8 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <Flag className="w-8 h-8 text-brand-blue mb-6" />
              <div className="font-['Bricolage_Grotesque'] font-black text-4xl mb-2">11</div>
              <div className="font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest text-brand-graphite/60 uppercase">Etapas Oficiais & Treinos</div>
            </div>
            
            <div className="bg-[#F8FAFC] border border-[#E1E7EF] border-t-4 border-t-brand-yellow p-8 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <Shield className="w-8 h-8 text-brand-yellow mb-6" />
              <div className="font-['Bricolage_Grotesque'] font-black text-4xl mb-2">18<span className="text-xl">HP</span></div>
              <div className="font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest text-brand-graphite/60 uppercase">Motor Honda RBC</div>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E1E7EF] border-t-4 border-t-brand-blue p-8 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <Calendar className="w-8 h-8 text-brand-blue mb-6" />
              <div className="font-['Bricolage_Grotesque'] font-black text-4xl mb-2">2<span className="text-xl">×</span></div>
              <div className="font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest text-brand-graphite/60 uppercase">Equalizações por ano</div>
            </div>

            <div className="bg-brand-navy text-white border-t-4 border-t-brand-graphite p-8 relative overflow-hidden group hover:shadow-lg transition-shadow">
              <CreditCard className="w-8 h-8 text-[#8FAED5] mb-6" />
              <div className="font-['Bricolage_Grotesque'] font-black text-4xl mb-2">3 <span className="text-lg">Etapas</span></div>
              <div className="font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest text-[#8FAED5] uppercase mb-2">Troca de pneus</div>
              <div className="text-[10px] font-bold tracking-wider text-brand-yellow uppercase">Custo do Piloto</div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
             <Button onClick={() => scrollTo('inscricao')} className="bg-brand-yellow text-brand-navy hover:bg-brand-yellow/90 h-12 px-8 rounded-none font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">
                Garantir Minha Vaga
              </Button>
          </div>
        </div>
      </section>

      {/* Investimento */}
      <section id="investimento" className="py-24 bg-[#F8FAFC] text-brand-navy border-t border-[#E1E7EF]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-['Bricolage_Grotesque'] font-black text-brand-blue/20 text-2xl">02</span>
              <h2 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-blue uppercase text-sm">Investimento</h2>
            </div>
            <h3 className="font-['Bricolage_Grotesque'] font-black text-5xl lg:text-6xl leading-[0.9] uppercase tracking-tight">
              Sua temporada<br/>profissional
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Card Motor */}
            <div className="bg-brand-navy text-white p-8 lg:p-12 relative shadow-xl">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-yellow origin-bottom-left -rotate-45 translate-x-8 -translate-y-8"></div>
              <h4 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-yellow text-xs uppercase mb-6">Aluguel do Motor Oficial 2027</h4>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-['Bricolage_Grotesque'] font-black text-5xl">R$ 3.000</span>
                <span className="text-[#8FAED5] font-bold">,00 à vista</span>
              </div>
              <div className="bg-white/10 inline-block px-4 py-2 font-['Bricolage_Grotesque'] font-bold tracking-wide text-sm mb-6">
                ou até 4× de R$ 800,00
              </div>
              <p className="text-[#8FAED5] leading-relaxed">
                Aluguel do motor Honda RBC 18HP para as <strong className="text-white">11 etapas + 11 treinos</strong> da temporada.
              </p>
            </div>

            {/* Card Campeonato */}
            <div className="bg-white border border-[#E1E7EF] p-8 lg:p-12 shadow-xl">
              <h4 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-blue text-xs uppercase mb-6">Custo do Campeonato</h4>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-['Bricolage_Grotesque'] font-black text-5xl text-brand-navy">R$ 11.000</span>
                <span className="text-brand-graphite/60 font-bold">,00 à vista</span>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E1E7EF] inline-block px-4 py-2 font-['Bricolage_Grotesque'] font-bold tracking-wide text-brand-navy text-sm mb-6">
                ou até 12× de R$ 990,00
              </div>
              <p className="text-brand-graphite/70 leading-relaxed">
                Dá acesso à estrutura completa de treinos, etapas e suporte técnico da temporada.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E1E7EF] p-8 lg:p-12 mb-8">
            <h4 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-blue text-sm uppercase mb-8">O que está incluso</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {[
                "Motor oficial Honda RBC 18HP, lacrado, para toda a temporada",
                "Uso do motor oficial nos 11 treinos oficiais, um antes de cada etapa",
                "Piloto com motor próprio pode treinar em outras datas",
                "Equalização completa dos motores duas vezes ao ano",
                "Sorteio dos motores em cada etapa",
                "Manutenção, revisão, transporte e logística dos motores",
                "Cronometragem eletrônica e resultados oficiais por etapa",
                "Premiação por etapa e classificação geral da temporada",
                "Cobertura de mídia, fotos e divulgação nos canais oficiais",
                "Transmissão ao vivo de algumas etapas",
                "Box para o chassi durante toda a temporada",
                "Sala de pilotos climatizada nas etapas de Nova Odessa",
                "Suporte da Equipe Mecânica Raceman nas corridas e treinos",
                "Desconto especial na Kart Machine (peças e acessórios)"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 bg-brand-yellow shrink-0 rotate-45" aria-hidden="true"></div>
                  <span className="text-brand-graphite/80 text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#1C1C1C] text-white p-8">
              <h4 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-yellow text-xs uppercase mb-6">O que o piloto precisa ter</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
                  <span className="font-['Bricolage_Grotesque'] font-bold tracking-wide uppercase text-sm">Chassi próprio, de qualquer marca</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-brand-yellow rounded-full"></div>
                  <span className="font-['Bricolage_Grotesque'] font-bold tracking-wide uppercase text-sm">Dois jogos de rodas</span>
                </div>
              </div>
            </div>
            <div className="p-8 border-l-4 border-brand-yellow flex items-center">
              <p className="text-sm text-brand-graphite/60 leading-relaxed">
                O motor oficial é lacrado e permanece propriedade do campeonato. Valores válidos para a temporada 2027; condições de pagamento tratadas com a diretoria. Custo da pista nos treinos por conta do piloto.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center lg:hidden">
             <Button onClick={() => scrollTo('inscricao')} className="bg-brand-yellow text-brand-navy hover:bg-brand-yellow/90 h-12 px-8 rounded-none font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">
                Garantir Minha Vaga
              </Button>
          </div>
        </div>
      </section>

      {/* Premiação */}
      <section id="premiacao" className="py-24 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,theme(colors.brand.yellow)_0%,transparent_70%)]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-['Bricolage_Grotesque'] font-black text-brand-blue text-2xl">03</span>
              <h2 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-yellow uppercase text-sm">Premiação</h2>
            </div>
            <h3 className="font-['Bricolage_Grotesque'] font-black text-5xl lg:text-6xl leading-[0.9] uppercase tracking-tight">
              Vitória<br/>Reconhecida
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white text-brand-navy p-8 lg:p-12">
              <Gift className="w-10 h-10 text-brand-blue mb-6" />
              <div className="font-['Bricolage_Grotesque'] font-black text-6xl mb-2">TOP <span className="text-brand-yellow">5</span></div>
              <p className="text-brand-graphite/70 text-lg">
                Troféus para os 5 melhores colocados de cada etapa, em cada categoria.
              </p>
              
              <div className="mt-12 bg-brand-navy p-6">
                <div className="font-['Bricolage_Grotesque'] font-black text-xl text-white uppercase leading-tight mb-2">
                  Premiação final <span className="text-brand-yellow">surpresa e especial</span>
                </div>
                <p className="text-sm text-[#8FAED5]">Reservada para o encerramento da temporada.</p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              <div className="bg-[#15345C] border border-[#1B4278] p-8">
                <h4 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-yellow text-xs uppercase mb-6">Voucher Restaurante Pobre Juan (Por Etapa)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-brand-navy p-6 flex flex-col justify-center border-l-4 border-brand-yellow">
                    <div className="font-['Bricolage_Grotesque'] font-black text-4xl text-white mb-2">R$ 500</div>
                    <div className="font-['Bricolage_Grotesque'] font-bold text-[10px] tracking-widest text-[#8FAED5] uppercase">Vencedor Categoria Ouro</div>
                  </div>
                  <div className="bg-brand-navy p-6 flex flex-col justify-center border-l-4 border-gray-400">
                    <div className="font-['Bricolage_Grotesque'] font-black text-4xl text-white mb-2">R$ 300</div>
                    <div className="font-['Bricolage_Grotesque'] font-bold text-[10px] tracking-widest text-[#8FAED5] uppercase">Vencedor Categoria Prata</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#15345C] border border-[#1B4278] p-8">
                <h4 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-[#8FAED5] text-xs uppercase mb-6">Vantagens dos Patrocinadores</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-navy flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-brand-yellow rotate-45"></div>
                    </div>
                    <p className="text-white text-sm pt-1">Descontos exclusivos para compras na <strong className="text-brand-yellow">TechZ Informática</strong></p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-navy flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-brand-yellow rotate-45"></div>
                    </div>
                    <p className="text-white text-sm pt-1">Cupom especial para tratamento contra calvície na <strong className="text-brand-yellow">Fio Raiz</strong></p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-navy flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-brand-yellow rotate-45"></div>
                    </div>
                    <p className="text-white text-sm pt-1">Encerramento de cada etapa com cerveja <strong className="text-brand-yellow">Ulson</strong> para pilotos maiores de idade</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center lg:hidden">
             <Button onClick={() => scrollTo('inscricao')} className="bg-brand-yellow text-brand-navy hover:bg-brand-yellow/90 h-12 px-8 rounded-none font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">
                Garantir Minha Vaga
              </Button>
          </div>
        </div>
      </section>

      {/* Kartódromos */}
      <section id="kartodromos" className="py-24 bg-white text-brand-navy border-t-8 border-brand-yellow">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-['Bricolage_Grotesque'] font-black text-brand-blue/20 text-2xl">04</span>
              <h2 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-blue uppercase text-sm">Kartódromos da Temporada</h2>
            </div>
            <h3 className="font-['Bricolage_Grotesque'] font-black text-5xl lg:text-6xl leading-[0.9] uppercase tracking-tight">
              Onde a copa<br/>vai correr
            </h3>
            <p className="mt-6 text-lg text-brand-graphite/70 font-medium max-w-2xl">
              A temporada 2027 acontece prioritariamente no Kartódromo de Nova Odessa, com etapas itinerantes em pistas selecionadas da região.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sede */}
            <div className="bg-brand-navy text-white p-10 lg:p-14 flex flex-col justify-end min-h-[400px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent z-10"></div>
              {/* Background pattern instead of photo since photoKart is missing */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)' }}></div>
              
              <div className="relative z-20">
                <div className="inline-block bg-brand-yellow text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase px-3 py-1 mb-4">
                  Sede Principal
                </div>
                <h4 className="font-['Bricolage_Grotesque'] font-black text-4xl lg:text-5xl uppercase leading-none mb-4">
                  Kartódromo de<br/>Nova Odessa
                </h4>
                <p className="text-[#8FAED5] text-sm leading-relaxed max-w-md">
                  Casa da Copa Raceman Kart e palco da maior parte das 11 etapas, com a estrutura de box, cronometragem e guarda dos motores oficiais.
                </p>
              </div>
            </div>

            {/* Itinerantes */}
            <div className="flex flex-col gap-4">
              <h5 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-graphite/50 text-xs uppercase mb-2">Etapas Itinerantes</h5>
              
              <div className="grid grid-cols-2 gap-4 flex-1">
                {[
                  { name: "San Marino", city: "PAULÍNIA · SP" },
                  { name: "Limeira", city: "LIMEIRA · SP" },
                  { name: "Aldeia da Serra", city: "ALDEIA DA SERRA · SP" },
                  { name: "Arujá", city: "ARUJÁ · SP" },
                ].map((p, i) => (
                  <div key={i} className="bg-[#F8FAFC] border border-[#E1E7EF] p-6 flex flex-col justify-center hover:border-brand-blue transition-colors">
                    <MapPin className="w-5 h-5 text-brand-blue/30 mb-3" />
                    <div className="font-['Bricolage_Grotesque'] font-black text-xl uppercase leading-none mb-1 text-brand-navy">{p.name}</div>
                    <div className="font-['Bricolage_Grotesque'] font-bold text-[9px] tracking-widest text-brand-graphite/50">{p.city}</div>
                  </div>
                ))}
                
                <div className="col-span-2 bg-[#F8FAFC] border border-[#E1E7EF] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-blue transition-colors relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow"></div>
                  <div>
                    <div className="font-['Bricolage_Grotesque'] font-black text-xl uppercase leading-none mb-1 text-brand-navy">Interlagos</div>
                    <div className="font-['Bricolage_Grotesque'] font-bold text-[9px] tracking-widest text-brand-graphite/50">SÃO PAULO · SP</div>
                  </div>
                  <div className="bg-brand-yellow text-brand-navy font-['Bricolage_Grotesque'] font-bold text-[9px] tracking-widest px-3 py-1 uppercase self-start sm:self-auto">
                    Potencial Novidade
                  </div>
                </div>
              </div>
              <p className="text-xs text-brand-graphite/40 mt-2">
                Calendário sujeito a confirmação das pistas e da diretoria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inscrição Form */}
      <section id="inscricao" className="py-24 bg-[#F8FAFC] border-t border-[#E1E7EF] relative">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="font-['Bricolage_Grotesque'] font-black text-brand-blue/20 text-2xl">05</span>
                <h2 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-blue uppercase text-sm">Solicitação de Vaga</h2>
              </div>
              <h3 className="font-['Bricolage_Grotesque'] font-black text-5xl lg:text-6xl leading-[0.9] uppercase tracking-tight text-brand-navy mb-6">
                Ficha de <span className="text-brand-yellow">Inscrição</span>
              </h3>
              <p className="text-lg text-brand-graphite/70 max-w-2xl mx-auto">
                Inscreva-se para analisarmos seu ingresso no campeonato. Entraremos em contato via WhatsApp.
              </p>
            </div>

            <div className="bg-white border border-[#E1E7EF] shadow-2xl p-8 lg:p-12 relative">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-blue"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-blue"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-blue"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-blue"></div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">Nome Completo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ayrton Senna" className="h-14 bg-[#F8FAFC] border-[#E1E7EF] focus-visible:ring-brand-yellow rounded-none text-brand-navy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">WhatsApp (com DDD) *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(11) 99999-9999" 
                              type="tel" 
                              className="h-14 bg-[#F8FAFC] border-[#E1E7EF] focus-visible:ring-brand-yellow rounded-none text-brand-navy" 
                              {...field}
                              onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "");
                                if (v.length > 11) v = v.substring(0, 11);
                                if (v.length > 2) {
                                  v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
                                }
                                if (v.length > 10) {
                                  v = `${v.substring(0, 10)}-${v.substring(10)}`;
                                }
                                field.onChange(v);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">E-mail</FormLabel>
                          <FormControl>
                            <Input placeholder="piloto@email.com" type="email" className="h-14 bg-[#F8FAFC] border-[#E1E7EF] focus-visible:ring-brand-yellow rounded-none text-brand-navy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">Cidade</FormLabel>
                          <FormControl>
                            <Input placeholder="São Paulo" className="h-14 bg-[#F8FAFC] border-[#E1E7EF] focus-visible:ring-brand-yellow rounded-none text-brand-navy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">Ano de Nasc.</FormLabel>
                          <FormControl>
                            <Input placeholder="1990" type="number" className="h-14 bg-[#F8FAFC] border-[#E1E7EF] focus-visible:ring-brand-yellow rounded-none text-brand-navy" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">Experiência *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-14 bg-[#F8FAFC] border-[#E1E7EF] focus-visible:ring-brand-yellow rounded-none text-brand-navy">
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-none border-[#E1E7EF]">
                              <SelectItem value="intermediario">Intermediário</SelectItem>
                              <SelectItem value="avancado">Avançado</SelectItem>
                              <SelectItem value="competidor">Competidor Pro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brand-navy font-['Bricolage_Grotesque'] font-bold text-xs tracking-widest uppercase">Observações (Opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Fale um pouco sobre seu histórico no kart..." 
                            className="resize-none min-h-[120px] bg-[#F8FAFC] border-[#E1E7EF] focus-visible:ring-brand-yellow rounded-none text-brand-navy"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full h-16 mt-8 group bg-brand-navy hover:bg-[#041226] text-white font-['Bricolage_Grotesque'] font-bold tracking-widest rounded-none text-sm uppercase transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        ENVIAR INSCRIÇÃO
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-brand-yellow" />
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Patrocinadores */}
      <section id="patrocinadores" className="py-24 bg-brand-navy border-t-8 border-[#15345C]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="font-['Bricolage_Grotesque'] font-black text-brand-blue text-2xl">06</span>
              <h2 className="font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] text-brand-yellow uppercase text-sm">Apoio Oficial</h2>
            </div>
            <h3 className="font-['Bricolage_Grotesque'] font-black text-4xl lg:text-5xl uppercase tracking-tight text-white">
              Quem sustenta a temporada
            </h3>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Master Sponsors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white flex flex-col h-full shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-navy"></div>
                <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
                  <div className="font-['Bricolage_Grotesque'] font-black text-[10px] tracking-widest text-brand-navy mb-6 uppercase">Master</div>
                  <div className="w-full py-8 px-6 flex items-center justify-center mb-6">
                    <img src={logoPanther} alt="Panther Lubrificantes" className="h-14 object-contain" />
                  </div>
                  <p className="text-sm text-brand-graphite/70 font-medium">Panther Lubrificantes assina a temporada 2027 como patrocinadora Master.</p>
                </div>
              </div>

              <div className="bg-white flex flex-col h-full shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-navy"></div>
                <div className="p-8 flex-1 flex flex-col justify-center items-center text-center">
                  <div className="font-['Bricolage_Grotesque'] font-black text-[10px] tracking-widest text-brand-navy mb-6 uppercase">Master</div>
                  <div className="w-full py-8 px-6 flex items-center justify-center mb-6">
                    <img src={logoAro} alt="ARO Contabilidade" className="h-16 object-contain" />
                  </div>
                  <p className="text-sm text-brand-graphite/70 font-medium">ARO Contabilidade assina a temporada 2027 como patrocinadora Master.</p>
                </div>
              </div>
            </div>

            {/* Supporting Sponsors */}
            <div className="pt-12 border-t border-white/10">
              <div className="font-['Bricolage_Grotesque'] font-bold text-xs tracking-[0.3em] text-[#8FAED5] mb-8 text-center uppercase">Demais Patrocinadores</div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { src: logoLeofran, alt: "Leofran Transportes", bg: "bg-white" },
                  { src: logoTatu, alt: "Tatu Shopping de Frutas", bg: "bg-white" },
                  { src: logoTechZ, alt: "Tech Z Informática", bg: "bg-white" },
                  { src: logoFioraiz, alt: "Fioraiz", bg: "bg-white", extra: "fioraiz.com.br" },
                  { src: logoUlson, alt: "Ulson Cervejaria", bg: "bg-white brightness-0" },
                  { src: logoPobreJuan, alt: "Pobre Juan", bg: "bg-white brightness-0" },
                ].map((s, i) => (
                  <div key={i} className="bg-white h-24 flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform cursor-default">
                    <img src={s.src} alt={s.alt} className={`max-h-12 max-w-full object-contain ${s.bg.includes('brightness') ? 'brightness-0' : ''}`} />
                    {s.extra && <div className="font-['Bricolage_Grotesque'] font-bold text-[8px] tracking-widest text-brand-graphite/40 mt-2 uppercase">{s.extra}</div>}
                  </div>
                ))}
                
                {/* Empty Spots */}
                <div className="bg-[#15345C] border border-dashed border-[#8FAED5]/30 h-24 flex items-center justify-center p-4 group cursor-pointer hover:bg-[#1A4070] transition-colors">
                  <span className="font-['Bricolage_Grotesque'] font-bold text-[10px] tracking-widest text-[#8FAED5] uppercase group-hover:text-brand-yellow transition-colors">SEU LOGO AQUI</span>
                </div>
                <div className="bg-[#15345C] border border-dashed border-[#8FAED5]/30 h-24 flex items-center justify-center p-4 group cursor-pointer hover:bg-[#1A4070] transition-colors">
                  <span className="font-['Bricolage_Grotesque'] font-bold text-[10px] tracking-widest text-[#8FAED5] uppercase group-hover:text-brand-yellow transition-colors">SEU LOGO AQUI</span>
                </div>
              </div>

              <div className="mt-12 text-center bg-[#15345C] p-8 border border-white/5">
                <p className="text-lg text-white font-medium mb-6">Entre em contato para ser um patrocinador e conheça todos os benefícios comerciais da temporada.</p>
                <a
                  href={`https://wa.me/5511999556595?text=${encodeURIComponent("Olá! Tenho interesse em ser patrocinador da Copa Raceman Kart 2027.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-brand-yellow text-brand-navy font-['Bricolage_Grotesque'] font-bold text-sm tracking-widest px-8 py-4 uppercase hover:scale-[1.02] transition-transform rounded-none"
                >
                  QUERO SER PATROCINADOR
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#041226] py-16 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col items-center text-center">
          <img src={logoRacemanWhite} alt="Copa Raceman Kart" className="w-32 opacity-50 mb-8" />
          
          <p className="text-white text-sm font-['Bricolage_Grotesque'] font-bold tracking-widest uppercase mb-6">
            Siga nossa página e fique por dentro das novidades
          </p>
          
          <a
            href="https://www.instagram.com/racemankart"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-['Bricolage_Grotesque'] font-black text-xl text-white px-8 py-4 mb-12 hover:scale-[1.03] transition-transform rounded-none shadow-lg"
            style={{ background: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF,#515BD4)" }}
          >
            @racemankart
          </a>

          <p className="text-white text-sm font-['Bricolage_Grotesque'] font-bold tracking-widest uppercase mb-6">
            Visite nosso site
          </p>

          <a
            href="https://racemankart.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-['Bricolage_Grotesque'] font-black text-xl text-brand-navy bg-brand-yellow px-8 py-4 mb-12 hover:scale-[1.03] transition-transform rounded-none shadow-lg"
          >
            racemankart.com.br
          </a>
          
          <p className="text-[#8FAED5] text-[10px] font-['Bricolage_Grotesque'] font-bold tracking-[0.2em] uppercase">
            COPA RACEMAN KART 2027 · MEDIA KIT OFICIAL
          </p>
        </div>
      </footer>

      {/* Mobile Floating CTA */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-brand-navy/90 backdrop-blur-md border-t border-white/10 z-40 transition-transform duration-300 ${showBottomCTA ? 'translate-y-0' : 'translate-y-full'}`}>
        <Button 
          onClick={() => scrollTo('inscricao')}
          className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-brand-navy h-14 rounded-none font-['Bricolage_Grotesque'] font-bold text-sm tracking-widest uppercase shadow-2xl"
        >
          GARANTIR MINHA VAGA
        </Button>
      </div>

    </div>
  );
}