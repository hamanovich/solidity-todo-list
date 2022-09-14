import { ethers } from "ethers";
import WrongNetworkMessage from "../components/WrongNetworkMessage";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TodoList from "../components/TodoList";
import TaskAbi from "../public/contracts/TaskContract.json";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (correctNetwork) getAllTasks();
  }, [correctNetwork]);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return console.log("Metamask not detected");

      const chainId = await window.ethereum.request({ method: "eth_chainId" });

      console.log("chain id", chainId, process.env.NEXT_PUBLIC_CHAIN_ID);

      if (chainId !== process.env.NEXT_PUBLIC_CHAIN_ID) return setCorrectNetwork(false);

      setCorrectNetwork(true);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllTasks = async () => {
    try {
      if (window.ethereum) {
        const TaskContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          TaskAbi.abi,
          new ethers.providers.Web3Provider(window.ethereum).getSigner()
        );

        const allTasks = await TaskContract.getAllTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    const task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      if (window.ethereum) {
        const TaskContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          TaskAbi.abi,
          new ethers.providers.Web3Provider(window.ethereum).getSigner()
        );

        await TaskContract.addTask(task.taskText);
        setTasks([...tasks, task]);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = (key) => async () => {
    try {
      if (window.ethereum) {
        const TaskContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          TaskAbi.abi,
          new ethers.providers.Web3Provider(window.ethereum).getSigner()
        );

        await TaskContract.deleteTask(key);

        const allTasks = await TaskContract.getAllTasks();
        setTasks(allTasks);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-[#97b5fe] h-screen w-screen flex justify-center py-6">
      {loading ? (
        <div className="text-center">
          <Loader />
        </div>
      ) : !correctNetwork ? (
        <WrongNetworkMessage />
      ) : !isUserLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : (
        <TodoList
          currentAccount={currentAccount}
          input={input}
          setInput={setInput}
          addTask={addTask}
          tasks={tasks}
          deleteTask={deleteTask}
        />
      )}
    </div>
  );
}
