import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { KeyIcon, CreditCardIcon } from "lucide-react";

const UpdatePinPage = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cards, setCards] = useState([]);
  const [isCardNumberFocused, setIsCardNumberFocused] = useState(false);
  const [isPinFocused, setIsPinFocused] = useState(false);

  const accountNumber = localStorage.getItem("accountNumber");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:8000/v1/bank/getCardNumbers/${accountNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCards(data);
      } catch (error) {
        setError("Failed to fetch cards.");
      }
    };

    fetchCards();
  }, [accountNumber, token]);

  const handleUpdatePin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('http://localhost:8000/v1/bank/updatePIN', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          card_number: cardNumber,
          pin: pin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update PIN');
      }

      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-blue-900">Update PIN</CardTitle>
          </CardHeader>
          <CardContent>
            {cards.length > 0 ? (
              <form onSubmit={handleUpdatePin} className="space-y-6">
                <div className="relative">
                  <Label htmlFor="cardNumber" className="text-blue-900 font-semibold">
                    Select Card
                  </Label>
                  <div className="relative">
                    <select
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      onFocus={() => setIsCardNumberFocused(true)}
                      onBlur={() => setIsCardNumberFocused(false)}
                      required
                      className="pl-10 bg-blue-100 text-blue-800 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 w-full py-2 px-3 rounded-md appearance-none"
                    >
                      <option value="" disabled>Select your card</option>
                      {cards.map((card) => (
                        <option key={card.card_number} value={card.card_number} className="bg-blue-100 text-blue-800">
                          {card.card_number} ({card.card_type})
                        </option>
                      ))}
                    </select>
                    <CreditCardIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${isCardNumberFocused ? 'text-blue-600' : 'text-blue-400'}`} />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-600">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Label htmlFor="pin" className="text-blue-900 font-semibold">
                    New PIN
                  </Label>
                  <Input
                    id="pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onFocus={() => setIsPinFocused(true)}
                    onBlur={() => setIsPinFocused(false)}
                    placeholder="Enter new PIN"
                    required
                    className="pl-10 bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <KeyIcon className={`absolute left-3 top-9 h-5 w-5 transition-colors duration-200 ${isPinFocused ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </motion.div>
                  ) : (
                    'Update PIN'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center text-blue-900 font-semibold">
                <p>No cards available.</p>
                <p>Apply for a card to use this service.</p>
              </div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert className="mt-6 bg-green-100 border-green-400 text-green-700">
                  <KeyIcon className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert className="mt-6 bg-red-100 border-red-400 text-red-700">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default UpdatePinPage;