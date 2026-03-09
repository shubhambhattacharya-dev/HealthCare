"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, CreditCard, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { updatePayoutStatus } from "@/actions/admin";

export function PendingPayouts({ payouts }) {
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [localPayouts, setLocalPayouts] = useState(payouts || []);

  const { loading, fn: submitPayoutUpdate } = useFetch(updatePayoutStatus);

  const handleUpdateStatus = async (payout, status) => {
    setSelectedPayout(payout.id);

    const formData = new FormData();
    formData.append("payoutId", payout.id);
    formData.append("status", status);

    const result = await submitPayoutUpdate(formData);

    if (result?.success) {
      const label = status === "PROCESSED" ? "Approved" : "Rejected";
      toast.success(`${label} payout for ${payout.doctorName || "doctor"}`);
      setLocalPayouts((prev) => prev.filter((p) => p.id !== payout.id));
    } else {
      toast.error(result?.error || "Something went wrong.");
    }

    setSelectedPayout(null);
  };

  const totalAmount = localPayouts.reduce(
    (sum, p) => sum + Number(String(p.amount).replace(/[^0-9.]/g, "")) || 0,
    0
  );

  return (
    <div>
      <style>{`
        .pp-wrap * { font-family: 'DM Sans', sans-serif; }
        .pp-title  { font-family: Georgia, 'Times New Roman', serif; font-weight: 800; letter-spacing: -0.03em; }

        .pp-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 14px; flex-wrap: wrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .pp-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.11);
        }

        .pp-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(110,231,183,0.15), rgba(52,211,153,0.05));
          border: 1px solid rgba(110,231,183,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .pp-amount {
          display: inline-flex; align-items: center; gap: 3px;
          background: rgba(110,231,183,0.08);
          border: 1px solid rgba(110,231,183,0.18);
          color: #6ee7b7;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          padding: 3px 10px; border-radius: 8px;
          white-space: nowrap;
        }

        .pp-btn {
          font-size: 12px !important; font-weight: 600 !important;
          padding: 5px 14px !important; border-radius: 8px !important;
          display: flex !important; align-items: center !important; gap: 5px !important;
          transition: all 0.2s ease !important; cursor: pointer;
          background: transparent !important; white-space: nowrap;
        }
        .pp-btn-approve {
          border: 1px solid rgba(52,211,153,0.28) !important;
          color: #6ee7b7 !important;
        }
        .pp-btn-approve:hover:not(:disabled) {
          background: rgba(52,211,153,0.09) !important;
          border-color: rgba(52,211,153,0.5) !important;
        }
        .pp-btn-reject {
          border: 1px solid rgba(239,68,68,0.25) !important;
          color: #f87171 !important;
        }
        .pp-btn-reject:hover:not(:disabled) {
          background: rgba(239,68,68,0.08) !important;
          border-color: rgba(239,68,68,0.45) !important;
        }

        .pp-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 64px 20px; gap: 10px;
        }
        .pp-empty-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 4px;
        }

        .pp-stat {
          flex: 1; min-width: 100px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .pp-stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800; line-height: 1; display: block;
        }
        .pp-stat-lbl {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.07em; color: #6b7280; display: block; margin-top: 2px;
        }
      `}</style>

      <div className="pp-wrap">
        <Card className="bg-muted/20 border-emerald-900/20" style={{ borderRadius: 16, overflow: 'hidden' }}>

          {/* Header */}
          <CardHeader style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <CardTitle className="pp-title" style={{ fontSize: 28, fontWeight: 800, color: '#f3f4f6', marginBottom: 4, letterSpacing: '-0.5px' }}>
              Pending Payouts
            </CardTitle>
            <CardDescription style={{ fontSize: 13, color: '#6b7280' }}>
              Review and process doctor payout requests
            </CardDescription>
          </CardHeader>

          <CardContent style={{ padding: '22px 28px 28px' }}>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="pp-stat">
                <div className="pp-stat-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Clock style={{ width: 16, height: 16, color: '#9ca3af' }} />
                </div>
                <div>
                  <span className="pp-stat-num" style={{ color: '#f9fafb' }}>{localPayouts.length}</span>
                  <span className="pp-stat-lbl">Pending</span>
                </div>
              </div>
              <div className="pp-stat">
                <div className="pp-stat-icon" style={{ background: 'rgba(110,231,183,0.08)' }}>
                  <DollarSign style={{ width: 16, height: 16, color: '#6ee7b7' }} />
                </div>
                <div>
                  <span className="pp-stat-num" style={{ color: '#6ee7b7', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
                    ${totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="pp-stat-lbl">Total ($)</span>
                </div>
              </div>
            </div>

            {/* List */}
            {localPayouts.length === 0 ? (
              <div className="pp-empty">
                <div className="pp-empty-icon">
                  <CreditCard style={{ width: 20, height: 20, color: '#4b5563' }} />
                </div>
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0, fontWeight: 500 }}>
                  No pending payouts at this time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {localPayouts.map((payout) => {
                  const isThisLoading = loading && selectedPayout === payout.id;
                  const cleanAmount = Number(String(payout.amount).replace(/[^0-9.]/g, ""));

                  return (
                    <div key={payout.id} className="pp-card">

                      {/* Left: Avatar + Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div className="pp-avatar">
                          <DollarSign style={{ width: 16, height: 16, color: '#6ee7b7' }} />
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#f9fafb', fontSize: 14, margin: '0 0 2px' }}>
                            {payout.doctorName || "Unknown Doctor"}
                          </p>
                          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                            {payout.email}
                          </p>
                        </div>
                      </div>

                      {/* Right: Amount + Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span className="pp-amount">
                          $<span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.3px' }}>{cleanAmount.toLocaleString('en-IN')}</span>
                        </span>

                        {isThisLoading ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px' }}>
                            <Loader2 style={{ width: 14, height: 14, color: '#6b7280' }} className="animate-spin" />
                            <span style={{ fontSize: 12, color: '#6b7280' }}>Processing…</span>
                          </div>
                        ) : (
                          <>
                            <Button
                              className="pp-btn pp-btn-approve"
                              size="sm"
                              onClick={() => handleUpdateStatus(payout, "PROCESSED")}
                              disabled={loading}
                            >
                              <CheckCircle style={{ width: 12, height: 12 }} />
                              Approve
                            </Button>
                            <Button
                              className="pp-btn pp-btn-reject"
                              size="sm"
                              onClick={() => handleUpdateStatus(payout, "FAILED")}
                              disabled={loading}
                            >
                              <XCircle style={{ width: 12, height: 12 }} />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}