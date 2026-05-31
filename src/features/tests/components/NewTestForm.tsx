import { FileText } from "lucide-react";
import { useState } from "react";
import type { ComplementarioPrueba } from "@/entities/tests/model/types";

interface NewTestFormProps {
  onCancel: () => void;
  onSave: () => void;
  initialData?: ComplementarioPrueba;
  onCreateComplementary: (nombre: string, valor: number) => Promise<void>;
  onUpdateComplementary: (
    id: number,
    nombre: string,
    valor: number,
  ) => Promise<void>;
}

export function NewTestForm({
  onCancel,
  onSave,
  initialData,
  onCreateComplementary,
  onUpdateComplementary,
}: NewTestFormProps) {
  const [nombre, setNombre] = useState(initialData?.nombre ?? "");
  const [valor, setValor] = useState(initialData?.valor.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!nombre || !valor) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (initialData) {
        await onUpdateComplementary(initialData.id, nombre, parseInt(valor));
      } else {
        await onCreateComplementary(nombre, parseInt(valor));
      }
      onSave();
    } catch (e) {
      console.error(e);
      setError(
        initialData ? "Error al actualizar prueba." : "Error al crear prueba.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-green-600" />
        {initialData
          ? "Editar Prueba Institucional"
          : "Crear Nueva Prueba Institucional"}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Prueba
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej. Simulacro ICFES 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Costo ($)
          </label>
          <input
            type="number"
            value={valor}
            onChange={(e) => {
              setValor(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej. 50000"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => {
            void handleSubmit();
          }}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading
            ? "Guardando..."
            : initialData
              ? "Actualizar"
              : "Crear Prueba"}
        </button>
      </div>
    </div>
  );
}
