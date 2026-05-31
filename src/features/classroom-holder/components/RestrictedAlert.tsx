export const RestrictedAlert = () => {
  return (
    <div className="bg-[#FFFDF0] border border-[#E8D98A] rounded-lg p-4 mb-6 flex items-start">
      <span className="text-[#B8860B] mr-3 text-lg mt-0.5">⚠</span>
      <div>
        <h3 className="text-sm font-bold text-gray-800">Acceso Restringido</h3>
        <p className="text-sm text-gray-600 mt-0.5">
          Este módulo está disponible únicamente para docentes titulares y administradores.
        </p>
      </div>
    </div>
  );
};