"use client";

import { useEffect, useState } from "react";
import { useCrossChainTransfer } from "@/hooks/use-cross-chain-transfer";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  SupportedChainId,
  SUPPORTED_CHAINS,
  CHAIN_TO_CHAIN_NAME,
} from "@/lib/chains";
import { ProgressSteps } from "@/components/progress-step";
import { TransferLog } from "@/components/transfer-log";
import { Timer } from "@/components/timer";
import { TransferTypeSelector } from "@/components/transfer-type";

export const TransferForm = () => {
  const [transferType, setTransferType] = useState<"fast" | "standard">("fast");
  const { currentStep, logs, error, executeTransfer, getBalance, reset } =
    useCrossChainTransfer();
  const [sourceChain, setSourceChain] = useState<SupportedChainId>(
    SupportedChainId.ARC_TESTNET
  );
  const [destinationChain, setDestinationChain] = useState<SupportedChainId>(
    SupportedChainId.ETH_SEPOLIA
  );
  const [amount, setAmount] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showFinalTime, setShowFinalTime] = useState(false);
  const [balance, setBalance] = useState("0");

  const handleStartTransfer = async () => {
    setIsTransferring(true);
    setShowFinalTime(false);
    setElapsedSeconds(0);
    try {
      await executeTransfer(sourceChain, destinationChain, amount, transferType);
    } catch (error) {
      console.error("Transfer failed:", error);
    } finally {
      setIsTransferring(false);
      setShowFinalTime(true);
    }
  };

  const handleReset = () => {
    reset();
    setIsTransferring(false);
    setShowFinalTime(false);
    setElapsedSeconds(0);
  };

  useEffect(() => {
    const wrapper = async () => {
      try {
        const balance = await getBalance(sourceChain);
        setBalance(balance);
      } catch (error) {
        console.error("Failed to get balance:", error);
        setBalance("0");
      }
    };
    wrapper();
  }, [sourceChain, getBalance]);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Cross-Chain USDC Transfer
        </CardTitle>
        <p className="text-center text-gray-600 text-sm mt-2">
          Move USDC securely across 16 blockchains
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Transfer Type</Label>
          <TransferTypeSelector value={transferType} onChange={setTransferType} />
          <p className="text-sm text-muted-foreground">
            {transferType === "fast"
              ? "Faster transfers with lower finality threshold (1000 blocks)"
              : "Standard transfers with higher finality (2000 blocks)"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Source Chain</Label>
            <Select value={String(sourceChain)} onValueChange={(value) => setSourceChain(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select source chain" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.map((chainId) => (
                  <SelectItem key={chainId} value={String(chainId)}>
                    {CHAIN_TO_CHAIN_NAME[chainId]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Destination Chain</Label>
            <Select
              value={String(destinationChain)}
              onValueChange={(value) => setDestinationChain(Number(value))}
              disabled={!sourceChain}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination chain" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.filter((chainId) => chainId !== sourceChain).map((chainId) => (
                  <SelectItem key={chainId} value={String(chainId)}>
                    {CHAIN_TO_CHAIN_NAME[chainId]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Amount (USDC)</Label>
          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              min="0"
              max={parseFloat(balance)}
              step="any"
              className="pr-12"
            />
            <span className="absolute right-3 top-2.5 text-sm text-gray-500">USDC</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Available: {balance} USDC</p>
            <button
              type="button"
              onClick={() => setAmount(balance)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Use Max
            </button>
          </div>
          {amount && parseFloat(amount) > parseFloat(balance) && (
            <p className="text-sm text-red-500 font-medium">Insufficient balance</p>
          )}
        </div>

        <div className="text-center">
          {showFinalTime ? (
            <div className="text-2xl font-mono">
              <span>{Math.floor(elapsedSeconds / 60).toString().padStart(2, "0")}</span>:
              <span>{(elapsedSeconds % 60).toString().padStart(2, "0")}</span>
            </div>
          ) : (
            <Timer isRunning={isTransferring} initialSeconds={elapsedSeconds} onTick={setElapsedSeconds} />
          )}
        </div>

        <ProgressSteps currentStep={currentStep} />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Estimated Details</span>
            <span className={`text-sm font-bold ${transferType === "fast" ? "text-green-600" : "text-orange-600"}`}>
              {transferType === "fast" ? "Faster" : "Standard"}
            </span>
          </div>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Gas Fee:</span>
              <span className="font-medium">~0.10 - 0.20 USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Bridge Fee:</span>
              <span className="font-medium">~0.05% of amount</span>
            </div>
            <div className="flex justify-between border-t pt-1 mt-1">
              <span className="font-semibold">Est. Time:</span>
              <span className="font-semibold text-blue-600">
                {transferType === "fast" ? "5-10 min" : "10-15 min"}
              </span>
            </div>
          </div>
        </div>

        <TransferLog logs={logs} />
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            <span className="font-semibold">❌ Error: </span>{error}
          </div>
        )}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleStartTransfer}
            disabled={isTransferring || currentStep === "completed" || parseFloat(amount) <= 0}
            className={`flex-1 py-3 font-semibold transition-all ${
              isTransferring
                ? "bg-gray-400 cursor-not-allowed opacity-75"
                : currentStep === "completed"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : parseFloat(amount) > 0 && sourceChain !== destinationChain
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                    : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            {isTransferring ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : currentStep === "completed" ? (
              "✅ Transfer Complete"
            ) : (
              `Send ${amount ? `${amount} USDC` : "USDC"}`
            )}
          </Button>
          {(currentStep === "completed" || currentStep === "error") && (
            <Button variant="outline" onClick={handleReset} className="px-6 py-3">
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
};
