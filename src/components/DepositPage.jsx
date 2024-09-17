import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DepositPage() {
  const [formData, setFormData] = useState({
    account_number: "",
    amount: ""
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")
  const [newBalance, setNewBalance] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let newErrors = {}
    if (!formData.account_number) newErrors.account_number = "Account number is required"
    if (!formData.amount) newErrors.amount = "Amount is required"
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) newErrors.amount = "Invalid amount"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8000/v1/bank/depositMoney', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const result = await response.json()

        if (response.ok) {
          setMessage(result.message)
          setNewBalance(result.new_balance)
        } else {
          setMessage('Error making deposit.')
        }
      } catch (error) {
        setMessage('Error making deposit.')
      }
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <Card className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-blue-900">Deposit Money</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="account_number" className="text-blue-900 font-semibold">Account Number</Label>
              <Input
                id="account_number"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.account_number ? "border-red-500" : ""}`}
              />
              {errors.account_number && <p className="text-red-500 text-sm">{errors.account_number}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-blue-900 font-semibold">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.amount ? "border-red-500" : ""}`}
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Deposit
            </Button>
            {message && (
              <div className="mt-4 text-center">
                <p className={`font-semibold ${message.includes('Error') ? 'text-red-500' : 'text-blue-500'}`}>{message}</p>
                {newBalance && <p className="mt-2">New Balance: ₹{newBalance}</p>}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
