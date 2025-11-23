"use client";
import { FiShield, FiAward, FiCheckCircle, FiUsers } from "react-icons/fi";

const badges = [
    {
        icon: FiShield,
        title: "BIS Certified",
        subtitle: "Quality Assured",
    },
    {
        icon: FiAward,
        title: "11+ Years",
        subtitle: "Since 2014",
    },
    {
        icon: FiCheckCircle,
        title: "100+ Sites",
        subtitle: "Completed",
    },
    {
        icon: FiUsers,
        title: "100+ Happy",
        subtitle: "Customers",
    },
];

export default function TrustBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {badges.map((badge) => (
                <div
                    key={badge.title}
                    className="flex flex-col items-center text-center p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/50 transition-colors"
                >
                    <badge.icon className="h-8 w-8 text-primary mb-2" />
                    <div className="text-sm font-semibold text-foreground">{badge.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{badge.subtitle}</div>
                </div>
            ))}
        </div>
    );
}
