import { useState } from "react";
import "./App.css";

function App() {
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const [resume, setResume] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // =========================
  // OPEN ANALYZER
  // =========================

  const openAnalyzer = () => {
    setShowAnalyzer(true);
    setResult(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // BACK TO HOME
  // =========================

  const backToHome = () => {
    setShowAnalyzer(false);
    setResult(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // FILE SELECT
  // =========================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file.");
      setResume(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Resume size must be below 10 MB.");
      setResume(null);
      return;
    }

    setResume(file);
    setResult(null);
    setError("");
  };

  // =========================
  // ANALYZE RESUME
  // =========================

  const analyzeResume = async () => {
    if (!resume) {
      setError("Please upload your resume first.");
      return;
    }

    setAnalyzing(true);
    setError("");
    setResult(null);
    setAnalyzing(true);
setError("");
setResult(null);

setTimeout(() => {
  document
    .querySelector(".upload-box")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
}, 100);

    try {
      const formData = new FormData();

      formData.append("resume", resume);

      fetch("https://careerai-backend-a72u.onrender.com/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(
          data.message || "Resume analysis failed."
        );
      }

      setResult(data);

      setTimeout(() => {
        document
          .querySelector(".result-section")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);
    } catch (err) {
      console.error(err);

      setError(
        "Backend connection failed. Please make sure Flask is running on port 5000."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  // =========================
  // ANALYZER PAGE
  // =========================

  if (showAnalyzer) {
    return (
      <div className="app">

        {/* BACKGROUND */}

        <div className="background-effects">

          <div className="glow glow-one"></div>
          <div className="glow glow-two"></div>
          <div className="glow glow-three"></div>

          <div className="stars">
            {Array.from({ length: 35 }).map((_, index) => (
              <span key={index}></span>
            ))}
          </div>

        </div>

        {/* NAVBAR */}

        <nav className="navbar">

          <div className="logo">
            <span className="logo-icon">✦</span>
            Career<span>AI</span>
          </div>

          <div className="nav-links">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                backToHome();
              }}
            >
              Home
            </a>

            <a href="#analyzer">
              Resume Analyzer
            </a>
          </div>

          <button
            className="nav-button"
            onClick={backToHome}
          >
            ← Back Home
          </button>

        </nav>

        {/* ANALYZER */}

        <section
          className="analyzer-section"
          id="analyzer"
          style={{
            minHeight: "calc(100vh - 100px)",
          }}
        >

          <div
            className="analyzer-container"
            style={{
              animation: "heroEnter 0.8s ease",
            }}
          >

            {/* TOP TITLE */}

            <div className="section-heading">

              <div className="section-label">
                CAREER ANALYZER
              </div>

              <h2>
                Analyze your resume with
                <span> CareerAI.</span>
              </h2>

              <p>
                Upload your resume and get your
                career intelligence report.
              </p>

            </div>

            {/* UPLOAD CARD */}

            <div className="upload-box">

              <div className="upload-icon">
                🚀
              </div>

              <h3>
                Upload your PDF or DOCX resume
              </h3>

              <p className="upload-info">
                Maximum file size: 10 MB
              </p>

              <label className="choose-button">

                Choose Resume

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                />

              </label>

              {/* SELECTED FILE */}

              {resume && (
                <div className="selected-file">

                  <span className="success-check">
                    ✓
                  </span>

                  <div>

                    <small>
                      Selected Resume
                    </small>

                    <strong>
                      {resume.name}
                    </strong>

                  </div>

                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="error-message">
                  ⚠ {error}
                </div>
              )}

              {/* ANALYZE */}

              <button
                className="analyze-button"
                onClick={analyzeResume}
                disabled={analyzing}
              >

                {analyzing ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    Analyze Resume
                    <span>✦</span>
                  </>
                )}

              </button>

            </div>

            {/* RESULT */}

            {result && (
              <div className="result-section">

                {/* HEADER */}

                <div className="result-header">

                  <div>

                    <div className="section-label">
                      AI ANALYSIS COMPLETE
                    </div>

                    <h2>
                      Your Career Intelligence Report
                    </h2>

                    <p>
                      {result.filename}
                    </p>

                  </div>

                  <div className="score-circle">

                    <div className="score-number">
                      {result.match_score}%
                    </div>

                    <span>
                      Score
                    </span>

                  </div>

                </div>

                {/* STATS */}

                <div className="result-stats">

                  <div className="result-stat">

                    <span>
                      🎯
                    </span>

                    <small>
                      SKILL MATCH
                    </small>

                    <strong>
                      {result.match_score}%
                    </strong>

                  </div>

                  <div className="result-stat">

                    <span>
                      💡
                    </span>

                    <small>
                      SKILLS FOUND
                    </small>

                    <strong>
                      {result.skill_count}
                    </strong>

                  </div>

                  <div className="result-stat">

                    <span>
                      📈
                    </span>

                    <small>
                      GROWTH AREAS
                    </small>

                    <strong>
                      {result.skills_missing?.length || 0}
                    </strong>

                  </div>

                </div>

                {/* SKILLS */}

                <div className="result-grid">

                  <div className="result-card strengths">

                    <h3>
                      ✓ Your Strengths
                    </h3>

                    <div className="skills-list">

                      {result.skills_found?.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="skill-pill found"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                  <div className="result-card missing">

                    <h3>
                      ⚡ Missing Skills
                    </h3>

                    <div className="skills-list">

                      {result.skills_missing?.map(
                        (skill, index) => (
                          <span
                            key={index}
                            className="skill-pill missing-pill"
                          >
                            + {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                </div>

                {/* SUMMARY */}

                <div className="summary-box">

                  <span>
                    🤖
                  </span>

                  <div>

                    <strong>
                      CareerAI Summary
                    </strong>

                    <p>
                      {result.summary}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* BACK BUTTON */}

            <div
              style={{
                textAlign: "center",
                marginTop: "35px",
              }}
            >

              <button
                className="secondary-button"
                onClick={backToHome}
              >
                ← Back to CareerAI Home
              </button>

            </div>

          </div>

        </section>

      </div>
    );
  }

  // =========================
  // HOME PAGE
  // =========================

  return (
    <div className="app">

      {/* BACKGROUND */}

      <div className="background-effects">

        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>
        <div className="glow glow-three"></div>

        <div className="stars">
          {Array.from({ length: 35 }).map((_, index) => (
            <span key={index}></span>
          ))}
        </div>

      </div>

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">✦</span>
          Career<span>AI</span>
        </div>

        <div className="nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#how">
            How It Works
          </a>

          <a href="#about">
            About
          </a>

        </div>

        <button
          className="nav-button"
          onClick={openAnalyzer}
        >
          Get Started
        </button>

      </nav>

      {/* HERO */}

      <section className="hero">

        <div className="hero-left">

          <div className="badge">
            <span className="badge-dot"></span>
            AI-Powered Career Intelligence
          </div>

          <h1>
            Future With
            <br />
            <span>AI.</span>
          </h1>

          <p className="hero-description">
            Analyze your resume, discover your skill gaps,
            find matching opportunities and prepare for
            interviews — all in one intelligent career platform.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={openAnalyzer}
            >
              Analyze My Resume
              <span>→</span>
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              Explore Platform
            </button>

          </div>

          <div className="trust-row">

            <div>
              <strong>AI</strong>
              <span>Powered</span>
            </div>

            <div>
              <strong>PDF</strong>
              <span>Analysis</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Private</span>
            </div>

          </div>

        </div>

        {/* AI VISUAL */}

        <div className="hero-right">

          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>
          <div className="orbit orbit-three"></div>

          <div className="ai-core">

            <div className="ai-inner">

              <div className="ai-star">
                ✦
              </div>

              <div className="ai-title">
                AI
              </div>

              <div className="ai-subtitle">
                INTELLIGENCE
              </div>

            </div>

          </div>

          <div className="floating-card resume-card">

            <div className="card-icon">
              📄
            </div>

            <div>
              <strong>
                Resume AI
              </strong>

              <span>
                94% Match
              </span>
            </div>

          </div>

          <div className="floating-card skill-card">

            <div className="card-icon">
              🎯
            </div>

            <div>
              <strong>
                Skill Match
              </strong>

              <span>
                Excellent
              </span>
            </div>

          </div>

          <div className="floating-card interview-card">

            <div className="card-icon">
              🤖
            </div>

            <div>
              <strong>
                AI Interview
              </strong>

              <span>
                Ready
              </span>
            </div>

          </div>

          <div className="particle particle-one"></div>
          <div className="particle particle-two"></div>
          <div className="particle particle-three"></div>

        </div>

      </section>

      {/* FEATURES */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <div className="section-label">
            POWERFUL FEATURES
          </div>

          <h2>
            Everything you need to
            <span> grow your career.</span>
          </h2>

          <p>
            CareerAI turns your resume into actionable
            career intelligence.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">📄</div>

            <h3>
              Resume Analysis
            </h3>

            <p>
              Upload your PDF or DOCX resume and let
              CareerAI analyze your technical skills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧠</div>

            <h3>
              Skill Intelligence
            </h3>

            <p>
              Discover your existing skills and identify
              important missing career skills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>

            <h3>
              Career Match
            </h3>

            <p>
              Get a quick skill-based match score from
              your resume analysis.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>

            <h3>
              Career Growth
            </h3>

            <p>
              Understand where you can improve and build
              stronger career opportunities.
            </p>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section
        className="how-section"
        id="how"
      >

        <div className="section-heading">

          <div className="section-label">
            HOW IT WORKS
          </div>

          <h2>
            Your career analysis in
            <span> three steps.</span>
          </h2>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div>
              <h3>
                Upload Resume
              </h3>

              <p>
                Upload your PDF or DOCX resume.
              </p>
            </div>

          </div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div>
              <h3>
                AI Analysis
              </h3>

              <p>
                CareerAI extracts and analyzes your skills.
              </p>
            </div>

          </div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div>
              <h3>
                Get Intelligence
              </h3>

              <p>
                View your score, skills and missing skills.
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ABOUT */}

      <section
        className="about-section"
        id="about"
      >

        <div className="about-content">

          <div className="section-label">
            ABOUT CAREERAI
          </div>

          <h2>
            Build your future
            <span> with intelligence.</span>
          </h2>

          <p>
            CareerAI is an AI-powered career platform designed
            to help students and professionals understand their
            resume, skills and career growth opportunities.
          </p>

          <button
            className="primary-button"
            onClick={openAnalyzer}
          >
            Start Analysis →
          </button>

        </div>

      </section>

      {/* FOOTER */}

      <footer>

        <div className="footer-logo">
          <span>✦</span> CareerAI
        </div>

        <p>
          AI-powered career intelligence platform.
        </p>

        <div className="footer-line"></div>

        <small>
          © 2026 CareerAI. Built with AI & ❤️
        </small>

      </footer>

    </div>
  );
}

export default App;