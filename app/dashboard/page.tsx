"use client";

import { useState,useEffect } from "react";
import {
  Menu,
  X,
  Plus,
  Eye,
  LogOut,
  Sun,
  Moon,
  Lock,
  Search,
  Settings,
  User,
  Shield,
  Trash,
  Brain,
  ShieldAlert 
} from "lucide-react";
import { AddPasswordModal } from "./AddPasswordModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "axios";
import { ViewPasswordModal } from "./ViewPasswordModal";
import DeletePasswordModal from "./DeletePasswordModal";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { signOut } from "next-auth/react";

const Dashboard = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [openAddPassword, setOpenAddPassword] = useState(false);
  const [openView, setOpenView] = useState(false);
const [passwordEntry, setPasswordEntry] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [selectedPassword, setSelectedPassword] = useState<any>(null);
const[refresh,setRefresh]=useState(0);
const[selectDeletePassword,setSelectedDeletePassword]=useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
const[logout,setLogout]=useState(false)
const filteredPasswords = passwordEntry
  .filter(
    (p) =>
      p.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortOrder === "desc") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  const toggleView = () => {
    setOpenView(!openView);
  };
  const toggleAddPassword = () => {
    setOpenAddPassword(!openAddPassword);
  };
  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);
  const handleLogOut = async()=>{
    setLogout(true);
    await signOut({ callbackUrl: "/login" });
  }

  useEffect(() => {
  const fetchPasswords = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/passwords/fetch");
      setPasswordEntry(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchPasswords();
}, [refresh]);
  

  const sidebarItems = [
    { icon: Lock, label: "My Passwords", active: true },
    { icon: Shield, label: "Password Generator", active: false },
    { icon: ShieldAlert , label: "Strength Checker", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-background transition-colors duration-200">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                {sidebarExpanded ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <h1 className="text-xl font-bold">Lockify 🔒</h1>
            </div>

            <div className="flex items-center space-x-2">
              
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleLogOut}
              >
                <LogOut size={18} />
                <span>Log out</span>
              </Button>
            </div>
          </div>
        </nav>

        <div className="flex pt-16">
          {/* Sidebar */}
          <aside
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-card transition-all duration-300 ease-in-out z-40 ${
              sidebarExpanded ? "w-64" : "w-16"
            }`}
          >
            <div className="p-4 space-y-2">
              {sidebarItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active ? "secondary" : "ghost"}
                  className="w-full justify-start space-x-3"
                >
                  <item.icon size={20} />
                  {sidebarExpanded && <span>{item.label}</span>}
                </Button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main
            className={`flex-1 transition-all duration-300 ${
              sidebarExpanded ? "ml-64" : "ml-16"
            } p-6`}
          >
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Your Passwords</h2>
                  <p className="text-muted-foreground">
                    Manage your secure credentials
                  </p>
                </div>
                <Button onClick={toggleAddPassword}>
                  <Plus size={18} className="mr-2" />
                  Add Password
                </Button>
              </div>

              {/* Search Bar */}
             <div className="flex items-center justify-between">
  <div className="relative w-full max-w-sm">
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      size={18}
    />
    <Input
      placeholder="Search passwords..."
      className="pl-10"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Sort dropdown */}
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
    className="ml-4 border rounded-md p-2 text-sm bg-background"
  >
    <option value="desc">Recently Added</option>
    <option value="asc">Oldest First</option>
  </select>
</div>

              {/* Password Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {loading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-lg">
        <Spinner />
        <p>Loading Your Passwords</p>
      </div>
    </div>
  ) : filteredPasswords.length > 0 ? (
    filteredPasswords.map((entry) => (
      <Card key={entry.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Lock className="text-white" size={18} />
          </div>
          <div>
            <CardTitle>{entry.platform}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Created {new Date(entry.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedPassword(entry)}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <Eye size={14} />
            <span>View</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedDeletePassword(entry)}
            className="flex items-center space-x-1 cursor-pointer"
          >
            <Trash size={14} />
            <span>Delete</span>
          </Button>
        </CardContent>
      </Card>
    ))
  ) : (
    <p className="text-muted-foreground text-sm col-span-full text-center">
      No results found.
    </p>
  )}

{selectDeletePassword && (
  <DeletePasswordModal
  open={!!selectDeletePassword}
  onOpenChange={()=>setSelectedDeletePassword(false)}
  passwordEntry={selectDeletePassword}
  onPasswordDeleted={() => setRefresh(prev => prev + 1)}
  />
)}
{selectedPassword && (
  <ViewPasswordModal
    open={!!selectedPassword}
    onOpenChange={() => setSelectedPassword(null)}
    passwordEntry={selectedPassword}
  />
)}
              </div>

              {/* Add New Password Placeholder */}
              <Card
                className="border-dashed hover:border-blue-500/20 transition-colors cursor-pointer"
                onClick={toggleAddPassword}
              >
                <CardContent className="flex flex-col items-center justify-center text-center py-10 hover:bg-blue-500/10 rounded-xl">
                  <Plus size={24} className="mb-2 text-muted-foreground" />
                  <p className="font-medium">Add New Password</p>
                  <p className="text-sm text-muted-foreground">
                    Store a new secure credential
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      {/* Open AddPassword Modal */}
      {openAddPassword && (
        <AddPasswordModal
          open={openAddPassword}
          onOpenChange={setOpenAddPassword}
          onPasswordAdded={() => setRefresh(prev => prev + 1)}
        />
      )};
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

export default Dashboard;
