import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-[#00e1cc] to-gray-800 shadow-lg">
      <Link href="/" legacyBehavior>
        <a className="text-3xl font-bold text-white hover:text-opacity-80 transition-colors">
          XPrompt NFT Launchpad
        </a>
      </Link>

      <nav className="flex items-center space-x-4">
        <button className="px-4 py-2 bg-white text-gray-800 rounded-full shadow-md hover:bg-opacity-80 transition duration-300 ease-in-out transform hover:scale-105">
          Connect Wallet
        </button>
      </nav>
    </header>
  );
};

export default Header;
