"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Activity, Bell, Zap, CheckCircle, Key, ArrowRight } from "lucide-react";

export default function VaultifyLanding() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Master Password Encryption",
      description: "Zero-knowledge encryption ensures we never see your passwords. You are the only key.",
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      title: "Secure Password Storage",
      description: "Store passwords with platform names and usernames, safely encrypted.",
    },
    {
      icon: <Activity className="w-6 h-6 text-white" />,
      title: "Complete Access Logs",
      description: "Track every view, update, and deletion. Full transparency for security audits.",
    },
    {
      icon: <Bell className="w-6 h-6 text-white" />,
      title: "Smart Reminders",
      description: "Get notified when passwords haven’t been updated in 45+ days.",
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "Customizable Password Generator",
      description: "Generate strong, random passwords with configurable length and character types.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      title: "Password Strength Checker",
      description: "Evaluate password strength before saving to ensure maximum security.",
    },
    {
      icon: <Key className="w-6 h-6 text-white" />,
      title: "Email Alerts",
      description: "Get instant notifications whenever a password is accessed.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-pink-700 text-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto py-32 px-6 gap-12">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-purple-100">Vaultify 🔒</h1>
          <p className="text-xl text-gray-300 max-w-lg">
            The most secure password manager with zero-knowledge encryption.
            Store, generate, and manage your passwords with military-grade security.
          </p>
          <div className="flex gap-4">
            <Link href="/login">
              <Button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 text-lg">
                Get Started <ArrowRight className="inline ml-1 w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" className="border-purple-400 text-black px-6 py-3 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="bg-white p-8 rounded-xl border border-purple-700">
          <h2 className="text-xl font-semibold mb-4 text-black">Password Vault Preview</h2>
          <div className="space-y-2 text-black">
            <div className="flex justify-between">
              <span>GitHub</span>
              <span className="text-green-600">Strong</span>
            </div>
            <div className="flex justify-between">
              <span>Gmail</span>
              <span className="text-blue-600">Very Strong</span>
            </div>
            <div className="flex justify-between">
              <span>Netflix</span>
              <span className="text-yellow-600">Medium</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-purple-100">Key Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-purple-700/20 border border-purple-600 p-6 hover:scale-105 transition-transform duration-300">
              <CardHeader className="flex items-center space-x-3 mb-4">
                {feature.icon}
                <CardTitle className="text-white text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-purple-600 text-center text-gray-400">
        &copy; 2025 Vaultify. All rights reserved. Your security is our priority.
      </footer>
    </div>
  );
}
