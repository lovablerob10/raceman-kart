import { useState } from 'react';
import { Plus, Edit, Trash2, MapPin, Calendar as CalendarIcon, Check, X } from 'lucide-react';

interface Stage {
    id: number;
    name: string;
    date: string;
    local: string;
    status: 'upcoming' | 'completed' | 'cancelled';
}

const initialStages: Stage[] = [
    { id: 1, name: 'Etapa 1', date: '2026-01-15', local: 'Kartódromo Granja Viana', status: 'completed' },
    { id: 2, name: 'Etapa 2', date: '2026-01-29', local: 'Kartódromo RBC', status: 'completed' },
    { id: 3, name: 'Etapa 3', date: '2026-02-01', local: 'Kartódromo San Marino', status: 'completed' },
    { id: 4, name: 'Etapa 4', date: '2026-02-15', local: 'Kartódromo Granja Viana', status: 'upcoming' },
    { id: 5, name: 'Etapa 5', date: '2026-03-01', local: 'Kartódromo RBC', status: 'upcoming' },
    { id: 6, name: 'Etapa 6', date: '2026-03-15', local: 'Kartódromo San Marino', status: 'upcoming' },
];

const statusStyles = {
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
    upcoming: 'Próxima',
    completed: 'Realizada',
    cancelled: 'Cancelada',
};

export function Stages() {
    const [stages, setStages] = useState<Stage[]>(initialStages);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Stage | null>(null);

    const handleEdit = (stage: Stage) => {
        setEditingId(stage.id);
        setEditForm({ ...stage });
    };

    const handleSave = () => {
        if (editForm) {
            setStages(stages.map(s => s.id === editForm.id ? editForm : s));
            setEditingId(null);
            setEditForm(null);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleDelete = (id: number) => {
        if (confirm('Tem certeza que deseja excluir esta etapa?')) {
            setStages(stages.filter(s => s.id !== id));
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-gray-500">Gerencie as etapas do campeonato 2026</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#2E6A9C] text-white rounded-lg hover:bg-[#1e4669] transition-colors">
                    <Plus size={20} />
                    <span style={{ fontFamily: 'Teko, sans-serif' }}>Nova Etapa</span>
                </button>
            </div>

            {/* Stages Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Etapa</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Data</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Local</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.map((stage) => (
                            <tr key={stage.id} className="border-b border-gray-100 hover:bg-gray-50">
                                {editingId === stage.id && editForm ? (
                                    <>
                                        <td className="py-4 px-6">
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <input
                                                type="date"
                                                value={editForm.date}
                                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                className="border rounded px-2 py-1"
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <input
                                                type="text"
                                                value={editForm.local}
                                                onChange={(e) => setEditForm({ ...editForm, local: e.target.value })}
                                                className="border rounded px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td className="py-4 px-6">
                                            <select
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Stage['status'] })}
                                                className="border rounded px-2 py-1"
                                            >
                                                <option value="upcoming">Próxima</option>
                                                <option value="completed">Realizada</option>
                                                <option value="cancelled">Cancelada</option>
                                            </select>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-4 px-6">
                                            <span
                                                className="font-bold text-slate-800 text-lg"
                                                style={{ fontFamily: 'Teko, sans-serif' }}
                                            >
                                                {stage.name}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <CalendarIcon size={16} className="text-gray-400" />
                                                {formatDate(stage.date)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin size={16} className="text-gray-400" />
                                                {stage.local}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[stage.status]}`}>
                                                {statusLabels[stage.status]}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(stage)}
                                                    className="p-2 text-[#2E6A9C] hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(stage.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stages;
