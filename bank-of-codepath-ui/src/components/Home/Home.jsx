import * as React from "react"
import AddTransaction, { AddTransactionForm } from "../AddTransaction/AddTransaction"
import BankActivity from "../BankActivity/BankActivity"
import "./Home.css"
import { useEffect } from "react"
import axios from "axios"


export default function Home(props) {

  async function getTransactions() {
    props.setIsLoading(true)
    
    try{
      const res = await axios.get("http://localhost:3001/bank/transactions")
      if(res.data.transactions) {
        props.setTransactions(res.data.transactions)
      }
      else
        throw "error"
    } 
    catch(err) {
      props.setError(err)
    }
    props.setIsLoading(false)
  }

  async function getTransfers() {
    props.setIsLoading(true)
    try{
      const res = await axios.get("http://localhost:3001/bank/transfers")
      if(res.data.transfers) {
        props.setTransfers(res.data.transfers)
      }
      else
        throw "error"
    } 
    catch(err) {
      props.setError(err)
    }
    props.setIsLoading(false)
  }

  useEffect(() => {getTransactions()}, [])

  useEffect(() => {getTransfers()}, [])

  let filteredTransactions = []

    if(props.filterInputValue) {
      filteredTransactions = props.transactions.filter((e) => {
        return(e.description.toLowerCase().includes(props.filterInputValue.toLowerCase()))
      })
    } else {
      filteredTransactions = props.transactions
    }

  async function handleOnSubmitNewTransaction() {
    props.setIsCreating(true)
    try{
      axios.post("http://localhost:3001/bank/transactions", {transaction: props.newTransactionForm})
    }catch(err) {
      props.setError(err)
      props.setIsCreating(false)
    }
  }



  if(props.isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
        <AddTransaction 
                    form={props.newTransactionForm}
                    setForm={props.setNewTransactionForm}
                    isCreating={props.isCreating}
                    setIsCreating={props.setIsCreating}
                    handleOnSubmit={handleOnSubmitNewTransaction}
        />
        </div>
    )
  }

  return (
    <div className="home">
      <AddTransaction 
                    form={props.newTransactionForm}
                    setForm={props.setNewTransactionForm}
                    isCreating={props.isCreating}
                    setIsCreating={props.setIsCreating}
                    handleOnSubmit={handleOnSubmitNewTransaction}
        />
      {
      props.isLoading 
      ? <h1>Loading...</h1> 
      : <BankActivity 
          transactions={filteredTransactions}
          transfers={props.transfers}
        />
      }
      {
        props.error
        ? <h2 className="error">{props.error}</h2>
        : null
      }
      
      
    </div>
    
  )
}
