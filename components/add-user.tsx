"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase/client";
import { Cog, Hash } from "lucide-react";
import { useState } from "react";

export function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function hashPassword(password: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function handleSubmit() {
    const formData = {
      email: email,
      password: await hashPassword(password),
      role: role,
      address: address,
      full_name: fullName,
      phone_number: phoneNumber,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([formData])
        .select();

      if (error) throw error;

      console.log("User added successfully", data);
      setEmail("");
      setPassword("");
      setRole("");
      setAddress("");
      setFullName("");
      setPhoneNumber("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Add User</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add User</SheetTitle>
          <SheetDescription>
            Add a new user to the system.
            <br />
            Fill in the form below to create a new user.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="">
            <Label htmlFor="full_name" className="text-right">
              Full Name
            </Label>
            <Input
              id="full_name"
              className="col-span-3"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <select
              id="role"
              className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
              <option value="customer">Customer</option>
            </select>
          </div>
          <div className="">
            <Label htmlFor="phone_number" className="text-right">
              Phone Number
            </Label>
            <Input
              id="phone_number"
              type="tel"
              className="col-span-3"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              className="col-span-3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="">
            <Label htmlFor="full_name" className="text-right">
              Password
            </Label>
            <Input
              id="full_name"
              className="col-span-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="">
            <Label htmlFor="confirm_password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm_password"
              className="col-span-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={() => {
                handleSubmit();
              }}
            >
              Add User
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
