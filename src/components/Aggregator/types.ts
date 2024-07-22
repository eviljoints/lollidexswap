export interface ExtraData {
	userAddress: string
	slippage: string
}
export interface IRoute {
  index: number;
  selected: boolean;
  setRoute: () => void;
  toToken: {
    label: string;
    value: string;
    address: string;
    logoURI: string;
    symbol: string;
    decimals: number;
    name: string;
    chainId: number;
    amount?: string;
    balanceUSD?: number;
    geckoId: string;
  };
  // Add the selectedChain property
  selectedChain: string;
  // Add other properties that are already defined
  gasTokenPrice: number;
  netOut: number;
  // Any other properties that IRoute might have
}

