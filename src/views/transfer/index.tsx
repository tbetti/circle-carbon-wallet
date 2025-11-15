"use client";
import { Card } from "@/components/ui/card";
import { TransferForm } from "./TransferForm";
import { SystemIntegrationSummary } from "@/components/system-integration-summary";

export const TransferView = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <SystemIntegrationSummary />
        <Card>
          <TransferForm />
        </Card>
      </div>
    </div>
  );
};
