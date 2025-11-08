"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface PaymentPendingModalProps {
  isOpen: boolean;
  message?: string;
}

const PaymentPendingModal = ({ isOpen, message }: PaymentPendingModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="flex flex-col items-center justify-center text-center bg-white p-8 rounded-2xl shadow-2xl max-w-sm mx-auto border border-[var(--color-shop-light-blue)]/40"
      >
        {/* Soft pulsing blue glow animation */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 0 0px rgba(0, 102, 255, 0.3)",
              "0 0 25px rgba(0, 102, 255, 0.4)",
              "0 0 0px rgba(0, 102, 255, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-20 h-20 rounded-full flex items-center justify-center bg-[var(--color-shop-electric-blue)]/90"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          >
            <Loader2 className="w-10 h-10 text-white" />
          </motion.div>
        </motion.div>

        <p className="mt-6 text-gray-700 font-semibold text-lg">
          {message || "Awaiting M-PESA payment confirmation..."}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Check your phone and enter your M-PESA PIN to complete payment.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPendingModal;
