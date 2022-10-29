import { useEffect, useState } from "react"


export default function useAccountInfo(uid) {

    const [ transactions, setTransactions] = useState([])
    const [ transactionsProcessed, setTransactionsProcessed] = useState([])
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [totalCredit, setTotalCredit] = useState(0)
    const [totalDebit, setTotalDebit] = useState(0)
    const [closingBalance, setClosingBalance] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const info = {
        bankAddress: "231 Valley Farms Street Santa Monica, CA 90403",
        bankEmail: "firstcitizenbank@domain.com", 
        bankName: "First Citezen Bank", 
        bankBranch: "Beacon branch", 
        accountNumber: "123-456-789-012", 
        accountName: "John Smith", 
        accountAddress: "2450 Courage st, STE 108", 
        statementDate: 1666986970, 
        openingBalance: 175900
    }

    const [startPeriod, setStartPeriod] = useState(0)
    const [endPeriod, setEndPeriod] = useState(0)

    useEffect(() => {
        setTransactions([
            {
                date: 1666295770,
                description: "Payment - Water bill",
                amount: 82388,
                isCredit: false
            },
            {
                date: 1666554970,
                description: "Account Transfer in",
                amount: 820388,
                isCredit: true
            },
            {
                date: 1666641370,
                description: "Account Transfer in",
                amount: 1388,
                isCredit: true
            },
            {
                date: 1666814170,
                description: "Payment - Car loan",
                amount: 33388,
                isCredit: false
            }
        ])
    }, [])

    useEffect(() => {
        var processed = []
        var balance = info.openingBalance
        var tCredit = 0
        var tDebit = 0
        for (let index = 0; index < transactions.length; index++) {
            const transaction = transactions[index];
            if(index == 0) {
                setStartPeriod(transaction.date)

            } else if(index == transactions.length - 1) {
                setEndPeriod(transaction.date)
            }
            
            if(transaction.isCredit) {
                balance = balance + transaction.amount
                tCredit += transaction.amount

            } else {
                balance = balance - transaction.amount
                tDebit += transaction.amount
            }
            processed.push({
                ...transaction,
                balance: balance
            })
        }
        setClosingBalance(balance)
        setTotalCredit(tCredit)
        setTotalDebit(tDebit)
        setTotalTransactions(transactions.length)
        setTransactionsProcessed(processed)
    }, [transactions])
    return {
        ...info,
        startPeriod, endPeriod,
        closingBalance, totalCredit, totalDebit, totalTransactions, 
        transactions: transactionsProcessed, isLoading, error
    }
}