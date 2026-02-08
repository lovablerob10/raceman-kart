import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Search, Globe, FileText } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { supabase, type News as DBNews } from '../../lib/supabase';

export function News() {
    const [news, setNews] = useState<DBNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<DBNews | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        image_url: null as string | null,
        status: 'draft' as 'draft' | 'published',
        author: 'Administrador',
        meta_title: '',
        meta_description: '',
        slug: '',
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) {
            console.error('Error fetching news:', error.message);
        } else if (data) {
            setNews(data);
        }
        setLoading(false);
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleOpenModal = (item?: DBNews) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                excerpt: item.excerpt || '',
                content: item.content || '',
                image_url: item.image_url,
                status: item.status,
                author: item.author,
                meta_title: item.meta_title || '',
                meta_description: item.meta_description || '',
                slug: item.slug || '',
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                image_url: null,
                status: 'draft',
                author: 'Administrador',
                meta_title: '',
                meta_description: '',
                slug: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
    };

    const handleSave = async () => {
        const payload = {
            ...formData,
            published_at: editingItem ? editingItem.published_at : new Date().toISOString(),
        };

        let error;
        if (editingItem) {
            const { error: updateError } = await supabase
                .from('news')
                .update(payload)
                .eq('id', editingItem.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('news')
                .insert([payload]);
            error = insertError;
        }

        if (error) {
            alert('Erro ao salvar notícia: ' + error.message);
        } else {
            fetchNews();
            handleCloseModal();
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta notícia?')) {
            const { error } = await supabase
                .from('news')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Erro ao excluir notícia: ' + error.message);
            } else {
                fetchNews();
            }
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const filteredNews = news.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Teko, sans-serif' }}>Gestão de Notícias</h1>
                    <p className="text-gray-500">Administre o conteúdo e o SEO das postagens</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} />
                    <span className="font-bold uppercase tracking-wider" style={{ fontFamily: 'Teko, sans-serif' }}>Nova Notícia</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]/20 focus:border-[#2E6A9C]"
                    />
                </div>
            </div>

            {/* News List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Carregando notícias...</div>
                ) : filteredNews.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Nenhuma notícia encontrada.</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredNews.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                            >
                                {/* Thumbnail */}
                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Image size={24} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 truncate group-hover:text-[#2E6A9C] transition-colors" style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.25rem' }}>
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs">
                                        <span className="text-gray-400">{formatDate(item.published_at)}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                                        </span>
                                        {item.slug && (
                                            <span className="text-gray-400 flex items-center gap-1">
                                                <Globe size={12} /> /{item.slug}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-3xl font-bold text-slate-800" style={{ fontFamily: 'Teko, sans-serif' }}>
                                {editingItem ? 'Editar Notícia' : 'Nova Notícia'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column: Content */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-2 mb-4 flex items-center gap-2 text-[#2E6A9C]">
                                        <FileText size={20} />
                                        <span className="font-bold uppercase tracking-widest text-sm">Conteúdo Principal</span>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Título</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => {
                                                const newTitle = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    title: newTitle,
                                                    slug: generateSlug(newTitle)
                                                });
                                            }}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2E6A9C]/20 focus:border-[#2E6A9C] outline-none"
                                            placeholder="Título impactante da notícia"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Slug (URL)</label>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1 bg-gray-50 px-3 py-1 rounded">
                                            <Globe size={14} /> racerkart.com/noticias/{formData.slug}
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2E6A9C]/20 focus:border-[#2E6A9C] outline-none text-xs"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Resumo (Excerpt)</label>
                                        <textarea
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2E6A9C]/20 focus:border-[#2E6A9C] outline-none resize-none"
                                            placeholder="Breve descrição para as redes sociais e listagem"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">Conteúdo Completo</label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            rows={6}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2E6A9C]/20 focus:border-[#2E6A9C] outline-none"
                                            placeholder="O texto completo da notícia..."
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Media/SEO/Status */}
                                <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    {/* Image */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Imagem de Capa</label>
                                        <div className="flex justify-center">
                                            <ImageUpload
                                                value={formData.image_url || undefined}
                                                shape="square"
                                                size="lg"
                                                onChange={(_, preview) => setFormData({ ...formData, image_url: preview })}
                                            />
                                        </div>
                                    </div>

                                    {/* SEO Section */}
                                    <div className="space-y-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-[#F5B500]">
                                            <Search size={18} />
                                            <span className="font-bold uppercase tracking-widest text-sm text-slate-700">Otimização SEO</span>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Meta Title (Google)</label>
                                            <input
                                                type="text"
                                                value={formData.meta_title}
                                                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#F5B500]"
                                                placeholder="Título para o Google"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Meta Description</label>
                                            <textarea
                                                value={formData.meta_description}
                                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#F5B500] resize-none"
                                                placeholder="Descrição para resultados de busca"
                                            />
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Status da Postagem</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setFormData({ ...formData, status: 'draft' })}
                                                className={`py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${formData.status === 'draft'
                                                    ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-200'
                                                    : 'bg-white text-gray-400 border border-gray-200'
                                                    }`}
                                            >
                                                Rascunho
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, status: 'published' })}
                                                className={`py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${formData.status === 'published'
                                                    ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                                    : 'bg-white text-gray-400 border border-gray-200'
                                                    }`}
                                            >
                                                Publicar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-white flex gap-4">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 px-4 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-50 mb-0"
                                style={{ fontFamily: 'Teko, sans-serif' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.title}
                                className="flex-[2] px-4 py-3 bg-[#2E6A9C] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#1e4669] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2E6A9C]/20 active:scale-[0.98] transition-all"
                                style={{ fontFamily: 'Teko, sans-serif' }}
                            >
                                Salvar Notícia
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default News;

