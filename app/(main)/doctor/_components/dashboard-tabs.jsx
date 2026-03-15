"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";

export function DoctorDashboardTabs({ children, ...props }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            <div className="md:col-span-1 bg-muted/30 border h-40 rounded-md" />
            <div className="md:col-span-3 h-96 bg-muted/20 rounded-md" />
        </div>;
    }

    return (
        <Tabs {...props}>
            {children}
        </Tabs>
    );
}
