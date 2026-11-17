"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { client } from "@/sanity/lib/client";

interface SanityArticleItem {
  _id: string;
  title: string;
  summary: string;
  category: string;
  subsection: string | null;
  imageUrl: string | null;
}

export default function NewscardStudioPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [articles, setArticles] = useState<SanityArticleItem[]>([]);

  // Exact PIL Template State Variables
  const [pillText, setPillText] = useState("GEOTREXX NEWS");
  const [tagText, setTagText] = useState("DIASPORA NEWS");
  const [headlineText, setHeadlineText] = useState(
    "ANOTHER YOUNG GHANAIAN MAN STABBED TO DEATH IN LONDON"
  );
  const [bodyText, setBodyText] = useState(
    "Thomas Oduro, a 21-year-old Ghanaian, has been fatally stabbed on Lordship Lane in Haringey, North London. The Metropolitan Police have launched a murder investigation into the incident, which occurred on Friday evening. No arrests have been made."
  );
  const [footerLeft, setFooterLeft] = useState("GEOTREXX NEWS • INTERNATIONAL");
  const [footerRight, setFooterRight] = useState("CRIME & JUSTICE");
  const [socialHandle, setSocialHandle] = useState("@geotrexx");

  // Main Photo & Privacy Blur Controls
  const [bgPhoto, setBgPhoto] = useState<string>("/orpheus.png");
  const [photoScale, setPhotoScale] = useState<number>(100);
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(5);
  const [enablePrivacyBlur, setEnablePrivacyBlur] = useState<boolean>(false);
  const [blurX, setBlurX] = useState<number>(320);
  const [blurY, setBlurY] = useState<number>(100);
  const [blurW, setBlurW] = useState<number>(440);
  const [blurH, setBlurH] = useState<number>(440);

  // Secondary / Sub-Brand / Partner Logo Controls
  const [showSecondaryLogo, setShowSecondaryLogo] = useState<boolean>(true);
  const [secondaryLogo, setSecondaryLogo] = useState<string>("/geotrexx-logo.png");
  const [secondaryShape, setSecondaryShape] = useState<"circle" | "square" | "raw">("circle");
  const [secondarySize, setSecondarySize] = useState<number>(145);
  const [secondaryRight, setSecondaryRight] = useState<number>(45);
  const [secondaryTop, setSecondaryTop] = useState<number>(25);
  const [secondaryLabel, setSecondaryLabel] = useState<string>("");

  // Fetch recent full articles from Sanity
  useEffect(() => {
    client
      .fetch(
        `*[_type in ["post", "article"] && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) [0...25] {
          _id,
          title,
          "summary": coalesce(excerpt, summary, description, pt::text(coalesce(body, content, []))[0...260] + "..."),
          "category": coalesce(category->title, categories[0]->title, section->title, category, "NEWS"),
          "subsection": coalesce(subsection->title, subCategory->title, subsection, null),
          "imageUrl": coalesce(mainImage.asset->url, image.asset->url, featuredImage.asset->url, null)
        }`
      )
      .then((res) => {
        if (Array.isArray(res)) setArticles(res);
      })
      .catch((err) => console.error("Sanity article load error:", err));
  }, []);

  // Load selected Sanity story directly into the PIL template
  const handleSelectArticle = (id: string) => {
    const found = articles.find((a) => a._id === id);
    if (!found) return;
    setTagText((found.category || "NEWS").toUpperCase());
    setHeadlineText((found.title || "").toUpperCase());
    setBodyText(found.summary || "");
    setFooterLeft(`GEOTREXX NEWS • ${(found.category || "DESK").toUpperCase()}`);
    setFooterRight((found.subsection || "BREAKING REPORT").toUpperCase());
    if (found.imageUrl) {
      setBgPhoto(found.imageUrl);
    }
  };

  // Main Photo Upload -> Base64 Data URL
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setBgPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Secondary Logo Upload -> Base64 Data URL
  const handleSecondaryLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setSecondaryLogo(reader.result);
        setShowSecondaryLogo(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Export exact 1080x1350 PNG
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    try {
      setExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        backgroundColor: "#0D0D0D",
      });
      const link = document.createElement("a");
      const slugName = headlineText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 35);
      link.download = `GEOTREXX_${slugName || "newscard"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG Export Error:", err);
    } finally {
      setExporting(false);
    }
  };

  // Export 1080x1350 PDF
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      setExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1350,
        pixelRatio: 2,
        backgroundColor: "#0D0D0D",
      });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [1080, 1350],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, 1080, 1350);
      pdf.save("GEOTREXX_Newscard.pdf");
    } catch (err) {
      console.error("PDF Export Error:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-geotrexx-black">
      
      {/* =====================================================================
          1. STUDIO CONTROL PANEL
      ===================================================================== */}
      <div className="border-2 border-geotrexx-black p-6 mb-10 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-geotrexx-black pb-4 mb-6 gap-4">
          <div className="flex items-center gap-3.5">
            <Link
              href="/"
              className="w-12 h-12 rounded-full border-2 border-geotrexx-black p-0.5 bg-white flex items-center justify-center shrink-0 hover:border-geotrexx-crimson transition-colors"
            >
              <div className="w-full h-full rounded-full border-2 border-geotrexx-crimson overflow-hidden bg-white">
                <img
                  src="/geotrexx-logo.png"
                  alt="GEOTREXX"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-geotrexx-crimson block">
                1080 × 1350 PIL Graphic Engine
              </span>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                GEOTREXX Newscard Studio
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/consortium"
              className="px-4 py-2 border-2 border-geotrexx-black bg-white text-geotrexx-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-geotrexx-black hover:text-white no-underline transition-colors"
            >
              Consortium Studio &rarr;
            </Link>
            <button
              onClick={handleDownloadPNG}
              disabled={exporting}
              className="px-5 py-2 bg-geotrexx-black text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-geotrexx-crimson transition-colors cursor-pointer"
            >
              {exporting ? "Rendering..." : "Export 1080×1350 PNG"}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={exporting}
              className="px-5 py-2 bg-geotrexx-crimson text-white text-xs font-mono font-bold uppercase tracking-widest hover:bg-geotrexx-black transition-colors cursor-pointer"
            >
              {exporting ? "Rendering..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* Auto-Fill from Live Sanity Articles */}
        <div className="mb-5 p-3.5 border border-geotrexx-black bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-geotrexx-black">
            ⚡ Auto-Fill From Published Sanity Story:
          </span>
          <select
            onChange={(e) => handleSelectArticle(e.target.value)}
            defaultValue=""
            className="flex-1 max-w-xl border border-geotrexx-black bg-white px-3 py-1.5 text-xs font-bold"
          >
            <option value="" disabled>
              -- Select a published article from Sanity to populate card --
            </option>
            {articles.map((art) => (
              <option key={art._id} value={art._id}>
                [{art.category}] {art.title}
              </option>
            ))}
          </select>
        </div>

        {/* Main Text Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">
              Top Crimson Pill Text
            </label>
            <input
              value={pillText}
              onChange={(e) => setPillText(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-bold uppercase"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">
              Gold Category Tag (tag_text)
            </label>
            <input
              value={tagText}
              onChange={(e) => setTagText(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-bold uppercase"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">
              Social Handle
            </label>
            <input
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value)}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-mono font-bold uppercase mb-1">
            Headline (headline_text — Auto-uppercase)
          </label>
          <input
            value={headlineText}
            onChange={(e) => setHeadlineText(e.target.value.toUpperCase())}
            className="w-full border border-geotrexx-black px-3 py-2 text-sm font-black uppercase"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[10px] font-mono font-bold uppercase mb-1">
            Lead Paragraph / Summary (body_text)
          </label>
          <textarea
            rows={3}
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full border border-geotrexx-black px-3 py-2 text-xs font-medium leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">
              Bottom Crimson Bar — Left Text
            </label>
            <input
              value={footerLeft}
              onChange={(e) => setFooterLeft(e.target.value.toUpperCase())}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono font-bold uppercase"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase mb-1">
              Bottom Crimson Bar — Right Subdesk
            </label>
            <input
              value={footerRight}
              onChange={(e) => setFooterRight(e.target.value.toUpperCase())}
              className="w-full border border-geotrexx-black px-3 py-1.5 text-xs font-mono font-bold uppercase"
            />
          </div>
        </div>

        {/* =================================================================
            SECONDARY / NEWS / PARTNER LOGO CONTROLS
        ================================================================= */}
        <div className="border-t-2 border-geotrexx-black pt-4 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <label className="flex items-center gap-2 text-xs font-mono font-black uppercase text-geotrexx-crimson cursor-pointer">
              <input
                type="checkbox"
                checked={showSecondaryLogo}
                onChange={(e) => setShowSecondaryLogo(e.target.checked)}
              />
              Show Secondary / News / Partner Logo (Top-Right Badge)
            </label>

            {showSecondaryLogo && (
              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3 py-1.5 bg-geotrexx-crimson text-white hover:bg-geotrexx-black text-[11px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors">
                  + Upload Secondary Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSecondaryLogoUpload}
                    className="hidden"
                  />
                </label>
                {secondaryLogo && (
                  <button
                    onClick={() => setSecondaryLogo("")}
                    className="px-2.5 py-1 border border-geotrexx-black text-[10px] font-mono font-bold uppercase hover:bg-geotrexx-black hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {showSecondaryLogo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-gray-50 p-3 border border-geotrexx-black">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase mb-1">
                  Logo Path / URL
                </label>
                <input
                  value={secondaryLogo.startsWith("data:") ? "" : secondaryLogo}
                  onChange={(e) => setSecondaryLogo(e.target.value)}
                  placeholder="/logo2.png or https://..."
                  className="w-full border border-geotrexx-black bg-white px-2.5 py-1 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase mb-1">
                  Badge Frame Style
                </label>
                <select
                  value={secondaryShape}
                  onChange={(e) =>
                    setSecondaryShape(e.target.value as "circle" | "square" | "raw")
                  }
                  className="w-full border border-geotrexx-black bg-white px-2.5 py-1 text-xs font-bold uppercase"
                >
                  <option value="circle">Concentric Circle Ring</option>
                  <option value="square">Rounded Square Box</option>
                  <option value="raw">Raw Transparent Crest</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase mb-1">
                  Optional Sub-Label
                </label>
                <input
                  value={secondaryLabel}
                  onChange={(e) => setSecondaryLabel(e.target.value.toUpperCase())}
                  placeholder="e.g. OFFICIAL / LIVE"
                  className="w-full border border-geotrexx-black bg-white px-2.5 py-1 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase mb-1">
                  Size ({secondarySize}px)
                </label>
                <input
                  type="range"
                  min={80}
                  max={220}
                  value={secondarySize}
                  onChange={(e) => setSecondarySize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase mb-1">
                  Top Offset ({secondaryTop}px)
                </label>
                <input
                  type="range"
                  min={0}
                  max={150}
                  value={secondaryTop}
                  onChange={(e) => setSecondaryTop(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* =================================================================
            MAIN PHOTO UPLOAD & PRIVACY BLUR CONTROLS
        ================================================================= */}
        <div className="border-t-2 border-geotrexx-black pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-3">
            <label className="px-4 py-2 bg-geotrexx-black text-white hover:bg-geotrexx-crimson text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors">
              + Upload Main Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <span className="text-[11px] font-mono text-gray-600">
              or paste URL:
            </span>
          </div>

          <input
            value={bgPhoto.startsWith("data:") ? "" : bgPhoto}
            onChange={(e) => setBgPhoto(e.target.value)}
            placeholder="https://... or /photo.jpg"
            className="border border-geotrexx-black px-3 py-1.5 text-xs font-mono"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase cursor-pointer">
              <input
                type="checkbox"
                checked={enablePrivacyBlur}
                onChange={(e) => setEnablePrivacyBlur(e.target.checked)}
              />
              Enable Privacy Blur Box
            </label>
          </div>
        </div>

        {/* Fine-Tuning Sliders for Photo Crop & Blur Box */}
        <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-mono">
          <div>
            <label className="block font-bold uppercase">Photo Zoom ({photoScale}%)</label>
            <input
              type="range"
              min={100}
              max={160}
              value={photoScale}
              onChange={(e) => setPhotoScale(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block font-bold uppercase">Photo Vertical Pan ({photoOffsetY}%)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={photoOffsetY}
              onChange={(e) => setPhotoOffsetY(Number(e.target.value))}
              className="w-full"
            />
          </div>
          {enablePrivacyBlur && (
            <>
              <div>
                <label className="block font-bold uppercase">Blur X ({blurX}px)</label>
                <input
                  type="range"
                  min={0}
                  max={800}
                  value={blurX}
                  onChange={(e) => setBlurX(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block font-bold uppercase">Blur Y ({blurY}px)</label>
                <input
                  type="range"
                  min={0}
                  max={600}
                  value={blurY}
                  onChange={(e) => setBlurY(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* =====================================================================
          2. EXACT 1080x1350 PIL NEWSCARD CANVAS
      ===================================================================== */}
      <div className="w-full overflow-x-auto pb-8">
        <div
          ref={cardRef}
          style={{
            width: "1080px",
            height: "1350px",
            backgroundColor: "#0D0D0D",
            position: "relative",
            overflow: "hidden",
            fontFamily: "var(--font-public-sans), Arial, sans-serif",
          }}
          className="mx-auto select-none shadow-2xl"
        >
          {/* 1. MAIN PHOTO REGION (1080 x 950) */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1080px",
              height: "950px",
              overflow: "hidden",
            }}
          >
            {bgPhoto && (
              <img
                src={bgPhoto}
                alt="Story Visual"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: `center ${photoOffsetY}%`,
                  transform: `scale(${photoScale / 100})`,
                }}
              />
            )}

            {/* OPTIONAL PRIVACY BLUR BOX */}
            {enablePrivacyBlur && (
              <div
                style={{
                  position: "absolute",
                  left: `${blurX}px`,
                  top: `${blurY}px`,
                  width: `${blurW}px`,
                  height: `${blurH}px`,
                  backdropFilter: "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  backgroundColor: "rgba(13, 13, 13, 0.25)",
                }}
              />
            )}

            {/* CINEMATIC GRADIENT FADE (y=300 to y=800 -> #0D0D0D solid) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(13,13,13,0) 0px, rgba(13,13,13,0) 300px, rgba(13,13,13,1) 800px, rgba(13,13,13,1) 950px)",
              }}
            />
          </div>

          {/* 2. TOP CRIMSON PILL BANNER (x=150, y=60, w=450, h=70) */}
          <div
            style={{
              position: "absolute",
              left: "150px",
              top: "60px",
              width: "450px",
              height: "70px",
              backgroundColor: "rgb(175, 20, 35)",
              borderRadius: "35px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "100px",
              zIndex: 10,
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "40px",
                fontWeight: 900,
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {pillText}
            </span>
          </div>

          {/* 3. PRIMARY GEOTREXX CIRCULAR CONCENTRIC BADGE (Top-Left: x=32, y=-13, 216x216) */}
          <div
            style={{
              position: "absolute",
              left: "32px",
              top: "-13px",
              width: "216px",
              height: "216px",
              borderRadius: "9999px",
              backgroundColor: "rgb(175, 20, 35)",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "9999px",
                backgroundColor: "#FFFFFF",
                padding: "3px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="/geotrexx-logo.png"
                alt="GEOTREXX"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "9999px",
                }}
              />
            </div>
          </div>

          {/* 3B. SECONDARY / NEWS / PARTNER LOGO SLOT (Top-Right) */}
          {showSecondaryLogo && secondaryLogo && (
            <div
              style={{
                position: "absolute",
                right: `${secondaryRight}px`,
                top: `${secondaryTop}px`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 25,
              }}
            >
              {secondaryShape === "circle" && (
                <div
                  style={{
                    width: `${secondarySize}px`,
                    height: `${secondarySize}px`,
                    borderRadius: "9999px",
                    backgroundColor: "rgb(175, 20, 35)",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.55)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "9999px",
                      backgroundColor: "#FFFFFF",
                      padding: "3px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={secondaryLogo}
                      alt="Secondary Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>
                </div>
              )}

              {secondaryShape === "square" && (
                <div
                  style={{
                    width: `${secondarySize}px`,
                    height: `${secondarySize}px`,
                    borderRadius: "20px",
                    backgroundColor: "rgb(175, 20, 35)",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.55)",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                      backgroundColor: "#FFFFFF",
                      padding: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={secondaryLogo}
                      alt="Secondary Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                </div>
              )}

              {secondaryShape === "raw" && (
                <img
                  src={secondaryLogo}
                  alt="Secondary Logo"
                  style={{
                    width: `${secondarySize}px`,
                    height: `${secondarySize}px`,
                    objectFit: "contain",
                    filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.75))",
                  }}
                />
              )}

              {secondaryLabel && (
                <div
                  style={{
                    marginTop: "8px",
                    backgroundColor: "rgb(175, 20, 35)",
                    border: "2px solid #FFFFFF",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    paddingTop: "3px",
                    paddingBottom: "3px",
                    borderRadius: "9999px",
                  }}
                >
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "18px",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {secondaryLabel}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 4. TYPOGRAPHY GRID (margin_x = 90, text_start_y = 650) */}
          <div
            style={{
              position: "absolute",
              left: "90px",
              right: "40px",
              top: "595px",
              zIndex: 30,
            }}
          >
            {/* Gold Category Tag (y = 595 to 650) */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "55px",
                paddingLeft: "15px",
                paddingRight: "15px",
                backgroundColor: "rgb(218, 165, 32)",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  color: "#000000",
                  fontSize: "32px",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                {tagText}
              </span>
            </div>

            {/* Headline + Left Vertical Crimson Bar (margin_x - 30 to margin_x - 15) */}
            <div style={{ position: "relative", marginTop: "4px" }}>
              <div
                style={{
                  position: "absolute",
                  left: "-30px",
                  top: "10px",
                  bottom: "6px",
                  width: "15px",
                  backgroundColor: "rgb(175, 20, 35)",
                }}
              />
              <h2
                style={{
                  color: "#FFFFFF",
                  fontSize: "55px",
                  fontWeight: 900,
                  lineHeight: "65px",
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                }}
              >
                {headlineText}
              </h2>
            </div>

            {/* Body Summary Paragraph (28px, rgb(220,220,220)) */}
            <p
              style={{
                color: "rgb(220, 220, 220)",
                fontSize: "28px",
                fontWeight: 400,
                lineHeight: "38px",
                marginTop: "20px",
                marginRight: "20px",
              }}
            >
              {bodyText}
            </p>
          </div>

          {/* 5. SOURCE & SOCIAL BLOCK (base_links_y = 1120) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "1085px",
              zIndex: 30,
            }}
          >
            {/* "Read more..." & "WWW.GEOTREXX.COM" */}
            <div
              style={{
                position: "relative",
                height: "75px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "830px",
                  top: "0px",
                  color: "rgb(175, 20, 35)",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                Read more...
              </span>
              <span
                style={{
                  position: "absolute",
                  left: "600px",
                  top: "35px",
                  color: "#FFFFFF",
                  fontSize: "32px",
                  fontWeight: 900,
                  letterSpacing: "0.02em",
                }}
              >
                WWW.GEOTREXX.COM
              </span>
            </div>

            {/* Horizontal Divider Line ((50, 1165) to (1030, 1165)) */}
            <div
              style={{
                marginLeft: "50px",
                marginRight: "50px",
                height: "3px",
                backgroundColor: "rgb(50, 50, 50)",
              }}
            />

            {/* Social Row (social_y = 1190) */}
            <div
              style={{
                position: "relative",
                height: "65px",
                marginTop: "15px",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  left: "220px",
                  top: "14px",
                  color: "#FFFFFF",
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                }}
              >
                FOLLOW US ON SOCIAL MEDIA
              </span>

              {/* Crimson Facebook Circle */}
              <div
                style={{
                  position: "absolute",
                  left: "530px",
                  top: "0px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  backgroundColor: "rgb(175, 20, 35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "30px",
                  fontWeight: 900,
                }}
              >
                f
              </div>

              {/* Charcoal X Circle */}
              <div
                style={{
                  position: "absolute",
                  left: "600px",
                  top: "0px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "9999px",
                  backgroundColor: "rgb(40, 40, 40)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "24px",
                  fontWeight: 900,
                }}
              >
                X
              </div>

              <span
                style={{
                  position: "absolute",
                  left: "660px",
                  top: "8px",
                  color: "rgb(220, 220, 220)",
                  fontSize: "22px",
                  fontWeight: 800,
                }}
              >
                {socialHandle}
              </span>
            </div>
          </div>

          {/* 6. BOTTOM CRIMSON FOOTER BAR (HEIGHT - 75 = 1275 to 1350) */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "75px",
              backgroundColor: "rgb(175, 20, 35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "50px",
              paddingRight: "50px",
              zIndex: 30,
            }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "0.03em",
              }}
            >
              {footerLeft}
            </span>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "0.03em",
              }}
            >
              {footerRight}
            </span>
          </div>

        </div>
      </div>

    </main>
  );
}