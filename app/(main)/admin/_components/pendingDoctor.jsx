"use client";

import { useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, User, Medal, FileText, ExternalLink, Loader2, Clock, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { updateDoctorStatus } from "@/actions/admin";
import useFetch from "@/hooks/use-fetch";

export function PendingDoctors({ doctors }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [localDoctors, setLocalDoctors] = useState(doctors || []);

  const { loading, data, fn: submitStatusUpdate } = useFetch(updateDoctorStatus);

  const handleUpdateStatus = async (doctorId, status) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("status", status);
    
    const result = await submitStatusUpdate(formData);
    
    if (result?.success) {
      setLocalDoctors((prev) => prev.filter((d) => d.id !== doctorId));
      setSelectedDoctor(null);
    }
  };

  return (
    <div>
      <style>{`
        .pd-wrap * { font-family: 'DM Sans', sans-serif; }
        .pd-title  { font-family: Georgia, 'Times New Roman', serif; font-weight: 800; letter-spacing: -0.03em; }

        .pd-doctor-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 18px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
          transition: background 0.2s, border-color 0.2s;
        }
        .pd-doctor-card:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.11);
        }

        .pd-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.05));
          border: 1px solid rgba(251,191,36,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .pd-pill {
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.2);
          color: #fbbf24;
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.06em;
          padding: 3px 10px; border-radius: 20px; white-space: nowrap;
        }

        .pd-view-btn {
          font-size: 12px !important; font-weight: 600 !important;
          padding: 5px 14px !important; border-radius: 8px !important;
          display: flex !important; align-items: center !important; gap: 5px !important;
          transition: all 0.2s ease !important;
          background: transparent !important;
          border: 1px solid rgba(110,231,183,0.25) !important;
          color: #6ee7b7 !important;
        }
        .pd-view-btn:hover {
          background: rgba(110,231,183,0.08) !important;
          border-color: rgba(110,231,183,0.45) !important;
        }

        .pd-stat {
          flex: 1; min-width: 100px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 14px 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .pd-stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pd-stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 20px; font-weight: 800; line-height: 1; display: block;
        }
        .pd-stat-lbl {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.07em; color: #6b7280; display: block; margin-top: 2px;
        }

        .pd-empty {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 64px 20px; gap: 10px;
        }
        .pd-empty-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center; margin-bottom: 4px;
        }

        /* Dialog overrides */
        .pd-dialog-content {
          background: #0d1117 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 16px !important;
        }
        .pd-field-label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.07em; color: #6b7280; margin-bottom: 4px;
        }
        .pd-field-value {
          font-size: 14px; font-weight: 500; color: #f3f4f6;
        }
        .pd-section-heading {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; color: #f3f4f6; margin-bottom: 12px;
        }
        .pd-info-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        @media (max-width: 600px) { .pd-info-grid { grid-template-columns: 1fr; } }

        .pd-btn-reject {
          font-size: 13px !important; font-weight: 600 !important;
          padding: 7px 18px !important; border-radius: 9px !important;
          display: flex !important; align-items: center !important; gap: 6px !important;
          background: transparent !important;
          border: 1px solid rgba(239,68,68,0.3) !important;
          color: #f87171 !important;
          transition: all 0.2s !important;
        }
        .pd-btn-reject:hover:not(:disabled) {
          background: rgba(239,68,68,0.08) !important;
          border-color: rgba(239,68,68,0.5) !important;
        }
        .pd-btn-approve {
          font-size: 13px !important; font-weight: 600 !important;
          padding: 7px 18px !important; border-radius: 9px !important;
          display: flex !important; align-items: center !important; gap: 6px !important;
          background: rgba(52,211,153,0.12) !important;
          border: 1px solid rgba(52,211,153,0.3) !important;
          color: #6ee7b7 !important;
          transition: all 0.2s !important;
        }
        .pd-btn-approve:hover:not(:disabled) {
          background: rgba(52,211,153,0.2) !important;
          border-color: rgba(52,211,153,0.5) !important;
        }
      `}</style>

      <div className="pd-wrap">
        <Card className="bg-muted/20 border-emerald-900/20" style={{ borderRadius: 16, overflow: 'hidden' }}>

          {/* Header */}
          <CardHeader style={{ padding: '24px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <CardTitle className="pd-title" style={{ fontSize: 28, fontWeight: 800, color: '#f3f4f6', marginBottom: 4, letterSpacing: '-0.5px' }}>
              Pending Doctor Verifications
            </CardTitle>
            <CardDescription style={{ fontSize: 13, color: '#6b7280' }}>
              Review and approve doctor applications
            </CardDescription>
          </CardHeader>

          <CardContent style={{ padding: '22px 28px 28px' }}>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <div className="pd-stat">
                <div className="pd-stat-icon" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Users style={{ width: 16, height: 16, color: '#9ca3af' }} />
                </div>
                <div>
                  <span className="pd-stat-num" style={{ color: '#f9fafb' }}>{localDoctors.length}</span>
                  <span className="pd-stat-lbl">Total Applications</span>
                </div>
              </div>
            </div>

            {/* List */}
            {localDoctors.length === 0 ? (
              <div className="pd-empty">
                <div className="pd-empty-icon">
                  <Users style={{ width: 20, height: 20, color: '#4b5563' }} />
                </div>
                <p style={{ color: '#6b7280', fontSize: 14, margin: 0, fontWeight: 500 }}>
                  No pending verification requests at this time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {localDoctors.map((doctor) => (
                  <div key={doctor.id} className="pd-doctor-card">

                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="pd-avatar">
                        <User style={{ width: 15, height: 15, color: '#fbbf24' }} />
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

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="pd-pill">Pending</span>
                      <Button
                        className="pd-view-btn"
                        size="sm"
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        <ExternalLink style={{ width: 12, height: 12 }} />
                        View Details
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      {selectedDoctor && (
        <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
          <DialogContent className="pd-dialog-content max-w-2xl">
            <DialogHeader>
              <DialogTitle className="pd-title" style={{ fontSize: 20, fontWeight: 800, color: '#f3f4f6' }}>
                Doctor Verification Details
              </DialogTitle>
              <DialogDescription style={{ fontSize: 13, color: '#6b7280' }}>
                Review the doctor&apos;s information carefully before making a decision
              </DialogDescription>
            </DialogHeader>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 0' }}>

              {/* Basic Info */}
              <div className="pd-info-grid">
                {[
                  { label: "Full Name",         value: selectedDoctor.name },
                  { label: "Email",             value: selectedDoctor.email },
                  { label: "Application Date",  value: format(new Date(selectedDoctor.createdAt), "PPP") },
                ].map((f) => (
                  <div key={f.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
                    <p className="pd-field-label">{f.label}</p>
                    <p className="pd-field-value">{f.value}</p>
                  </div>
                ))}
              </div>

              <Separator style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Professional */}
              <div>
                <div className="pd-section-heading">
                  <Medal style={{ width: 16, height: 16, color: '#6ee7b7' }} />
                  Professional Information
                </div>
                <div className="pd-info-grid">
                  {[
                    { label: "Specialty",          value: selectedDoctor.specialty },
                    { label: "Years of Experience", value: `${selectedDoctor.experience} years` },
                  ].map((f) => (
                    <div key={f.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
                      <p className="pd-field-label">{f.label}</p>
                      <p className="pd-field-value">{f.value}</p>
                    </div>
                  ))}
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', gridColumn: 'span 2' }}>
                    <p className="pd-field-label">Credentials</p>
                    <a
                      href={selectedDoctor.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6ee7b7', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
                    >
                      View Credentials <ExternalLink style={{ width: 13, height: 13 }} />
                    </a>
                  </div>
                </div>
              </div>

              <Separator style={{ background: 'rgba(255,255,255,0.06)' }} />

              {/* Description */}
              <div>
                <div className="pd-section-heading">
                  <FileText style={{ width: 16, height: 16, color: '#6ee7b7' }} />
                  Service Description
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px', fontSize: 13, color: '#9ca3af', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {selectedDoctor.description}
                </div>
              </div>
            </div>

            {/* Loading bar */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                <Loader2 style={{ width: 14, height: 14, color: '#6b7280' }} className="animate-spin" />
                <span style={{ fontSize: 12, color: '#6b7280' }}>Processing…</span>
              </div>
            )}

            <DialogFooter style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <Button
                className="pd-btn-reject"
                onClick={() => handleUpdateStatus(selectedDoctor.id, "REJECTED")}
                disabled={loading}
              >
                <X style={{ width: 13, height: 13 }} />
                Reject
              </Button>
              <Button
                className="pd-btn-approve"
                onClick={() => handleUpdateStatus(selectedDoctor.id, "VERIFIED")}
                disabled={loading}
              >
                <Check style={{ width: 13, height: 13 }} />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}