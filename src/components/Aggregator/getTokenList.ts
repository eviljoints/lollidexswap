import { groupBy, mapValues, merge, uniqBy } from 'lodash';
import { IToken } from '~/types';
import { nativeTokens } from './nativeTokens';
import pLimit from 'p-limit';

const tokensToRemove = {
  1: {
    ['0xB8c77482e45F1F44dE1745F52C74426C631bDD52'.toLowerCase()]: true
  }
};

const oneInchChains = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  optimism: 10,
  arbitrum: 42161,
  avax: 43114,
};

const limit = pLimit(10); // Limit to 10 concurrent requests

let cachedTokenList = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

async function fetchOneInchTokens(chainId) {
  const response = await fetch(`https://api.1inch.dev/swap/v6.0/${chainId}/tokens`);
  return response.json();
}

export async function getTokenList() {
  const now = Date.now();
  if (cachedTokenList && (now - lastFetchTime) < CACHE_DURATION) {
    return {
      props: {
        tokenlist: cachedTokenList
      },
      revalidate: CACHE_DURATION / 1000 // revalidate in seconds
    };
  }

  const oneInchPromises = Object.values(oneInchChains).map(chainId =>
    limit(() => fetchOneInchTokens(chainId))
  );
  const oneInch = await Promise.all(oneInchPromises);

  const [sushiList, lifiList, geckoList] = await Promise.all([
    fetch('https://token-list.sushi.com/').then((r) => r.json()),
    fetch('https://li.quest/v1/tokens').then((r) => r.json()),
    fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false').then((res) => res.json())
  ]);

  const oneInchList = Object.values(oneInchChains)
    .map((chainId, i) =>
      Object.values(oneInch[i]).map((token: { address: string }) => ({
        ...token,
        chainId
      }))
    )
    .flat();

  const tokensByChain = mapValues(
    merge(
      groupBy([...oneInchList, ...sushiList.tokens, ...nativeTokens], 'chainId'),
      lifiList.tokens
    ),
    (val) => uniqBy(val, (token: IToken) => token.address?.toLowerCase())
  );

  const tokensFiltered = mapValues(tokensByChain, (val, key) => {
    return val.filter((token) => token.address && !tokensToRemove[key]?.[token.address.toLowerCase()]);
  });

  const tokenlist = {};

  for (const chain in tokensFiltered) {
    tokenlist[chain] = tokensFiltered[chain].map((t) => ({
      ...t,
      label: t.symbol,
      value: t.address,
      geckoId: geckoList
        ? geckoList?.find((geckoCoin) => geckoCoin.symbol === t.symbol.toLowerCase())?.id ?? null
        : null
    }));
  }

  // Define the default token
  const defaultToken = {
    address: '0xAF4B52275C0d1a0f5b7BF9e3187120Ea30a79dD2',
    chainId: 56, // BNB chain ID
    symbol: 'LOLLY',
    name: 'Lollipop',
    decimals: 18,
    logoURI: '/loader.png',
    label: 'DEFAULT',
    value: '0xAF4B52275C0d1a0f5b7BF9e3187120Ea30a79dD2',
    geckoId: null // Update this if you have a corresponding Gecko ID
  };

  // Add the default token to the BNB chain token list
  if (!tokenlist[56]) {
    tokenlist[56] = [];
  }
  tokenlist[56].push(defaultToken);

  if (tokenlist[66] && tokenlist[66][0] && tokenlist[66][1]) {
    tokenlist[66][0].logoURI = tokenlist[66][1].logoURI;
  }

  cachedTokenList = tokenlist;
  lastFetchTime = now;

  return {
    props: {
      tokenlist
    },
    revalidate: CACHE_DURATION / 1000 // 5 minutes
  };
}
