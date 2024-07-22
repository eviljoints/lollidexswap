import { defillamaReferrerAddress } from '../constants';

export const chainToId = {
  ethereum: 'https://api.0x.org/',
  bsc: 'https://bsc.api.0x.org/',
  polygon: 'https://polygon.api.0x.org/',
  optimism: 'https://optimism.api.0x.org/',
  arbitrum: 'https://arbitrum.api.0x.org/',
 
};

export const name = 'Matcha/0x';
export const token = 'ZRX';

export function approvalAddress() {
  return '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
}

const nativeToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const zeroAddress = '0x0000000000000000000000000000000000000000';

export async function getQuote(chain: string, from: string, to: string, amount: string, extra: any) {
  const tokenFrom = from === zeroAddress ? nativeToken : from;
  const tokenTo = to === zeroAddress ? nativeToken : to;
  const apiUrl = `${
    chainToId[chain]
  }swap/v1/quote?buyToken=${tokenTo}&sellToken=${tokenFrom}&sellAmount=${amount}&slippagePercentage=${
    extra.slippage / 100 || 1
  }&affiliateAddress=${defillamaReferrerAddress}&enableSlippageProtection=false`;

  const headers = {
    'Accept': 'application/json',
    '0x-api-key': process.env.NEXT_PUBLIC_0X_API_KEY,
  };

  const data = await fetch(`/api/proxy0x?url=${encodeURIComponent(apiUrl)}`, { headers })
    .then((r) => r.json());

  return {
    amountReturned: data.buyAmount,
    estimatedGas: data.gas,
    tokenApprovalAddress: data.to,
    rawQuote: data,
    logo: 'https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=2,format=auto/https%3A%2F%2F1690203644-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FKX9pG8rH3DbKDOvV7di7%252Ficon%252F1nKfBhLbPxd2KuXchHET%252F0x%2520logo.png%3Falt%3Dmedia%26token%3D25a85a3e-7f72-47ea-a8b2-e28c0d24074b'
  };
}

export async function swap({ signer, rawQuote }) {
  const fromAddress = await signer.getAddress();

  const tx = await signer.sendTransaction({
    from: fromAddress,
    to: rawQuote.to,
    data: rawQuote.data,
    value: rawQuote.value
  });

  return tx;
}

export const getTxData = ({ rawQuote }) => rawQuote?.data;
