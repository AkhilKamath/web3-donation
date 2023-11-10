'use client'

import React, { useState, FormEvent } from 'react'
import { ethers, formatEther} from 'ethers'
import PropTypes, { InferProps } from 'prop-types';
 
export default function DonationForm({ ethersProvider, contract, minAmount, hasWindowEthereum, setShouldGetEth }: 
  InferProps<typeof DonationForm.propTypes> & { ethersProvider: ethers.Provider | null, 
  contract: any | null, 
  minAmount: string | null,
  hasWindowEthereum: boolean,
  setShouldGetEth: Function
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
 
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts
 
    try {
        if(!ethersProvider || !contract) {
        return;
      }

      const formData = new FormData(event.currentTarget)
      if(formData.get('amount') !== null || formData.get('email') !== null || formData.get('nick') !== null) {
        const tx = await contract.donateForHalloween(formData.get('email')?.toString(), formData.get('nick')?.toString(), {
          value: ethers.parseEther(formData.get('amount')?.toString() || '0')
        })
        const res = await tx.wait(1)
      }
    } catch (error: any) {
      // Capture the error message to display to the user
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  function handleOnClick(event: any) {
    if(!hasWindowEthereum) {
      setShouldGetEth((old: number) => (old + 1) % 10)
      event.preventDefault()
    }
  }
 
  return (
    <div>
      {/* {error && <div style={{ color: 'red' }}>{error}</div>} */}
      <form onSubmit={onSubmit}>
        {
          error &&
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">Something went wrong. Could not send ETH</span>
          </div>      
        }
        {/* <p>Minimum amount is {minAmount} ETH</p> */}
        <input type="number" step='any' name='amount' placeholder="Amount" /><br/><br/>
        <input type="email" name='email' placeholder="Email" /><br/><br/>
        <input type="text" name='nick' placeholder="Nick" /><br/><br/>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleOnClick}
            type={hasWindowEthereum ? "submit" : "button"} disabled={isLoading}>
            {isLoading ? 'Sending ETH...' : hasWindowEthereum ? 'Submit' : 'Connect Wallet'}
        </button>
      </form>
    </div>
  )
}

DonationForm.propTypes = {
  ethersProvider: PropTypes.object,
  contract: PropTypes.any,
  minAmount: PropTypes.string,
  hasWindowEthereum: PropTypes.bool, 
  setShouldGetEth: PropTypes.func,
};