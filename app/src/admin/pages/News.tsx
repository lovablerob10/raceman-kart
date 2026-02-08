import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Image } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    image: string | null;
    publishedAt: string;
    status: 'draft' | 'published';
}

const initialNews: NewsItem[] = [
    {
        id: 1,
        title: 'Marco Aurélio vence Etapa 3 com autoridade',
        excerpt: 'O piloto dominou a prova do início ao fim...',
        image: '/images/news/news1.jpg',
        publishedAt: '2026-02-01',
        status: 'published'
    },
    {
        id: 2,
        title: 'Felipe Andrade assume liderança na categoria LIGHT',
        excerpt: 'Com vitória na última etapa...',
        image: '/images/news/news2.jpg',
        publishedAt: '2026-01-29',
        status: 'published'
    },
    {
        id: 3,
        title: 'Próxima etapa promete grande disputa',
        excerpt: 'Rascunho da próxima notícia...',
        image: null,
        publishedAt: '2026-02-15',
        status: 'draft'
    },
];

export function News() {
    const [news, setNews] = useState<NewsItem[]>(initialNews);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        image: null as string | null,
        status: 'draft' as 'draft' | 'published',
    });

    const handleOpenModal = (item?: NewsItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                excerpt: item.excerpt,
                image: item.image,
                status: item.status,
            });
        } else {
            setEditingItem(null);
            setFormData({ title: '', excerpt: '', image: null, status: 'draft' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setFormData({ title: '', excerpt: '', image: null, status: 'draft' });
    };

    const handleSave = () => {
        if (editingItem) {
            setNews(news.map(n =>
                n.id === editingItem.id
                    ? { ...n, ...formData, publishedAt: new Date().toISOString().split('T')[0] }
                    : n
            ));
        } else {
            const newItem: NewsItem = {
                id: Date.now(),
                title: formData.title,
                excerpt: formData.excerpt,
                image: formData.image,
                status: formData.status,
                publishedAt: new Date().toISOString().split('T')[0],
            };
            setNews([newItem, ...news]);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta notícia?')) {
            setNews(news.filter(n => n.id !== id));
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-500">Gerencie notícias e galeria do site</p>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-colors"
                >
                    <Plus size={20} />
                    <span style={{ fontFamily: 'Teko, sans-serif' }}>Nova Notícia</span>
                </button>
            </div>

            {/* News List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {news.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                        {/* Thumbnail */}
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.image ? (
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Image size={24} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 truncate" style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.1rem' }}>
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{item.excerpt}</p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-400">{formatDate(item.publishedAt)}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'published'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                <Eye size={18} />
                            </button>
                            <button
                                onClick={() => handleOpenModal(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={handleCloseModal} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
                        <h2
                            className="text-2xl font-bold text-slate-800 mb-6"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            {editingItem ? 'Editar Notícia' : 'Nova Notícia'}
                        </h2>

                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div className="flex justify-center">
                                <ImageUpload
                                    value={formData.image || undefined}
                                    shape="square"
                                    size="lg"
                                    onChange={(_, preview) => setFormData({ ...formData, image: preview })}
                                    placeholder="Imagem de capa"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                    placeholder="Título da notícia"
                                />
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resumo</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C] resize-none"
                                    placeholder="Breve descrição da notícia"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                >
                                    <option value="draft">Rascunho</option>
                                    <option value="published">Publicado</option>
                                </select>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!formData.title}
                                    className="flex-1 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default News;
