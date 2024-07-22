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
    selectedChain: string;
    gasTokenPrice: number;
    netOut: number;
    price: any;
    name: string;
    airdrop: boolean;
    fromAmount: string;
    txData: string;
    l1Gas: number | 'Unknown';
  }
  