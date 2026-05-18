import { useState } from "react";

const ACCENT = "#f0c040";
const BG = "#0f0f0f";
const CARD = "#1a1a1a";
const BORDER = "#2a2a2a";

const styles = {
  "@import": "https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap",
};

export default function CoverLetterGenerator() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeInfo, setResumeInfo] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!jobDesc.trim() || !resumeInfo.trim()) {
      setError("Please fill in both fields before generating.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are an expert cover letter writer. Write a professional, personalized, and compelling cover letter based on the job description and candidate info below.

Keep it to 3 short paragraphs. Sound human, confident, and specific — not generic. Do not include a date or address header, just start with "Dear Hiring Manager," and end with "Sincerely, [Candidate Name]".

JOB DESCRIPTION:
${jobDesc}

CANDIDATE INFO / RESUME SUMMARY:
${resumeInfo}

Write the cover letter now:`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data?.content?.[0]?.text || "";
      if (!text) throw new Error("No response from AI.");
      setResult(text);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setResult("");
    setJobDesc("");
    setResumeInfo("");
    setError("");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      color: "#e8e8e8",
      fontFamily: "'DM Mono', monospace",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus { outline: none; border-color: ${ACCENT} !important; }
        textarea { resize: vertical; }
        .gen-btn:hover { background: #e0b030 !important; transform: translateY(-1px); }
        .gen-btn:active { transform: translateY(0px); }
        .copy-btn:hover { background: #2a2a2a !important; }
        .reset-btn:hover { color: ${ACCENT} !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .result-card { animation: fadeIn 0.4s ease; }
        .loading-dot { animation: pulse 1.2s infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`,
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: 36, height: 36,
          background: ACCENT,
          borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>✉</div>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", color: "#fff" }}>
            CoverDraft
          </div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>AI-powered cover letters in seconds</div>
        </div>
        <div style={{
          marginLeft: "auto",
          background: "#1a1a1a",
          border: `1px solid ${BORDER}`,
          borderRadius: 20,
          padding: "4px 12px",
          fontSize: 11,
          color: ACCENT,
          fontWeight: 500,
        }}>FREE</div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>

        {!result ? (
          <>
            {/* Hero */}
            <div style={{ marginBottom: 40, textAlign: "center" }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 5vw, 42px)",
                color: "#fff",
                letterSpacing: "-1px",
                lineHeight: 1.1,
                marginBottom: 12,
              }}>
                Land the interview.<br />
                <span style={{ color: ACCENT }}>Skip the blank page.</span>
              </h1>
              <p style={{ color: "#777", fontSize: 14, lineHeight: 1.6 }}>
                Paste the job description + your background. Get a tailored cover letter instantly.
              </p>
            </div>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: ACCENT, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Job Description
                </label>
                <textarea
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the full job posting here..."
                  rows={6}
                  style={{
                    width: "100%",
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    color: "#e8e8e8",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    lineHeight: 1.6,
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: ACCENT, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Your Background
                </label>
                <textarea
                  value={resumeInfo}
                  onChange={e => setResumeInfo(e.target.value)}
                  placeholder={`Your name, current role, years of experience, key skills, and 1-2 achievements.\n\nExample: Jane Doe, 3 years in marketing, skills in SEO and content writing, grew blog traffic 200% at previous job.`}
                  rows={5}
                  style={{
                    width: "100%",
                    background: CARD,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    color: "#e8e8e8",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    lineHeight: 1.6,
                    transition: "border-color 0.2s",
                  }}
                />
              </div>

              {error && (
                <div style={{ color: "#ff6b6b", fontSize: 13, padding: "10px 14px", background: "#1a0f0f", border: "1px solid #3a1a1a", borderRadius: 8 }}>
                  ⚠ {error}
                </div>
              )}

              <button
                className="gen-btn"
                onClick={generate}
                disabled={loading}
                style={{
                  background: loading ? "#888" : ACCENT,
                  color: "#0f0f0f",
                  border: "none",
                  borderRadius: 10,
                  padding: "16px 24px",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {loading ? (
                  <>
                    <span>Generating</span>
                    <span style={{ display: "flex", gap: 3 }}>
                      {[0,1,2].map(i => (
                        <span key={i} className="loading-dot" style={{ width: 5, height: 5, background: "#0f0f0f", borderRadius: "50%", display: "inline-block" }} />
                      ))}
                    </span>
                  </>
                ) : (
                  "✦ Generate Cover Letter"
                )}
              </button>
            </div>
          </>
        ) : (
          // Result
          <div className="result-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff" }}>
                  Your Cover Letter ✦
                </h2>
                <p style={{ color: "#666", fontSize: 12, marginTop: 4 }}>Ready to copy and send</p>
              </div>
              <button className="reset-btn" onClick={reset} style={{
                background: "none", border: `1px solid ${BORDER}`, borderRadius: 8,
                color: "#888", fontFamily: "'DM Mono', monospace", fontSize: 12,
                padding: "8px 14px", cursor: "pointer", transition: "color 0.2s",
              }}>
                ← Start Over
              </button>
            </div>

            <div style={{
              background: CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: "28px 28px",
              marginBottom: 16,
              lineHeight: 1.8,
              fontSize: 14,
              color: "#d8d8d8",
              whiteSpace: "pre-wrap",
            }}>
              {result}
            </div>

            <button className="copy-btn" onClick={copyToClipboard} style={{
              width: "100%",
              background: copied ? "#1a2a1a" : "#1a1a1a",
              border: `1px solid ${copied ? "#2a5a2a" : BORDER}`,
              borderRadius: 10,
              padding: "14px",
              color: copied ? "#6aff6a" : "#e8e8e8",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              {copied ? "✓ Copied to Clipboard!" : "Copy to Clipboard"}
            </button>

            <p style={{ textAlign: "center", color: "#555", fontSize: 11, marginTop: 16 }}>
              Tip: Always personalize 1-2 sentences before sending.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
