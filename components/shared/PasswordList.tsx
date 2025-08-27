import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordEntry } from "@/types";

interface PasswordListProps {
  passwords: PasswordEntry[];
  onViewPassword: (password: PasswordEntry) => void;
  onDeletePassword: (password: PasswordEntry) => void;
  loading?: boolean;
}

export function PasswordList({ 
  passwords, 
  onViewPassword, 
  onDeletePassword, 
  loading = false 
}: PasswordListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPasswords = passwords.filter((password) =>
    password.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (password.platform_username && password.platform_username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (password.platform_url && password.platform_url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search passwords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {filteredPasswords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {searchTerm ? "No passwords found matching your search." : "No passwords saved yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPasswords.map((password) => (
            <Card key={password.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{password.platform}</span>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewPassword(password)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDeletePassword(password)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {password.platform_username && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Username:</strong> {password.platform_username}
                  </p>
                )}
                {password.platform_url && (
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>URL:</strong> {password.platform_url}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Added: {new Date(password.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
