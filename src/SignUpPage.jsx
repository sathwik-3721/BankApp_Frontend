import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Updated import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_num: "",
    email: "",
    pancard_num: "",
    dob: "",
    account_type: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const navigate = useNavigate(); // Use navigate instead of useRouter

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, account_type: value }));
    if (errors.account_type) {
      setErrors((prev) => ({ ...prev, account_type: "" }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
    if (!formData.mobile_num) newErrors.mobile_num = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile_num)) newErrors.mobile_num = "Invalid mobile number";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.pancard_num) newErrors.pancard_num = "PAN card number is required";
    else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pancard_num)) newErrors.pancard_num = "Invalid PAN card number";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.account_type) newErrors.account_type = "Account type is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:8000/v1/bank/createCustomer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        setMessage(result.message);
        setCustomerId(result.customer_id);
        // Show customer ID and display 'Create Account' button
      } catch (error) {
        setMessage('Error creating account.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <Card className="w-full max-w-2xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-blue-900">Sign Up for miraBank</CardTitle>
          <CardDescription className="text-blue-700">Enter your details to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-blue-900 font-semibold">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.first_name ? "border-red-500" : ""}`}
                />
                {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-blue-900 font-semibold">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.last_name ? "border-red-500" : ""}`}
                />
                {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile_num" className="text-blue-900 font-semibold">Mobile Number</Label>
              <Input
                id="mobile_num"
                name="mobile_num"
                value={formData.mobile_num}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.mobile_num ? "border-red-500" : ""}`}
              />
              {errors.mobile_num && <p className="text-red-500 text-sm">{errors.mobile_num}</p>}
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
            <div className="space-y-2">
              <Label htmlFor="pancard_num" className="text-blue-900 font-semibold">PAN Card Number</Label>
              <Input
                id="pancard_num"
                name="pancard_num"
                value={formData.pancard_num}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.pancard_num ? "border-red-500" : ""}`}
              />
              {errors.pancard_num && <p className="text-red-500 text-sm">{errors.pancard_num}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob" className="text-blue-900 font-semibold">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.dob ? "border-red-500" : ""}`}
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
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
              <Label htmlFor="password" className="text-blue-900 font-semibold">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`bg-white bg-opacity-50 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">Sign Up</Button>
          </form>
          {message && (
            <div className="mt-4 text-center">
              <p className={`font-semibold ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
              {customerId && <p className="mt-2">Your Customer ID: {customerId}</p>}
              {customerId && (
                <div className="mt-4">
                  <Button
                    onClick={() => navigate('/create-account')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Go to Create Account
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
