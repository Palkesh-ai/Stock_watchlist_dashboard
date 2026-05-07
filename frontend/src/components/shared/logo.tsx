import { CandlestickChart } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-primary p-2 text-white">
        <CandlestickChart className="h-4 w-4" />
      </div>
      <p className="font-semibold">{APP_NAME}</p>
    </div>
  );
}
