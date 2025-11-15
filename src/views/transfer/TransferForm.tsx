"use client";

import { useEffect, useState } from "react";
import { useCrossChainTransfer } from "@/hooks/use-cross-chain-transfer";
// Bridge Kit Integration
import { bridgeUSDC, connectPhantom } from "@/lib/bridgeKitClient";
import { fetchGpuCost } from "@/lib/apiClient";

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
  
  // Bridge Kit Integration States
  const [useBridgeKit, setUseBridgeKit] = useState(false);
  const [carbonEmissions, setCarbonEmissions] = useState<number | null>(null);
  const [phantomConnected, setPhantomConnected] = useState(false);
  const [metamaskConnected, setMetamaskConnected] = useState(false);

  // Calculate carbon emissions for the transfer
  const calculateCarbonEmissions = async (transferAmount: string) => {
    try {
      // Mock calculation - in reality this would use the carbon API
      // For now, simulate based on transfer amount (larger transfers = more computation = more emissions)
      const amount = parseFloat(transferAmount);
      const estimatedEmissions = amount * 0.001; // 0.001 kg CO2 per USDC transferred
      setCarbonEmissions(estimatedEmissions);
      return estimatedEmissions;
    } catch (error) {
      console.error("Failed to calculate carbon emissions:", error);
      return 0;
    }
  };

  // Bridge Kit Transfer Handler
  const handleBridgeKitTransfer = async () => {
    try {
      setIsTransferring(true);
      setElapsedSeconds(0);
      
      // 1. Calculate carbon emissions first
      await calculateCarbonEmissions(amount);
      
      // 2. Connect wallets if needed
      if (!phantomConnected) {
        await connectPhantom();
        setPhantomConnected(true);
      }
      
      // 3. Execute Bridge Kit transfer
      const result = await bridgeUSDC(amount);
      console.log("Bridge Kit transfer successful:", result);
      
      // 4. Auto-mint carbon credits after successful Bridge Kit transfer
      // This will be handled in the Bridge Kit success callback
      
    } catch (error) {
      console.error("Bridge Kit transfer failed:", error);
    } finally {
      setIsTransferring(false);
      setShowFinalTime(true);
    }
  };

  // Main transfer handler - chooses between Bridge Kit and manual CCTP
  const handleStartTransfer = async () => {
    const isSolanaToArc = sourceChain === SupportedChainId.SOLANA_DEVNET && 
                          destinationChain === SupportedChainId.ARC_TESTNET;
    
    if (useBridgeKit && isSolanaToArc) {
      // Use Bridge Kit for Solana -> Arc transfers
      await handleBridgeKitTransfer();
    } else {
      // Use manual CCTP for other combinations
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

  // Calculate carbon emissions when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && useBridgeKit) {
      calculateCarbonEmissions(amount);
    } else {
      setCarbonEmissions(null);
    }
  }, [amount, useBridgeKit]);

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Cross-Chain USDC Transfer
        </CardTitle>
        <p className="text-center text-gray-600 text-xs md:text-sm mt-2">
          Move USDC securely across 16 blockchains
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bridge Kit Toggle */}
        {sourceChain === SupportedChainId.SOLANA_DEVNET && 
         destinationChain === SupportedChainId.ARC_TESTNET && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🌉</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Bridge Kit Enhanced Transfer</h3>
                  <p className="text-sm text-gray-600">Optimized Solana → Arc transfer with automatic carbon offsetting</p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useBridgeKit}
                  onChange={(e) => setUseBridgeKit(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  useBridgeKit ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    useBridgeKit ? 'translate-x-6' : 'translate-x-1'
                  } mt-1`} />
                </div>
              </label>
            </div>
            {useBridgeKit && (
              <div className="mt-3 p-3 bg-white/50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Carbon Impact:</span>
                  <span className="font-medium text-green-600">
                    {carbonEmissions ? `~${carbonEmissions.toFixed(3)} kg CO₂` : 'Calculating...'}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Carbon credits will be automatically minted to offset this transfer
                </div>
              </div>
            )}
          </div>
        )}

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
            ) : useBridgeKit && sourceChain === SupportedChainId.SOLANA_DEVNET && 
                 destinationChain === SupportedChainId.ARC_TESTNET ? (
              `🌉 Bridge Kit: Send ${amount ? `${amount} USDC` : "USDC"}`
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
