import { chain } from 'wagmi';
import { chainIconUrl } from '~/utils/index';

const binance = {
	id: 56,
	name: 'Binance SmartChain',
	network: 'binance',
	iconUrl: chainIconUrl('binance'),
	iconBackground: '#000',
	nativeCurrency: {
		decimals: 18,
		name: 'Binance',
		symbol: 'BNB'
	},
	rpcUrls: {
		default: 'https://rpc.ankr.com/bsc'
	},
	blockExplorers: {
		default: { name: 'BSCScan', url: 'https://bscscan.com' }
	},
	testnet: false
};

const dogechain = {
	id: 2000,
	name: 'DogeChain',
	network: 'doge',
	iconUrl: chainIconUrl('dogechain'),
	iconBackground: '#000',
	nativeCurrency: {
		decimals: 18,
		name: 'Doge',
		symbol: 'DOGE'
	},
	rpcUrls: {
		default: 'https://dogechain.ankr.com'
	},
	blockExplorers: {
		default: {
			name: 'DogeChain Explorer',
			url: 'https://explorer.dogechain.dog'
		}
	},
	testnet: false
};

const avax = {
	id: 43114,
	name: 'AVAX',
	network: 'avax',
	iconUrl: chainIconUrl('avalanche'),
	iconBackground: '#000',
	nativeCurrency: {
		decimals: 18,
		name: 'Avalanche',
		symbol: 'AVAX'
	},
	rpcUrls: {
		default: 'https://avalanche-evm.publicnode.com'
	},
	blockExplorers: {
		default: { name: 'SnowTrace', url: 'https://snowtrace.io' }
	},
	testnet: false
};

const fantom = {
	id: 250,
	name: 'Fantom Opera',
	network: 'fantom',
	iconUrl: chainIconUrl('fantom'),
	iconBackground: '#000',
	nativeCurrency: {
		decimals: 18,
		name: 'Fantom',
		symbol: 'FTM'
	},
	rpcUrls: {
		default: 'https://rpc.ftm.tools'
	},
	blockExplorers: {
		default: { name: 'FTMScan', url: 'https://ftmscan.com' }
	},
	testnet: false
};

const polygon = {
	id: 137,
	name: 'Polygon',
	network: 'polygon',
	iconUrl: chainIconUrl('polygon'),
	iconBackground: '#000',
	nativeCurrency: {
		decimals: 18,
		name: 'Matic',
		symbol: 'MATIC'
	},
	rpcUrls: {
		default: 'https://rpc.ankr.com/polygon'
	},
	blockExplorers: {
		default: { name: 'PolygonScan', url: 'https://polygonscan.com' }
	},
	testnet: false
};

const arbirum = {
	...chain.arbitrum,
	iconUrl: chainIconUrl('arbitrum')
};

const ethereum = {
	...chain.mainnet,
	iconUrl: chainIconUrl('ethereum')
};

const optimism = {
	...chain.optimism,
	iconUrl: chainIconUrl('optimism')
};

export const allChains = [
	polygon,
	binance,
	fantom,
	avax,
	dogechain,
	optimism,
	arbirum,
	ethereum
];
