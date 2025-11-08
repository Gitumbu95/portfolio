"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onMpesaPay: (phone: string) => Promise<void>;
  onCardPay: () => Promise<void>;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onMpesaPay,
  onCardPay,
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<"mpesa" | "card">("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMpesaSubmit = async () => {
    if (!phoneNumber) return alert("Please enter your M-Pesa phone number");

    setLoading(true);
    setShowPending(true);

    try {
      await onMpesaPay(phoneNumber);
      setShowPending(false);
      setShowSuccess(true);
      onSuccess();
    } catch (error) {
      console.error(error);
      setShowPending(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCardSubmit = async () => {
    setLoading(true);
    setShowPending(true);
    try {
      await onCardPay();
      // Stripe handles redirect; modal closes once successful payment callback hits
    } catch (error) {
      console.error(error);
      setShowPending(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-[var(--color-shop-dark-blue)]">
                Complete Your Payment
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Choose your preferred payment method below
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div className="flex justify-around mb-4">
                <Button
                  variant={selectedMethod === "mpesa" ? "default" : "outline"}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                    selectedMethod === "mpesa"
                      ? "bg-[var(--color-shop-electric-blue)] text-white"
                      : "border-[var(--color-shop-dark-blue)]/40"
                  }`}
                  onClick={() => setSelectedMethod("mpesa")}
                >
                  <Smartphone className="w-4 h-4" />
                  M-Pesa
                </Button>

                <Button
                  variant={selectedMethod === "card" ? "default" : "outline"}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                    selectedMethod === "card"
                      ? "bg-[var(--color-shop-electric-blue)] text-white"
                      : "border-[var(--color-shop-dark-blue)]/40"
                  }`}
                  onClick={() => setSelectedMethod("card")}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </Button>
              </div>

              {/* Payment Method Fields */}
              {selectedMethod === "mpesa" && (
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">
                    M-Pesa Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="e.g. 254712345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="border-gray-300 focus:border-[var(--color-shop-electric-blue)] focus:ring-[var(--color-shop-electric-blue)]"
                  />
                  <Button
                    onClick={handleMpesaSubmit}
                    className="w-full mt-2 bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] text-white rounded-full font-semibold py-3 transition-all"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : `Pay KES ${amount.toFixed(2)}`}
                  </Button>
                </div>
              )}

              {selectedMethod === "card" && (
                <div className="text-center">
                  <p className="text-sm text-gray-700 mb-4">
                    You’ll be redirected securely to Stripe Checkout.
                  </p>
                  <Button
                    onClick={handleCardSubmit}
                    className="w-full mt-2 bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] text-white rounded-full font-semibold py-3 transition-all"
                    disabled={loading}
                  >
                    {loading ? "Redirecting..." : `Pay with Card (KES ${amount.toFixed(2)})`}
                  </Button>
                </div>
              )}
            </div>

            {/* Pending Animation */}
            <AnimatePresence>
              {showPending && (
                <motion.div
                  className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], boxShadow: [
                      "0 0 0px rgba(66,153,225,0)",
                      "0 0 20px rgba(59,130,246,0.6)",
                      "0 0 0px rgba(66,153,225,0)",
                    ] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full bg-[var(--color-shop-electric-blue)] flex items-center justify-center"
                  >
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </motion.div>
                  <p className="text-sm font-medium text-[var(--color-shop-dark-blue)]">
                    Processing payment, please wait...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-3 p-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-md"
                  >
                    <CheckCircle2 className="text-white w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-[var(--color-shop-dark-blue)]">
                    Payment Successful!
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Your transaction has been processed successfully.
                  </p>
                  <Button
                    onClick={() => {
                      setShowSuccess(false);
                      onClose();
                    }}
                    className="mt-3 bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] text-white rounded-full font-semibold px-6 py-2"
                  >
                    Close
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
