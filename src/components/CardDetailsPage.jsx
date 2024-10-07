"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Wallet, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Component() {
  const [accountNumber, setAccountNumber] = useState('')
  const [cards, setCards] = useState([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showBackside, setShowBackside] = useState(false)
  const [cardHolderName, setCardHolderName] = useState('')
  const [cvv, setCvv] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('username')
    setCardHolderName(name || 'Card Holder')

    const storedAccountNumber = localStorage.getItem('accountNumber')
    if (storedAccountNumber) {
      setAccountNumber(storedAccountNumber)
    }

    setCvv(generateCVV())
  }, [])

  const fetchCardDetails = async () => {
    setIsLoading(true)
    setError('')
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`http://localhost:8000/v1/bank/getCardDetails/${accountNumber}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch card details')
      }
      const data = await response.json()
      setCards(data.map(card => ({
        ...card,
        cardNetwork: card.card_type.toLowerCase() === 'debit' ? 'mastercard' : null
      })))
    } catch (err) {
      setError('Error fetching card details. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchCardDetails()
  }

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : cards.length - 1))
    setShowBackside(false)
  }

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex < cards.length - 1 ? prevIndex + 1 : 0))
    setShowBackside(false)
  }

  const toggleCardSide = () => {
    setShowBackside(!showBackside)
  }

  const getCardBackground = (cardType) => {
    return cardType.toLowerCase() === 'debit' ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'
  }

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString()
  }

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (issuedDate) => {
    const date = new Date(issuedDate)
    date.setFullYear(date.getFullYear() + 5)
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`
  }

  const MastercardLogo = () => (
    <svg className="h-8" viewBox="0 0 152 95" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="47.5" cy="47.5" r="47.5" fill="#EB001B"/>
      <circle cx="104.5" cy="47.5" r="47.5" fill="#F79E1B"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M76 86.9C90.8 78.1 101 62.2 101 44.2C101 26.2 90.8 10.3 76 1.5C61.2 10.3 51 26.2 51 44.2C51 62.2 61.2 78.1 76 86.9Z" fill="#FF5F00"/>
      <path d="M0 94H152V95H0V94Z" fill="black"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-900">Card Details</CardTitle>
          <CardDescription className="text-center text-blue-700">View your available cards</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-blue-900 font-semibold">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                value={accountNumber}
                readOnly
                className="bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading || !accountNumber}
            >
              {isLoading ? 'Loading...' : 'Fetch Card Details'}
            </Button>
          </form>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {cards.length > 0 && (
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <Button
                  onClick={handlePrevCard}
                  variant="ghost"
                  size="icon"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <ChevronLeft className="h-6 w-6" />
                  <span className="sr-only">Previous card</span>
                </Button>
                <span className="text-blue-900 font-medium">
                  Card {currentCardIndex + 1} of {cards.length}
                </span>
                <Button
                  onClick={handleNextCard}
                  variant="ghost"
                  size="icon"
                  className="text-blue-700 hover:text-blue-900"
                >
                  <ChevronRight className="h-6 w-6" />
                  <span className="sr-only">Next card</span>
                </Button>
              </div>
              <div 
                className={`bg-gradient-to-r ${getCardBackground(cards[currentCardIndex].card_type)} rounded-xl p-6 text-white shadow-lg transition-all duration-300 ease-in-out cursor-pointer`}
                onClick={toggleCardSide}
                style={{ perspective: '1000px' }}
              >
                <div className={`relative w-full h-56 transition-transform duration-500 ${showBackside ? 'rotate-y-180' : ''}`} style={{ transformStyle: 'preserve-3d' }}>
                  {/* Front side */}
                  <div className={`absolute w-full h-full backface-hidden ${showBackside ? 'invisible' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <Wallet className="h-10 w-10" />
                      <span className="text-lg font-bold capitalize">{cards[currentCardIndex].card_type}</span>
                    </div>
                    <div className="mb-6 mt-12">
                      <span className="text-2xl font-mono tracking-wider">
                        {formatCardNumber(cards[currentCardIndex].card_number)}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs uppercase">Card Holder</p>
                        <p className="font-medium">{cardHolderName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase">Expires</p>
                        <p className="font-medium">{formatExpiryDate(cards[currentCardIndex].issued_date)}</p>
                      </div>
                    </div>
                    {cards[currentCardIndex].card_type.toLowerCase() === 'debit' && (
                      <div className="absolute bottom-0 right-0">
                        <MastercardLogo />
                      </div>
                    )}
                  </div>
                  {/* Back side */}
                  <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${showBackside ? '' : 'invisible'}`}>
                    <div className="h-full flex flex-col">
                      <div className="h-12 bg-black w-full"></div>
                      <div className="flex-grow bg-gray-200 p-4">
                        <div className="bg-white h-8 w-full mb-4"></div>
                        <div className="flex justify-end">
                          <div className="bg-white h-8 w-16 flex items-center justify-center font-mono">
                            {cvv}
                          </div>
                        </div>
                      </div>
                      <div className="h-12 bg-gray-300 flex items-center justify-between px-4">
                        <span className="text-xs text-gray-600">CVV: {cvv}</span>
                        <MastercardLogo />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}