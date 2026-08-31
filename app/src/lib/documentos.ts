import { supabase } from './supabase';

const BUCKET = 'documentos';
const PASTA = 'classificacao';
const LIMITE_BYTES = 10 * 1024 * 1024;

/**
 * PDF embutido no build. Serve de reserva caso o Storage esteja vazio ou
 * indisponivel, para o botao do site nunca ficar quebrado.
 */
export const CLASSIFICACAO_FALLBACK = '/documentos/classificacao-2026-etapa-5.pdf';

export interface DocumentoAtual {
    url: string;
    nome: string;
    atualizadoEm: string | null;
    tamanho: number | null;
}

function sanitizarNome(nome: string): string {
    return nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]+/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
}

async function listarArquivos() {
    const { data, error } = await supabase.storage.from(BUCKET).list(PASTA, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;
    // O Storage devolve um placeholder para pastas vazias; filtrar por .pdf resolve.
    return (data ?? []).filter((f) => f.name.toLowerCase().endsWith('.pdf'));
}

function montar(nomeArquivo: string, criadoEm?: string | null, tamanho?: number | null): DocumentoAtual {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(`${PASTA}/${nomeArquivo}`);
    return {
        url: data.publicUrl,
        nome: nomeArquivo,
        atualizadoEm: criadoEm ?? null,
        tamanho: tamanho ?? null,
    };
}

/** PDF de classificacao mais recente no Storage, ou null se nao houver nenhum. */
export async function getClassificacaoAtual(): Promise<DocumentoAtual | null> {
    const arquivos = await listarArquivos();
    if (arquivos.length === 0) return null;
    const atual = arquivos[0];
    return montar(atual.name, atual.created_at, atual.metadata?.size ?? null);
}

/**
 * Sobe o PDF novo e remove os anteriores.
 *
 * A ordem importa: o upload acontece primeiro e a remocao so roda depois que
 * ele deu certo. Se o envio falhar, o arquivo atual continua no ar intacto.
 */
export async function uploadClassificacao(file: File): Promise<DocumentoAtual> {
    if (file.type !== 'application/pdf') {
        throw new Error('O arquivo precisa ser um PDF.');
    }
    if (file.size > LIMITE_BYTES) {
        throw new Error('O PDF precisa ter no maximo 10MB.');
    }

    const antigos = await listarArquivos();

    const nome = `${Date.now()}-${sanitizarNome(file.name)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(`${PASTA}/${nome}`, file, {
        cacheControl: '3600',
        contentType: 'application/pdf',
        upsert: false,
    });
    if (error) {
        throw new Error(`Nao foi possivel enviar o PDF: ${error.message}`);
    }

    const remover = antigos.filter((f) => f.name !== nome).map((f) => `${PASTA}/${f.name}`);
    if (remover.length > 0) {
        // Falha aqui nao invalida o envio: o arquivo novo ja e o mais recente e
        // e ele que o site vai servir. Sobra so lixo no bucket.
        const { error: erroRemocao } = await supabase.storage.from(BUCKET).remove(remover);
        if (erroRemocao) {
            console.warn('PDF novo enviado, mas a limpeza dos antigos falhou:', erroRemocao);
        }
    }

    return montar(nome, new Date().toISOString(), file.size);
}
