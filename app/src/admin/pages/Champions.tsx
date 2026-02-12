import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Trophy, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ImageUpload } from '../components/ImageUpload';

interface Champion {
    id: string;
    year: number;
    pilot_name: string;
    category: string;
    image_url: string | null;
}

export function Champions() {
    const [champions, setChampions] = useState<Champion[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingChampion, setEditingChampion] = useState<Champion | null>(null);
    const [formData, setFormData] = useState({
        year: new Date().getFullYear(),
        pilot_name: '',
        category: 'Ouro',
        image_url: '' as string | null
    });

    useEffect(() => {
        fetchChampions();
    }, []);

    const fetchChampions = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('champions')
                .select('*')
                .order('year', { ascending: false });

            if (error) throw error;
            setChampions(data || []);
        } catch (error) {
            console.error('Error fetching champions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (champion?: Champion) => {
        if (champion) {
            setEditingChampion(champion);
            setFormData({
                year: champion.year,
                pilot_name: champion.pilot_name,
                category: champion.category,
                image_url: champion.image_url
            });
        } else {
            setEditingChampion(null);
            setFormData({
                year: new Date().getFullYear(),
                pilot_name: '',
                category: 'Geral',
                image_url: null
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingChampion(null);
    };

    const handleSave = async () => {
        const payload = {
            year: formData.year,
            pilot_name: formData.pilot_name,
            category: formData.category,
            image_url: formData.image_url
        };

        if (editingChampion) {
            const { error } = await supabase
                .from('champions')
                .update(payload)
                .eq('id', editingChampion.id);

            if (error) {
                console.error('Error updating champion:', error);
            } else {
                fetchChampions();
            }
        } else {
            const { error } = await supabase
                .from('champions')
                .insert(payload);

            if (error) {
                console.error('Error creating champion:', error);
            } else {
                fetchChampions();
            }
        }
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este campeão?')) {
            const { error } = await supabase
                .from('champions')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting champion:', error);
            } else {
                fetchChampions();
            }
        }
    };

    const filteredChampions = champions.filter(c =>
        c.pilot_name.toLowerCase().includes(search.toLowerCase()) ||
        c.year.toString().includes(search)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 text-[#2E6A9C] animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar campeão..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                        />
                    </div>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-colors"
                >
                    <Plus size={20} />
                    <span style={{ fontFamily: 'Teko, sans-serif' }}>Novo Campeão</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredChampions.map((champion) => (
                    <div
                        key={champion.id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4">
                            <div className="bg-[#F5B500] text-black font-bold px-3 py-1 rounded text-xl shadow-sm" style={{ fontFamily: 'Teko, sans-serif' }}>
                                {champion.year}
                            </div>
                        </div>

                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                                {champion.image_url ? (
                                    <img
                                        src={champion.image_url}
                                        alt={champion.pilot_name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <Trophy size={40} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="font-bold text-slate-800 text-lg uppercase" style={{ fontFamily: 'Teko, sans-serif' }}>
                                {champion.pilot_name}
                            </h3>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-600 uppercase">
                                {champion.category}
                            </span>
                        </div>

                        <div className="flex justify-center gap-2 mt-4 border-t pt-4">
                            <button
                                onClick={() => handleOpenModal(champion)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(champion.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6" style={{ fontFamily: 'Teko, sans-serif' }}>
                            {editingChampion ? 'Editar Campeão' : 'Novo Campeão'}
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <ImageUpload
                                    value={formData.image_url || undefined}
                                    shape="circle"
                                    size="lg"
                                    onChange={(_, preview) => setFormData({ ...formData, image_url: preview })}
                                    placeholder="Foto do campeão"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                        placeholder="Ex: Ouro, Prata, Geral"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Piloto</label>
                                <input
                                    type="text"
                                    value={formData.pilot_name}
                                    onChange={(e) => setFormData({ ...formData, pilot_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                    placeholder="Nome do campeão"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!formData.pilot_name || !formData.year}
                                    className="flex-1 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] disabled:opacity-50"
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

export default Champions;
