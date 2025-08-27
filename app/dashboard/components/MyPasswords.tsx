"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Eye, Trash, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import axios from "axios";
import { ViewPasswordModal } from "../ViewPasswordModal";
import DeletePasswordModal from "../DeletePasswordModal";
import { AddPasswordModal } from "../AddPasswordModal";
import { UpdatePasswordModal } from "../UpdatePasswordModal";

export default function MyPasswordsSection() {
  const [openAddPassword, setOpenAddPassword] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [passwordEntry, setPasswordEntry] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ignoreLoading, setIgnoreLoading] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<any>(null);
  const [selectDeletePassword, setSelectedDeletePassword] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("recentlyAdded");
  const [selectedUpdatePassword, setSelectedUpdatePassword] = useState<any>(null);

  const now = new Date();
  const REMINDER_DAYS = 45;

  // Filter and sort passwords
  const filteredPasswords = passwordEntry
    .filter(
      (p) =>
        p.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
  const lastUpdatedA = new Date(a.lastUpdated).getTime();
  const lastUpdatedB = new Date(b.lastUpdated).getTime();
  const createdAtA = new Date(a.createdAt).getTime();
  const createdAtB = new Date(b.createdAt).getTime();

  const diffDaysA = (now.getTime() - lastUpdatedA) / (1000 * 60 * 60 * 24);
  const diffDaysB = (now.getTime() - lastUpdatedB) / (1000 * 60 * 60 * 24);

  switch (sortOrder) {
    case "recentlyAdded":
      return createdAtB - createdAtA;
    case "oldestAdded":
      return createdAtA - createdAtB;
    case "lastUpdated":
      return lastUpdatedB - lastUpdatedA;
    case "oldestUpdated":
      return lastUpdatedA - lastUpdatedB;
    case "needsUpdate":
      const needsUpdateA = diffDaysA > REMINDER_DAYS;
      const needsUpdateB = diffDaysB > REMINDER_DAYS;

      if (needsUpdateA && needsUpdateB) return lastUpdatedB - lastUpdatedA; // both need update, sort by lastUpdated
      if (needsUpdateA) return -1; // only A needs update
      if (needsUpdateB) return 1;  // only B needs update
      return 0; // neither needs update
    default:
      return createdAtB - createdAtA;
  }

    });

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

  const handleIgnoreReminder = async (passwordId: string) => {
    try {
      setIgnoreLoading(true);
      await axios.post("/api/passwords/ignoreRemainder", { passwordId });
      // Update local state directly
      setPasswordEntry((prev) =>
        prev.map((p) =>
          p.id === passwordId ? { ...p, ignoreReminder: true } : p
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIgnoreLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Passwords</h2>
          <p className="text-muted-foreground">Manage your secure credentials</p>
        </div>
        <Button onClick={() => setOpenAddPassword(true)}>
          <Plus size={18} className="mr-2" />
          Add Password
        </Button>
      </div>

      {/* Search Bar + Sort */}
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

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="ml-4 border rounded-md p-2 text-sm bg-background"
        >
          <option value="recentlyAdded">Recently Added</option>
          <option value="oldestAdded">Oldest First</option>
          <option value="lastUpdated">Last Updated</option>
          <option value="oldestUpdated">Oldest Last Updated</option>
          <option value="needsUpdate">Needs Update</option>
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
          filteredPasswords.map((entry) => {
            const lastUpdatedDate = new Date(entry.lastUpdated);
            const diffDays = Math.floor(
              (now.getTime() - lastUpdatedDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            const showReminder =
              diffDays >= REMINDER_DAYS && !entry.ignoreReminder;

            return (
              <Card
                key={entry.id}
                className={`hover:shadow-md transition-shadow ${
                  showReminder ? "bg-red-100 border-2 border-red-500" : ""
                }`}
                title={showReminder ? "Password needs updating" : ""}
              >
                <CardHeader className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Lock className="text-white" size={18} />
                  </div>
                  <div>
                    <CardTitle>{entry.platform}{showReminder?": ⚠️ Update Required":""}</CardTitle>
                    <p
                      className={`text-xs ${
                        showReminder ? "text-black" : "text-muted-foreground"
                      }`}
                    >
                      Created {new Date(entry.createdAt).toLocaleDateString()}
                      <br />
                      Last Updated {diffDays} day{diffDays > 1 ? "s" : ""} ago
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="flex justify-end space-x-1 items-center">
                  {showReminder && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIgnoreReminder(entry.id)}
                      title="Ignore reminder"
                      disabled={ignoreLoading}
                    >
                      {ignoreLoading ? <Spinner size={14} /> : "Ignore"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUpdatePassword(entry)}
                    className="flex items-center space-x-1 cursor-pointer"
                  >
                    <Lock size={14} />
                    <span>Update</span>
                  </Button>
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
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm col-span-full text-center">
            No results found.
          </p>
        )}

        {/* Modals */}
        {selectDeletePassword && (
          <DeletePasswordModal
            open={!!selectDeletePassword}
            onOpenChange={() => setSelectedDeletePassword(false)}
            passwordEntry={selectDeletePassword}
            onPasswordDeleted={() => setRefresh((prev) => prev + 1)}
          />
        )}
        {selectedPassword && (
          <ViewPasswordModal
            open={!!selectedPassword}
            onOpenChange={() => setSelectedPassword(null)}
            passwordEntry={selectedPassword}
          />
        )}
        {selectedUpdatePassword && (
          <UpdatePasswordModal
            open={!!selectedUpdatePassword}
            onOpenChange={() => setSelectedUpdatePassword(null)}
            passwordEntry={selectedUpdatePassword}
            onPasswordUpdated={() => setRefresh((prev) => prev + 1)}
          />
        )}
      </div>

      {/* Add New Password Placeholder */}
      <Card
        className="border-dashed hover:border-blue-500/20 transition-colors cursor-pointer"
        onClick={() => setOpenAddPassword(true)}
      >
        <CardContent className="flex flex-col items-center justify-center text-center py-10 hover:bg-blue-500/10 rounded-xl">
          <Plus size={24} className="mb-2 text-muted-foreground" />
          <p className="font-medium">Add New Password</p>
          <p className="text-sm text-muted-foreground">
            Store a new secure credential
          </p>
        </CardContent>
      </Card>

      {/* Add Password Modal */}
      {openAddPassword && (
        <AddPasswordModal
          open={openAddPassword}
          onOpenChange={setOpenAddPassword}
          onPasswordAdded={() => setRefresh((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
