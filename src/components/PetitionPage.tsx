import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/landing-page.css';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Avatar, Button } from '@mui/material';
import { trackButtonClick } from '../services/googleAnalytics';
import { Helmet } from 'react-helmet-async';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Component for animating numbers
interface CountingNumberProps {
  value: string | number;
  prefix?: string;
  suffix?: string;
}

const CountingNumber: React.FC<CountingNumberProps> = ({ value, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const endValue = parseInt(value.toString());
      const duration = 2000; // 2 seconds
      const increment = Math.ceil(endValue / (duration / 50)); // Update every 50ms
      
      const timer = setInterval(() => {
        startValue += increment;
        if (startValue > endValue) {
          clearInterval(timer);
          setDisplayValue(endValue);
        } else {
          setDisplayValue(startValue);
        }
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <motion.span ref={ref} className="stat-value">
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
};

// Testimonials data
const testimonials = [
  {
    name: "Priya Mehra",
    image: "/images/home-page/testimonials/Priya Mehra.avif",
    quote: "I didn't know I was signing my life away.",
    story: "It sounded like a dream. A guaranteed vacation spot, every year. But after the first year, the fees went up... and up. And we could never book when we wanted. We tried to cancel, but it felt like hitting a wall. Signing this petition was the first time I felt like maybe someone was finally listening."
  },
  {
    name: "Sofia Bennett",
    image: "/images/home-page/testimonials/Sofia Bennett.avif",
    quote: "We were threatened when we tried to leave.",
    story: "When we called to cancel, they told us we'd ruin our credit, that we'd be sued, that there was no way out. We felt bullied. And honestly, we backed down. This petition is a chance to stand up — not just for us, but for every family they've scared into silence."
  },
  {
    name: "Daniel Wu",
    image: "/images/home-page/testimonials/Daniel Wu.avif",
    quote: "We trusted them. That was the mistake.",
    story: "They made it sound so simple. Three days to cancel. But there were hidden clauses we didn't even know existed. By the time we figured it out, it was too late. I'm speaking up now because I don't want anyone else to go through what we did. This petition matters."
  }
];

interface PetitionPageProps {}

const PetitionPage: React.FC<PetitionPageProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureCount, setSignatureCount] = useState(3427);
  const signatureGoal = 10000;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch signature count from the API
    fetch('/api/signatures/count')
      .then(response => response.json())
      .then(data => {
        if (data.count) {
          setSignatureCount(data.count);
        }
      })
      .catch(error => console.error('Error fetching signature count:', error));
  }, []);

  const handleSignNow = () => {
    trackButtonClick('sign_petition_main');
    window.location.href = '/sign/84dec50d-d877-4f15-9250-f5364124371a';
  };

  // Calculate progress percentage
  const progressPercentage = ((signatureCount / signatureGoal) * 100).toFixed(1);

  return (
    <div className="landing-page">
      <Helmet>
        <title>Sign the Petition | ePSF</title>
        <meta
          name="description"
          content="Join the fight against timeshare scams. Sign our petition to protect consumers and hold companies accountable."
        />
      </Helmet>
      {/* Add Bootstrap Icons CDN */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <motion.div 
              className="hero-text"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.h1 className="hero-title" variants={fadeIn}>
                Tired of Timeshare Scams and Unfair Contracts?
              </motion.h1>
              <motion.p className="hero-subtitle" variants={fadeIn}>
                You Deserve Fairness—Sign Our Petition to Fight Back
              </motion.p>
              <motion.p className="hero-description" variants={fadeIn}>
                As a timeshare owner, you want vacations, not headaches. But scams, fraud, and impossible 
                cancellation rules have turned your dream into a nightmare. You're not alone—thousands face 
                the same unfair practices.
              </motion.p>
              <motion.div className="trust-badges" variants={fadeIn}>
                <div className="trust-badge">
                  <i className="bi bi-people-fill trust-icon"></i>
                  <div className="badge-content">
                    <span className="badge-text">{signatureCount} Owners Joined</span>
                  </div>
                </div>
                <div className="trust-badge">
                  <i className="bi bi-shield-fill-check trust-icon"></i>
                  <div className="badge-content">
                    <span className="badge-text">Nonprofit Advocacy</span>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} style={{ marginTop: '2rem' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  style={{
                    display: 'inline-block',
                    padding: '1rem 2rem',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    backgroundColor: '#E0AC3F',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onClick={handleSignNow}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                    e.currentTarget.style.backgroundColor = '#c99b38';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.backgroundColor = '#E0AC3F';
                  }}
                >
                  Sign the Petition Now
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="hero-image-wrapper"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
            >
              <img 
                src="/images/ePSF Google ad images (1) (1).png" 
                alt="Timeshare contract with scam stamp"
                className="hero-img"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problems" className="problems-section">
        <div className="container">
          <motion.h2 
            className="section-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            The Timeshare Trap Is Real
          </motion.h2>
          <motion.div 
            className="problem-cards"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="problem-card" variants={fadeIn}>
              <div className="icon-circle">
                <img src="/images/High-Pressure-Sales.png" alt="High Pressure Sales Icon" className="problem-icon" />
              </div>
              <h3>High-Pressure Sales</h3>
              <p>Aggressive tactics and misleading promises force you into rushed decisions you'll regret.</p>
            </motion.div>
            <motion.div className="problem-card" variants={fadeIn}>
              <div className="icon-circle">
                <img src="/images/Hidden-Fees.png" alt="Hidden Fees Icon" className="problem-icon" />
              </div>
              <h3>Hidden Fees</h3>
              <p>Unexpected costs and rising maintenance fees drain your savings year after year.</p>
            </motion.div>
            <motion.div className="problem-card" variants={fadeIn}>
              <div className="icon-circle">
                <img src="/images/No-way-out.png" alt="No Way Out Icon" className="problem-icon" />
              </div>
              <h3>No Way Out</h3>
              <p>Limited cancellation rights and short rescission periods trap you in unwanted contracts.</p>
            </motion.div>
          </motion.div>
          <motion.div 
            className="stats-strip"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="stat-item" variants={scaleIn}>
              <CountingNumber value="87" suffix="%" />
              <span className="stat-label">Regret Their Purchase</span>
            </motion.div>
            <motion.div className="stat-item" variants={scaleIn}>
              <motion.span className="stat-value" variants={fadeIn}>3-10</motion.span>
              <span className="stat-label">Days to Cancel</span>
            </motion.div>
            <motion.div className="stat-item" variants={scaleIn}>
              <CountingNumber value="22" prefix="$" suffix="K" />
              <span className="stat-label">Average Loss</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" style={{ backgroundColor: '#f5f5f5', padding: '4rem 0' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              className="section-title"
              variants={fadeIn}
              style={{
                textAlign: 'center',
                marginBottom: '2rem',
                color: '#01BD9B'
              }}
            >
              Real Stories. Real Impact.
            </motion.h2>
            <motion.p
              variants={fadeIn}
              style={{
                textAlign: 'center',
                fontSize: '1.2rem',
                color: '#666',
                maxWidth: '800px',
                margin: '0 auto 3rem'
              }}
            >
              These are just a few of the thousands of stories we've heard. Each one represents a family that deserved better.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                padding: '0 1rem'
              }}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease',
                  }}
                  whileHover={{
                    transform: 'translateY(-8px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={{
                        width: '64px',
                        height: '64px',
                        border: '2px solid #01BD9B'
                      }}
                    />
                    <div>
                      <h3 style={{ margin: '0', fontSize: '1.2rem', fontWeight: '600' }}>
                        {testimonial.name}
                      </h3>
                      <p style={{ margin: '0.5rem 0 0', color: '#01BD9B', fontStyle: 'italic' }}>
                        {testimonial.quote}
                      </p>
                    </div>
                  </div>
                  <p style={{ margin: '0', color: '#666', lineHeight: '1.6' }}>
                    {testimonial.story}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
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
                  <span>Advocating for Fairness Since</span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill check-icon"></i>
                  <span>Fighting for Timeshare Justice</span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill check-icon"></i>
                  <span>A Trusted Voice for Timeshare Reform</span>
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
              to="/sign/84dec50d-d877-4f15-9250-f5364124371a" 
              className="cta-button"
            >
              Submit Your Signature
              <i className="bi bi-arrow-right button-icon"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="outcomes-section">
        <div className="container">
          <motion.div 
            className="outcomes-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div 
              className="outcome success"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3>With Your Signature</h3>
              <ul>
                <motion.li variants={fadeIn}><i className="bi bi-check-lg outcome-icon"></i>Stronger consumer protections</motion.li>
                <motion.li variants={fadeIn}><i className="bi bi-check-lg outcome-icon"></i>Fair cancellation rights</motion.li>
                <motion.li variants={fadeIn}><i className="bi bi-check-lg outcome-icon"></i>Extended rescission periods</motion.li>
                <motion.li variants={fadeIn}><i className="bi bi-check-lg outcome-icon"></i>End to predatory practices</motion.li>
              </ul>
            </motion.div>
            <motion.div 
              className="outcome failure"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3>Without Action</h3>
              <ul>
                <motion.li variants={fadeIn}><i className="bi bi-x-lg outcome-icon"></i>More families scammed</motion.li>
                <motion.li variants={fadeIn}><i className="bi bi-x-lg outcome-icon"></i>Continued exploitation</motion.li>
                <motion.li variants={fadeIn}><i className="bi bi-x-lg outcome-icon"></i>Limited legal recourse</motion.li>
                <motion.li variants={fadeIn}><i className="bi bi-x-lg outcome-icon"></i>Growing financial burden</motion.li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="final-cta-section">
        <div className="container">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Fuel the Fight for Consumer Protection
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.p className="subtitle" variants={fadeIn}>
              Timeshare fraud and unfair contracts harm thousands of families every year. 
            </motion.p>
            <motion.p className="subtitle" variants={fadeIn}>
              Your donation helps us push for stronger laws, hold bad actors accountable, 
              and protect consumers from financial traps.
            </motion.p>
            <motion.p className="subtitle" variants={fadeIn}>
              Stand with us—every dollar makes a difference.
            </motion.p>
            <motion.a 
              href="/donation.html"
              className="cta-button pulse"
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Donate Now
              <i className="bi bi-heart button-icon"></i>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="disclaimer-section">
        <div className="container">
          <div className="disclaimer-content">
            <h4>Petition Disclaimer:</h4>
            <p>
              This petition is for informational and advocacy purposes only. It does not constitute legal advice or representation. The organizers are not attorneys and are not affiliated with any law firm. Statements in this petition reflect personal experiences, publicly available information, and concerns shared by affected timeshare owners. All individuals are encouraged to consult a licensed attorney for legal advice regarding their own circumstances. The petition's purpose is to raise awareness and advocate for consumer protections, transparency, and reform in the timeshare industry.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PetitionPage; 