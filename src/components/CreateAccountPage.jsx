import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from 'react-router-dom'

export default function Component() {
  const [formData, setFormData] = useState({
    customer_id: "",
    balance: "",
    account_type: "",
    email: ""
  })

  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")
  const [accountNumber, setAccountNumber] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, account_type: value }))
    if (errors.account_type) {
      setErrors(prev => ({ ...prev, account_type: "" }))
    }
  }

  const validateForm = () => {
    let newErrors = {}
    if (!formData.customer_id) newErrors.customer_id = "Customer ID is required"
    if (!formData.balance) newErrors.balance = "Initial balance is required"
    else if (isNaN(formData.balance) || parseFloat(formData.balance) < 0) newErrors.balance = "Invalid balance amount"
    if (!formData.account_type) newErrors.account_type = "Account type is required"
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8000/v1/bank/createAccount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        const result = await response.json()

        if (response.ok) {
          setMessage(result.message)
          setAccountNumber(result.accountNumber)
        } else {
          setMessage('Error creating account.')
        }
      } catch (error) {
        setMessage('Error creating account.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <Card className="w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-blue-900">Create Your Account</CardTitle>
          <CardDescription className="text-blue-700">Please provide the following details to create your bank account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id" className="text-blue-900 font-semibold">Customer ID</Label>
              <Input
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.customer_id ? "border-red-500" : ""}`}
              />
              {errors.customer_id && <p className="text-red-500 text-sm">{errors.customer_id}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance" className="text-blue-900 font-semibold">Initial Balance</Label>
              <Input
                id="balance"
                name="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.balance ? "border-red-500" : ""}`}
              />
              {errors.balance && <p className="text-red-500 text-sm">{errors.balance}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_type" className="text-blue-900 font-semibold">Account Type</Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.account_type ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Checking">Checking</SelectItem>
                </SelectContent>
              </Select>
              {errors.account_type && <p className="text-red-500 text-sm">{errors.account_type}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-900 font-semibold">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
              Create Account
            </Button>
            {message && (
              <div className="mt-4 text-center">
                <p className={`font-semibold ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
                {accountNumber && <p className="mt-2">Your Account Number: {accountNumber}</p>}
              </div>
            )}
            <div className="mt-4 text-center">
              <Link to="/login" className="text-blue-500 hover:underline">Login to continue</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
