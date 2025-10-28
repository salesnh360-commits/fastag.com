"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, MapPin, User, Mail, Phone, Home, CheckCircle, Package, Headphones } from "lucide-react"
import Image from "next/image"
import { useCart } from "./cart-context"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

interface CustomerDetails {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state, dispatch } = useCart()
  const [step, setStep] = useState<"pincode" | "kyc" | "details" | "success">("pincode")
  const [pincode, setPincode] = useState("")
  const [pincodeValid, setPincodeValid] = useState(false)
  const [pincodeError, setPincodeError] = useState("")
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [orderId, setOrderId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle")
  const [paymentMethod, setPaymentMethod] = useState<"Prepaid" | "COD">("Prepaid")
  const [docs, setDocs] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  // Fulfillment selection state
  const [fulfillmentMode, setFulfillmentMode] = useState<"delivery" | "pickup" | null>(null)
  const [deliverySpeed, setDeliverySpeed] = useState<"instant" | "normal" | null>(null)
  const [pickupOffices, setPickupOffices] = useState<Array<{
    name: string
    branchType: string
    district: string
    state: string
    country: string
    pincode: string
  }>>([])
  const [pickupLoading, setPickupLoading] = useState(false)
  const [pickupError, setPickupError] = useState<string>("")
  const [pickupSelection, setPickupSelection] = useState<string>("")

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalOriginalPrice = state.items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const savings = totalOriginalPrice - totalPrice
  const shippingCost = 0 // Free shipping
  const finalTotal = totalPrice + shippingCost

  // Accept all valid Indian pincodes (6 digits, cannot start with 0)
  const isIndianPincode = (code: string) => /^[1-9]\d{5}$/.test(code)

  // Instant delivery window helper
  const isWithinInstantWindow = () => {
    const now = new Date()
    const hour = now.getHours()
    return hour >= 8 && hour < 23
  }

  const instantEtaText = () => {
    if (!isWithinInstantWindow()) return "Available 8:00 AM – 11:00 PM"
    return "Estimated 3–7 hours today"
  }

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`
  }

  const validatePincode = (code: string) => {
    if (code.length !== 6) {
      setPincodeError("Pincode must be 6 digits")
      setPincodeValid(false)
      return false
    }

    if (!/^\d{6}$/.test(code)) {
      setPincodeError("Pincode must contain only numbers")
      setPincodeValid(false)
      return false
    }

    if (!isIndianPincode(code)) {
      setPincodeError("Enter a valid 6-digit Indian pincode")
      setPincodeValid(false)
      return false
    }

    setPincodeError("")
    setPincodeValid(true)
    return true
  }

  const handlePincodeSubmit = () => {
    if (validatePincode(pincode)) {
      setCustomerDetails({ ...customerDetails, pincode })
      if (!orderId) setOrderId(generateOrderId())
      setStep("kyc")
    }
  }

  // Fetch pickup locations when user selects pickup and pincode is valid
  useEffect(() => {
    const run = async () => {
      if (!pincodeValid || fulfillmentMode !== "pickup") return
      try {
        setPickupLoading(true)
        setPickupError("")
        const res = await fetch(`/api/pincode/${pincode}`)
        if (!res.ok) throw new Error("Failed to fetch nearby locations")
        const data = await res.json()
        const offices = Array.isArray(data?.offices) ? data.offices : []
        setPickupOffices(offices)
        if (offices.length > 0) {
          const first = offices[0]
          const label = `${first.name} (${first.branchType}), ${first.district}, ${first.state}`
          setPickupSelection(label)
        } else {
          setPickupSelection("")
        }
      } catch (e: any) {
        setPickupError(e?.message || "Could not load nearby locations")
        setPickupOffices([])
        setPickupSelection("")
      } finally {
        setPickupLoading(false)
      }
    }
    run()
  }, [fulfillmentMode, pincode, pincodeValid])

  const handleDetailsChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails({ ...customerDetails, [field]: value })
  }

  const isDetailsValid = () => {
    const base = (
      customerDetails.name.trim() !== "" &&
      customerDetails.email.trim() !== "" &&
      customerDetails.phone.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email) &&
      /^\d{10}$/.test(customerDetails.phone)
    )
    if (fulfillmentMode === 'pickup') {
      return base && Boolean(pickupSelection)
    }
    return (
      base &&
      customerDetails.address.trim() !== "" &&
      customerDetails.city.trim() !== "" &&
      customerDetails.state.trim() !== ""
    )
  }

  const generateOrderId = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `COR${timestamp}${random}`
  }

  const uploadDoc = async (docType: string, file: File) => {
    const ensureId = orderId || generateOrderId()
    if (!orderId) setOrderId(ensureId)
    setUploading((u) => ({ ...u, [docType]: true }))
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("orderId", ensureId)
      form.append("docType", docType)
      const res = await fetch("/api/order-doc-upload", { method: "POST", body: form })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Upload failed")
      }
      const data = await res.json()
      const url = data?.url as string
      if (url) setDocs((d) => ({ ...d, [docType]: url }))
    } catch (e) {
      console.error("doc upload error", e)
      alert("Failed to upload. Please try again.")
    } finally {
      setUploading((u) => ({ ...u, [docType]: false }))
    }
  }

  const handlePlaceOrder = async () => {
    if (!isDetailsValid()) return

    setIsSubmitting(true)
    setEmailStatus("sending")

    const newOrderId = orderId || generateOrderId()
    setOrderId(newOrderId)

    // Derive address fields based on fulfillment
    let addressFinal = customerDetails.address
    let cityFinal = customerDetails.city
    let stateFinal = customerDetails.state
    if (fulfillmentMode === 'pickup') {
      addressFinal = pickupSelection ? `Pickup: ${pickupSelection}` : 'Pickup'
      try {
        const parts = (pickupSelection || '').split(',').map(s => s.trim())
        cityFinal = parts.length >= 2 ? parts[parts.length - 2] : cityFinal
        stateFinal = parts.length >= 1 ? parts[parts.length - 1] : stateFinal
      } catch {}
    }

    // Prepare order details for email
    const orderDetails = {
      orderId: newOrderId,
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      phone: customerDetails.phone,
      paymentMethod,
      totalAmount: finalTotal,
      items: state.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      address: addressFinal,
      city: cityFinal,
      state: stateFinal,
      pincode: customerDetails.pincode,
      orderDate: new Date().toISOString(),
      docs: Object.entries(docs).map(([doc_type, url]) => ({ doc_type, url })),
      deliveryPreference: {
        mode: fulfillmentMode,
        speed: deliverySpeed,
      },
    }

    // Persist order for Admin dashboard
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      })
    } catch (e) {
      console.warn('order persist failed', e)
    }

    // Send notification to sales team
    try {
      await sendOrderNotificationToSales(orderDetails)
      setEmailStatus("sent")
    } catch (error) {
      console.error("Failed to send order notification:", error)
      setEmailStatus("failed")
    }

    setStep("success")
    setIsSubmitting(false)
  }

  const sendOrderNotificationToSales = async (orderDetails: any) => {
    try {
      console.log("Sending order notification to sales team...")

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "order-notification",
          data: orderDetails,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send email")
      }

      if (result.success) {
        console.log("Order notification email sent successfully:", result.messageId)
      } else {
        throw new Error(result.message || "Email sending failed")
      }
    } catch (error) {
      console.error("Error sending order notification:", error)
      throw error
    }
  }

  const handleClose = () => {
    // Reset all states when closing
    setStep("pincode")
    setPincode("")
    setPincodeValid(false)
    setPincodeError("")
    setCustomerDetails({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    })
    setOrderId("")
    setIsSubmitting(false)
    setEmailStatus("idle")
    setDocs({})
    setUploading({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={handleClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === "pincode" && "Check Delivery"}
              {step === "kyc" && "Upload Documents"}
              {step === "details" && "Checkout Details"}
              {step === "success" && "Order Confirmed"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "pincode" && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <MapPin className="h-16 w-16 text-orange-600 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">Enter Your Pincode</h3>
                  <p className="text-gray-600">We'll check if we deliver to your area</p>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit pincode"
                      value={pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        setPincode(value)
                        if (value.length === 6) {
                          validatePincode(value)
                        } else {
                          setPincodeError("")
                          setPincodeValid(false)
                        }
                      }}
                      className={`text-center text-lg ${
                        pincodeError ? "border-red-500" : pincodeValid ? "border-green-500" : ""
                      }`}
                      maxLength={6}
                    />
                    {pincodeError && <p className="text-red-600 text-sm">{pincodeError}</p>}
                    {pincodeValid && (
                      <p className="text-green-600 text-sm flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Great! We deliver to this area
                      </p>
                    )}

                    {pincodeValid && (
                      <div className="space-y-3 border rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900">Choose Fulfillment</h4>
                        <div className="flex items-center gap-6 text-sm">
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="radio"
                              name="fulfillment"
                              checked={fulfillmentMode === "delivery"}
                              onChange={() => { setFulfillmentMode("delivery"); setDeliverySpeed(null); }}
                            />
                            <span>Delivery</span>
                          </label>
                          <label className="inline-flex items-center gap-2">
                            <input
                              type="radio"
                              name="fulfillment"
                              checked={fulfillmentMode === "pickup"}
                              onChange={() => setFulfillmentMode("pickup")}
                            />
                            <span>Pickup</span>
                          </label>
                        </div>

                        {fulfillmentMode === "delivery" && (
                          <div className="space-y-2 mt-1">
                            <div className="text-sm font-medium text-gray-700">Delivery Speed</div>
                            <div className="flex items-center gap-6 text-sm">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="speed"
                                  disabled={!isWithinInstantWindow()}
                                  checked={deliverySpeed === "instant"}
                                  onChange={() => setDeliverySpeed("instant")}
                                />
                                <span>Instant (3–7 hrs) <span className="text-gray-500">· {instantEtaText()}</span></span>
                              </label>
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="speed"
                                  checked={deliverySpeed === "normal"}
                                  onChange={() => setDeliverySpeed("normal")}
                                />
                                <span>Normal (within 2 days)</span>
                              </label>
                            </div>
                          </div>
                        )}

                        {fulfillmentMode === "pickup" && (
                          <div className="space-y-2 mt-1">
                            <div className="text-sm font-medium text-gray-700">Choose Nearby Pickup Location</div>
                            {pickupLoading && (
                              <div className="text-sm text-gray-500">Loading nearby locations…</div>
                            )}
                            {pickupError && (
                              <div className="text-sm text-red-600">{pickupError}</div>
                            )}
                            {!pickupLoading && !pickupError && (
                              <select
                                className="w-full border rounded px-3 py-2 text-sm"
                                value={pickupSelection}
                                onChange={(e) => setPickupSelection(e.target.value)}
                              >
                                {pickupOffices.length === 0 && (
                                  <option value="">No nearby offices found for this pincode</option>
                                )}
                                {pickupOffices.map((o, idx) => {
                                  const label = `${o.name} (${o.branchType}), ${o.district}, ${o.state}`
                                  return (
                                    <option key={`${o.name}-${idx}`} value={label}>
                                      {label}
                                    </option>
                                  )
                                })}
                              </select>
                            )}
                            <p className="text-xs text-gray-500">Pickup is typically ready same day during 8 AM – 11 PM.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12"
                    onClick={handlePincodeSubmit}
                    disabled={!pincodeValid || (!fulfillmentMode || (fulfillmentMode === "delivery" && !deliverySpeed) || (fulfillmentMode === "pickup" && !pickupSelection))}
                  >
                    Continue
                  </Button>
                </div>

                {/* Serviceable Areas Info */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">We Deliver Across India</h4>
                  <p className="text-orange-800 text-sm">
                    Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, and Paduvampalli (Tamil
                    Nadu). Plus, all other locations — we support all valid 6‑digit Indian pincodes.
                  </p>
                  <p className="text-orange-700 text-xs mt-2">
                    Don’t see your area listed? We still deliver — enter your pincode above.
                  </p>
                </div>
              </div>
            )}

            {step === "kyc" && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Upload KYC Documents</h3>
                  <p className="text-gray-600 text-sm">RC Front is mandatory to continue. RC Back, Aadhaar, and PAN are optional at this stage.</p>
                  {orderId && (
                    <p className="text-xs text-gray-400">Temporary Order ID: {orderId}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'rc_front', label: 'RC Front (Required)' },
                    { key: 'rc_back', label: 'RC Back (Optional)' },
                    { key: 'aadhar_front', label: 'Aadhaar Front (Optional)' },
                    { key: 'aadhar_back', label: 'Aadhaar Back (Optional)' },
                    { key: 'pan', label: 'PAN (Optional)' },
                  ].map(({ key, label }) => (
                    <div key={key} className="space-y-2 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <label className="font-medium text-gray-800">{label}</label>
                        {docs[key] ? (
                          <span className="text-green-600">Uploaded</span>
                        ) : uploading[key] ? (
                          <span className="text-orange-600">Uploading…</span>
                        ) : (
                          <span className="text-gray-400">Not uploaded</span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) uploadDoc(key, f)
                        }}
                      />
                      {/* URL hidden intentionally */}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                    onClick={() => setStep('pincode')}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={!docs['rc_front']}
                    onClick={() => setStep('details')}
                  >
                    Continue to Checkout
                  </Button>
                </div>
              </div>
            )}

            {step === "details" && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Customer Details Form */}
                <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={customerDetails.name}
                        onChange={(e) => handleDetailsChange("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={customerDetails.email}
                        onChange={(e) => handleDetailsChange("email", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        placeholder="Enter 10-digit mobile number"
                        value={customerDetails.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                          handleDetailsChange("phone", value)
                        }}
                        maxLength={10}
                      />
                    </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">{fulfillmentMode === 'pickup' ? 'Pickup Details' : 'Delivery Address'}</h3>

              {fulfillmentMode === 'pickup' ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      Selected Pickup Location
                    </label>
                    <Input type="text" value={pickupSelection || 'Not selected'} disabled className="bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Pincode</label>
                      <Input type="text" value={customerDetails.pincode} disabled className="bg-gray-100" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Method</label>
                      <Input type="text" value={deliverySpeed === 'instant' ? 'Pickup (instant readiness)' : 'Pickup'} disabled className="bg-gray-100" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Pickup assistance available 8 AM – 11 PM.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Home className="h-4 w-4 mr-2" />
                      Full Address *
                    </label>
                    <Textarea
                      placeholder="House/Flat No., Building Name, Street, Locality"
                      value={customerDetails.address}
                      onChange={(e) => handleDetailsChange("address", e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <Input
                        type="text"
                        placeholder="Enter city"
                        value={customerDetails.city}
                        onChange={(e) => handleDetailsChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State *</label>
                      <Input
                        type="text"
                        placeholder="Enter state"
                        value={customerDetails.state}
                        onChange={(e) => handleDetailsChange("state", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                    <Input type="text" value={customerDetails.pincode} disabled className="bg-gray-100" />
                  </div>
                </>
              )}
            </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>

                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                          {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm font-bold text-gray-900">{formatPrice(item.price)}</span>
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                            <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Payment Method</h4>
                <div className="flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "Prepaid"}
                      onChange={() => setPaymentMethod("Prepaid")}
                    />
                    <span>Prepaid (Paid)</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span className="text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">You save</span>
                        <span className="text-green-600 font-medium">{formatPrice(savings)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>Total {paymentMethod === 'Prepaid' ? '(Paid)' : '(COD)'}</span>
                  <span className="text-orange-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg font-semibold"
                    onClick={handlePlaceOrder}
                    disabled={!isDetailsValid() || isSubmitting}
                  >
                    {isSubmitting ? "Placing Order..." : `Place Order - ${formatPrice(finalTotal)}`}
                  </Button>

                  <div className="text-xs text-gray-500 text-center">
                    By placing this order, you agree to our Terms & Conditions and Privacy Policy
                  </div>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="text-center space-y-6 py-8">
                <div className="space-y-4">
                  <CheckCircle className="h-20 w-20 text-green-600 mx-auto" />
                  <h3 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h3>
              <p className="text-gray-600">Thank you for choosing NH360 FASTag. Your request has been confirmed.</p>

                  {/* Email Status */}
                  {emailStatus === "sending" && (
                    <p className="text-blue-600 text-sm">📧 Sending notification to sales team...</p>
                  )}
                  {emailStatus === "sent" && (
                    <p className="text-green-600 text-sm">✅ Sales team has been notified via email</p>
                  )}
                  {emailStatus === "failed" && (
                    <p className="text-red-600 text-sm">
                      ⚠️ Email notification failed, but order was placed successfully
                    </p>
                  )}
                </div>

                <div className="bg-green-50 p-6 rounded-lg space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-green-900">Order Details</h4>
                    <div className="space-y-1">
                      <p className="text-green-800">
                        <strong>Order ID:</strong> {orderId}
                      </p>
                      <p className="text-green-800">
                        <strong>Total Amount:</strong> {formatPrice(finalTotal)}
                      </p>
                      <p className="text-green-800">
                        <strong>Items:</strong> {totalItems} product(s)
                      </p>
                      <p className="text-green-800">
                        <strong>Delivery Address:</strong> {customerDetails.address}, {customerDetails.city},{" "}
                        {customerDetails.state} - {customerDetails.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg space-y-4">
                  <h4 className="text-lg font-semibold text-orange-900">What's Next?</h4>
                  <div className="space-y-3 text-sm text-orange-800">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-orange-600" />
                      <span>Your request will be processed within 24 hours</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <span>Order confirmation sent to {customerDetails.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-orange-600" />
                      <span>SMS updates will be sent to {customerDetails.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Need Help?</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4 text-orange-600" />
                      <span>
                        <strong>Email:</strong> support@nh360fastag.com
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Headphones className="h-4 w-4 text-orange-600" />
                      <span>
                        <strong>Support Hours:</strong> Mon-Sat, 9 AM - 7 PM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12" onClick={handleClose}>
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      dispatch({ type: "CLEAR_CART" })
                      handleClose()
                    }}
                  >
                    Clear Cart & Start Fresh
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                    onClick={() => window.print()}
                  >
                    Print Order Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
