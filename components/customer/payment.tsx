import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Apple } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState("card");

  const handleMethodChange = (method: any) => {
    setSelectedMethod(method);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className=" bg-primary flex flex-1 hover:bg-primary"
        >
          Purchase
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] h-screen">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 overflow-y-auto h-full scroll-smooth">
          <h2 className="text-xl font-semibold mb-1">Payment Method</h2>
          <p className="text-slate-400 text-sm mb-4">
            Add a new payment method to your account.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <Button
              variant="outline"
              className={`h-16 flex flex-col items-center justify-center ${selectedMethod === "card" ? "border-2 border-purple-500" : "border-slate-700"}`}
              onClick={() => handleMethodChange("card")}
            >
              <CreditCard className="mb-1" />
              <span className="text-sm">Card</span>
            </Button>
            <Button
              variant="outline"
              className={`h-16 flex flex-col items-center justify-center ${selectedMethod === "paypal" ? "border-2 border-purple-500" : "border-slate-700"}`}
              onClick={() => handleMethodChange("paypal")}
            >
              {/* <wallet className="mb-1" /> */}
              <span className="text-sm">Wallet</span>
            </Button>
            <Button
              variant="outline"
              className={`h-16 flex flex-col items-center justify-center ${selectedMethod === "apple" ? "border-2 border-purple-500" : "border-slate-700"}`}
              onClick={() => handleMethodChange("apple")}
            >
              <Apple className="mb-1" />
              <span className="text-sm">Apple</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                className="bg-slate-800 border-slate-700 text-slate-100"
                placeholder="First Last"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <Input className="bg-slate-800 border-slate-700 text-slate-100" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Card number
              </label>
              <Input className="bg-slate-800 border-slate-700 text-slate-100" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expires
                </label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={(i + 1).toString().padStart(2, "0")}
                      >
                        {(i + 1).toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Year</label>
                <Select>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={(new Date().getFullYear() + i).toString()}
                      >
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CVC</label>
                <Input
                  className="bg-slate-800 border-slate-700 text-slate-100"
                  placeholder="CVC"
                />
              </div>
            </div>
          </div>

          <Button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white">
            Continue
          </Button>
        </div>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
