"use client";
import { useState } from "react";
import { FiX, FiTrendingUp, FiSun, FiHome, FiBriefcase, FiInfo } from "react-icons/fi";

interface SolarCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
}

type ConsumerType = 'residential' | 'commercial';

export default function SolarCalculator({ isOpen, onClose }: SolarCalculatorProps) {
    const [step, setStep] = useState(1);
    const [billAmount, setBillAmount] = useState("");
    const [consumerType, setConsumerType] = useState<ConsumerType>('residential');
    const [roofSize, setRoofSize] = useState("");
    const [email, setEmail] = useState("");
    const [showResults, setShowResults] = useState(false);

    if (!isOpen) return null;

    const calculateSavings = () => {
        const bill = parseInt(billAmount) || 0;
        const isRes = consumerType === 'residential';

        // Industry Standard Assumptions for Maharashtra
        const tariff = isRes ? 10 : 14; // Avg tariff per unit
        const unitsConsumed = bill / tariff;

        // System Sizing: 1kW generates ~4 units/day => ~120 units/month
        // We size the system to offset ~100% of consumption
        let systemSize = Math.ceil((unitsConsumed / 120) * 2) / 2; // Round to nearest 0.5 kW
        if (systemSize < 1) systemSize = 1; // Minimum 1kW

        // Dynamic Pricing Logic (Economies of Scale)
        let grossCost = 0;
        if (isRes) {
            // Residential Tiered Pricing
            if (systemSize <= 1) grossCost = systemSize * 85000;
            else if (systemSize <= 2) grossCost = systemSize * 75000;
            else if (systemSize <= 3) grossCost = systemSize * 70000;
            else if (systemSize <= 10) grossCost = systemSize * 60000;
            else grossCost = systemSize * 55000; // >10kW
        } else {
            // Commercial Tiered Pricing
            if (systemSize <= 10) grossCost = systemSize * 65000;
            else if (systemSize <= 50) grossCost = systemSize * 55000;
            else grossCost = systemSize * 45000; // >50kW
        }

        // PM Surya Ghar Subsidy Calculation (Residential Only)
        let subsidy = 0;
        if (isRes) {
            if (systemSize <= 2) {
                subsidy = systemSize * 30000;
            } else if (systemSize <= 3) {
                subsidy = 60000 + ((systemSize - 2) * 18000);
            } else {
                subsidy = 78000; // Capped at 3kW subsidy
            }
        }

        const netCost = grossCost - subsidy;
        const monthlyGeneration = systemSize * 120; // Units
        const monthlySavings = Math.round(monthlyGeneration * tariff);
        const yearlySavings = monthlySavings * 12;

        // ROI
        const paybackYears = (netCost / yearlySavings).toFixed(1);
        const roi = Math.round((yearlySavings / netCost) * 100);
        const co2Offset = (systemSize * 1.2).toFixed(1); // Tons per year

        return {
            systemSize,
            grossCost,
            subsidy,
            netCost,
            monthlySavings,
            yearlySavings,
            paybackYears,
            roi,
            co2Offset
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && billAmount) {
            setStep(2);
        } else if (step === 2 && email) {
            setShowResults(true);
            console.log('Lead captured:', { billAmount, consumerType, roofSize, email });
        }
    };

    const results = calculateSavings();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-border">
                <div className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-secondary/20">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FiTrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground">Solar Savings Calculator</h2>
                            <p className="text-xs text-muted-foreground">Based on Maharashtra Tariff & PM Surya Ghar Scheme</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-secondary rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-4 md:p-6">
                    {!showResults ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <>
                                    {/* Consumer Type Toggle */}
                                    <div className="grid grid-cols-2 gap-4 p-1 bg-secondary/50 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => setConsumerType('residential')}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${consumerType === 'residential'
                                                ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <FiHome /> Residential
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setConsumerType('commercial')}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${consumerType === 'commercial'
                                                ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                                                : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            <FiBriefcase /> Commercial
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Average Monthly Electricity Bill
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                                            <input
                                                type="number"
                                                value={billAmount}
                                                onChange={(e) => setBillAmount(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                                                placeholder="e.g., 3000"
                                                required
                                                min="500"
                                                max="1000000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Available Roof Space (Optional)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={roofSize}
                                                onChange={(e) => setRoofSize(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="e.g., 400"
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">sq ft</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                    >
                                        Calculate Savings
                                    </button>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/10 rounded-xl p-6 space-y-6">
                                        <div className="flex items-center gap-3 text-primary border-b border-primary/10 pb-4">
                                            <FiSun className="h-6 w-6" />
                                            <h3 className="text-lg font-bold">Estimated System Design</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-1">Recommended System</div>
                                                <div className="text-3xl font-bold text-foreground">{results.systemSize} kW</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground mb-1">Annual Savings</div>
                                                <div className="text-3xl font-bold text-green-600">₹{results.yearlySavings.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Estimated Project Cost:</span>
                                                <span className="font-medium">₹{results.grossCost.toLocaleString()}</span>
                                            </div>
                                            {results.subsidy > 0 && (
                                                <div className="flex justify-between text-sm text-green-600">
                                                    <span className="flex items-center gap-1"><FiInfo className="w-3 h-3" /> Govt. Subsidy (Estimated):</span>
                                                    <span className="font-bold">- ₹{results.subsidy.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-base border-t border-border pt-3">
                                                <span className="font-bold text-foreground">Net Investment:</span>
                                                <span className="font-bold text-primary">₹{results.netCost.toLocaleString()}</span>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground text-center pt-2">
                                                * This is an estimated cost. Actual project costing will differ based on current market prices and specific site conditions.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            📧 <strong>Get the full breakdown!</strong> Enter your email to receive this detailed ROI report and a formal quote.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            Get Detailed Report
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    ) : (
                        <div className="text-center space-y-6 py-4">
                            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto animate-in zoom-in duration-300">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Report Sent!</h3>
                                <p className="text-muted-foreground">
                                    We've sent the detailed analysis to <strong>{email}</strong>
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="bg-secondary/30 p-4 rounded-xl">
                                    <div className="text-sm text-muted-foreground">Payback Period</div>
                                    <div className="text-2xl font-bold text-foreground">{results.paybackYears} Years</div>
                                </div>
                                <div className="bg-secondary/30 p-4 rounded-xl">
                                    <div className="text-sm text-muted-foreground">ROI</div>
                                    <div className="text-2xl font-bold text-green-600">{results.roi}%</div>
                                </div>
                                <div className="bg-secondary/30 p-4 rounded-xl">
                                    <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                                    <div className="text-2xl font-bold text-foreground">{results.co2Offset} Tons</div>
                                </div>
                                <div className="bg-secondary/30 p-4 rounded-xl">
                                    <div className="text-sm text-muted-foreground">Monthly Savings</div>
                                    <div className="text-2xl font-bold text-primary">₹{results.monthlySavings.toLocaleString()}</div>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground pt-4">
                                One of our solar engineers will be in touch shortly to verify site feasibility.
                            </p>
                            <button
                                onClick={onClose}
                                className="w-full bg-secondary text-foreground font-semibold py-3 rounded-lg hover:bg-secondary/80 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
