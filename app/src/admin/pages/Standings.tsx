import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Save, Loader2, Plus, Trash2, X, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Pilot {
    id: string;
    pilot_id: string;
    name: string;
    category: 'Ouro' | 'Prata';
    points: number;
    position: number;
}

interface AvailablePilot {
    id: string;
    name: string;
    category: 'Ouro' | 'Prata';
}

export function Standings() {
    const [pilots, setPilots] = useState<Pilot[]>([]);
    const [loading, setLoading] = useState(true);
    const [editedPoints, setEditedPoints] = useState<Record<string, number>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    // Add pilot modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addCategory, setAddCategory] = useState<'Ouro' | 'Prata'>('Ouro');
    const [newPilotName, setNewPilotName] = useState('');
    const [newPilotNumber, setNewPilotNumber] = useState('');
    const [newPilotTeam, setNewPilotTeam] = useState('');
    const [addingPilot, setAddingPilot] = useState(false);

    // Add existing pilot
    const [showExistingModal, setShowExistingModal] = useState(false);
    const [existingCategory, setExistingCategory] = useState<'Ouro' | 'Prata'>('Ouro');
    const [availablePilots, setAvailablePilots] = useState<AvailablePilot[]>([]);
    const [selectedPilotId, setSelectedPilotId] = useState('');

    useEffect(() => {
        fetchStandings();
    }, []);

    const fetchStandings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('standings')
                .select(`
                    id,
                    pilot_id,
                    points,
                    position,
                    category,
                    pilot:pilot_id (
                        name
                    )
                `)
                .order('points', { ascending: false });

            if (error) throw error;

            if (data) {
                const mapped: Pilot[] = data.map((s: any, index: number) => ({
                    id: s.id,
                    pilot_id: s.pilot_id,
                    name: s.pilot?.name || 'Piloto',
                    category: s.category as 'Ouro' | 'Prata',
                    points: s.points,
                    position: index + 1
                }));
                setPilots(mapped);
            }
        } catch (err) {
            console.error('Error fetching standings:', err);
        } finally {
            setLoading(false);
        }
    };

    const proPilots = pilots.filter(p => p.category === 'Ouro').sort((a, b) => b.points - a.points);
    const lightPilots = pilots.filter(p => p.category === 'Prata').sort((a, b) => b.points - a.points);

    const handlePointsChange = (id: string, points: number) => {
        setEditedPoints({ ...editedPoints, [id]: points });
        setHasChanges(true);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const updates = Object.entries(editedPoints).map(([id, points]) => ({
                id,
                points
            }));

            for (const update of updates) {
                const { error } = await supabase
                    .from('standings')
                    .update({ points: update.points })
                    .eq('id', update.id);

                if (error) throw error;
            }

            await fetchStandings();
            setEditedPoints({});
            setHasChanges(false);
            alert('Pontuação atualizada com sucesso!');
        } catch (err) {
            console.error('Error saving standings:', err);
            alert('Erro ao salvar as alterações.');
        } finally {
            setSaving(false);
        }
    };

    const handleOpenAddModal = (category: 'Ouro' | 'Prata') => {
        setAddCategory(category);
        setNewPilotName('');
        setNewPilotNumber('');
        setNewPilotTeam('');
        setShowAddModal(true);
    };

    const handleAddNewPilot = async () => {
        if (!newPilotName.trim()) return;
        setAddingPilot(true);

        try {
            // 1. Create pilot
            const { data: pilotData, error: pilotError } = await supabase
                .from('pilots')
                .insert({
                    name: newPilotName.trim(),
                    category: addCategory,
                    number: newPilotNumber ? parseInt(newPilotNumber) : null,
                    team: newPilotTeam.trim() || null,
                })
                .select()
                .single();

            if (pilotError) throw pilotError;

            // 2. Create standings entry
            const { error: standingError } = await supabase
                .from('standings')
                .insert({
                    pilot_id: pilotData.id,
                    category: addCategory,
                    points: 0,
                    season_year: new Date().getFullYear() > 2025 ? new Date().getFullYear() : 2026
                });

            if (standingError) throw standingError;

            await fetchStandings();
            setShowAddModal(false);
        } catch (err) {
            console.error('Error adding pilot:', err);
            alert('Erro ao adicionar piloto.');
        } finally {
            setAddingPilot(false);
        }
    };

    const handleOpenExistingModal = async (category: 'Ouro' | 'Prata') => {
        setExistingCategory(category);
        setSelectedPilotId('');

        // Fetch pilots that don't have standings yet
        const existingPilotIds = pilots.map(p => p.pilot_id);

        const { data, error } = await supabase
            .from('pilots')
            .select('id, name, category')
            .order('name');

        if (!error && data) {
            const available = data.filter(p => !existingPilotIds.includes(p.id));
            setAvailablePilots(available as AvailablePilot[]);
        }

        setShowExistingModal(true);
    };

    const handleAddExistingPilot = async () => {
        if (!selectedPilotId) return;
        setAddingPilot(true);

        try {
            const { error } = await supabase
                .from('standings')
                .insert({
                    pilot_id: selectedPilotId,
                    category: existingCategory,
                    points: 0,
                    season_year: new Date().getFullYear() > 2025 ? new Date().getFullYear() : 2026
                });

            if (error) throw error;

            await fetchStandings();
            setShowExistingModal(false);
        } catch (err) {
            console.error('Error adding existing pilot:', err);
            alert('Erro ao adicionar piloto à classificação.');
        } finally {
            setAddingPilot(false);
        }
    };

    const handleRemoveFromStandings = async (standingId: string) => {
        if (!confirm('Remover este piloto da classificação?')) return;

        const { error } = await supabase
            .from('standings')
            .delete()
            .eq('id', standingId);

        if (!error) {
            await fetchStandings();
        }
    };

    const getPositionIcon = (pos: number) => {
        switch (pos) {
            case 1: return <Trophy className="text-yellow-500" size={20} />;
            case 2: return <Medal className="text-gray-400" size={20} />;
            case 3: return <Award className="text-orange-600" size={20} />;
            default: return <span className="text-gray-400 font-bold">{pos}º</span>;
        }
    };

    const renderTable = (categoryPilots: Pilot[], title: string, category: 'Ouro' | 'Prata') => (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-slate-50 flex items-center justify-between">
                <h3
                    className="text-xl font-bold text-slate-800"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenExistingModal(category)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                        title="Adicionar piloto existente"
                    >
                        <UserPlus size={14} />
                        <span className="hidden sm:inline">Existente</span>
                    </button>
                    <button
                        onClick={() => handleOpenAddModal(category)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-colors font-semibold"
                        title="Criar novo piloto"
                    >
                        <Plus size={14} />
                        <span className="hidden sm:inline">Novo Piloto</span>
                    </button>
                </div>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 w-16">Pos</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Piloto</th>
                        <th className="text-center py-3 px-6 text-sm font-medium text-gray-500 w-32">Pontos</th>
                        <th className="text-center py-3 px-3 text-sm font-medium text-gray-500 w-12"></th>
                    </tr>
                </thead>
                <tbody>
                    {categoryPilots.map((pilot, index) => (
                        <tr
                            key={pilot.id}
                            className={`border-b border-gray-100 group ${index < 3 ? 'bg-gradient-to-r from-transparent to-gray-50' : ''}`}
                        >
                            <td className="py-4 px-6">
                                {getPositionIcon(index + 1)}
                            </td>
                            <td className="py-4 px-6">
                                <span
                                    className="font-bold text-slate-800"
                                    style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.1rem' }}
                                >
                                    {pilot.name}
                                </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                                <input
                                    type="number"
                                    value={editedPoints[pilot.id] ?? pilot.points}
                                    onChange={(e) => handlePointsChange(pilot.id, parseInt(e.target.value) || 0)}
                                    className="w-20 text-center border border-gray-300 rounded-lg py-1 
                    focus:outline-none focus:ring-2 focus:ring-[#2E6A9C] focus:border-transparent
                    font-bold text-slate-800"
                                    style={{ fontFamily: 'Teko, sans-serif', fontSize: '1.2rem' }}
                                />
                            </td>
                            <td className="py-4 px-3 text-center">
                                <button
                                    onClick={() => handleRemoveFromStandings(pilot.id)}
                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Remover da classificação"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {categoryPilots.length === 0 && (
                        <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-400">
                                Nenhum piloto nesta categoria. Clique em "Novo Piloto" para adicionar.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
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
            {/* Header with Save Button */}
            <div className="flex items-center justify-between">
                <p className="text-gray-500">Edite a pontuação dos pilotos</p>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${hasChanges && !saving
                        ? 'bg-[#2E6A9C] text-white hover:bg-[#1e4669]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    <span style={{ fontFamily: 'Teko, sans-serif' }}>
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </span>
                </button>
            </div>

            {/* Podium Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3
                    className="text-xl font-bold text-slate-800 mb-6"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    Preview do Pódio - OURO
                </h3>
                <div className="flex items-end justify-center gap-4">
                    {/* 2nd Place */}
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-2 flex items-center justify-center overflow-hidden">
                            <Medal className="text-gray-400" size={32} />
                        </div>
                        <div className="bg-gray-200 rounded-t-lg pt-4 pb-2 px-4 h-24 flex items-end justify-center">
                            <span className="text-sm font-bold text-gray-600">2º</span>
                        </div>
                        <p className="text-xs mt-2 font-medium text-gray-600 truncate w-24">
                            {proPilots[1]?.name || '-'}
                        </p>
                    </div>

                    {/* 1st Place */}
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-yellow-100 mx-auto mb-2 flex items-center justify-center border-4 border-yellow-400 overflow-hidden">
                            <Trophy className="text-yellow-500" size={40} />
                        </div>
                        <div className="bg-yellow-400 rounded-t-lg pt-4 pb-2 px-4 h-32 flex items-end justify-center">
                            <span className="text-lg font-bold text-yellow-800">1º</span>
                        </div>
                        <p className="text-sm mt-2 font-bold text-slate-800 truncate w-28">
                            {proPilots[0]?.name || '-'}
                        </p>
                    </div>

                    {/* 3rd Place */}
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-orange-100 mx-auto mb-2 flex items-center justify-center overflow-hidden">
                            <Award className="text-orange-600" size={28} />
                        </div>
                        <div className="bg-orange-200 rounded-t-lg pt-4 pb-2 px-4 h-20 flex items-end justify-center">
                            <span className="text-sm font-bold text-orange-700">3º</span>
                        </div>
                        <p className="text-xs mt-2 font-medium text-gray-600 truncate w-20">
                            {proPilots[2]?.name || '-'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderTable(proPilots, 'Categoria OURO', 'Ouro')}
                {renderTable(lightPilots, 'Categoria PRATA', 'Prata')}
            </div>

            {/* Add New Pilot Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Teko, sans-serif' }}>
                                Novo Piloto - {addCategory}
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Nome *</label>
                                <input
                                    type="text"
                                    value={newPilotName}
                                    onChange={(e) => setNewPilotName(e.target.value)}
                                    placeholder="Nome do piloto"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E6A9C]"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Número</label>
                                    <input
                                        type="number"
                                        value={newPilotNumber}
                                        onChange={(e) => setNewPilotNumber(e.target.value)}
                                        placeholder="00"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E6A9C]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Equipe</label>
                                    <input
                                        type="text"
                                        value={newPilotTeam}
                                        onChange={(e) => setNewPilotTeam(e.target.value)}
                                        placeholder="Equipe"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E6A9C]"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddNewPilot}
                                    disabled={addingPilot || !newPilotName.trim()}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2E6A9C] text-white rounded-xl hover:bg-[#1e4669] transition-all font-bold disabled:opacity-50"
                                >
                                    {addingPilot ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Plus size={18} />
                                    )}
                                    {addingPilot ? 'Adicionando...' : 'Adicionar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Existing Pilot Modal */}
            {showExistingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Teko, sans-serif' }}>
                                Adicionar Piloto Existente - {existingCategory}
                            </h3>
                            <button onClick={() => setShowExistingModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {availablePilots.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <UserPlus size={36} className="mx-auto mb-3 text-gray-300" />
                                <p className="font-semibold">Todos os pilotos já estão na classificação</p>
                                <p className="text-sm mt-1">Crie um novo piloto usando o botão "Novo Piloto"</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-2">Selecione o piloto</label>
                                    <select
                                        value={selectedPilotId}
                                        onChange={(e) => setSelectedPilotId(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E6A9C]"
                                    >
                                        <option value="">-- Selecione --</option>
                                        {availablePilots.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.category})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setShowExistingModal(false)}
                                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleAddExistingPilot}
                                        disabled={addingPilot || !selectedPilotId}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2E6A9C] text-white rounded-xl hover:bg-[#1e4669] transition-all font-bold disabled:opacity-50"
                                    >
                                        {addingPilot ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <UserPlus size={18} />
                                        )}
                                        {addingPilot ? 'Adicionando...' : 'Adicionar'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Standings;
