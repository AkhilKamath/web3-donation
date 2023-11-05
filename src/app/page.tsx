'use client'

import { useState, useEffect } from 'react'
import DonationForm from '@/Components/DonationForm'
import DonationList from '@/Components/DonationList'
// import Web3 from 'web3'
import { abi, testAbi } from './abi';
import PropTypes, { InferProps } from 'prop-types';
import { ethers } from "ethers";


// const TestContract = ({ web3, testContract }: InferProps<typeof DonationForm.propTypes> & { web3: Web3<any> | null, testContract: any | null}) => {
//   const [counter, setCounter] = useState(0)
//   const [toggle, setToggle] = useState(false)
//   async function handleClick(event) {
//     event.preventDefault()
//     if(!web3 || !testContract) {
//       return;
//       // throw new Error('Web3 or contract not initialized')
//     }
//     if(event.target.name === 'increment') {
//       testContract.methods.incrementCounter().call()
//       .then((res) => {
//         console.log('called increment', res)
//         // setCounter(counter + 1)
//         setToggle(!toggle)
//       })
//       .catch((err: any) => {
//         console.error('Eror while incrementing' + err)
//       })

//     } else {
//       testContract.methods.decrementCounter().call()
//       .then((res) => {
//         console.log('called decrement', res)
//         // setCounter(counter - 1)
//         setToggle(!toggle)
//       })
//       .catch((err: any) => {
//         console.error('Eror while decrementing' + err)
//       })
//     }
//   }

//   useEffect(() => {
//     console.log('AAA')
//     if(!web3 || !testContract) {
//       return;
//       // throw new Error('Web3 or contract not initialized')
//     }
//     console.log('getting counter')
//     testContract.methods.getCount().call()
//     .then((count: any) => {
//       // if(typeof counter === "number")
//         console.log('Got count value', count)
//         setCounter(Number(count))
//     })
//     .catch((err: any) => {
//       console.error('Eror while getting counter' + err)
//     })
//   }, [testContract, toggle])
//   return (
//     <div>
//       <p>Current value {counter}</p>
//       <button name='increment' onClick={handleClick}>increment</button><br/><br/>
//       <button name='decrement' onClick={handleClick}>decrement</button>
//     </div>
//   )
// }

// TestContract.propTypes = {
//   web3: PropTypes.object,
//   testContract: PropTypes.any
// };

export default function Home() {
  // const contractAddress = '0xd20c97d9826451b464D70864a6eA09414eF75Fb2'
  const contractAddress =  '0xAF9B416C2c29eaC8b1Ee0942dC4622db775B2512'
  // const testContractAddress = '0xCe88Fc07BcE373FD4a5bd9798b67eeC12B25Fa6C'
  // const [web3, setWeb3] = useState<Web3<any> | null>(null)
  const [ethersProvider, setEthersProvider] = useState<ethers.Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<any | null>(null)
  const [testContract, setTestContract] = useState<ethers.Contract | null>(null)
  const [minAmount, setMinAmount] = useState<string | null>(null)

  useEffect(() => {
    async function initialize() {
      if(typeof window !== 'undefined' && window.ethereum) {
        console.log('Got window.ethereum')
        const provider = new ethers.BrowserProvider(window.ethereum)
        setEthersProvider(provider)
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner()
        setSigner(signer)
        
        const contractInstance = new ethers.Contract(contractAddress, abi, signer)
        setContract(contractInstance)
      } else {
        console.log('No window.ethereum')
        alert('Please install an Ethereum wallet.');
      }
    }
    initialize()
  }, [])

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1>Halloween</h1>
      <DonationForm ethersProvider={ethersProvider} contract={contract} minAmount={minAmount}/>
      {
        contract ?
        <DonationList ethersProvider={ethersProvider} contractAddress={contractAddress} contract={contract}/> : null
      }
      {/* <TestContract web3={web3} testContract={testContract}/> */}
    </div>
  )
  }