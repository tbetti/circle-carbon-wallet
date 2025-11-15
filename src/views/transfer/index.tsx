"use client";
import { Card } from "@/components/ui/card";
import { TransferForm } from "./TransferForm";

export const TransferView = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-3xl mx-auto">
        <TransferForm />
      </Card>
    </div>
  );
};
