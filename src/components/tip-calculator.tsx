"use client";

import { useState, useEffect, useMemo } from "react";
import { DollarSign, Users, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const tipOptions = [5, 10, 15, 20, 25];

export function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [customTipPercent, setCustomTipPercent] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isCustomTip, setIsCustomTip] = useState(false);

  const handleBillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBill(e.target.value.replace(/[^0-9.]/g, ''));
  };

  const handlePeopleChange = (value: number) => {
    if (value >= 1) {
      setNumberOfPeople(value);
    }
  };
  
  const handleSelectTip = (tip: number) => {
    setTipPercent(tip);
    setCustomTipPercent("");
    setIsCustomTip(false);
  };

  const handleCustomTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomTipPercent(value);
    setTipPercent(0);
    setIsCustomTip(true);
  }

  const billAmount = useMemo(() => parseFloat(bill) || 0, [bill]);
  const finalTipPercent = useMemo(() => (isCustomTip ? parseFloat(customTipPercent) : tipPercent) || 0, [isCustomTip, customTipPercent, tipPercent]);

  const tipAmountPerPerson = useMemo(() => {
    if (billAmount > 0 && numberOfPeople > 0) {
      return (billAmount * (finalTipPercent / 100)) / numberOfPeople;
    }
    return 0;
  }, [billAmount, finalTipPercent, numberOfPeople]);

  const totalPerPerson = useMemo(() => {
    if (billAmount > 0 && numberOfPeople > 0) {
      const tipTotal = billAmount * (finalTipPercent / 100);
      return (billAmount + tipTotal) / numberOfPeople;
    }
    return 0;
  }, [billAmount, finalTipPercent, numberOfPeople]);

  const resetCalculator = () => {
    setBill("");
    setTipPercent(15);
    setCustomTipPercent("");
    setNumberOfPeople(1);
    setIsCustomTip(false);
  };
  
  useEffect(() => {
    if (billAmount === 0 && (customTipPercent || bill)) {
        resetCalculator();
    }
  }, [billAmount, customTipPercent, bill])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl mx-auto bg-card rounded-3xl shadow-2xl overflow-hidden font-headline">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">TipSplit</h1>
          <p className="text-muted-foreground">Calculate tip and split the bill</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bill" className="font-semibold">Bill Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="bill"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={bill}
              onChange={handleBillChange}
              className="pl-10 text-2xl font-semibold h-14"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-semibold">Select Tip %</Label>
          <div className="grid grid-cols-3 gap-2">
            {tipOptions.map((tip) => (
              <Button
                key={tip}
                variant={tipPercent === tip && !isCustomTip ? "default" : "outline"}
                onClick={() => handleSelectTip(tip)}
                className="h-12 text-lg"
              >
                {tip}%
              </Button>
            ))}
             <Input
                type="text"
                inputMode="numeric"
                placeholder="Custom"
                value={customTipPercent}
                onChange={handleCustomTipChange}
                className={cn(
                    "h-12 text-lg text-center",
                    isCustomTip ? "ring-2 ring-primary border-primary" : ""
                )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="people" className="font-semibold">Number of People</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="people"
              type="number"
              value={numberOfPeople}
              onChange={(e) => handlePeopleChange(parseInt(e.target.value) || 1)}
              className="pr-24 text-center text-2xl font-semibold h-14"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
                 <Button variant="ghost" size="icon" onClick={() => handlePeopleChange(numberOfPeople - 1)}>
                    <Minus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handlePeopleChange(numberOfPeople + 1)}>
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-between rounded-t-3xl md:rounded-l-none md:rounded-r-3xl space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">Tip Amount</p>
              <p className="text-sm opacity-80">/ person</p>
            </div>
            <p className="text-4xl font-bold">${tipAmountPerPerson.toFixed(2)}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">Total</p>
              <p className="text-sm opacity-80">/ person</p>
            </div>
            <p className="text-4xl font-bold">${totalPerPerson.toFixed(2)}</p>
          </div>
        </div>
        <Button 
          onClick={resetCalculator} 
          disabled={!billAmount && !customTipPercent}
          className="w-full h-14 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 disabled:bg-primary/50 disabled:text-primary-foreground/50 disabled:cursor-not-allowed">
          RESET
        </Button>
      </div>
    </div>
  );
}
