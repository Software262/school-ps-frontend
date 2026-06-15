import { InventorySection } from '@/shared/ui/organisms/InventorySection';
import type { InventorySectionProps } from '@/shared/ui/organisms/InventorySection';

type Props = Omit<
  InventorySectionProps,
  'editLabel' | 'newLabel' | 'maintenanceLabel' | 'editDisabledTitle' | 'emptyMessage'
>;

export const SportInventorySection = (props: Props) => (
  <InventorySection
    {...props}
    editLabel="Editar Equipo"
    newLabel="Nuevo Equipo"
    maintenanceLabel="Mantenimiento"
    importLabel="Importar Equipos"
    editDisabledTitle="Selecciona un equipo de la tabla para editarlo"
    emptyMessage="No se encontraron equipos deportivos"
  />
);
