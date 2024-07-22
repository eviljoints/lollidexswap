import { ethers } from 'ethers';
import { chainIconUrl } from '~/utils/index';

const ethereum = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 1,
	name: 'Ethereum',
	symbol: 'ETH',
	logoURI: chainIconUrl('ethereum'),
	decimals: 18
};

const binance = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 56,
	name: 'Binance',
	symbol: 'BNB',
	logoURI: chainIconUrl('binance'),
	decimals: 18
};

const arbitrum = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 42161,
	name: 'Ethereum',
	symbol: 'ETH',
	logoURI: chainIconUrl('ethereum'),
	decimals: 18
};

const optimism = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 10,
	name: 'Ethereum',
	symbol: 'ETH',
	logoURI: chainIconUrl('ethereum'),
	decimals: 18
};

const polygon = {
	mcap: Number.MAX_SAFE_INTEGER,
	address: ethers.constants.AddressZero,
	chainId: 137,
	name: 'Matic',
	symbol: 'MATIC',
	logoURI: chainIconUrl('polygon'),
	decimals: 18
};

export const nativeTokens = [
	ethereum,
	arbitrum,
	binance,
	optimism,
	polygon,
];
