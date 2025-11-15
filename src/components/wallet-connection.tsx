"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { connectPhantom } from "@/lib/bridgeKitClient";

interface WalletConnectionProps {
  onWalletConnected?: (walletType: 'phantom' | 'metamask', address: string) => void;
  onWalletDisconnected?: () => void;
}

export function WalletConnection({ onWalletConnected, onWalletDisconnected }: WalletConnectionProps) {
  const [phantomAddress, setPhantomAddress] = useState<string | null>(null);
  const [metamaskAddress, setMetamaskAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check for existing wallet connections on mount
  useEffect(() => {
    checkExistingConnections();
  }, []);

  const checkExistingConnections = async () => {
    // Check MetaMask
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setMetamaskAddress(accounts[0]);
          onWalletConnected?.('metamask', accounts[0]);
        }
      } catch (error) {
        console.log('MetaMask not connected:', error);
      }
    }

    // Check Phantom
    if (typeof window !== 'undefined' && window.solana) {
      try {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        if (response.publicKey) {
          const address = response.publicKey.toString();
          setPhantomAddress(address);
          onWalletConnected?.('phantom', address);
        }
      } catch (error) {
        console.log('Phantom not connected:', error);
      }
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) {
        alert('MetaMask is not installed. Please install MetaMask and try again.');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('🔗 METAMASK DEBUG: All available accounts:', accounts);
      console.log('🔗 METAMASK DEBUG: Expected address: 0x3e87719908519654d54059c77e87a71d0684b36d');
      console.log('🔗 METAMASK DEBUG: Current selected account:', accounts[0]);
      
      const expectedAddress = '0x3e87719908519654d54059c77e87a71d0684b36d';
      const hasExpectedAccount = accounts.some((addr: string) => addr.toLowerCase() === expectedAddress.toLowerCase());
      console.log('🔗 METAMASK DEBUG: Expected account available:', hasExpectedAccount);

      if (accounts.length > 0) {
        setMetamaskAddress(accounts[0]);
        onWalletConnected?.('metamask', accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      alert('Failed to connect to MetaMask. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectPhantomWallet = async () => {
    setIsConnecting(true);
    try {
      const phantom = await connectPhantom();
      if (phantom.publicKey) {
        const address = phantom.publicKey.toString();
        setPhantomAddress(address);
        onWalletConnected?.('phantom', address);
      }
    } catch (error) {
      console.error('Failed to connect Phantom:', error);
      alert('Failed to connect to Phantom. Please install Phantom wallet and try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectMetaMask = () => {
    setMetamaskAddress(null);
    onWalletDisconnected?.();
  };

  const disconnectPhantom = () => {
    setPhantomAddress(null);
    onWalletDisconnected?.();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-center">🌉 Bridge Kit Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MetaMask Connection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">
                M
              </div>
              <span className="font-medium">MetaMask (Arc Testnet)</span>
            </div>
            
            {metamaskAddress ? (
              <div className="space-y-2">
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded border">
                  ✅ Connected: {formatAddress(metamaskAddress)}
                </div>
                {metamaskAddress.toLowerCase() !== '0x3e87719908519654d54059c77e87a71d0684b36d'.toLowerCase() && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded border">
                    ⚠️ This account may not have USDC on Arc Testnet. Expected: {formatAddress('0x3e87719908519654d54059c77e87a71d0684b36d')}
                    <br />
                    <span className="text-amber-700">Switch accounts in MetaMask if needed.</span>
                    <Button 
                      onClick={() => window.ethereum?.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })}
                      className="mt-2 w-full text-xs bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                      size="sm"
                    >
                      Switch Account in MetaMask
                    </Button>
                  </div>
                )}
                <Button 
                  onClick={disconnectMetaMask}
                  className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm px-3 py-1"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connectMetaMask}
                disabled={isConnecting}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            )}
          </div>

          {/* Phantom Connection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                P
              </div>
              <span className="font-medium">Phantom (Solana)</span>
            </div>
            
            {phantomAddress ? (
              <div className="space-y-2">
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded border">
                  ✅ Connected: {formatAddress(phantomAddress)}
                </div>
                <Button 
                  onClick={disconnectPhantom}
                  className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm px-3 py-1"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connectPhantomWallet}
                disabled={isConnecting}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {isConnecting ? 'Connecting...' : 'Connect Phantom'}
              </Button>
            )}
          </div>
        </div>

        {/* Connection Status */}
        {(phantomAddress && metamaskAddress) && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <span className="text-green-700 font-medium">
              🚀 Ready for Bridge Kit transfers! Both wallets connected.
            </span>
          </div>
        )}

        {(!phantomAddress || !metamaskAddress) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center text-sm text-blue-700">
            Connect both wallets to enable seamless Solana ↔ Arc transfers via Bridge Kit
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// TypeScript declarations for wallet objects
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
