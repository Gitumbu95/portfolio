"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "./ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  primaryActionText?: string;
  onPrimaryAction?: () => void;
  orderNumber?: string;
  amount?: number;
  paymentMethod?: "Mpesa" | "Card" | string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Payment Successful!",
  message = "Your transaction has been processed successfully.",
  primaryActionText = "Continue Shopping",
  onPrimaryAction,
  orderNumber,
  amount,
  paymentMethod,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm sm:max-w-md text-center"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ❌ Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ✅ Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.1,
                type: "spring",
                stiffness: 180,
                damping: 12,
              }}
              className="w-20 h-20 bg-[var(--color-shop-electric-blue)] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <CheckCircle2 className="text-white w-10 h-10" />
            </motion.div>

            {/* ✅ Text Content */}
            <h2 className="text-2xl font-bold text-[var(--color-shop-dark-blue)] mb-2">
              {title}
            </h2>
            <p className="text-gray-600 text-sm mb-6">{message}</p>

            {/* ✅ Order Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--color-shop-alice-blue)]/40 rounded-xl p-4 text-left mb-6 border border-[var(--color-shop-light-blue)]/40 shadow-sm"
            >
              {orderNumber && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Order No:</span>
                  <span className="text-[var(--color-shop-dark-blue)] font-medium">
                    {orderNumber}
                  </span>
                </div>
              )}
              {paymentMethod && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">Payment Method:</span>
                  <span className="text-[var(--color-shop-electric-blue)] font-medium">
                    {paymentMethod}
                  </span>
                </div>
              )}
              {amount !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700">Amount Paid:</span>
                  <span className="text-[var(--color-shop-dark-blue)] font-semibold">
                    Ksh {amount.toLocaleString()}
                  </span>
                </div>
              )}
            </motion.div>

            {/* ✅ Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={onPrimaryAction || onClose}
                className="bg-[var(--color-shop-electric-blue)] hover:bg-[var(--color-shop-dark-blue)] text-white rounded-full py-2.5 font-semibold"
              >
                {primaryActionText}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 hover:bg-gray-100 rounded-full py-2.5 font-medium"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
