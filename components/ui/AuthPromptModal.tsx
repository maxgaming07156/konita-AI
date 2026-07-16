"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogIn, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthPromptModal({ 
  isOpen, 
  onClose,
  title = "Sign in to save progress",
  description = "Create a free account to save your vocabulary, track your streak, and access your translation history across all devices."
}: AuthPromptModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-base-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-base-900 p-6 shadow-2xl sm:p-8"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-mist-400 transition-colors hover:bg-white/5 hover:text-mist-100"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <LogIn className="h-6 w-6" />
              </div>
              
              <h2 className="mb-2 font-display text-2xl font-semibold text-mist-100">
                {title}
              </h2>
              <p className="mb-8 text-mist-400">
                {description}
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => signIn("google", { callbackUrl: "/tutor" })}
                  className="w-full justify-center"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in with Google
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={onClose}
                  className="w-full justify-center"
                >
                  Continue as guest
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
