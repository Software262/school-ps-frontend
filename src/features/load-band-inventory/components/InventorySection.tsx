import { InventorySection as SharedInventorySection } from '@/shared/ui/organisms/InventorySection';
import type { InventorySectionProps } from '@/shared/ui/organisms/InventorySection';

type Props = Omit<
  InventorySectionProps,
  'editLabel' | 'newLabel' | 'editDisabledTitle' | 'emptyMessage'
>;

export const InventorySection = (props: Props) => (
  <SharedInventorySection
    {...props}
    editLabel="Editar Instrumento"
    newLabel="Nuevo Instrumento"
    editDisabledTitle="Selecciona un instrumento de la tabla para editarlo"
    emptyMessage="No se encontraron instrumentos"
  />
);
