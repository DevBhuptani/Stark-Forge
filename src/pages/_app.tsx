import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import {
  argent,
  braavos,
  publicProvider,
  StarknetConfig,
  useInjectedConnectors,
  voyager,
} from '@starknet-react/core';
import { mainnet, sepolia } from '@starknet-react/chains';
import { StarknetWalletConnectors } from '@dynamic-labs/starknet';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

export default function App({ Component, pageProps }: AppProps) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: 'onlyIfNoConnectors',
    order: 'random',
  });
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'be72e05e-2712-4d85-8d2f-214df749013f',
        walletConnectors: [StarknetWalletConnectors],
      }}
    >
      <StarknetConfig
        chains={[mainnet, sepolia]}
        provider={publicProvider()}
        connectors={connectors}
        explorer={voyager}
      >
        <Component {...pageProps} />
      </StarknetConfig>
    </DynamicContextProvider>
  );
}
