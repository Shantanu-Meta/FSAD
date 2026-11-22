import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Row, Col, Card } from 'antd';
import { useAuth } from '../context/AuthContext';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  BookOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';

const FEATURES = [
  { icon: <FileTextOutlined />, color: '#3b5bdb', bg: '#eef2ff', title: 'Application Management', desc: 'Clerks enter student applications digitally. No paper forms, no data loss.' },
  { icon: <CheckCircleOutlined />, color: '#2f9e44', bg: '#ebfbee', title: 'Approval Workflow', desc: 'Admins review, approve or reject applications with remarks in one click.' },
  { icon: <DollarOutlined />, color: '#e67700', bg: '#fff3e0', title: 'Fee Collection', desc: 'Record Cash, Cheque or Online payments against course fee heads instantly.' },
  { icon: <FileDoneOutlined />, color: '#c92a2a', bg: '#fff0f0', title: 'Invoice Generation', desc: 'Auto-numbered printable invoices generated the moment a payment is recorded.' },
  { icon: <BarChartOutlined />, color: '#862e9c', bg: '#f8f0fc', title: 'Reports & Analytics', desc: 'Real-time seat availability, admission trends and fee collection summaries.' },
  { icon: <SafetyCertificateOutlined />, color: '#1864ab', bg: '#e8f4fd', title: 'Role-Based Access', desc: 'Admin and Clerk roles with strictly enforced permissions at every API call.' },
];

