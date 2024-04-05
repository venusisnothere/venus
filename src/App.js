import React, { useState, useEffect } from 'react';
import { Web3 } from 'web3'; // Make sure this import matches your package's export

// Initialize Web3 instance with an RPC endpoint
const web3 = new Web3(process.env.REACT_APP_RPC_URL);

function AplikasiLava() {
  const [data, setData] = useState({
    balance: null,
    blockNumber: null,
    chainId: null,
    nonce: null,
    gasPrice: null,
  });
  const [error, setError] = useState('');
  const [updateCount, setUpdateCount] = useState(0); // State to track update count

  useEffect(() => {
    const fetchData = async () => {
      try {
        const address = '0xf89d7b9c864f589bbF53a82105107622B35EaA40';
        const balance = await web3.eth.getBalance(address);
        const blockNumber = await web3.eth.getBlockNumber();
        const chainIdHex = await web3.eth.getChainId();
        const nonce = await web3.eth.getTransactionCount(address);
        const gasPrice = await web3.eth.getGasPrice();

        // Parse hexadecimal values to decimal
        const chainIdDecimal = parseInt(chainIdHex, 16).toString();
        const blockNumberDecimal = parseInt(blockNumber, 16).toString();
        const nonceDecimal = parseInt(nonce, 16).toString();
        const gasPriceDecimal = parseFloat(web3.utils.fromWei(gasPrice, 'gwei')).toFixed(3);

        setData({
          balance: parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(3), // Format balance to 3 decimal places
          blockNumber: blockNumberDecimal,
          chainId: chainIdDecimal,
          nonce: nonceDecimal,
          gasPrice: gasPriceDecimal,
        });

        // Increment update count
        setUpdateCount(prevCount => prevCount + 1);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch data. Check console for details.');
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">ETH MAINNET DATA</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoBox label="Balance (ETH)" value={data.balance} />
        <InfoBox label="Block Number" value={data.blockNumber} />
        <InfoBox label="Chain ID" value={data.chainId} />
        <InfoBox label="Nonce" value={data.nonce} />
        <InfoBox label="Gas Price (Gwei)" value={data.gasPrice} />
      </div>
      {updateCount > 0 && (
        <div className="mt-4 p-3 bg-green-200 text-green-800 rounded">
          ini request ke {updateCount}  bosquee 🚀🚀🚀
        </div>
      )}
    </div>
  );
}

const InfoBox = ({ label, value }) => (
  <div className="bg-gray-100 p-4 rounded shadow">
    <strong>{label}:</strong> {value !== null ? value : 'Loading...'}
  </div>
);

export default AplikasiLava;
