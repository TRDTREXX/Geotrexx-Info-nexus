"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

interface Candidate {
  name: string;
  pct: number;
  lead: boolean;
  photoUrl?: string;
}

interface Portfolio {
  office: string;
  status: string;
  volatile: boolean;
  metric: string;
  candidates: Candidate[];
}

export default function ConsortiumStudioPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const [reportId, setReportId] = useState("GC-INDEX-2026-04");
  const [dateStamp, setDateStamp] = useState("NOVEMBER 2026");
  const [electionTitle, setElectionTitle] = useState("NPP NATIONAL ANNUAL DELEGATES CONFERENCE");
  const [venue, setVenue] = useState("BABA YARA SPORTS STADIUM • KUMASI, GHANA");
  const [confidence, setConfidence] = useState("95% CONFIDENCE INTERVAL (±2.4%)");
  const [methodology, setMethodology] = useState(
    "MULTI-VARIABLE DELEGATE, PARLIAMENTARY CAUCUS & FIELD POLLING INDEX"
  );

  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    {
      office: "GENERAL SECRETARY",
      status: "PROJECTED SUPERMAJORITY",
      volatile: false,
      metric: "68+ SITTING MPs ALIGNED WITH FRIMPONG",
      candidates: [
        { name: "Justin Kodua Frimpong", pct: 64.7, lead: true, photoUrl: "" },
        { name: "Other Contenders / Undecided", pct: 35.3, lead: false, photoUrl: "" },
      ],
    },
    {
      office: "NATIONAL CHAIRMAN",
      status: "DECISIVE LEAD",
      volatile: false,
      metric: "GRASSROOTS & REGIONAL BLOC CONSOLIDATION",
      candidates: [
        { name: "John Boadu", pct: 46.0, lead: true, photoUrl: "" },
        { name: "Nearest Contender", pct: 31.5, lead: false, photoUrl: "" },
        { name: "Remaining Field", pct: 22.5, lead: false, photoUrl: "" },
      ],
    },
    {
      office: "NATIONAL TREASURER",
      status: "VOLATILE • TOO CLOSE TO CALL",
      volatile: true,
      metric: "SWING DELEGATE BLOCS UNDECIDED",
      candidates: [
        { name: "Contender A", pct: 48.2, lead: false, photoUrl: "" },
        { name: "Contender B", pct: 47.1, lead: false, photoUrl: "" },
        { name: "Undecided", pct: 4.7, lead: false, photoUrl: "" },
      ],
    },
  ]);

  const updateCandidate = (
    pIdx: number,
    cIdx: number,
    field: keyof Candidate,
    value: string | number | boolean
  ) => {
    const next = [...portfolios];
    next[pIdx].candidates[cIdx] = {
      ...next[pIdx].candidates[cIdx],
      [field]: value,
    };
    setPortfolios(next);
  };

  // Handle local computer image upload -> Base64 Data URL for clean PNG/PDF export
  const handlePortraitUpload = (
    pIdx: number,
    cIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        updateCandidate(pIdx, cIdx, "photoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const addCandidate = (pIdx: number) => {
    const next = [...portfolios];
    next[pIdx].candidates.push({
      name: "New Candidate",
      pct: 10.0,
      lead: false,
      photoUrl: "",
    });
    setPortfolios(next);
  };

  const removeCandidate = (pIdx: number, cIdx: number) => {
    const next = [...portfolios];
    next[pIdx].candidates.splice(cIdx, 1);
    setPortfolios(next);
  };

  const addPortfolio = () => {
    setPortfolios([
      ...portfolios,
      {
        office: "NEW PORTFOLIO / CONSTITUENCY",
        status: "PROJECTED LEAD",
        volatile: false,
        metric: "FIELD SAMPLE VERIFIED",
        candidates: [
          { name: "Candidate A", pct: 54.0, lead: true, photoUrl: "" },
          { name: "Candidate B", pct: 46.0, lead: false, photoUrl: "" },
        ],
      },
    ]);
  };

  const removePortfolio = (pIdx: number) => {
    const next = [...portfolios];
    next.splice(pIdx, 1);
    setPortfolios(next);
  };

  // Helper to get initials when no candidate portrait is uploaded yet
  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      setExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#FFFFFF",
      });
      const link = document.createElement("a");
      link.download = `${reportId.toLowerCase()}-projection.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export PNG:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      setExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#FFFFFF",
      });

      const elementWidth = cardRef.current.offsetWidth;
      const elementHeight = cardRef.current.offsetHeight;

      const pdf = new jsPDF({
        orientation: elementHeight > elementWidth ? "portrait" : "landscape",
        unit: "px",
        format: [elementWidth, elementHeight],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, elementWidth, elementHeight);
      pdf.save(`${reportId.toLowerCase()}-briefing.pdf`);
    } catch (err) {
      console.error("Failed to export PDF:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-geotrexx-black">
      
      {/* =====================================================================
          CONTROL PANEL (Input Candidate Data, Portraits & Export)
      ===================================================================== */}
      <div className="border-2 border-geotrexx-black p-6 mb-12 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-geotrexx-black pb-4 mb-6 gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              aria-label="Back to GEOTREXX Home"
              className="group relative w-12 h-12 rounded-full border-2 border-geotrexx-black p-0.5 bg-white flex items-center justify-center shrink-0 transition-all duration-300 hover:border-geotrexx-crimson hover:scale-105"
            >
              <div className="w-full h-full rounded-full border-2 border-geotrexx-crimson overflow-hidden bg-white flex items-center justify-center">
                <img
                  src="/geotrexx-logo.png"
                  alt="GEOTREXX Seal"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson block">
                Electoral Intelligence Engine
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                Geotrexx Consortium Studio
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={addPortfolio}
              className="px-4 py-2 border-2 border-geotrexx-black bg-white text-geotrexx-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-geotrexx-black hover:text-white transition-colors cursor-pointer"
            >
              + Add Race
            </button>
            <button
              onClick={handleDownloadPNG}
              disabled={exporting}
              className="px-5 py-2 bg-geotrexx-black text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-geotrexx-crimson transition-colors cursor-pointer"
            >
              {exporting ? "Exporting..." : "Download PNG Card"}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={exporting}
              className="px-5 py-2 bg-geotrexx-crimson text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-geotrexx-black transition-colors cursor-pointer"
            >
              {exporting ? "Exporting..." : "Download PDF Brief"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">Report ID</label>
            <input
              value={reportId}
              onChange={(e) => setReportId(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">Date Stamp</label>
            <input
              value={dateStamp}
              onChange={(e) => setDateStamp(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">Confidence / Margin</label>
            <input
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">Election / Event Title</label>
            <input
              value={electionTitle}
              onChange={(e) => setElectionTitle(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">Venue / Geographic Scope</label>
            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-[10px] font-mono font-bold uppercase mb-1">Methodology Footnote</label>
          <input
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono"
          />
        </div>

        {/* Races & Candidates Editor with Portrait Uploader */}
        <div className="space-y-4">
          {portfolios.map((p, pIdx) => (
            <div key={pIdx} className="border-2 border-geotrexx-black p-4 bg-white">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-300">
                <span className="text-xs font-mono font-bold uppercase text-geotrexx-crimson">
                  Race #{pIdx + 1}
                </span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase cursor-pointer">
                    <input
                      type="checkbox"
                      checked={p.volatile}
                      onChange={(e) => {
                        const next = [...portfolios];
                        next[pIdx].volatile = e.target.checked;
                        setPortfolios(next);
                      }}
                    />
                    Volatile / Too Close
                  </label>
                  <button
                    onClick={() => addCandidate(pIdx)}
                    className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 border border-geotrexx-black hover:bg-geotrexx-black hover:text-white cursor-pointer"
                  >
                    + Candidate
                  </button>
                  <button
                    onClick={() => removePortfolio(pIdx)}
                    className="text-[11px] font-mono font-bold uppercase text-geotrexx-crimson hover:underline cursor-pointer"
                  >
                    Remove Race
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <input
                  value={p.office}
                  onChange={(e) => {
                    const next = [...portfolios];
                    next[pIdx].office = e.target.value;
                    setPortfolios(next);
                  }}
                  className="border border-geotrexx-black px-2.5 py-1.5 text-xs font-black uppercase"
                  placeholder="Office / Constituency"
                />
                <input
                  value={p.status}
                  onChange={(e) => {
                    const next = [...portfolios];
                    next[pIdx].status = e.target.value;
                    setPortfolios(next);
                  }}
                  className="border border-geotrexx-black px-2.5 py-1.5 text-xs font-mono uppercase"
                  placeholder="Status Badge"
                />
                <input
                  value={p.metric}
                  onChange={(e) => {
                    const next = [...portfolios];
                    next[pIdx].metric = e.target.value;
                    setPortfolios(next);
                  }}
                  className="border border-geotrexx-black px-2.5 py-1.5 text-xs font-mono uppercase"
                  placeholder="Key Alignment Signal"
                />
              </div>

              <div className="space-y-3">
                {p.candidates.map((c, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex flex-wrap items-center gap-2 border border-gray-200 p-2 bg-white"
                  >
                    {/* Candidate Name */}
                    <input
                      value={c.name}
                      onChange={(e) => updateCandidate(pIdx, cIdx, "name", e.target.value)}
                      className="flex-1 min-w-[160px] border border-geotrexx-black px-2.5 py-1 text-xs font-bold"
                      placeholder="Candidate Name"
                    />

                    {/* Vote Share % */}
                    <input
                      type="number"
                      step="0.1"
                      value={c.pct}
                      onChange={(e) =>
                        updateCandidate(pIdx, cIdx, "pct", parseFloat(e.target.value) || 0)
                      }
                      className="w-20 border border-geotrexx-black px-2.5 py-1 text-xs font-mono font-bold"
                      placeholder="%"
                    />

                    {/* Portrait File Upload Button */}
                    <label className="px-2.5 py-1 border border-geotrexx-black bg-geotrexx-black text-white hover:bg-geotrexx-crimson text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors">
                      {c.photoUrl ? "Change Photo" : "+ Upload Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePortraitUpload(pIdx, cIdx, e)}
                        className="hidden"
                      />
                    </label>

                    {/* Optional Image Path Input (e.g. /orpheus.png) */}
                    <input
                      value={c.photoUrl?.startsWith("data:") ? "" : c.photoUrl || ""}
                      onChange={(e) => updateCandidate(pIdx, cIdx, "photoUrl", e.target.value)}
                      className="w-36 border border-geotrexx-black px-2 py-1 text-[11px] font-mono"
                      placeholder="or /photo.png"
                    />

                    {c.photoUrl && (
                      <button
                        onClick={() => updateCandidate(pIdx, cIdx, "photoUrl", "")}
                        className="text-[10px] font-mono uppercase text-geotrexx-crimson hover:underline cursor-pointer"
                      >
                        Clear Photo
                      </button>
                    )}

                    {/* Lead Toggle */}
                    <label className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={c.lead}
                        onChange={(e) => updateCandidate(pIdx, cIdx, "lead", e.target.checked)}
                      />
                      Crimson Lead
                    </label>

                    {/* Remove Candidate */}
                    <button
                      onClick={() => removeCandidate(pIdx, cIdx)}
                      className="text-xs font-mono text-gray-500 hover:text-geotrexx-crimson px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================================
          EXPORTABLE AP-STYLE CONSORTIUM CARD (With Candidate Portraits)
      ===================================================================== */}
      <div className="overflow-x-auto">
        <div
          ref={cardRef}
          className="w-full max-w-[920px] mx-auto border-[3px] border-geotrexx-black p-8 md:p-12 bg-white text-geotrexx-black"
        >
          {/* Top 10px Brutalist Bar */}
          <div className="w-full h-2.5 bg-geotrexx-black mb-6" />

          {/* Masthead with Rounded Concentric Seal */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-geotrexx-black pb-5 mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-geotrexx-black p-0.5 bg-white flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full border-2 border-geotrexx-crimson overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src="/geotrexx-logo.png"
                    alt="GEOTREXX Consortium Seal"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-crimson block mb-1">
                  Electoral Intelligence & Decision Desk • {dateStamp}
                </span>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-geotrexx-black leading-none">
                  GEOTREXX CONSORTIUM
                </h2>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-geotrexx-crimson text-white text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 mb-1">
                {reportId}
              </span>
              <p className="text-[11px] font-mono uppercase tracking-widest text-geotrexx-black font-bold">
                {confidence}
              </p>
            </div>
          </div>

          {/* Election Title & Venue */}
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-black uppercase text-geotrexx-black leading-tight mb-1">
              {electionTitle}
            </h3>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-geotrexx-black">
              {venue}
            </p>
          </div>

          {/* Portfolios Stack */}
          <div className="space-y-6">
            {portfolios.map((portfolio, idx) => (
              <div
                key={idx}
                className={`border-2 border-geotrexx-black border-l-[10px] p-6 bg-white ${
                  portfolio.volatile ? "border-l-geotrexx-black" : "border-l-geotrexx-crimson"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-geotrexx-black pb-3 mb-5 gap-2">
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-wide text-geotrexx-black">
                      {portfolio.office}
                    </h4>
                    <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-geotrexx-black mt-0.5">
                      INTEL SIGNAL: {portfolio.metric}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 self-start sm:self-center ${
                      portfolio.volatile
                        ? "bg-geotrexx-black text-white"
                        : "bg-geotrexx-crimson text-white"
                    }`}
                  >
                    {portfolio.status}
                  </span>
                </div>

                {/* Candidates List with Portrait Badges */}
                <div className="space-y-5">
                  {portfolio.candidates.map((cand, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-4">
                      
                      {/* Circular Concentric Candidate Portrait Badge */}
                      <div
                        className={`w-14 h-14 rounded-full border-2 p-0.5 bg-white flex items-center justify-center shrink-0 ${
                          cand.lead ? "border-geotrexx-crimson" : "border-geotrexx-black"
                        }`}
                      >
                        <div className="w-full h-full rounded-full border border-geotrexx-black overflow-hidden bg-white flex items-center justify-center">
                          {cand.photoUrl ? (
                            <img
                              src={cand.photoUrl}
                              alt={cand.name}
                              className="w-full h-full object-cover object-top rounded-full"
                            />
                          ) : (
                            <span
                              className={`text-xs font-mono font-black uppercase ${
                                cand.lead ? "text-geotrexx-crimson" : "text-geotrexx-black"
                              }`}
                            >
                              {getInitials(cand.name)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Candidate Name, Percentage & Bar */}
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-base md:text-lg font-bold text-geotrexx-black">
                            {cand.name}
                          </span>
                          <span
                            className={`text-lg md:text-xl font-mono font-black ${
                              cand.lead ? "text-geotrexx-crimson" : "text-geotrexx-black"
                            }`}
                          >
                            {cand.pct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-5 border border-geotrexx-black bg-white p-0.5">
                          <div
                            className={`h-full ${
                              cand.lead ? "bg-geotrexx-crimson" : "bg-geotrexx-black"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, cand.pct))}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Methodology Footer */}
          <div className="mt-8 pt-4 border-t-2 border-geotrexx-black flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-geotrexx-black">
            <span>METHODOLOGY: {methodology}</span>
            <span className="font-bold text-geotrexx-crimson">GEOTREXX CONSORTIUM • ACCRA</span>
          </div>
        </div>
      </div>
    </main>
  );
}