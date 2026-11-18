import { useState } from 'react';
import {
  Save,
  Sparkles,
  Copy,
  Percent,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/shared/ui/atoms/Button';
import { Badge } from '@/shared/ui/atoms/Badge';
import { useToast } from '@/shared/ui';
import { useBaseFees } from '../hooks/useBaseFees';
import { CopyFeesModal } from './CopyFeesModal';
import { MassiveAdjustmentModal } from './MassiveAdjustmentModal';

const formatCop = (val: number | null | undefined): string => {
  if (val === null || val === undefined || Number.isNaN(val)) return '$0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val);
};

export const BaseFeesManager = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    selectedYear,
    setSelectedYear,
    data,
    loading,
    saving,
    error,
    localRows,
    modifiedCount,
    updateRowValue,
    saveAll,
    saveSingle,
    initializeDefaults,
    copyFromYear,
    applyMassivePercentage,
  } = useBaseFees();

  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isMassiveModalOpen, setIsMassiveModalOpen] = useState(false);
  const [customYearInput, setCustomYearInput] = useState<string>('');
  const [savingGradeId, setSavingGradeId] = useState<number | null>(null);

  // Available common years
  const availableYears = [2024, 2025, 2026, 2027];
  if (!availableYears.includes(selectedYear)) {
    availableYears.push(selectedYear);
    availableYears.sort((a, b) => a - b);
  }

  // Handle saving all
  const handleSaveAll = async () => {
    try {
      await saveAll();
      showToast('Tarifas base guardadas exitosamente.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al guardar tarifas', 'error');
    }
  };

  // Handle saving single grade
  const handleSaveSingle = async (gradoId: number) => {
    setSavingGradeId(gradoId);
    try {
      await saveSingle(gradoId);
      showToast('Tarifa del grado actualizada.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al guardar el grado', 'error');
    } finally {
      setSavingGradeId(null);
    }
  };

  // Handle suggested defaults
  const handleLoadDefaults = async () => {
    if (
      !window.confirm(
        `¿Deseas inicializar los valores sugeridos estándar para el año ${selectedYear.toString()}? Esta acción sobreescribirá las tarifas actuales con la escala institucional recomendada.`,
      )
    ) {
      return;
    }
    try {
      await initializeDefaults();
      showToast(
        `Valores sugeridos cargados y guardados para ${selectedYear.toString()}.`,
        'success',
      );
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error al cargar sugeridos', 'error');
    }
  };

  // Stats calculation
  const totalGrados = data?.total_grados ?? 0;
  const totalConfigurados = data?.total_configurados ?? 0;
  const unconfiguredCount = totalGrados - totalConfigurados;

  const currentValues = Object.values(localRows);
  const avgMatricula =
    currentValues.length > 0
      ? Math.round(
          currentValues.reduce((acc, r) => acc + r.matricula_valor, 0) / currentValues.length,
        )
      : 0;

  const avgPension =
    currentValues.length > 0
      ? Math.round(
          currentValues.reduce((acc, r) => acc + r.pension_valor, 0) / currentValues.length,
        )
      : 0;

  return (
    <div className="enrollment-view" style={{ gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header and Back Link */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '16px',
        }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            void navigate({ to: '/dashboard/enrollment' });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <ArrowLeft size={16} /> Volver a Matrícula
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--brand-primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Año Activo: {selectedYear}</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="page-title">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Layers size={28} color="var(--brand-primary)" />
          Parametrización de Costos Base (Matrícula y Pensión)
        </h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Configuración institucional de tarifas por grado académico para el proceso de matrícula
          automática y generación de cuentas de pensión mensual.
        </p>
      </div>

      {/* Year Selection Bar & Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}
      >
        {/* Stat: Total Grados */}
        <div
          style={{
            padding: '16px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Grados Institucionales
            </span>
            <Layers size={18} color="var(--brand-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalGrados}</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              ({totalConfigurados} configurados)
            </span>
          </div>
        </div>

        {/* Stat: Estado de Parametrización */}
        <div
          style={{
            padding: '16px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Estado del Año {selectedYear}
            </span>
            {unconfiguredCount === 0 ? (
              <CheckCircle2 size={18} color="var(--status-green)" />
            ) : (
              <AlertTriangle size={18} color="var(--status-yellow)" />
            )}
          </div>
          <div>
            {unconfiguredCount === 0 ? (
              <Badge variant="green">Completo (100%)</Badge>
            ) : (
              <Badge variant="yellow">{unconfiguredCount} grado(s) pendientes</Badge>
            )}
          </div>
        </div>

        {/* Stat: Promedio Matrícula */}
        <div
          style={{
            padding: '16px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Matrícula Promedio
            </span>
            <DollarSign size={18} color="var(--brand-primary)" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
            {formatCop(avgMatricula)}
          </span>
        </div>

        {/* Stat: Promedio Pensión */}
        <div
          style={{
            padding: '16px',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              Pensión Mensual Prom.
            </span>
            <TrendingUp size={18} color="#2563eb" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2563eb' }}>
            {formatCop(avgPension)}
          </span>
        </div>
      </div>

      {/* Toolbar & Year Filter */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          background: 'white',
          padding: '14px 18px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Year Selector Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Año:
          </span>
          {availableYears.map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => {
                setSelectedYear(yr);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                backgroundColor: selectedYear === yr ? 'var(--brand-primary)' : '#f8fafc',
                color: selectedYear === yr ? '#ffffff' : 'var(--text-primary)',
                borderColor: selectedYear === yr ? 'var(--brand-primary)' : 'var(--border)',
                transition: 'all 0.15s ease',
              }}
            >
              {yr}
            </button>
          ))}

          {/* Custom Year Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
            <input
              type="number"
              placeholder="+ Año"
              value={customYearInput}
              onChange={(e) => {
                setCustomYearInput(e.target.value);
              }}
              style={{
                width: '80px',
                padding: '5px 8px',
                fontSize: '0.8125rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              }}
              min={2000}
              max={2100}
            />
            {customYearInput && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const y = Number(customYearInput);
                  if (y >= 2000 && y <= 2100) {
                    setSelectedYear(y);
                    setCustomYearInput('');
                  }
                }}
              >
                Ir
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void handleLoadDefaults();
            }}
            disabled={saving || loading}
            title="Carga la escala recomendada institucional (Sexto 850k/450k, Décimo 950k/520k, etc.)"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={16} color="#d97706" /> Valores Sugeridos
          </Button>


          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsCopyModalOpen(true);
            }}
            disabled={saving || loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Copy size={16} /> Copiar de otro año
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsMassiveModalOpen(true);
            }}
            disabled={saving || loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Percent size={16} /> Ajuste %
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              void handleSaveAll();
            }}
            disabled={saving || loading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
          >
            <Save size={16} />
            {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
            {modifiedCount > 0 && (
              <span
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--brand-primary)',
                  borderRadius: '99px',
                  padding: '1px 6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginLeft: '4px',
                }}
              >
                {modifiedCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Unsaved changes notification */}
      {modifiedCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            backgroundColor: 'var(--status-yellow-bg)',
            border: '1px solid var(--status-yellow-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--status-yellow)',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            <span>
              Tienes <strong>{modifiedCount}</strong> cambios sin guardar en las tarifas de{' '}
              {selectedYear}.
            </span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              void handleSaveAll();
            }}
            disabled={saving}
          >
            Guardar Ahora
          </Button>

        </div>
      )}

      {/* Missing configuration alert */}
      {unconfiguredCount > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 18px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            color: '#92400e',
            fontSize: '0.875rem',
          }}
        >
          <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '4px' }}>
              Atención: Existen grados sin costo base de matrícula parametrizado para {selectedYear}
              .
            </strong>
            <p style={{ margin: 0, color: '#78350f' }}>
              Al intentar matricular automáticamente a un estudiante de estos grados, el sistema
              rechazará la solicitud con el error{' '}
              <em>"No hay costo de matrícula parametrizado para grado..."</em>. Puedes hacer clic en{' '}
              <strong>"Valores Sugeridos"</strong> para cargar los montos institucionales o ingresar
              las tarifas manualmente en la tabla y hacer clic en{' '}
              <strong>"Guardar Todos los Cambios"</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--status-red-bg)',
            color: 'var(--status-red)',
            border: '1px solid var(--status-red-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Main Table */}
      <div className="table-container" style={{ background: 'white' }}>
        <table className="data-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '180px' }}>Grado Académico</th>
              <th style={{ width: '220px' }}>Costo Matrícula Base ($)</th>
              <th style={{ width: '220px' }}>Pensión Mensual ($)</th>
              <th style={{ width: '180px' }}>Proyección Anual</th>
              <th style={{ width: '130px', textAlign: 'center' }}>Estado</th>
              <th style={{ width: '110px', textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  Cargando tarifas de {selectedYear}...
                </td>
              </tr>
            ) : !data || data.tarifas.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  No se encontraron grados académicos registrados en el sistema.
                </td>
              </tr>
            ) : (
              data.tarifas.map((item) => {
                const row = localRows[item.grado_id] ?? {
                  grado_id: item.grado_id,
                  matricula_valor: item.matricula_valor ?? 0,
                  pension_valor: item.pension_valor ?? 0,
                  isModified: false,
                };

                const isConfigured = row.matricula_valor > 0 && row.pension_valor > 0;
                const anualEst = row.matricula_valor + row.pension_valor * 10;
                const isRowSaving = savingGradeId === item.grado_id;

                return (
                  <tr
                    key={item.grado_id}
                    style={{
                      backgroundColor: row.isModified ? '#fffdf0' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                          {item.grado_nombre}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ID: {item.grado_id}
                        </span>
                      </div>
                    </td>

                    {/* Matrícula input */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div
                          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '10px',
                              color: 'var(--text-muted)',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            $
                          </span>
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={row.matricula_valor === 0 ? '' : row.matricula_valor}
                            placeholder="0"
                            onChange={(e) => {
                              updateRowValue(
                                item.grado_id,
                                'matricula_valor',
                                Number(e.target.value),
                              );
                            }}
                            style={{
                              width: '100%',
                              padding: '8px 10px 8px 24px',
                              border:
                                row.matricula_valor === 0
                                  ? '1px solid #f59e0b'
                                  : '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              backgroundColor: row.isModified ? '#ffffff' : '#fcfcfc',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatCop(row.matricula_valor)}
                        </span>
                      </div>
                    </td>

                    {/* Pensión input */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div
                          style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: '10px',
                              color: 'var(--text-muted)',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                            }}
                          >
                            $
                          </span>
                          <input
                            type="number"
                            min={0}
                            step={1000}
                            value={row.pension_valor === 0 ? '' : row.pension_valor}
                            placeholder="0"
                            onChange={(e) => {
                              updateRowValue(
                                item.grado_id,
                                'pension_valor',
                                Number(e.target.value),
                              );
                            }}
                            style={{
                              width: '100%',
                              padding: '8px 10px 8px 24px',
                              border:
                                row.pension_valor === 0
                                  ? '1px solid #f59e0b'
                                  : '1px solid var(--border)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              backgroundColor: row.isModified ? '#ffffff' : '#fcfcfc',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {formatCop(row.pension_valor)} / mes
                        </span>
                      </div>
                    </td>

                    {/* Anual estimate */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                          {formatCop(anualEst)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Matrícula + 10 mensualidades
                        </span>
                      </div>
                    </td>

                    {/* Estado badge */}
                    <td style={{ textAlign: 'center' }}>
                      {isConfigured ? (
                        <Badge variant="green">Parametrizado</Badge>
                      ) : (
                        <Badge variant="yellow">Pendiente</Badge>
                      )}
                    </td>

                    {/* Fila individual acción */}
                    <td style={{ textAlign: 'center' }}>
                      <Button
                        variant={row.isModified ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => {
                          void handleSaveSingle(item.grado_id);
                        }}
                        disabled={isRowSaving || saving}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        {isRowSaving ? '...' : row.isModified ? 'Guardar' : 'Fijar'}
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Box */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: 'var(--text-primary)' }}>
          📌 Información sobre la parametrización de costos:
        </p>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>
            <strong>Matrícula Base:</strong> Se carga como el concepto principal al registrar la
            matrícula de un estudiante en la pantalla de Matrícula.
          </li>
          <li>
            <strong>Pensión Mensual:</strong> Determina la cuota que se cobra mensualmente en el
            Módulo de Pensión (10 mensualidades del año electivo).
          </li>
          <li>
            Para nuevos años académicos (ej: 2027), utiliza la herramienta{' '}
            <strong>"Copiar de otro año"</strong> para migrar todos los valores con el aumento por
            inflación en un solo clic.
          </li>
        </ul>
      </div>

      {/* Modals */}
      <CopyFeesModal
        isOpen={isCopyModalOpen}
        onClose={() => {
          setIsCopyModalOpen(false);
        }}
        currentYear={selectedYear}
        onConfirm={async (sYr, tYr, incPct) => {
          await copyFromYear(sYr, tYr, incPct);
          showToast(
            `Tarifas copiadas exitosamente de ${sYr.toString()} a ${tYr.toString()}.`,
            'success',
          );
        }}
      />

      <MassiveAdjustmentModal
        isOpen={isMassiveModalOpen}
        onClose={() => {
          setIsMassiveModalOpen(false);
        }}
        year={selectedYear}
        onApply={(pct) => {
          applyMassivePercentage(pct);
          showToast(
            `Ajuste de ${pct > 0 ? `+${pct.toString()}%` : `${pct.toString()}%`} aplicado a la tabla. Recuerda hacer clic en "Guardar Todos los Cambios".`,
            'info',
          );
        }}
      />
    </div>
  );
};
