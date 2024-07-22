import { useQuery } from '@tanstack/react-query';
import type { IToken } from '~/types';

type ChainId = number | string;
type Address = string;
type Balances = Record<ChainId, Record<Address, IToken>>;

// Covalent API key (replace with your actual API key)
const COVALENT_API_KEY = 'cqt_rQxMcPw3fdRMWhKQ3g8GJRXFcbXK';

const getBalances = async (address: Address): Promise<Balances> => {
  if (!address) return {};

  const chainId = 1; // Replace with the appropriate chain ID if needed
  const response = await fetch(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/?key=${COVALENT_API_KEY}`);
  const data = await response.json();

  const balancesByChain: Balances = data.data.items.reduce(
    (acc: Balances, token: any) => {
      const chainIdStr = chainId.toString();
      if (!acc[chainIdStr]) {
        acc[chainIdStr] = {};
      }
      acc[chainIdStr][token.contract_address.toLowerCase()] = {
        address: token.contract_address,
        logoURI: token.logo_url,
        symbol: token.contract_ticker_symbol,
        decimals: token.contract_decimals,
        name: token.contract_name,
        chainId: chainId,
        amount: token.balance,
        balanceUSD: token.quote,
        geckoId: token.contract_address // assuming geckoId is same as contract address, update if needed
      };
      return acc;
    },
    {}
  );

  return balancesByChain;
};

export const useTokenBalances = (address: Address) => {
  return useQuery<Balances>(
    {
      queryKey: ['balances', address],
      queryFn: () => getBalances(address),
      refetchInterval: 20000,
      enabled: !!address
    }
  );
};
