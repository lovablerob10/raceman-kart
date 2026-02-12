import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Pilot {
    id: string;
    pilot_id: string;
    name: string;
    category: 'Ouro' | 'Prata';
    points: number;
    position: number;
}

export function Standings() {
    const [pilots, setPilots] = useState<Pilot[]>([]);
    const [loading, setLoading] = useState(true);
    const [editedPoints, setEditedPoints] = useState<Record<string, number>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

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

    const getPositionIcon = (pos: number) => {
        switch (pos) {
            case 1: return <Trophy className="text-yellow-500" size={20} />;
            case 2: return <Medal className="text-gray-400" size={20} />;
            case 3: return <Award className="text-orange-600" size={20} />;
            default: return <span className="text-gray-400 font-bold">{pos}º</span>;
        }
    };

    const renderTable = (categoryPilots: Pilot[], title: string) => (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-slate-50">
                <h3
                    className="text-xl font-bold text-slate-800"
                    style={{ fontFamily: 'Teko, sans-serif' }}
                >
                    {title}
                </h3>
            </div>
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-500 w-16">Pos</th>
                        <th className="text-left py-3 px-6 text-sm font-medium text-gray-500">Piloto</th>
                        <th className="text-center py-3 px-6 text-sm font-medium text-gray-500 w-32">Pontos</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryPilots.map((pilot, index) => (
                        <tr
                            key={pilot.id}
                            className={`border-b border-gray-100 ${index < 3 ? 'bg-gradient-to-r from-transparent to-gray-50' : ''}`}
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
                        </tr>
                    ))}
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
                {renderTable(proPilots, 'Categoria OURO')}
                {renderTable(lightPilots, 'Categoria PRATA')}
            </div>
        </div>
    );
}

export default Standings;
