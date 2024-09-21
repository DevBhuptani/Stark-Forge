import { Wand2, Loader2, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Label } from './ui/label';
import { Input } from './ui/input';
import axios from 'axios';
import Image from 'next/image';
import { connect } from 'starknetkit';
import { Contract } from 'starknet';
import contract_class from '../connector/abi.json';

const MainPage = () => {
  const [prompt, setPrompt] = useState('');
  const [price, setPrice] = useState('0.05');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [nftImage, setNftImage] = useState<string>('');
  const [isImageReady, setIsImageReady] = useState(false); // New state for image readiness

  const handleSubmit = async (e: React.FormEvent) => {
    if (prompt.trim() === '') {
      alert('Please enter a prompt before minting.');
      return;
    }

    e.preventDefault();
    setIsGenerating(true);
    setIsImageReady(false); // Reset image readiness before generating

    const options = {
      method: 'POST',
      url: 'https://text-to-image13.p.rapidapi.com/',
      headers: {
        'x-rapidapi-key': '39735b2314msh1e8c532bd060158p157221jsn418de8433bcb',
        'x-rapidapi-host': 'text-to-image13.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
      data: {
        prompt: 'Cat and dog dating each other', // You might want to replace this with `prompt`
      },
      responseType: 'blob',
    };

    try {
      const response = await axios.request(options);
      const imageBlob = response.data;
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setNftImage(imageObjectUrl);
      setIsImageReady(true);
    } catch (error) {
      console.error('Error generating NFT:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConnectWallet = () => {
    setTimeout(() => {
      setIsWalletConnected(true);
    }, 1000);
  };

  const handleMintingNFT = async () => {
    if (!isImageReady || !nftImage) {
      console.error('Image is not ready for minting.');
      return;
    }

    const json = {
      name: 'StarkAI',
      description: 'Image generated by StarkAI',
      image: nftImage,
    };

    try {
      const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      const response = await axios.post(url, json, {
        headers: {
          pinata_api_key: '411dd1142b5de31e2450',
          pinata_secret_api_key:
            '9508b26f3e6902440bd53fb664ea3cdaaf4db4f40d88cef3cd76105bd240c9d7',
          'Content-Type': 'application/json',
        },
      });

      if (response?.status === 200) {
        blockchainScript(response?.data?.IpfsHash);
      }
    } catch (error) {
      console.error('Error uploading to Pinata:', error);
    }
  };

  const blockchainScript = async (ipfs: string) => {
    const connection = await connect();
    const testAddress =
      '0x0157788b28c473a46b65886e379c4c605766c7d60dc037047d56b4ce8a5e3d56';

    const myTestContract = new Contract(
      contract_class.abi,
      testAddress,
      connection?.wallet?.account
    );
    const myCall = myTestContract.populate('safe_mint', [
      connection?.wallet?.selectedAddress,
      Math.floor(Math.random() * 10001),
      `https://silver-accessible-locust-527.mypinata.cloud/ipfs/${ipfs}`,
    ]);
    const res = await myTestContract.safe_mint(myCall.calldata);
    console.log('res', res);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-800">Stark-Forge</h1>
          <Button
            onClick={handleConnectWallet}
            variant={isWalletConnected ? 'outline' : 'default'}
            className="flex items-center"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
          </Button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full">
          <h2 className="text-4xl font-bold text-center mb-8 text-indigo-800">
            Create Your Unique NFT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="prompt"
                  className="text-lg font-medium text-gray-700"
                >
                  Describe your NFT
                </Label>
                <Input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A cosmic cat riding a pizza through space..."
                  className="mt-2 text-lg"
                />
              </div>
              <div>
                <Label
                  htmlFor="price"
                  className="text-lg font-medium text-gray-700"
                >
                  Set your price
                </Label>
                <div className="mt-2 relative">
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    required
                    className="text-lg pr-12"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full text-lg h-12"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Crafting Your NFT...
                  </>
                ) : (
                  <>
                    Generate Masterpiece
                    <Wand2 className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
            <div className="flex items-center justify-center">
              <div className="w-full h-80 md:h-96 bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 rounded-lg shadow-inner overflow-hidden relative">
                {isGenerating ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="w-3/4 h-3/4 rounded-lg animate-pulse" />
                  </div>
                ) : nftImage ? (
                  <Image
                    src={nftImage}
                    alt="Generated NFT"
                    className="w-full h-full object-cover"
                    priority
                    width={50}
                    height={50}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-800">
                    <Wand2 className="h-16 w-16 mb-4 animate-bounce" />
                    <p className="text-xl font-medium text-center px-4">
                      Your one-of-a-kind NFT will materialize here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mint NFT Button */}
          {isImageReady && nftImage && (
            <Button
              onClick={handleMintingNFT}
              className="mt-8 w-full text-lg h-12"
            >
              Mint NFT
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
