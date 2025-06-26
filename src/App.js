import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Login from "./components/Login";
import Finished from "./components/Finished";
import Connected from "./components/Connected";
import "./App.css";
import { CONTRACT_ABI } from "./constant/constant";

function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [votingStatus, setVotingStatus] = useState(true);
    const [remainingTime, setremainingTime] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [number, setNumber] = useState("");
    const [CanVote, setCanVote] = useState(true);

    useEffect(() => {
        getCandidates();
        getRemainingTime();
        getCurrentStatus();
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener(
                    "accountsChanged",
                    handleAccountsChanged
                );
            }
        };
    });

    async function vote() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
            String(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS),
            CONTRACT_ABI,
            signer
        );

        const tx = await contractInstance.vote(number);
        await tx.wait();
        canVote();
    }

    async function canVote() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
            String(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS),
            CONTRACT_ABI,
            signer
        );
        const voteStatus = await contractInstance.voters(
            await signer.getAddress()
        );
        setCanVote(voteStatus);
    }

    async function getCandidates() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
            String(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS),
            CONTRACT_ABI,
            signer
        );
        const candidatesList = await contractInstance.getAllVotesOfCandidates();
        const formattedCandidates = candidatesList.map((candidate, index) => {
            return {
                index: index,
                name: candidate.name,
                voteCount: Number(candidate.voteCount),
            };
        });
        setCandidates(formattedCandidates);
    }

    async function getCurrentStatus() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
            String(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS),
            CONTRACT_ABI,
            signer
        );
        const status = await contractInstance.getVotingStatus();
        // console.log(status);
        setVotingStatus(status);
    }

    async function getRemainingTime() {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(
            String(process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS),
            CONTRACT_ABI,
            signer
        );
        const time = await contractInstance.getRemainingTime();
        setremainingTime(parseInt(time, 16));
    }

    function handleAccountsChanged(accounts) {
        if (accounts.length > 0 && account !== accounts[0]) {
            setAccount(accounts[0]);
            canVote();
        } else {
            setIsConnected(false);
            setAccount(null);
        }
    }

    async function connectToMetamask() {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);
                console.log("Metamask Connected : " + address);
                console.log("is connected : " + isConnected);
                setIsConnected(true);
                canVote();
            } catch (err) {
                console.error(err);
            }
        } else {
            console.error("Metamask is not detected in the browser");
        }
    }

    async function handleNumberChange(e) {
        setNumber(e.target.value);
    }

    return (
        <div className="App">
            {votingStatus ? (
                isConnected ? (
                    <Connected
                        account={account}
                        candidates={candidates}
                        remainingTime={remainingTime}
                        number={number}
                        handleNumberChange={handleNumberChange}
                        voteFunction={vote}
                        showButton={CanVote}
                    />
                ) : (
                    <Login connectWallet={connectToMetamask} />
                )
            ) : (
                <Finished />
            )}
        </div>
    );
}

export default App;
