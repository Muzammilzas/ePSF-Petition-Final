import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/landing-page.css';

const NewLandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignNow = () => {
    window.location.href = '/sign/84dec50d-d877-4f15-9250-f5364124371a';
  };

  return (
    <div className="landing-page">
      {/* Add Bootstrap Icons CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Tired of Timeshare Scams and Unfair Contracts?</h1>
              <p className="hero-subtitle">You Deserve Fairness—Sign Our Petition to Fight Back</p>
              <p className="hero-description">
                As a timeshare owner, you want vacations, not headaches. But scams, fraud, and impossible 
                cancellation rules have turned your dream into a nightmare. You're not alone—thousands face 
                the same unfair practices.
              </p>
              <div className="trust-badges">
                <div className="trust-badge">
                  <i className="bi bi-people-fill trust-icon"></i>
                  <span>3,427 Owners Joined</span>
                </div>
                <div className="trust-badge">
                  <i className="bi bi-shield-fill-check trust-icon"></i>
                  <span>Nonprofit Advocacy</span>
                </div>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <img 
                src="/images/ePSF Google ad images (1) (1).png" 
                alt="Timeshare contract with scam stamp"
                className="hero-img"
              />
              <span className="image-tag">End the Nightmare</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="problems-section">
        <div className="container">
          <h2 className="section-title">The Timeshare Trap Is Real</h2>
          <div className="problem-cards">
            <div className="problem-card">
              <div className="icon-circle">
                <img src="/images/High-Pressure-Sales.png" alt="High Pressure Sales Icon" className="problem-icon" />
              </div>
              <h3>High-Pressure Sales</h3>
              <p>Aggressive tactics and misleading promises force you into rushed decisions you'll regret.</p>
            </div>
            <div className="problem-card">
              <div className="icon-circle">
                <img src="/images/Hidden-Fees.png" alt="Hidden Fees Icon" className="problem-icon" />
              </div>
              <h3>Hidden Fees</h3>
              <p>Unexpected costs and rising maintenance fees drain your savings year after year.</p>
            </div>
            <div className="problem-card">
              <div className="icon-circle">
                <img src="/images/No-way-out.png" alt="No Way Out Icon" className="problem-icon" />
              </div>
              <h3>No Way Out</h3>
              <p>Limited cancellation rights and short rescission periods trap you in unwanted contracts.</p>
            </div>
          </div>
          <div className="stats-strip">
            <div className="stat-item">
              <span className="stat-value">87%</span>
              <span className="stat-label">Regret Their Purchase</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">3-10</span>
              <span className="stat-label">Days to Cancel</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">$22K</span>
              <span className="stat-label">Average Loss</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Section */}
      <section id="about" className="guide-section">
        <div className="container">
          <div className="guide-content">
            <div className="guide-text">
              <h2 className="section-title">Meet Your Ally: ePublic Safety Foundation</h2>
              <p className="guide-description">
                We're the nonprofit fighting for timeshare owners like you. With years of advocacy, 
                we've seen the scams and heard the stories. Now, we're leading the charge with a 
                petition to stop timeshare fraud and demand fair laws.
              </p>
              <ul className="credentials-list">
                <li>
                  <i className="bi bi-check-circle-fill check-icon"></i>
                  <span>10+ Years of Advocacy</span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill check-icon"></i>
                  <span>5,000+ Owners Helped</span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill check-icon"></i>
                  <span>Nonprofit Status</span>
                </li>
              </ul>
            </div>
            <div className="guide-image">
              <img src="/images/ePSF Google ad images (2) (1).png" alt="ePSF Team" />
            </div>
          </div>
        </div>
      </section>

      {/* Plan Section */}
      <section id="our-plan" className="plan-section">
        <div className="container">
          <h2 className="section-title">Our 3-Step Plan to Protect You</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon-circle">
                <img src="/images/Sign the petition.png" alt="Sign Petition Icon" className="step-icon" />
              </div>
              <h3>Sign the Petition</h3>
              <p>Add your name to demand timeshare scam prevention and stronger cancellation rights.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon-circle">
                <img src="/images/Join the Owners Group.png" alt="Join Owners Group Icon" className="step-icon" />
              </div>
              <h3>Join the Owners Group</h3>
              <p>Unite with thousands in our timeshare owners group to amplify your voice.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon-circle">
                <img src="/images/Push for Change.png" alt="Push for Change Icon" className="step-icon" />
              </div>
              <h3>Push for Change</h3>
              <p>We'll deliver your signatures to lawmakers for a fair rescission period and real protections.</p>
            </div>
          </div>
          <div className="plan-cta">
            <Link 
              to="http://localhost:5174/sign/84dec50d-d877-4f15-9250-f5364124371a" 
              className="cta-button"
            >
              Take the First Step
              <i className="bi bi-arrow-right button-icon"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="outcomes-section">
        <div className="container">
          <div className="outcomes-grid">
            <div className="outcome success">
              <h3>With Your Signature</h3>
              <ul>
                <li><i className="bi bi-check-lg outcome-icon"></i>Stronger consumer protections</li>
                <li><i className="bi bi-check-lg outcome-icon"></i>Fair cancellation rights</li>
                <li><i className="bi bi-check-lg outcome-icon"></i>Extended rescission periods</li>
                <li><i className="bi bi-check-lg outcome-icon"></i>End to predatory practices</li>
              </ul>
            </div>
            <div className="outcome failure">
              <h3>Without Action</h3>
              <ul>
                <li><i className="bi bi-x-lg outcome-icon"></i>More families scammed</li>
                <li><i className="bi bi-x-lg outcome-icon"></i>Continued exploitation</li>
                <li><i className="bi bi-x-lg outcome-icon"></i>Limited legal recourse</li>
                <li><i className="bi bi-x-lg outcome-icon"></i>Growing financial burden</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <h2>Take Action: Sign Today</h2>
          <p className="subtitle">Your Signature Can End Timeshare Fraud</p>
          <div className="signature-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '68.5%' }}></div>
            </div>
            <p className="progress-text">3,427 of 5,000 signatures</p>
          </div>
          <Link 
            to="http://localhost:5174/sign/84dec50d-d877-4f15-9250-f5364124371a" 
            className="cta-button pulse"
          >
            Submit Your Signature
            <i className="bi bi-pen button-icon"></i>
          </Link>
        </div>
      </section>

      {/* Petition Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-modal" onClick={() => setIsModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-content">
              <h2>Sign the Petition Against Timeshare Fraud</h2>
              <p>Join 3,427 owners fighting for fair practices</p>
              <form className="petition-form">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="comment">Comment (Optional)</label>
                  <textarea id="comment" rows={4}></textarea>
                </div>
                <p className="privacy-notice">
                  Your information is secure and will only be used for petition purposes.
                </p>
                <button type="submit" className="cta-button">
                  Sign the Petition
                  <i className="bi bi-pen button-icon"></i>
                </button>
                <div className="modal-trust">
                  <div className="trust-item">
                    <i className="bi bi-shield-lock-fill modal-icon"></i>
                    <span>Secure & Private</span>
                  </div>
                  <div className="trust-item">
                    <i className="bi bi-people-fill modal-icon"></i>
                    <span>3,427 Signatures</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewLandingPage; 