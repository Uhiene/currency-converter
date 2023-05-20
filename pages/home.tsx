import Head from 'next/head'
import { useEffect, useState } from 'react'

interface ExchangeRate {
  [key: string]: string
}

export default function Home() {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [selectedFrom, setSelectedFrom] = useState<string>('USD')
  const [selectedTo, setSelectedTo] = useState<string>('ETH')
  const [fromResult, setFromResult] = useState<string>('')
  const [toResult, setToResult] = useState<string>('')

  const getExchangeRates = async (currency: string): Promise<ExchangeRate[]> => {
    const url = `https://api.coinbase.com/v2/exchange-rates?currency=${currency}`

    return new Promise<ExchangeRate[]>(async (resolve, reject) => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error(`Request Failed with status code ${response.status}`)
        })
        .then((data) => {
          const fetchedRates: ExchangeRate[] = convertToObjectArray(data.data.rates)
          const fetchedFromRate: ExchangeRate | undefined = fetchedRates.find(
            (curr) => curr.currency === selectedFrom
          )
          const fetchedToRate: ExchangeRate | undefined = fetchedRates.find(
            (curr) => curr.currency === selectedTo
          )

          if (fetchedFromRate) setFromResult(fetchedFromRate.rate)
          if (fetchedToRate) setToResult(fetchedToRate.rate)

          setRates(fetchedRates)
          resolve(fetchedRates)
        })
        .catch((error) => reject(error))
    })
  }

  const convertToObjectArray = (rates: ExchangeRate): { currency: string; rate: string }[] => {
    return Object.entries(rates).map(([currency, rate]) => ({ currency, rate }))
  }

  useEffect(() => {
    const fetchData = async () => {
      await getExchangeRates(selectedFrom)
    }

    fetchData()
  }, [selectedFrom, selectedTo])

  return (
    <div>
      <Head>
        <title>Currency App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="p-4 max-w-md mx-auto">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Currency</label>
            <select
              onChange={(e) => setSelectedFrom(e.target.value)}
              id="fromCurrency"
              name="fromCurrency"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {rates.map((rate, i) => (
                <option value={rate.currency} key={i} selected={rate.currency === selectedFrom}>
                  {rate.currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              id="fromCurrency"
              name="fromCurrency"
              readOnly
              placeholder="result"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-green-300
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={fromResult}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">To Currency</label>
            <select
              onChange={(e) => setSelectedTo(e.target.value)}
              id="toCurrency"
              name="toCurrency"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none
              focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {rates.map((rate, i) => (
                <option value={rate.currency} key={i} selected={rate.currency === selectedTo}>
                  {rate.currency}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              id="toCurrency"
              name="toCurrency"
              readOnly
              placeholder="result"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-green-300
              focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={toResult}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Convert
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
