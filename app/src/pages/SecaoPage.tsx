import { useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navigation } from '../sections/Navigation';
import { Footer } from '../sections/Footer';

gsap.registerPlugin(ScrollTrigger);

/**
 * Layout das paginas de secao (/classificacao, /calendario, ...).
 *
 * Cada secao continua existindo tambem na home, que segue sendo a pagina
 * longa. Aqui ela aparece sozinha, com a navegacao e o rodape em volta.
 */
export function SecaoPage({ children }: { children: ReactNode }) {
    useEffect(() => {
        // Ao trocar de rota o navegador mantem a posicao de rolagem anterior.
        window.scrollTo(0, 0);

        // As secoes animam com ScrollTrigger, que calcula as posicoes de gatilho
        // no momento da montagem. Numa troca de rota o layout ainda pode nao ter
        // altura final (fontes, imagens e os dados que cada secao busca no
        // Supabase), entao as posicoes ficam defasadas. Os refreshs abaixo
        // recalculam depois que o conteudo assenta.
        const ids = [400, 1200, 2500].map((ms) => setTimeout(() => ScrollTrigger.refresh(), ms));
        return () => ids.forEach(clearTimeout);
    }, []);

    return (
        <div className="min-h-screen bg-black">
            <Navigation />
            {/* A navegacao e fixed, entao o conteudo precisa de espaco no topo */}
            <main className="pt-24">{children}</main>
            <Footer />
        </div>
    );
}

export default SecaoPage;
