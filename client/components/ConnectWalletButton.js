const ConnectWalletButton = ({ connectWallet }) => (
  <button
    className="h-[5rem] text-2xl font-bold py-3 px-12 bg-[#f1c232] hover:scale-105"
    onClick={connectWallet}
  >
    Connect Wallet
  </button>
);

export default ConnectWalletButton;
