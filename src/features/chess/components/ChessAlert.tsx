import { ModuleAlert } from '@/shared/ui/organisms/ModuleAlert';

export const ChessAlert = () => (
  <ModuleAlert
    icon="♟"
    title="Gestión de Material de Ajedrez"
    message="Cada juego de ajedrez debe contar con 32 piezas completas. Al devolver, verifique que el material esté completo y en buen estado. Si faltan piezas, se generará una novedad y se bloqueará el paz y salvo del estudiante."
  />
);
