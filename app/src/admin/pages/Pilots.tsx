// Build trigger: 2026-02-08 22:58
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { supabase, type Pilot as DBPilot } from '../../lib/supabase';

interface Pilot {
    id: string;
    name: string;
    category: 'PRO' | 'LIGHT';
    number: number | null;
    photo: string | null;
    team?: string;
}

export function Pilots() {
    const [pilots, setPilots] = useState<Pilot[]>([]);

    // Fetch pilots from Supabase
    useEffect(() => {
        fetchPilots();
    }, []);

    const fetchPilots = async () => {
        const { data, error } = await supabase
            .from('pilots')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching pilots:', error);
        } else if (data) {
            setPilots(data.map((p: DBPilot) => ({
                id: p.id,
                name: p.name,
                category: p.category as 'PRO' | 'LIGHT',
                number: p.number,
                photo: p.photo_url,
                team: p.team || undefined
            })));
        }
    };
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'PRO' | 'LIGHT'>('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'PRO' as 'PRO' | 'LIGHT',
        number: '' as string | number,
        team: '',
        photo: null as string | null,
    });

    const filteredPilots = pilots.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleOpenModal = (pilot?: Pilot) => {
        if (pilot) {
            setEditingPilot(pilot);
            setFormData({
                name: pilot.name,
                category: pilot.category,
                number: pilot.number || '',
                team: pilot.team || '',
                photo: pilot.photo,
            });
        } else {
            setEditingPilot(null);
            setFormData({ name: '', category: 'PRO', number: '', team: '', photo: null });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPilot(null);
        setFormData({ name: '', category: 'PRO', number: '', team: '', photo: null });
    };

    const handleSave = async () => {
        const payload = {
            name: formData.name,
            category: formData.category,
            number: formData.number === '' ? null : Number(formData.number),
            team: formData.team || null,
            photo_url: formData.photo
        };

        if (editingPilot) {
            const { error } = await supabase
                .from('pilots')
                .update(payload)
                .eq('id', editingPilot.id);

            if (error) {
                console.error('Error updating pilot:', error);
            } else {
                fetchPilots();
            }
        } else {
            const { error } = await supabase
                .from('pilots')
                .insert(payload);

            if (error) {
                console.error('Error creating pilot:', error);
            } else {
                fetchPilots();
            }
        }
        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este piloto?')) {
            const { error } = await supabase
                .from('pilots')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting pilot:', error);
            } else {
                fetchPilots();
            }
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar piloto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C] focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                    >
                        <option value="ALL">Todas</option>
                        <option value="PRO">Ouro (PRO)</option>
                        <option value="LIGHT">Prata (LIGHT)</option>
                    </select>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-colors"
                >
                    <Plus size={20} />
                    <span style={{ fontFamily: 'Teko, sans-serif' }}>Novo Piloto</span>
                </button>
            </div>

            {/* Pilots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPilots.map((pilot) => (
                    <div
                        key={pilot.id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow relative"
                    >
                        {/* Pilot Number Badge */}
                        {pilot.number && (
                            <div className="absolute top-4 right-4 bg-[#F5B500] text-black font-bold px-2 py-0.5 rounded text-xs shadow-sm" style={{ fontFamily: 'Teko, sans-serif' }}>
                                #{pilot.number}
                            </div>
                        )}

                        {/* Photo */}
                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                                {pilot.photo ? (
                                    <img
                                        src={pilot.photo}
                                        alt={pilot.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-500">{getInitials(pilot.name)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center">
                            <h3
                                className="font-bold text-slate-800 text-lg"
                                style={{ fontFamily: 'Teko, sans-serif' }}
                            >
                                {pilot.name}
                            </h3>
                            {pilot.team && (
                                <p className="text-sm text-gray-500">{pilot.team}</p>
                            )}
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${pilot.category === 'PRO'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-slate-100 text-slate-500'
                                }`}>
                                {pilot.category}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center gap-2 mt-4 border-t pt-4">
                            <button
                                onClick={() => handleOpenModal(pilot)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(pilot.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                    <div
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        onClick={handleCloseModal}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-white rounded-xl shadow-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
                        <h2
                            className="text-2xl font-bold text-slate-800 mb-6"
                            style={{ fontFamily: 'Teko, sans-serif' }}
                        >
                            {editingPilot ? 'Editar Piloto' : 'Novo Piloto'}
                        </h2>

                        <div className="space-y-4">
                            {/* Photo Upload */}
                            <div className="flex justify-center">
                                <ImageUpload
                                    value={formData.photo || undefined}
                                    shape="circle"
                                    size="lg"
                                    onChange={(_, preview) => setFormData({ ...formData, photo: preview })}
                                    placeholder="Foto do piloto"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {/* Name */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                        placeholder="Piloto"
                                    />
                                </div>

                                {/* Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº</label>
                                    <input
                                        type="number"
                                        value={formData.number}
                                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                        placeholder="00"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['PRO', 'LIGHT'] as const).map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={`px-4 py-2 rounded-lg border italic font-black text-lg transition-all ${formData.category === cat
                                                ? cat === 'PRO'
                                                    ? 'bg-[#F5B500] border-[#F5B500] text-black shadow-lg shadow-[#F5B500]/20'
                                                    : 'bg-slate-700 border-slate-700 text-white shadow-lg'
                                                : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                }`}
                                            style={{ fontFamily: 'Teko, sans-serif' }}
                                        >
                                            {cat === 'PRO' ? 'Ouro (PRO)' : 'Prata (LIGHT)'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Team */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Equipe (opcional)</label>
                                <input
                                    type="text"
                                    value={formData.team}
                                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E6A9C]"
                                    placeholder="Nome da equipe"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!formData.name}
                                    className="flex-1 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Pilots;
