import { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Button, Space, Typography, Spin } from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  FileAddOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const { Title } = Typography;

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role === 'ADMIN') return <AdminDashboard navigate={navigate} />;
  return <ClerkDashboard navigate={navigate} user={user} />;
}

function AdminDashboard({ navigate }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/reports/summary')
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  return (
    <div>
      <Title level={3}>Admin Dashboard</Title>
      <Row gutter={[16, 16]} className="dashboard-cards">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Applications" value={summary.totalApplications} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Pending Review" value={summary.pending} valueStyle={{ color: '#d46b08' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Approved" value={summary.approved} valueStyle={{ color: '#389e0d' }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Rejected" value={summary.rejected} valueStyle={{ color: '#cf1322' }} prefix={<CloseCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Admissions" value={summary.totalAdmissions} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Available Seats" value={summary.availableSeats} suffix={`/ ${summary.totalSeats}`} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Courses" value={summary.totalCourses} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Fee Collected" value={summary.feeCollected} prefix="₹" />
          </Card>
        </Col>
      </Row>

      <Card title="Quick Actions" style={{ marginTop: 16 }}>
        <Space wrap>
          <Button type="primary" icon={<FileTextOutlined />} onClick={() => navigate('/applications')}>
            Review Applications
          </Button>
          <Button icon={<BookOutlined />} onClick={() => navigate('/courses')}>
            Manage Courses
          </Button>
          <Button icon={<DollarOutlined />} onClick={() => navigate('/fees')}>
            Fee Structure
          </Button>
          <Button icon={<UserOutlined />} onClick={() => navigate('/users')}>
            Manage Users
          </Button>
          <Button icon={<BookOutlined />} onClick={() => navigate('/reports')}>
            View Reports
          </Button>
        </Space>
      </Card>
    </div>
  );
}

function ClerkDashboard({ navigate, user }) {
  return (
    <div>
      <Title level={3}>Welcome, {user?.fullName || user?.username}</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card hoverable onClick={() => navigate('/applications/new')}>
            <Statistic title="New Student Application" value="Start" prefix={<FileAddOutlined />} />
            <Button type="primary" block style={{ marginTop: 16 }}>
              Enter Application
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable onClick={() => navigate('/fee-collection')}>
            <Statistic title="Fee Collection" value="Collect" prefix={<CreditCardOutlined />} />
            <Button block style={{ marginTop: 16 }}>
              Record Payment
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card hoverable onClick={() => navigate('/admissions')}>
            <Statistic title="Admissions" value="View" prefix={<UserOutlined />} />
            <Button block style={{ marginTop: 16 }}>
              View Admitted Students
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
