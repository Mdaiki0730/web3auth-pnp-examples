import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

import { IWalletProvider } from "./walletProvider";

const starkexProvider = (provider: IProvider | null, uiConsole: (...args: unknown[]) => void): IWalletProvider => {
  const getAddress = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = await signer.getAddress();
      return address;
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getChainId = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      return (await ethersProvider.getNetwork()).chainId.toString(16);
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getBalance = async (): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // Get user's Ethereum public address
      const address = signer.getAddress();

      // Get user's balance in ether
      const balance = ethers.formatEther(
        await ethersProvider.getBalance(address) // Balance is in wei
      );
      return balance;
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const getSignature = async (message: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();
      // Sign the message
      const signedMessage = await signer.signMessage(message);
      return signedMessage;
    } catch (error) {
      uiConsole(error);
      return error.toString();
    }
  };

  const sendTransaction = async (amount: string, destination: string): Promise<string> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      console.log(ethersProvider);

      const signer = await ethersProvider.getSigner();
      console.log(signer);
      // Convert 1 ether to wei
      console.log("Amount: ", amount);
      const amountBigInt = ethers.parseEther(amount);
      console.log(amountBigInt);
      // Submit transaction to the blockchain
      const tx = await signer.sendTransaction({
        to: destination,
        value: amountBigInt,
      });
      console.log(tx);
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log(receipt);
      return await receipt.getResult();
    } catch (error) {
      return error as string;
    }
  };

  const getPrivateKey = async (): Promise<string> => {
    try {
      const privateKey = await provider.request({
        method: "eth_private_key",
      });

      return privateKey as string;
    } catch (error) {
      return error as string;
    }
  };

  const deployContract = async (abi: any, bytecode: string): Promise<any> => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // const contractABI = [
      //   { inputs: [{ internalType: "string", name: "initMessage", type: "string" }], stateMutability: "nonpayable", type: "constructor" },
      //   { inputs: [], name: "message", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
      //   {
      //     inputs: [{ internalType: "string", name: "newMessage", type: "string" }],
      //     name: "update",
      //     outputs: [],
      //     stateMutability: "nonpayable",
      //     type: "function",
      //   },
      // ];

      // const contractByteCode =
      //   "60806040523480156200001157600080fd5b5060405162000bee38038062000bee8339818101604052810190620000379190620001e3565b80600090816200004891906200047f565b505062000566565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000b9826200006e565b810181811067ffffffffffffffff82111715620000db57620000da6200007f565b5b80604052505050565b6000620000f062000050565b9050620000fe8282620000ae565b919050565b600067ffffffffffffffff8211156200012157620001206200007f565b5b6200012c826200006e565b9050602081019050919050565b60005b83811015620001595780820151818401526020810190506200013c565b60008484015250505050565b60006200017c620001768462000103565b620000e4565b9050828152602081018484840111156200019b576200019a62000069565b5b620001a884828562000139565b509392505050565b600082601f830112620001c857620001c762000064565b5b8151620001da84826020860162000165565b91505092915050565b600060208284031215620001fc57620001fb6200005a565b5b600082015167ffffffffffffffff8111156200021d576200021c6200005f565b5b6200022b84828501620001b0565b91505092915050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200028757607f821691505b6020821081036200029d576200029c6200023f565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620003077fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620002c8565b620003138683620002c8565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003606200035a62000354846200032b565b62000335565b6200032b565b9050919050565b6000819050919050565b6200037c836200033f565b620003946200038b8262000367565b848454620002d5565b825550505050565b600090565b620003ab6200039c565b620003b881848462000371565b505050565b5b81811015620003e057620003d4600082620003a1565b600181019050620003be565b5050565b601f8211156200042f57620003f981620002a3565b6200040484620002b8565b8101602085101562000414578190505b6200042c6200042385620002b8565b830182620003bd565b50505b505050565b600082821c905092915050565b6000620004546000198460080262000434565b1980831691505092915050565b60006200046f838362000441565b9150826002028217905092915050565b6200048a8262000234565b67ffffffffffffffff811115620004a657620004a56200007f565b5b620004b282546200026e565b620004bf828285620003e4565b600060209050601f831160018114620004f75760008415620004e2578287015190505b620004ee858262000461565b8655506200055e565b601f1984166200050786620002a3565b60005b8281101562000531578489015182556001820191506020850194506020810190506200050a565b868310156200055157848901516200054d601f89168262000441565b8355505b6001600288020188555050505b505050505050565b61067880620005766000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80633d7403a31461003b578063e21f37ce14610057575b600080fd5b61005560048036038101906100509190610270565b610075565b005b61005f610088565b60405161006c9190610338565b60405180910390f35b80600090816100849190610570565b5050565b6000805461009590610389565b80601f01602080910402602001604051908101604052809291908181526020018280546100c190610389565b801561010e5780601f106100e35761010080835404028352916020019161010e565b820191906000526020600020905b8154815290600101906020018083116100f157829003601f168201915b505050505081565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61017d82610134565b810181811067ffffffffffffffff8211171561019c5761019b610145565b5b80604052505050565b60006101af610116565b90506101bb8282610174565b919050565b600067ffffffffffffffff8211156101db576101da610145565b5b6101e482610134565b9050602081019050919050565b82818337600083830152505050565b600061021361020e846101c0565b6101a5565b90508281526020810184848401111561022f5761022e61012f565b5b61023a8482856101f1565b509392505050565b600082601f8301126102575761025661012a565b5b8135610267848260208601610200565b91505092915050565b60006020828403121561028657610285610120565b5b600082013567ffffffffffffffff8111156102a4576102a3610125565b5b6102b084828501610242565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156102f35780820151818401526020810190506102d8565b60008484015250505050565b600061030a826102b9565b61031481856102c4565b93506103248185602086016102d5565b61032d81610134565b840191505092915050565b6000602082019050818103600083015261035281846102ff565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806103a157607f821691505b6020821081036103b4576103b361035a565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261041c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826103df565b61042686836103df565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061046d6104686104638461043e565b610448565b61043e565b9050919050565b6000819050919050565b61048783610452565b61049b61049382610474565b8484546103ec565b825550505050565b600090565b6104b06104a3565b6104bb81848461047e565b505050565b5b818110156104df576104d46000826104a8565b6001810190506104c1565b5050565b601f821115610524576104f5816103ba565b6104fe846103cf565b8101602085101561050d578190505b610521610519856103cf565b8301826104c0565b50505b505050565b600082821c905092915050565b600061054760001984600802610529565b1980831691505092915050565b60006105608383610536565b9150826002028217905092915050565b610579826102b9565b67ffffffffffffffff81111561059257610591610145565b5b61059c8254610389565b6105a78282856104e3565b600060209050601f8311600181146105da57600084156105c8578287015190505b6105d28582610554565b86555061063a565b601f1984166105e8866103ba565b60005b82811015610610578489015182556001820191506020850194506020810190506105eb565b8683101561062d5784890151610629601f891682610536565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220eecabaeaef849ff90aa73071525a5fa1972cd301476f7718a27010569d13051264736f6c63430008120033";

      const contractFactory = new ethers.ContractFactory(JSON.parse(JSON.stringify(abi)), bytecode, signer);
      const contract = await contractFactory.deploy("Deployed!");

      const receipt = await contract.waitForDeployment();
      return receipt;
    } catch (error) {
      return error as string;
    }
  };

  const readContract = async (contractAddress: string, contractABI: any) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // const contractABI = [
      //   { inputs: [{ internalType: "string", name: "initMessage", type: "string" }], stateMutability: "nonpayable", type: "constructor" },
      //   { inputs: [""], name: "message", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
      //   {
      //     inputs: [{ internalType: "string", name: "newMessage", type: "string" }],
      //     name: "update",
      //     outputs: [""],
      //     stateMutability: "nonpayable",
      //     type: "function",
      //   },
      // ];
      // const contractAddress = "0x04cA407965D60C2B39d892a1DFB1d1d9C30d0334";
      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);

      // Read message from smart contract
      const message = await contract.message();
      return message;
    } catch (error) {
      return error as string;
    }
  };

  const writeContract = async (contractAddress: string, contractABI: any) => {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);

      const signer = await ethersProvider.getSigner();

      // const contractABI = [
      //   { inputs: [{ internalType: "string", name: "initMessage", type: "string" }], stateMutability: "nonpayable", type: "constructor" },
      //   { inputs: [], name: "message", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
      //   {
      //     inputs: [{ internalType: "string", name: "newMessage", type: "string" }],
      //     name: "update",
      //     outputs: [],
      //     stateMutability: "nonpayable",
      //     type: "function",
      //   },
      // ];
      // const contractAddress = "0x04cA407965D60C2B39d892a1DFB1d1d9C30d0334";
      const contract = new ethers.Contract(contractAddress, JSON.parse(JSON.stringify(contractABI)), signer);
      // Generate random number between 1000 and 9000
      const number = Math.floor(Math.random() * 9000) + 1000;

      // Send transaction to smart contract to update message
      const tx = await contract.update(`Web3Auth is awesome ${number} times!`);

      // Wait for transaction to finish
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      return error as string;
    }
  };

  return {
    getAddress,
    getBalance,
    getChainId,
    getSignature,
    sendTransaction,
    getPrivateKey,
    deployContract,
    readContract,
    writeContract,
  };
};

export default starkexProvider;
