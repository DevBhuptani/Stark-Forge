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

export default function App({ Component, pageProps }: AppProps) {
  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: 'onlyIfNoConnectors',
    order: 'random',
  });
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
    >
      <Component {...pageProps} />
    </StarknetConfig>
  );
}
