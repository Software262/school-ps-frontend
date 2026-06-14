import { useState } from 'react';
import { Plus, Tags, Trash2, Pencil, PackageSearch } from 'lucide-react';
import { Badge } from '@/shared/ui/atoms/Badge';
import { Button } from '@/shared/ui/atoms/Button';
import { Spinner } from '@/shared/ui/atoms/Spinner';
import { useTiposComplementario } from '../hooks/useTiposComplementario';
import { useComplementarios } from '../hooks/useComplementarios';
import { TipoComplementarioModal } from './TipoComplementarioModal';
import { ComplementarioModal } from './ComplementarioModal';
import type { Complementario, TipoComplementario } from '../model/types';
import '@/features/escuelas-formacion/components/EscuelasFormacionList.css';

export const ComplementariosManager = () => {
  const {
    tipos,
    loading: loadingTipos,
    error: errorTipos,
    create: createTipo,
    update: updateTipo,
    remove: removeTipo,
  } = useTiposComplementario();
  const {
    complementarios,
    loading: loadingComplementarios,
    error: errorComplementarios,
    create: createComplementario,
    update: updateComplementario,
    remove: removeComplementario,
  } = useComplementarios();

  const [tipoModalOpen, setTipoModalOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState<TipoComplementario | null>(null);

  const [compModalOpen, setCompModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Complementario | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);

  function openNewTipo() {
    setEditingTipo(null);
    setTipoModalOpen(true);
  }

  function openEditTipo(tipo: TipoComplementario) {
    setEditingTipo(tipo);
    setTipoModalOpen(true);
  }

  async function handleDeleteTipo(tipo: TipoComplementario) {
    setActionError(null);
    if (!window.confirm(`¿Inactivar el tipo "${tipo.nombre}"?`)) return;
    try {
      await removeTipo(tipo.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo inactivar el tipo');
    }
  }

  function openNewComplementario() {
    setEditingComp(null);
    setCompModalOpen(true);
  }

  function openEditComplementario(comp: Complementario) {
    setEditingComp(comp);
    setCompModalOpen(true);
  }

  async function handleDeleteComplementario(comp: Complementario) {
    setActionError(null);
    if (!window.confirm(`¿Inactivar el complementario "${comp.nombre}"?`)) return;
    try {
      await removeComplementario(comp.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo inactivar el complementario');
    }
  }

  return (
    <div className="ef-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {actionError && <div className="alert alert-error">{actionError}</div>}

      <div className="ef-section">
        <div className="ef-section-header">
          <Tags size={16} style={{ color: 'var(--brand-primary)' }} />
          <h3 className="ef-section-title">Tipos de complementario</h3>
          <div style={{ marginLeft: 'auto' }}>
            <Button variant="primary" size="sm" onClick={openNewTipo}>
              <Plus size={14} /> Nuevo tipo
            </Button>
          </div>
        </div>

        {errorTipos && <div className="alert alert-error">{errorTipos}</div>}

        {loadingTipos && (
          <div className="ef-state">
            <Spinner size={26} />
            <span>Cargando tipos…</span>
          </div>
        )}

        {!loadingTipos && tipos.length === 0 && (
          <div className="ef-state ef-state--empty">
            <Tags size={36} style={{ opacity: 0.3 }} />
            <p>No hay tipos de complementario registrados.</p>
          </div>
        )}

        {!loadingTipos && tipos.length > 0 && (
          <div className="ef-table-wrap">
            <table className="ef-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo padre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tipos.map((tipo) => (
                  <tr key={tipo.id} className={!tipo.estado ? 'ef-row--inactive' : ''}>
                    <td>{tipo.nombre}</td>
                    <td>{tipo.padre_nombre ?? '—'}</td>
                    <td>
                      <Badge variant={tipo.estado ? 'green' : 'gray'}>
                        {tipo.estado ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td>
                      <div className="ef-row-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            openEditTipo(tipo);
                          }}
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            void handleDeleteTipo(tipo);
                          }}
                          disabled={!tipo.estado}
                          title="Inactivar"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="ef-section">
        <div className="ef-section-header">
          <PackageSearch size={16} style={{ color: 'var(--brand-primary)' }} />
          <h3 className="ef-section-title">Complementarios</h3>
          <div style={{ marginLeft: 'auto' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={openNewComplementario}
              disabled={tipos.length === 0}
            >
              <Plus size={14} /> Nuevo complementario
            </Button>
          </div>
        </div>

        {errorComplementarios && <div className="alert alert-error">{errorComplementarios}</div>}

        {loadingComplementarios && (
          <div className="ef-state">
            <Spinner size={26} />
            <span>Cargando complementarios…</span>
          </div>
        )}

        {!loadingComplementarios && complementarios.length === 0 && (
          <div className="ef-state ef-state--empty">
            <PackageSearch size={36} style={{ opacity: 0.3 }} />
            <p>No hay complementarios registrados.</p>
          </div>
        )}

        {!loadingComplementarios && complementarios.length > 0 && (
          <div className="ef-table-wrap">
            <table className="ef-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Año</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {complementarios.map((comp) => (
                  <tr
                    key={comp.id}
                    className={comp.estado_complemento !== 'Activo' ? 'ef-row--inactive' : ''}
                  >
                    <td>{comp.nombre}</td>
                    <td>{comp.tipo_complementario_nombre}</td>
                    <td>{comp.anio}</td>
                    <td>${comp.valor.toLocaleString('es-CO')}</td>
                    <td>
                      <Badge variant={comp.estado_complemento === 'Activo' ? 'green' : 'gray'}>
                        {comp.estado_complemento}
                      </Badge>
                    </td>
                    <td>
                      <div className="ef-row-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            openEditComplementario(comp);
                          }}
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            void handleDeleteComplementario(comp);
                          }}
                          disabled={comp.estado_complemento !== 'Activo'}
                          title="Inactivar"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {tipoModalOpen && (
        <TipoComplementarioModal
          key={editingTipo?.id ?? 'new-tipo'}
          isOpen={tipoModalOpen}
          onClose={() => {
            setTipoModalOpen(false);
          }}
          tipos={tipos}
          editing={editingTipo}
          onSubmit={async (nombre, subTipoComplementario, estado) => {
            if (editingTipo) {
              await updateTipo(editingTipo.id, {
                nombre,
                sub_tipo_complementario: subTipoComplementario,
                ...(estado !== null && { estado }),
              });
            } else {
              await createTipo({ nombre, sub_tipo_complementario: subTipoComplementario });
            }
          }}
        />
      )}

      {compModalOpen && (
        <ComplementarioModal
          key={editingComp?.id ?? 'new-complementario'}
          isOpen={compModalOpen}
          onClose={() => {
            setCompModalOpen(false);
          }}
          tipos={tipos}
          editing={editingComp}
          onSubmit={async ({ nombre, anio, valor, estadoComplemento, tipoComplementarioId }) => {
            if (editingComp) {
              await updateComplementario(editingComp.id, {
                nombre,
                anio,
                valor,
                estado_complemento: estadoComplemento,
                tipo_complementario_id: tipoComplementarioId,
              });
            } else {
              await createComplementario({
                nombre,
                anio,
                valor,
                estado_complemento: estadoComplemento,
                tipo_complementario_id: tipoComplementarioId,
              });
            }
          }}
        />
      )}
    </div>
  );
};
