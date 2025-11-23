"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiX, FiCalendar } from "react-icons/fi";

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Check if user has already seen the popup in this session
        const hasSeenPopup = sessionStorage.getItem("exitPopupShown");
        if (hasSeenPopup) return;

        let exitIntent = false;

        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger if mouse is leaving towards the top of the page
            if (e.clientY <= 0 && !exitIntent) {
                exitIntent = true;
                setIsVisible(true);
                sessionStorage.setItem("exitPopupShown", "true");
            }
        };

        const handleManualTrigger = () => {
            if (!sessionStorage.getItem("exitPopupShown")) {
                setIsVisible(true);
                sessionStorage.setItem("exitPopupShown", "true");
            }
        };

        const handlePopState = (e: PopStateEvent) => {
            // Intercept the back button
            if (!sessionStorage.getItem("exitPopupShown")) {
                setIsVisible(true);
                sessionStorage.setItem("exitPopupShown", "true");
                // We don't need to preventDefault; the browser has already navigated back 
                // to the previous history entry (which we duplicated), so the user stays on the page.
            }
        };

        // Start listening immediately
        document.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("triggerExitIntent", handleManualTrigger);

        // Back Button Capture Strategy
        // Push a duplicate state so the first "back" click fires popstate but stays on the URL
        // We do this on every route change to ensure the "trap" is always at the top of the stack
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("triggerExitIntent", handleManualTrigger);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [pathname]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would send the email to your CRM/email service
        console.log("Exit intent lead captured:", email);

        setIsSubmitted(true);

        // Close after 3 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 3000);
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors z-10"
                    aria-label="Close"
                >
                    <FiX className="h-5 w-5" />
                </button>

                <div className="p-5 md:p-8">
                    {!isSubmitted ? (
                        <>
                            <div className="text-center mb-6">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4">
                                    <FiCalendar className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Wait! Don't miss out...
                                </h2>
                                <p className="text-muted-foreground">
                                    Get a <strong>Free Site Survey & Custom Quote</strong> today. No obligation!
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl p-4 mb-6">
                                <ul className="space-y-2 text-sm text-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Expert site feasibility check</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Shadow analysis & generation report</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Accurate cost & subsidy estimation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-600 mt-0.5">✓</span>
                                        <span>Best price guarantee</span>
                                    </li>
                                </ul>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-blue-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    <FiCalendar className="h-5 w-5" />
                                    Book Free Survey
                                </button>
                                <p className="text-xs text-center text-muted-foreground">
                                    We respect your privacy. No spam.
                                </p>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">Request Received!</h3>
                            <p className="text-muted-foreground">
                                We'll contact you shortly at <strong>{email}</strong> to schedule your survey.
                            </p>
                            <p className="text-sm text-muted-foreground mt-4">
                                This window will close automatically...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
