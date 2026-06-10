import { useState } from 'react';
import { DataTable, StatusBadge } from '@/shared/ui';
import {
  Plus,
  ListPlus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { CreateTestForm } from '@/features/tests/components/CreateTestForm';
import { NewTestForm } from '@/features/tests/components/NewTestForm';
import { PaymentModal } from '@/features/tests/components/PaymentModal';
import { useTests } from '@/features/tests/hooks/useTests';
import type { PruebaAssignment, ComplementarioPrueba } from '@/entities/tests/model/types';

export function TestsPage() {
  const {
    assignments,
    availableTests,
    grados,
    periodos,
    estudiantes,
    loading,
    pendientes,
    pagadas,
    totalRecaudo,
    totalPendiente,
    moduloBloqueado,
    assignIndividual,
    assignMassive,
    registerPayment,
    deleteAssignment,
    deleteComplementary,
    updateComplementary,
    createComplementary,
  } = useTests();

  const [showAssign, setShowAssign] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editingTest, setEditingTest] = useState<ComplementarioPrueba | null>(null);
  const [payingTest, setPayingTest] = useState<PruebaAssignment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const handleDeleteTest = async (id: number) => {
    if (
      !confirm(
        '¿Seguro que deseas borrar este tipo de prueba? Se borrarán también las asignaciones relacionadas.',
      )
    )
      return;
    try {
      await deleteComplementary(id);
    } catch {
      alert('Error al eliminar la prueba');
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta asignación de prueba?')) return;
    try {
      await deleteAssignment(id);
    } catch {
      alert('Error al eliminar la asignación');
    }
  };

  const handlePayConfirm = async (monto: number) => {
    if (!payingTest) return;
    await registerPayment(payingTest.id, monto);
    setPayingTest(null);
  };

  const columns = [
    { key: 'documento', label: 'Documento' },
    { key: 'estudianteNombre', label: 'Estudiante' },
    { key: 'pruebaNombre', label: 'Tipo de Prueba' },
    { key: 'periodoNombre', label: 'Período' },
    { key: 'valorStr', label: 'Valor Total' },
    { key: 'valorPagadoStr', label: 'Abonado' },
    { key: 'saldoStr', label: 'Saldo' },
    {
      key: 'estadoStr',
      label: 'Estado',
      render: (value: unknown) => <StatusBadge status={String(value)} />,
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (_: unknown, item: PruebaAssignment) => (
        <div className="flex gap-3 items-center">
          <button
            onClick={() => {
              setPayingTest(item);
            }}
            disabled={item.estado === 'pagada'}
            className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Abonar
          </button>
          <button
            onClick={() => {
              void handleDeleteAssignment(item.id);
            }}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Eliminar asignación"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filteredAssignments = assignments.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      (a.documento?.toLowerCase().includes(q) ?? false) ||
      (a.estudianteNombre?.toLowerCase().includes(q) ?? false);
    const matchesStatus = statusFilter === 'todos' || a.estado === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pruebas Internas</h2>
          <p className="text-gray-600 mt-1">Gestión de evaluaciones institucionales</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowCreate(true);
              setShowAssign(false);
              setEditingTest(null);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Crear Prueba
          </button>
          <button
            onClick={() => {
              setShowAssign(true);
              setShowCreate(false);
              setEditingTest(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <ListPlus className="w-4 h-4" /> Asignar
          </button>
        </div>
      </div>

      {/* PRI-RF-04: Module status banner */}
      {assignments.length > 0 && (
        <div
          className={`rounded-xl p-4 flex items-center gap-4 border ${moduloBloqueado ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${moduloBloqueado ? 'bg-red-100' : 'bg-green-100'}`}
          >
            {moduloBloqueado ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${moduloBloqueado ? 'text-red-800' : 'text-green-800'}`}>
              {moduloBloqueado
                ? `Módulo con obligaciones pendientes — ${pendientes.toString()} estudiante(s) sin cancelar`
                : 'Módulo al día — Todas las obligaciones están canceladas'}
            </p>
            <p className="text-sm text-gray-600 mt-0.5">
              {pagadas} pagadas · {pendientes} pendientes · {assignments.length} total
            </p>
          </div>
          <div className="flex gap-4 text-sm text-right">
            <div>
              <p className="text-gray-500">Recaudo</p>
              <p className="font-bold text-gray-900">${totalRecaudo.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Pendiente</p>
              <p className={`font-bold ${moduloBloqueado ? 'text-red-600' : 'text-green-600'}`}>
                ${totalPendiente.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Forms */}
      {showAssign && (
        <CreateTestForm
          onCancel={() => {
            setShowAssign(false);
          }}
          onSave={() => {
            setShowAssign(false);
          }}
          availableTests={availableTests}
          grados={grados}
          periodos={periodos}
          estudiantes={estudiantes}
          onAssignIndividual={assignIndividual}
          onAssignMassive={assignMassive}
        />
      )}

      {(showCreate || editingTest) && (
        <NewTestForm
          key={editingTest ? editingTest.id : 'new'}
          onCancel={() => {
            setShowCreate(false);
            setEditingTest(null);
          }}
          onSave={() => {
            setShowCreate(false);
            setEditingTest(null);
          }}
          initialData={editingTest ?? undefined}
          onCreateComplementary={createComplementary}
          onUpdateComplementary={updateComplementary}
        />
      )}

      {payingTest && (
        <PaymentModal
          item={payingTest}
          onClose={() => {
            setPayingTest(null);
          }}
          onConfirm={handlePayConfirm}
        />
      )}

      {/* Available Tests Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Pruebas Disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableTests.map((prueba) => (
            <div
              key={prueba.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 pr-16">{prueba.nombre}</h4>
                  <p className="text-lg font-bold text-blue-600 mt-2">
                    ${prueba.valor.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Año {prueba.anio}</p>
                </div>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingTest(prueba);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar Prueba"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      void handleDeleteTest(prueba.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Eliminar Prueba"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {availableTests.length === 0 && !loading && (
            <div className="col-span-3 text-center py-8 text-gray-400">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No hay pruebas creadas. Usa "Crear Prueba" para empezar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <h3 className="font-semibold text-gray-800 shrink-0">Estudiantes Asignados</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por documento o nombre..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-80"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-48"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="pago-parcial">Pago Parcial</option>
              <option value="pagada">Pagada</option>
            </select>
          </div>
        </div>
        <div className="p-4">
          <DataTable columns={columns} data={filteredAssignments} />
        </div>
      </div>
    </div>
  );
}
