"use client";
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Shield, AlertTriangle, Check, X } from "lucide-react";
import zxcvbn from "zxcvbn";

interface PasswordStrengthProps {
  onPasswordChange?: (password: string, strength: number) => void;
}

export default function PasswordStrengthChecker({ onPasswordChange }: PasswordStrengthProps) {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [breached, setBreached] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // HIBP breach check using k-Anonymity
  const checkPasswordBreached = async (pwd: string) => {
    try {
      const crypto = await import("crypto");
      const sha1 = crypto.createHash("sha1").update(pwd).digest("hex").toUpperCase();
      const prefix = sha1.slice(0, 5);
      const suffix = sha1.slice(5);

      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await res.text();
      const found = text.split("\n").some(line => line.split(":")[0] === suffix);
      setBreached(found);
    } catch (err) {
      console.error(err);
      setBreached(null);
    }
  };

  useEffect(() => {
    const result = zxcvbn(password);
    setStrength(result.score);
    setFeedback(result.feedback.warning || result.feedback.suggestions.slice(0, 2).join(", "));
    onPasswordChange?.(password, result.score);

    if (password.length > 0) checkPasswordBreached(password);
    else setBreached(null);
  }, [password, onPasswordChange]);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "";
    }
  };

  const getProgressValue = (score: number) => password.length === 0 ? 0 : (score + 1) * 20;

  const handleCopy = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password');
      }
    }
  };

  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) }
  ];

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Password Strength Checker</h2>
          <p className="text-gray-600">Enter a password to check its security</p>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-20 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={handleCopy}
                disabled={!password}
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : ''}`} />
              </Button>
            </div>
          </div>
          {copied && (
            <p className="text-sm text-green-600 flex items-center">
              <Check className="w-4 h-4 mr-1" />
              Password copied!
            </p>
          )}
        </div>

        {/* Strength Indicator */}
        {password && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Strength: <span className={`font-semibold ${
                  strength <= 1 ? 'text-red-600' : 
                  strength === 2 ? 'text-yellow-600' : 
                  strength === 3 ? 'text-green-600' : 'text-purple-600'
                }`}>{getStrengthLabel(strength)}</span>
              </span>
              {breached !== null && (
                <span className={`text-sm font-semibold flex items-center ${
                  breached ? "text-red-600" : "text-green-600"
                }`}>
                  {breached ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Compromised
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Secure
                    </>
                  )}
                </span>
              )}
            </div>
            <Progress value={getProgressValue(strength)} className="h-2" />
            {feedback && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                💡 {feedback}
              </p>
            )}
          </div>
        )}

        {/* Password Requirements */}
        {password && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Password Requirements</h4>
            <div className="grid gap-2">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {req.met ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
