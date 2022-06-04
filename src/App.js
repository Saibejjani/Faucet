
import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })
  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);


  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"));

    }
    web3Api.contract && loadBalance()
  }, [web3Api])

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);
      if (provider) {

        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      }
      else {
        console.error("Please install metamask")
      }
    }
    loadProvider()
  }, [])



  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    web3Api.web3 && getAccounts()
  }, [web3Api.web3])

  const addFunds = async () => {
    const { contract, web3 } = web3Api

    const reciept = await contract.addFunds({ from: account, value: "1000000000000000000" });
    const events = reciept.logs[0].args;
    const res = "Funder : " + events.funder + "\nValue :" + web3.utils.fromWei(events.value.toString());
    alert(res + " Ether");
  }

  const withdraw = async () => {
    const { contract, web3 } = web3Api;
    const reciept = await contract.withdraw(10000000000, { from: account });
    const events = reciept.logs[0].args;
    const res = "Receiver : " + events.receiver + "\nValue :" + web3.utils.fromWei(events.value.toString());
    alert(res + " Ether");

  }
  return (
    <>
      <div className='Faucet-Wrapper'>
        <div className='faucet'>
          <div className="is-flex">
            <span>
              <strong>Account :</strong>
            </span>
            <h1>
              {account ? account :
                <button className="button is-info is-light mr-2 is-small"
                  onClick={() =>
                    web3Api.provider.request({ method: "eth_requestAccounts" })
                  }
                >
                  Connect Wallet
                </button>
              }
            </h1>
          </div>
          <div className='balnce-view is-size-2 mb-4 mt-8'>
            Current Balance : <strong>{balance}</strong> ETH
          </div>

          <button onClick={addFunds}
            className='button mr-2 is-primary'
          >Donate 1 Ether</button>
          <button onClick={withdraw}
            className='button is-link '>Withdraw 0.1</button>
        </div>
      </div>
    </>
  );
}

export default App;
