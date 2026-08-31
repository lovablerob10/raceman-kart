import { useState, useRef, useCallback } from 'react';
import { FileUp, X, Loader2, CheckCircle2, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import {
    getClassificacaoAtual,
    uploadClassificacao,
    type DocumentoAtual,
} from '../../lib/documentos';

function formatarTamanho(bytes: number | null): string {
    if (bytes === null) return '';
    return `${(bytes / 1024).toFixed(0)} KB`;
}

function formatarData(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function UploadClassificacaoPdf() {
    const [aberto, setAberto] = useState(false);
    const [atual, setAtual] = useState<DocumentoAtual | null>(null);
    const [carregandoAtual, setCarregandoAtual] = useState(false);
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const abrir = useCallback(async () => {
        setAberto(true);
        setArquivo(null);
        setErro(null);
        setSucesso(false);
        setCarregandoAtual(true);
        try {
            setAtual(await getClassificacaoAtual());
        } catch (e: any) {
            setErro(`Nao foi possivel consultar o PDF atual: ${e?.message ?? e}`);
        } finally {
            setCarregandoAtual(false);
        }
    }, []);

    const selecionar = (f: File | null) => {
        setErro(null);
        setSucesso(false);
        if (!f) {
            setArquivo(null);
            return;
        }
        if (f.type !== 'application/pdf') {
            setErro('Selecione um arquivo PDF.');
            setArquivo(null);
            return;
        }
        setArquivo(f);
    };

    const enviar = async () => {
        if (!arquivo) return;
        setEnviando(true);
        setErro(null);
        try {
            const novo = await uploadClassificacao(arquivo);
            setAtual(novo);
            setArquivo(null);
            setSucesso(true);
            if (inputRef.current) inputRef.current.value = '';
        } catch (e: any) {
            setErro(e?.message ?? 'Falha ao enviar o PDF.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <>
            <button
                onClick={abrir}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F5B500] text-[#2D2D2D] hover:bg-[#d9a000] transition-colors"
            >
                <FileUp size={20} />
                <span style={{ fontFamily: 'Teko, sans-serif' }}>Upload PDF Classificação</span>
            </button>

            {aberto && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#2D2D2D]" style={{ fontFamily: 'Teko, sans-serif' }}>
                                PDF DA CLASSIFICAÇÃO
                            </h2>
                            <button onClick={() => setAberto(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Publicado hoje no site</p>
                            {carregandoAtual ? (
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" /> Consultando...
                                </p>
                            ) : atual ? (
                                <div className="flex items-start gap-2">
                                    <FileText size={18} className="text-[#2E6A9C] mt-0.5 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-800 break-all">{atual.nome}</p>
                                        <p className="text-xs text-gray-500">
                                            {formatarData(atual.atualizadoEm)} {formatarTamanho(atual.tamanho)}
                                        </p>
                                        <a
                                            href={atual.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-[#2E6A9C] hover:underline inline-flex items-center gap-1 mt-1"
                                        >
                                            Abrir <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Nenhum PDF enviado ainda. O site esta usando a versao embutida no build.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Novo PDF</label>
                            <input
                                ref={inputRef}
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={(e) => selecionar(e.target.files?.[0] ?? null)}
                                className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2E6A9C] file:text-white hover:file:bg-[#1e4669] file:cursor-pointer"
                            />
                            {arquivo && (
                                <p className="text-xs text-gray-500 mt-2">
                                    {arquivo.name} ({formatarTamanho(arquivo.size)})
                                </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                Somente PDF, ate 10MB. Ao enviar, a versao anterior e removida e o site passa a
                                oferecer a nova imediatamente.
                            </p>
                        </div>

                        {erro && (
                            <p className="text-sm text-red-600 flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {erro}
                            </p>
                        )}
                        {sucesso && (
                            <p className="text-sm text-green-700 flex items-start gap-2">
                                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                                PDF atualizado. O botao do site ja aponta para a versao nova.
                            </p>
                        )}

                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => setAberto(false)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={enviar}
                                disabled={!arquivo || enviando}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${arquivo && !enviando
                                    ? 'bg-[#2E6A9C] text-white hover:bg-[#1e4669]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {enviando ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />}
                                {enviando ? 'Enviando...' : 'Enviar e substituir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