const STEPS = [
  { n: '1', title: 'Clerk enters application', desc: 'Student details and course selection captured digitally.' },
  { n: '2', title: 'Admin reviews & decides', desc: 'Approve or reject with remarks — decision is final and audited.' },
  { n: '3', title: 'Roll number auto-generated', desc: 'System creates enrollment record (e.g. BCA-2026-001) on approval.' },
  { n: '4', title: 'Clerk collects fee', desc: 'Payment recorded per fee head with mode selection.' },
  { n: '5', title: 'Invoice printed', desc: 'Unique numbered receipt generated and ready to print.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e8ecf4',
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOutlined style={{ fontSize: 20, color: '#1e3a8a' }} />
          <span style={{ fontSize: 17, fontWeight: 700, color: '#1e3a8a', letterSpacing: '-0.3px' }}>
            AdmissionSystem
          </span>
        </div>
        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={() => navigate('/login')}
          style={{ background: '#1e3a8a', borderColor: '#1e3a8a', fontWeight: 600 }}
        >
          Sign In
        </Button>
      </nav>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1f5c 0%, #1e3a8a 55%, #3b5bdb 100%)',
        padding: '80px 48px 100px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 64, flexWrap: 'wrap', minHeight: 520,
      }}>
        {/* Left copy */}
        <div style={{ maxWidth: 540, flex: '1 1 320px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '1.2px',
            textTransform: 'uppercase', padding: '5px 14px', borderRadius: 20, marginBottom: 24,
          }}>
            BITS Pilani — FSAD Project
          </div>
          <h1 style={{
            fontSize: 52, fontWeight: 800, color: '#fff',
            lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-1px',
          }}>
            College Admission<br />
            <span style={{ color: '#93c5fd' }}>Management System</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 36 }}>
            A fully digital, role-based platform that streamlines every step of the
            college admission process — from application entry to fee invoice — with zero paperwork.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Button
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/login')}
              style={{
                background: '#fff', color: '#1e3a8a', borderColor: '#fff',
                fontWeight: 700, height: 48, padding: '0 28px', fontSize: 15,
                borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              Get Started
            </Button>
            <Button
              size="large"
              onClick={() => document.getElementById('lp-features').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', color: '#fff',
                borderColor: 'rgba(255,255,255,0.5)',
                height: 48, padding: '0 28px', fontSize: 15, borderRadius: 8,
              }}
            >
              Learn More
            </Button>
          </div>
        </div>

      </section>

      {/* STATS BAR */}
      <section style={{ background: '#fff', padding: '40px 48px', borderBottom: '1px solid #f0f4ff' }}>
        <Row gutter={[32, 24]} justify="center">
          {[
            { v: '8', l: 'Core Modules' },
            { v: '2', l: 'User Roles' },
            { v: '100%', l: 'Paperless' },
            { v: '1-Click', l: 'Invoice Print' },
          ].map((s) => (
            <Col key={s.l} xs={12} sm={6} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#1e3a8a', lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{s.l}</div>
            </Col>
          ))}
        </Row>
      </section>

      {/* FEATURES */}
      <section id="lp-features" style={{ background: '#f8faff', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>Everything you need</h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Six powerful modules covering the full admission lifecycle.</p>
          </div>
          <Row gutter={[24, 24]}>
            {FEATURES.map((f) => (
              <Col key={f.title} xs={24} sm={12} lg={8}>
                <Card
                  bordered={false}
                  style={{ height: '100%', borderRadius: 14, boxShadow: '0 2px 16px rgba(30,58,138,0.07)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  styles={{ body: { padding: 24 } }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(30,58,138,0.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px rgba(30,58,138,0.07)'; }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16, fontSize: 24, color: f.color,
                  }}>
                    {f.icon}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{f.title}</div>
                  <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#fff', padding: '80px 48px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>How it works</h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Five steps from application to receipt.</p>
          </div>
          {STEPS.map((s, i) => (
            <div key={s.n} style={{ display: 'flex', gap: 20, marginBottom: i < STEPS.length - 1 ? 0 : 0, position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 48px' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#1e3a8a,#3b5bdb)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 800, boxShadow: '0 4px 14px rgba(59,91,219,0.35)',
                }}>
                  {s.n}
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 2, flex: 1, minHeight: 32, background: 'linear-gradient(to bottom,#3b5bdb55,#3b5bdb11)', margin: '4px 0' }} />
                )}
              </div>
              <div style={{ paddingTop: 10, paddingBottom: i < STEPS.length - 1 ? 24 : 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section style={{ background: '#f8faff', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>Two roles, clearly separated</h2>
            <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Every permission enforced at the API layer.</p>
          </div>
          <Row gutter={[24, 24]} justify="center">
            {[
              {
                label: 'ADMIN', labelColor: '#1e3a8a', labelBg: '#1e3a8a',
                borderColor: '#1e3a8a', bg: 'linear-gradient(145deg,#f0f4ff,#e8eeff)',
                title: 'System Administrator',
                items: ['Manage courses, subjects & fee structures', 'Create and deactivate Clerk accounts', 'Review, approve or reject applications', 'View all reports and analytics', 'Full audit trail visibility'],
              },
              {
                label: 'CLERK', labelColor: '#2f9e44', labelBg: '#2f9e44',
                borderColor: '#2f9e44', bg: 'linear-gradient(145deg,#f0fff4,#e6f9ec)',
                title: 'Front Desk Staff',
                items: ['Enter new student applications', 'Search admitted students by roll number', 'Record fee payments (Cash / Cheque / Online)', 'Generate and print fee invoices', 'No access to admin functions'],
              },
            ].map((r) => (
              <Col key={r.label} xs={24} md={11}>
                <Card
                  bordered={false}
                  style={{ borderRadius: 16, borderTop: `4px solid ${r.borderColor}`, background: r.bg, boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}
                  styles={{ body: { padding: 28 } }}
                >
                  <div style={{
                    display: 'inline-block', background: r.labelBg, color: '#fff',
                    fontSize: 11, fontWeight: 800, letterSpacing: '1.5px',
                    padding: '4px 14px', borderRadius: 20, marginBottom: 14,
                  }}>
                    {r.label}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>{r.title}</div>
                  <ul style={{ paddingLeft: 18, margin: 0, color: '#374151', lineHeight: 2.1, fontSize: 14 }}>
                    {r.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        background: 'linear-gradient(135deg,#0f1f5c 0%,#1e3a8a 55%,#3b5bdb 100%)',
        padding: '80px 48px', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Ready to go paperless?</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: 32 }}>
          Sign in with your Admin or Clerk credentials to get started.
        </p>
        <Button
          size="large"
          icon={<ArrowRightOutlined />}
          onClick={() => navigate('/login')}
          style={{
            background: '#fff', color: '#1e3a8a', borderColor: '#fff',
            fontWeight: 700, height: 48, padding: '0 32px', fontSize: 15,
            borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}
        >
          Sign In Now
        </Button>
        <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
          Demo &nbsp;·&nbsp; Admin: <code style={{ background: 'rgba(255,255,255,0.12)', padding: '2px 7px', borderRadius: 4, color: '#93c5fd' }}>admin / admin123</code>
          &nbsp;·&nbsp; Clerk: <code style={{ background: 'rgba(255,255,255,0.12)', padding: '2px 7px', borderRadius: 4, color: '#93c5fd' }}>clerk / clerk123</code>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a1540', padding: '24px 48px', textAlign: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
          BITS Pilani WILP &nbsp;·&nbsp; Full Stack Application Development (SESAPZG503) &nbsp;·&nbsp; Debarghya Pal &amp; Shantanu Dutta
        </span>
      </footer>

      {/* keyframe for floating cards */}
      <style>{`
        @keyframes lpFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @media (max-width: 640px) {
          section { padding-left: 20px !important; padding-right: 20px !important; }
          h1 { font-size: 34px !important; }
        }
      `}</style>
    </div>
  );
}
