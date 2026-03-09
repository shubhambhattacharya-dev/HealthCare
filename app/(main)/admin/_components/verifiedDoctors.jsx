"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Ban, Loader2, User, Search, Users, ShieldCheck, ShieldOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updateDoctorActiveStatus } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

export function VerifiedDoctors({ doctors }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetDoctor, setTargetDoctor] = useState(null);
  const [localDoctors, setLocalDoctors] = useState(doctors);

  const {
    loading,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorActiveStatus);

  // Sync if parent prop changes
  useEffect(() => {
    setLocalDoctors(doctors);
  }, [doctors]);

  const filteredDoctors = localDoctors.filter((doctor) => {
    const query = searchTerm.toLowerCase();
    return (
      (doctor.name || "").toLowerCase().includes(query) ||
      (doctor.specialty || "").toLowerCase().includes(query) ||
      (doctor.email || "").toLowerCase().includes(query)
    );
  });

  const handleStatusChange = async (doctor, suspend) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${suspend ? "suspend" : "reinstate"} ${doctor.name}?`
    );
    if (!confirmed || loading) return;

    const formData = new FormData();
    formData.append("doctorId", doctor.id);
    formData.append("suspend", suspend ? "true" : "false");

    setTargetDoctor(doctor);

    const result = await submitStatusUpdate(formData);

    if (result?.success) {
      toast.success(`${suspend ? "Suspended" : "Reinstated"} ${doctor.name} successfully!`);
      // Optimistic UI update
      setLocalDoctors((prev) =>
        prev.map((d) =>
          d.id === doctor.id
            ? { ...d, isActive: !suspend }
            : d
        )
      );
    } else {
      toast.error(result?.error || "Something went wrong. Please try again.");
    }

    setTargetDoctor(null);
  };

  // ✅ Fixed: use isActive field instead of verificationStatus
  const activeCount    = localDoctors.filter((d) => d.isActive !== false).length;
  const suspendedCount = localDoctors.filter((d) => d.isActive === false).length;

  return (
    <div>
      <style>{`
        .verified-wrap * { font-family: 'DM Sans', sans-serif; }
        .vd-title  { font-family: Georgia, 'Times New Roman', serif; font-weight: 800; letter-spacing: -0.03em; }

        .vd-search { position: relative; }
        .vd-search input {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 10px !important;
          color: #f3f4f6 !important;
          padding-left: 36px !important;
          font-size: 13px !important;
          height: 38px !important;
          transition: all 0.2s ease !important;
        }
        .vd-search input:focus {
          border-color: rgba(110,231,183,0.35) !important;
          background: rgba(255,255,255,0.06) !important;
          box-shadow: 0 0 0 3px rgba(110,231,183,0.07) !important;
          outline: none !important;
        }
        .vd-search input::placeholder { color: #4b5563 !important; }
        .vd-search-icon {
          position: absolute; left: 11px; top: 50%;
          transform: translateY(-50%); z-index: 1; pointer-events: none;
        }

        .vd-stat {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .vd-stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .vd-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800; line-height: 1; display: block;
        }
        .vd-stat-lbl {
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          color: #6b7280; display: block; margin-top: 2px;
        }

        .vd-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          padding: 14px 18px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .vd-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .vd-card.suspended { border-color: rgba(239,68,68,0.12); background: rgba(239,68,68,0.02); }
        .vd-card.suspended:hover { border-color: rgba(239,68,68,0.22); }

        .vd-avatar { padding: 2px; border-radius: 50%; }
        .vd-avatar-inner {
          background: #0d1117; border-radius: 50%; padding: 8px;
          display: flex; align-items: center; justify-content: center;
        }

        .vd-pill {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.06em; padding: 3px 10px; border-radius: 20px; white-space: nowrap;
        }
        .vd-pill-active   { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.2); color: #6ee7b7; }
        .vd-pill-suspended{ background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.2);  color: #f87171; }

        .vd-btn {
          font-size: 12px !important; font-weight: 600 !important;
          padding: 5px 13px !important; border-radius: 8px !important;
          display: flex !important; align-items: center !important; gap: 5px !important;
          transition: all 0.2s ease !important; cursor: pointer; white-space: nowrap;
          background: transparent !important;
        }
        .vd-btn-suspend   { border: 1px solid rgba(239,68,68,0.25) !important; color: #f87171 !important; }
        .vd-btn-suspend:hover:not(:disabled)   { background: rgba(239,68,68,0.08) !important; border-color: rgba(239,68,68,0.45) !important; }
        .vd-btn-reinstate { border: 1px solid rgba(52,211,153,0.25) !important; color: #6ee7b7 !important; }
        .vd-btn-reinstate:hover:not(:disabled) { background: rgba(52,211,153,0.08) !important; border-color: rgba(52,211,153,0.45) !important; }

        .vd-empty {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 64px 20px; gap: 10px;
        }
        .vd-empty-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
        }
      `}</style>

      <div className="verified-wrap">
        <Card className="bg-muted/20 border-emerald-900/20" style={{ borderRadius: 16, overflow: 'hidden' }}>

          {/* Header */}
          <CardHeader style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <CardTitle className="vd-title" style={{ fontSize: 28, fontWeight: 800, color: '#f3f4f6', marginBottom: 4, letterSpacing: '-0.5px' }}>
                  Manage Doctors
                </CardTitle>
                <CardDescription style={{ fontSize: 13, color: '#6b7280' }}>
                  View and manage all verified doctors
                </CardDescription>
              </div>
              <div className="vd-search" style={{ minWidth: 220 }}>
                <Search className="vd-search-icon" style={{ width: 14, height: 14, color: '#4b5563' }} />
                <Input
                  placeholder="Search name, specialty, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent style={{ padding: '22px 28px 28px' }}>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="vd-stat">
                <div className="vd-stat-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Users style={{ width: 16, height: 16, color: '#9ca3af' }} />
                </div>
                <div>
                  <span className="vd-stat-num" style={{ color: '#f9fafb' }}>{localDoctors.length}</span>
                  <span className="vd-stat-lbl">Total</span>
                </div>
              </div>
              <div className="vd-stat">
                <div className="vd-stat-icon" style={{ background: 'rgba(52,211,153,0.08)' }}>
                  <ShieldCheck style={{ width: 16, height: 16, color: '#6ee7b7' }} />
                </div>
                <div>
                  <span className="vd-stat-num" style={{ color: '#6ee7b7' }}>{activeCount}</span>
                  <span className="vd-stat-lbl">Active</span>
                </div>
              </div>
              <div className="vd-stat">
                <div className="vd-stat-icon" style={{ background: 'rgba(239,68,68,0.08)' }}>
                  <ShieldOff style={{ width: 16, height: 16, color: '#f87171' }} />
                </div>
                <div>
                  <span className="vd-stat-num" style={{ color: '#f87171' }}>{suspendedCount}</span>
                  <span className="vd-stat-lbl">Suspended</span>
                </div>
              </div>
            </div>

            {/* Doctor list */}
            {filteredDoctors.length === 0 ? (
              <div className="vd-empty">
                <div className="vd-empty-icon">
                  <Users style={{ width: 20, height: 20, color: '#4b5563' }} />
                </div>
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0, fontWeight: 500 }}>
                  {searchTerm ? `No results for "${searchTerm}"` : "No verified doctors yet."}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredDoctors.map((doctor) => {
                  const isSuspended = doctor.isActive === false;
                  const isThisLoading = loading && targetDoctor?.id === doctor.id;

                  return (
                    <div key={doctor.id} className={`vd-card${isSuspended ? " suspended" : ""}`}>

                      {/* Left: Avatar + Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div
                          className="vd-avatar"
                          style={{
                            background: isSuspended
                              ? 'linear-gradient(135deg,#f87171,#ef4444)'
                              : 'linear-gradient(135deg,#6ee7b7,#34d399)',
                          }}
                        >
                          <div className="vd-avatar-inner">
                            <User style={{ width: 14, height: 14, color: isSuspended ? '#f87171' : '#6ee7b7' }} />
                          </div>
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, color: '#f9fafb', fontSize: 14, margin: '0 0 2px' }}>
                            {doctor.name}
                          </p>
                          <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 1px' }}>
                            {doctor.specialty || "General"} · {doctor.experience || 0} yrs exp
                          </p>
                          <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>
                            {doctor.email}
                          </p>
                        </div>
                      </div>

                      {/* Right: Status + Action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className={`vd-pill ${isSuspended ? "vd-pill-suspended" : "vd-pill-active"}`}>
                          {isSuspended ? "Suspended" : "Active"}
                        </span>

                        {isSuspended ? (
                          <Button
                            className="vd-btn vd-btn-reinstate"
                            size="sm"
                            onClick={() => handleStatusChange(doctor, false)}
                            disabled={loading}
                          >
                            {isThisLoading
                              ? <Loader2 style={{ width: 12, height: 12 }} className="animate-spin" />
                              : <Check style={{ width: 12, height: 12 }} />
                            }
                            Reinstate
                          </Button>
                        ) : (
                          <Button
                            className="vd-btn vd-btn-suspend"
                            size="sm"
                            onClick={() => handleStatusChange(doctor, true)}
                            disabled={loading}
                          >
                            {isThisLoading
                              ? <Loader2 style={{ width: 12, height: 12 }} className="animate-spin" />
                              : <Ban style={{ width: 12, height: 12 }} />
                            }
                            Suspend
                          </Button>
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