
import React from "react";
import { Loader2 } from "lucide-react";

export const PageLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-16 w-16 animate-spin text-green-600" />
  </div>
);
