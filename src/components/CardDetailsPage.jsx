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
    try {
      const response = await fetch(`http://localhost:8000/v1/bank/getCardDetails/${accountNumber}`)
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
                            <path d="M651.19 0.533936L408.31 323.276H325.776L203.39 36.1139C196.871 13.5169 190.904 5.93993 171.762 0.533936H0.5L2.60666 9.67094C39.8174 18.808 83.3893 34.0059 110.208 50.3079C126.465 60.5399 131.321 69.1169 138.393 90.6029L211.022 323.276H297.449L624.925 0.533936H651.19Z" fill="white"/>
                            <path d="M999.5 323.276H920.19L769.728 0.533936H696.548L546.086 323.276H470.796L621.258 0.533936H703.068L853.53 323.276H999.5Z" fill="white"/>
                          </svg>
                        ) : (
                          <svg className="h-8" viewBox="0 0 1000 775" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M385.5 774.5C598.5 774.5 771.5 601.5 771.5 388C771.5 174.5 598.5 1.5 385.5 1.5C172 1.5 -0.5 174.5 -0.5 388C-0.5 601.5 172 774.5 385.5 774.5Z" fill="#EB001B"/>
                            <path d="M615 774.5C828 774.5 1001 601.5 1001 388C1001 174.5 828 1.5 615 1.5C402 1.5 229 174.5 229 388C229 601.5 402 774.5 615 774.5Z" fill="#F79E1B"/>
                            <path d="M500 712C648.5 625 733 503.5 733 388C733 272.5 648.5 151 500 64C351.5 151 267 272.5 267 388C267 503.5 351.5 625 500 712Z" fill="#FF5F00"/>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Back side */}
                  <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${showBackside ? '' : 'invisible'}`}>
                    <div className="w-full h-12 bg-black mt-4"></div>
                    <div className="mt-4 px-4">
                      <div className="bg-white bg-opacity-20 h-8 w-3/4"></div>
                      <div className="mt-4 flex justify-end">
                        <div className="bg-white text-black px-2 py-1 rounded">
                          CVV: {generateCVV()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-blue-700 mt-2">Click the card to view the {showBackside ? 'front' : 'back'}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}