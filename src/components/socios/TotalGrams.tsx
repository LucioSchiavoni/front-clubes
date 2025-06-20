import { useAuthStore } from "@/store/auth";
import { useGramsBySocio } from "@/hooks/useGramsBySocio";
import { Loader2 } from "lucide-react";

const TotalGrams = () => {
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