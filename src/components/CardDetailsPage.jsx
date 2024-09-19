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

  useEffect(() => {
    const name = localStorage.getItem('username')
    setCardHolderName(name || 'Card Holder')

    // Fetch account number from local storage
    const storedAccountNumber = localStorage.getItem('accountNumber')
    if (storedAccountNumber) {
      setAccountNumber(storedAccountNumber)
    }
  }, [])

  const fetchCardDetails = async () => {
    setIsLoading(true)
    setError('')
    const token = localStorage.getItem('token') // Retrieve the token from local storage

    try {
      const response = await fetch(`http://localhost:8000/v1/bank/getCardDetails/${accountNumber}`, {
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch card details')
      }
      const data = await response.json()
      setCards(data.map(card => ({
        ...card,
        cardNetwork: card.card_type.toLowerCase() === 'debit' ? (Math.random() < 0.5 ? 'visa' : 'mastercard') : null
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
    switch (cardType.toLowerCase()) {
      case 'debit':
        return 'from-blue-400 to-blue-600'
      case 'credit':
        return 'from-purple-400 to-purple-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
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
                        {cards[currentCardIndex].cardNetwork === 'visa' ? (
                          <svg className="h-8" viewBox="0 0 1000 324" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M651.19 0.533936L408.31 323.276H325.776L203.39 36.1139C196.871 13.5169 190.904 5.93993 171.762 0.533936H0.5L2.60666 9.67094C39.8174 18.808 83.3893 34.0059 110.208 50.3079C126.465 60.5399 131.321 69.1169 138.393 90.6029L211.022 323.276H297.449L624.925 0.533936H651.19Z" fill="currentColor" />
                            <path d="M0.5 0.533936L203.39 323.276H355.767L559.647 129.924L533.69 80.3839L494.08 0.533936H0.5V0.533936Z" fill="currentColor" />
                            <path d="M425.242 0.533936L624.925 0.533936L299.163 323.276H146.577L0.5 23.9364L1.23366 0.533936L425.242 0.533936Z" fill="currentColor" />
                            <path d="M900.953 0.533936L651.189 323.276H456.242L225.639 0.533936H900.953Z" fill="currentColor" />
                          </svg>
                        ) : (
                          <svg className="h-8" viewBox="0 0 1000 324" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.5 0.533936L468.724 0.533936L0.5 323.276L0.5 0.533936Z" fill="currentColor" />
                            <path d="M0.5 0.533936L468.724 0.533936L0.5 323.276L0.5 0.533936Z" fill="currentColor" />
                            <path d="M804.647 0.533936L468.724 0.533936L804.647 323.276L804.647 0.533936Z" fill="currentColor" />
                            <path d="M804.647 0.533936L468.724 0.533936L804.647 323.276L804.647 0.533936Z" fill="currentColor" />
                            <path d="M804.647 0.533936L468.724 0.533936L804.647 323.276L804.647 0.533936Z" fill="currentColor" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Back side */}
                  <div className={`absolute w-full h-full backface-hidden ${showBackside ? '' : 'invisible'}`}>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold">Card Back</div>
                      <div className="mt-4 text-center">
                        <div className="text-xs uppercase mb-2">CVV</div>
                        <div className="text-2xl font-mono tracking-wider">{generateCVV()}</div>
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
