import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { applyArbitrumFees } from '../utils/arbitrumFees';
import { defillamaReferrerAddress } from '../constants';
import { sendTx } from '../utils/sendTx';

export const chainToId = {
  ethereum: 1,
  bsc: 56,
  polygon: 137,
  optimism: 10,
  arbitrum: 42161,
  gnosis: 100,
  avax: 43114,
  fantom: 250,
  klaytn: 8217,
  aurora: 1313161554
};

export const name = '1inch';
export const token = '1INCH';
export const referral = true;

export function approvalAddress() {
  return '0x1111111254fb6c44bac0bed2854e76f90643097d';
}

const nativeToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

async function fetchWithProxy(url) {
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_1INCH_API_KEY}`,
  };

  console.log(`Fetching URL: ${url}`);
  const response = await fetch(`/api/proxy1inch?url=${encodeURIComponent(url)}`, { headers });
  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function getQuote(chain, from, to, amount, extra) {
  const tokenFrom = from === ethers.constants.AddressZero ? nativeToken : from;
  const tokenTo = to === ethers.constants.AddressZero ? nativeToken : to;

  const apiUrl = `https://api.1inch.dev/swap/v6.0/${chainToId[chain]}/quote?fromTokenAddress=${tokenFrom}&toTokenAddress=${tokenTo}&amount=${amount}&slippage=${extra.slippage}`;

  console.log(`1inch getQuote - API URL: ${apiUrl}`);

  const [data, { address: tokenApprovalAddress }, swapData] = await Promise.all([
    fetchWithProxy(apiUrl),
    fetchWithProxy(`https://api.1inch.dev/swap/v6.0/${chainToId[chain]}/approve/spender`),
    extra.userAddress !== ethers.constants.AddressZero
      ? fetchWithProxy(
          `https://api.1inch.dev/swap/v6.0/${chainToId[chain]}/swap?fromTokenAddress=${tokenFrom}&toTokenAddress=${tokenTo}&amount=${amount}&fromAddress=${extra.userAddress}&slippage=${extra.slippage}&referrerAddress=${defillamaReferrerAddress}&disableEstimate=true`
        )
      : null,
  ]);

  console.log(`1inch getQuote - Data: `, data);
  console.log(`1inch getQuote - Token Approval Address: ${tokenApprovalAddress}`);
  console.log(`1inch getQuote - Swap Data: `, swapData);

  const estimatedGas = data.estimatedGas || 0;
  let gas = estimatedGas;

  if (chain === 'optimism') gas = BigNumber(3.5).times(estimatedGas).toFixed(0, 1);
  if (chain === 'arbitrum')
    gas = swapData === null ? null : await applyArbitrumFees(swapData.tx.to, swapData.tx.data, gas);

  const quoteResult = {
    amountReturned: swapData?.toTokenAmount ?? data.toTokenAmount,
    estimatedGas: gas,
    tokenApprovalAddress,
    rawQuote: swapData === null ? null : { ...swapData, tx: { ...swapData.tx, gasLimit: gas } },
    logo: 'https://icons.llamao.fi/icons/protocols/1inch-network?w=48&q=75',
  };

  console.log(`1inch getQuote - Result: `, quoteResult);

  return quoteResult;
}

export async function swap({ signer, rawQuote, chain }) {
  console.log(`1inch swap - Raw Quote: `, rawQuote);
  try {
    const tx = await sendTx(signer, chain, {
      from: rawQuote.tx.from,
      to: rawQuote.tx.to,
      data: rawQuote.tx.data,
      value: rawQuote.tx.value,
      ...(chain === 'optimism' && { gasLimit: rawQuote.tx.gasLimit }),
    });
    console.log(`1inch swap - Transaction: `, tx);
    return tx;
  } catch (e) {
    console.error(`1inch swap - Error: `, e);
    throw e;
  }
}

export const getTxData = ({ rawQuote }) => rawQuote?.tx?.data;

export const getTx = ({ rawQuote }) => {
  if (rawQuote === null) {
    return {};
  }
  return {
    from: rawQuote.tx.from,
    to: rawQuote.tx.to,
    data: rawQuote.tx.data,
    value: rawQuote.tx.value,
  };
};
