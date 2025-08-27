"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; // if you have shadcn slider
import { Eye, EyeOff, Copy, Save,ClipboardCheck } from "lucide-react";
import zxcvbn from "zxcvbn";
import { AddPasswordModal } from "../AddPasswordModal";

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
    const[copied,setCopied]=useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const generatePassword = () => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_-+=<>?";

    let newPass = "";
    for (let i = 0; i < length; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true); // show toast
      setTimeout(() => setCopied(false), 3000);
       
  };

  const strength = password ? zxcvbn(password).score : -1;
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Password Generator</h2>
      <p className="text-muted-foreground">
        Generate and save strong passwords
      </p>

      {/* Length Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Password Length: {length}</label>
        <Slider
          min={6}
          max={50}
          step={1}
          value={[length]}
          onValueChange={(val) => setLength(val[0])}
        />
      </div>

      {/* Options */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeUpper}
            onChange={(e) => setIncludeUpper(e.target.checked)}
          />
          <span>Uppercase</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
          />
          <span>Numbers</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
          />
          <span>Symbols</span>
        </label>
      </div>

      {/* Generate Button */}
      <Button onClick={generatePassword} className="w-full">
        Generate Password
      </Button>

      {/* Generated Password */}
      {password && (
        <div className="p-4 border rounded-lg bg-card space-y-3">
          <div className="flex items-center justify-between">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
            {copied ? (
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <ClipboardCheck size={18} />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy size={18} />
              </Button>
            )}
          </div>
          {/* Strength Indicator */}
          <div>
            <p className="text-sm font-medium">
              Strength: {strength >= 0 ? strengthLabels[strength] : "N/A"}
            </p>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${
                  strength === 0
                    ? "bg-red-500"
                    : strength === 1
                    ? "bg-orange-500"
                    : strength === 2
                    ? "bg-yellow-500"
                    : strength === 3
                    ? "bg-green-400"
                    : "bg-green-600"
                }`}
                style={{ width: `${(strength + 1) * 20}%` }}
              ></div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={() => setOpenModal(true)}
            className="w-full flex items-center gap-2"
          >
            <Save size={18} /> Save Password
          </Button>
        </div>
      )}

      {/* Modal */}
      <AddPasswordModal
        open={openModal}
        onOpenChange={setOpenModal}
        onPasswordAdded={() => setOpenModal(false)}
        initialPassword={password} // pass down generated password
      />
      {copied && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-100 opacity-100">
          Password copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
