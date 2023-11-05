'use client'
import { useState, useEffect } from 'react'
import { abi, testAbi } from '../app/abi';
import PropTypes, { InferProps } from 'prop-types';
import { ethers, formatEther } from 'ethers';

export default function DonationList ({ethersProvider, contractAddress, contract}: 
  InferProps<typeof DonationList.propTypes> & {ethersProvider: ethers.Provider | null, contractAddress: string | null, contract: ethers.Contract | null}) {

  const [donations, setDonations] = useState<any>([])
  const [newDonation, setNewDonation] = useState<any>(null)
  // const [contract, setContract] = useState<any>(null)

  // useEffect(() => {
  //   const contractInstance = new ethers.Contract(contractAddress, abi, etherProvider)
  //   console.log('contractInstance', contractInstance)
  //   // setContract(contractInstance)
  // }, [])

  useEffect(() => {
    if(!contract) {
      console.log('returning early')
      return;
    }

    const listener = (user: any, email: any, nick: any, amount: any, event: any) => {
      console.log('before donations', donations)
      setNewDonation({user, email, nick, amount})
      console.log('DonationReceived', user, email, nick, amount)
    }

    contract.on('DonationReceived', listener)

    const getDonations = async () => {
      const donationsList = await contract.getAllDonations()
      console.log('donationsList', donationsList)
      setDonations(donationsList)
    }

    const removeListeners = async () => {
      await contract.removeAllListeners()
    }

    getDonations()

    return () => {
      removeListeners()
    }
  }, [])

  console.log('loaded once')
  return (
    <div>
      <h2>Donations</h2>
      <ul>
        {
          newDonation ? 
          <li>
            <span>{newDonation.user}</span>
            <span>{newDonation.email}</span>
            <span>{newDonation.nick}</span>
            <span>{newDonation.amount}</span>
          </li> : null
        }
        {donations.map((donation: any, index: number) => {
          if(index < 13) return null;
          return (
            <li key={index}>
              <span>{donation.user}</span>
              <span>{donation.email}</span>
              <span>{donation.nick}</span>
              <span>{donation.amount}</span>
            </li>
          )
        }).reverse()
        }
      </ul>
    </div>
  )
}

DonationList.propTypes = {
  ethersProvider: PropTypes.object,
  contractAddress: PropTypes.string,
  contract: PropTypes.object,
};