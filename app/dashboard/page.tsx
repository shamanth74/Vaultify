"use client";

import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Lock,
  User,
  Shield,
  ShieldAlert,
  Bell,
  Logs 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { useSession,signOut } from "next-auth/react";
import MyPasswordsSection from "./components/MyPasswords";
import PasswordGenerator from "./components/PasswordGenerator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PasswordStrengthChecker from "./components/PasswordStrengthChecker";
export default function DashBoard() {
  const { data: session, status } = useSession()
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("passwords");
  
const[logout,setLogout]=useState(false)

  
  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);
  const handleLogOut = async()=>{
    setLogout(true);
    await signOut({ callbackUrl: "/" });
  }

  const sidebarItems = [
    { icon: Lock, label: "My Passwords", key: "passwords" },
    { icon: Shield, label: "Password Generator", key: "generator" },
    { icon: ShieldAlert, label: "Strength Checker", key: "checker" },
    // { icon: Logs  , label: "Access Logs", key: "remainder" },
  ];

  return (
    <div className={`min-h-screen }`}>
      <div className="min-h-screen bg-background transition-colors duration-200">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                {sidebarExpanded ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <h1 className="text-xl font-bold">Vaultify 🔒</h1>
            </div>

            <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User size={25} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium">{session?.user?.email}</p>
                
              </div>
              <DropdownMenuItem
                onClick={handleLogOut}
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
          </div>
        </nav>

        {/* Sidebar */}
        <div className="flex pt-16">
          <aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300 ease-in-out z-40 ${
              sidebarExpanded ? "w-64" : "w-16"
            }`}
          >
            <div className="p-4 space-y-2">
              {sidebarItems.map((item, index) => (
                <Button
                  key={item.key}
                  variant={activeSection === item.key ? "secondary" : "ghost"}
                  className="w-full justify-start space-x-3"
                  onClick={() => setActiveSection(item.key)}
                >
                  <item.icon size={20} />
                  {sidebarExpanded && <span>{item.label}</span>}
                </Button>
              ))}
            </div>
          </aside>

              {/* The main Component  */}
          <main
            className={`flex-1 transition-all duration-300 ${
              sidebarExpanded ? "ml-64" : "ml-16"
            } p-6`}
          >
            {activeSection === "passwords" && <MyPasswordsSection />}
            {activeSection === "generator" && <PasswordGenerator />}
            {activeSection === "checker" && <PasswordStrengthChecker />}
          </main>
        </div>
      </div>

      {/* Log Out Section */}
      {logout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-lg">
            <Spinner />
            <p>Logging You Out</p>
          </div>
        </div>
      )}
    </div>
  );
};
