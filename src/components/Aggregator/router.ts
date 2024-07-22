import * as matcha from './adapters/0x';
//import * as inch from './adapters/1inch';
import * as kyberswap from './adapters/kyberswap';
import { capitalizeFirstLetter } from '~/utils';
import { allChains } from '../WalletProvider/chains';
import { chainNamesReplaced, chainsMap } from './constants';

export const adapters = [matcha, kyberswap,];

const adaptersMap = adapters.reduce((acc, adapter) => ({ ...acc, [adapter.name]: adapter }), {});
console.log('Adapters Map: ', adaptersMap);

export function getAllChains() {
  const chains = new Set<string>();
  for (const adapter of adapters) {
    Object.keys(adapter.chainToId).forEach((chain) => chains.add(chain));
  }
  const chainsArr = Array.from(chains);

  const chainsOptions = chainsArr.map((c) => ({
    value: c,
    label: chainNamesReplaced[c] ?? capitalizeFirstLetter(c),
    chainId: chainsMap[c],
    logoURI: allChains.find(({ id }) => id === chainsMap[c])?.iconUrl
  }));

  console.log('Chains Options: ', chainsOptions);
  return chainsOptions;
}

export async function swap({ chain, from, to, amount, signer, slippage = '1', adapter, rawQuote, tokens }) {
  const aggregator = adaptersMap[adapter];
  console.log('Swap - Aggregator: ', aggregator);
  try {
    const res = await aggregator.swap({
      chain,
      from,
      to,
      amount,
      signer,
      slippage,
      rawQuote,
      tokens
    });
    console.log('Swap - Response: ', res);
    return res;
  } catch (e) {
    console.error('Swap - Error: ', e);
    throw e;
  }
}
