"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export function DoctorEarnings({ earnings, payouts }) {
    const totalCredits = earnings?.totalCredits || 0;
    const appointmentsCount = earnings?.appointmentsCount || 0;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-emerald-900/20 bg-emerald-950/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-400">Total Credits Earned</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalCredits}</div>
                        <p className="text-xs text-emerald-500/60 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            From {appointmentsCount} completed appointments
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-emerald-900/20 bg-zinc-900/50">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-white">Earnings History</CardTitle>
                </CardHeader>
                <CardContent>
                    {earnings?.appointments?.length > 0 ? (
                        <div className="space-y-4">
                            {earnings.appointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-emerald-900/20 text-emerald-400">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Appointment Earning</p>
                                            <p className="text-xs text-zinc-500">{format(new Date(apt.date), 'PPp')}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-emerald-400">
                                        +2 Credits
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-zinc-500">
                            No earnings history available yet.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-emerald-900/20 bg-zinc-900/50">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-white">Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                    {payouts.length > 0 ? (
                        <div className="space-y-4">
                            {payouts.map((payout) => (
                                <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-blue-900/20 text-blue-400">
                                            <ArrowDownRight className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Withdrawal</p>
                                            <p className="text-xs text-zinc-500">{format(new Date(payout.createdAt), 'PPp')}</p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-blue-400">
                                        -{payout.amount} Credits
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-zinc-500">
                            No payout history available yet.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
