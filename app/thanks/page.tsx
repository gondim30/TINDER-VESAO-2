"use client"

import { motion } from "framer-motion"
import { CheckCircle, Clock, Mail, Shield, ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ThanksPage() {
  const router = useRouter()

  const reportItems = [
    "All profile photos (including private ones)",
    "Complete conversation history and messages",
    "Exact location data and dating activity",
    "Detailed activity timeline and patterns",
  ]

  const processSteps = [
    { icon: CheckCircle, label: "Payment Confirmed", status: "completed" },
    { icon: Clock, label: "Report Processing", status: "current" },
    { icon: Mail, label: "Email Delivery", status: "pending" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold text-white mb-2">🎉 Payment Successful!</h1>
            <p className="text-xl text-gray-300">
              Thank you for your purchase. Your complete report is being processed.
            </p>
          </div>

          {/* Main Content Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              {/* Report Delivery Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">📩 Complete Report Delivery</h2>
                <p className="text-lg text-gray-600 mb-6">
                  <strong>Estimated Delivery:</strong> Within 7 days
                </p>

                {/* Process Steps */}
                <div className="space-y-4">
                  {processSteps.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`flex items-center p-4 rounded-lg border-2 ${
                          step.status === "completed"
                            ? "bg-green-50 border-green-200"
                            : step.status === "current"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 mr-3 ${
                            step.status === "completed"
                              ? "text-green-600"
                              : step.status === "current"
                                ? "text-blue-600"
                                : "text-gray-400"
                          }`}
                        />
                        <span
                          className={`font-semibold ${
                            step.status === "completed"
                              ? "text-green-800"
                              : step.status === "current"
                                ? "text-blue-800"
                                : "text-gray-600"
                          }`}
                        >
                          {step.label}
                        </span>
                        {step.status === "completed" && <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />}
                        {step.status === "current" && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full ml-auto"
                          />
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">📦 What's Included</h3>
                <div className="space-y-3">
                  {reportItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Important Notice */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8"
              >
                <div className="flex items-start">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notice</h4>
                    <p className="text-yellow-700 leading-relaxed">
                      Please check your email regularly, including your spam/junk folder. The report will be sent from a
                      secure email address.
                      <br />
                      <strong>If you don't receive it within 7 days, please contact our support team.</strong>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Security Badges */}
              <div className="flex justify-center items-center space-x-6 mb-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1 text-green-600" />
                  SSL Secured
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-blue-600" />
                  Verified Payment
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-purple-600" />
                  Email Protected
                </div>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />← Back to Home
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8 text-gray-400 text-sm"
          >
            <p>
              Need help? Contact our support team at{" "}
              <a href="mailto:support@tindercheck.online" className="text-blue-400 hover:underline">
                support@tindercheck.online
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
