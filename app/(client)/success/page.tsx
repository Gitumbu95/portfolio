"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useStore from "@/store";
import { Check, Loader2 } from "lucide-react";
import SuccessModal from "@/components/SuccessModal";

const SuccessPageContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderNumber = searchParams.get("orderNumber");
  const { resetCart } = useStore();

  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
        const data = await res.json();

        if (data.success && data.session.payment_status === "paid") {
          setIsVerified(true);
          resetCart();
        }
      } catch (error) {
        console.error("Stripe verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, resetCart]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 to-gray-100">
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center text-center gap-3"
        >
          <Loader2 className="animate-spin text-[var(--color-shop-electric-blue)] w-10 h-10" />
          <p className="text-gray-600 font-medium">Verifying payment...</p>
        </motion.div>
      ) : isVerified ? (
        <SuccessModal
          isOpen={true}
          onClose={() => (window.location.href = "/")}
          orderNumber={orderNumber ?? "N/A"}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-6 text-center"
        >
          <Check className="text-red-500 w-10 h-10 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-800">
            Payment verification failed
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            We couldn’t verify your payment session. Please check your email or
            try again.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const SuccessPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SuccessPageContent />
  </Suspense>
);

export default SuccessPage;
