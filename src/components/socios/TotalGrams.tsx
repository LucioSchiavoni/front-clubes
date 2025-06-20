import { useAuthStore } from "@/store/auth";
import { useGramsBySocio } from "@/hooks/useGramsBySocio";
import { Loader2 } from "lucide-react";

const TotalGrams = () => {
  const { profile } = useAuthStore();
  const userId = profile?.data?.id;
  const { data, isLoading, error } = useGramsBySocio(userId);

  console.log(userId)
  console.log("la data:",data)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-emerald-600 w-6 h-6 mr-2" />
        <span className="text-emerald-700 font-medium">Cargando tus estadísticas...</span>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
        Error al cargar los datos de consumo.
      </div>
    );
  }


  return (
    <div className="bg-emerald-900/90 rounded-2xl shadow-lg p-6 flex flex-col items-center text-white">
      <h3 className="text-lg font-semibold mb-2">Consumo del mes</h3>
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold">{data.data.totalGrams}g</span>
          <span className="text-emerald-300 text-sm">Total gramos</span>
        </div>
        <div className="w-px h-8 bg-emerald-700/50"></div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{data.totalOrders}</span>
          <span className="text-emerald-300 text-sm">Órdenes</span>
        </div>
      </div>
      <div className="mt-3 text-emerald-200 text-xs">
        Última actualización: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
};

export default TotalGrams;