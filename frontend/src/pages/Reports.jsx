import { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Progress, Statistic, Typography, Spin, Tag } from 'antd';
import api from '../api/client';

const { Title } = Typography;

export default function Reports() {
  const [seats, setSeats] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/seats'),
      api.get('/reports/admissions'),
      api.get('/reports/fees'),
    ])
      .then(([s, a, f]) => {
        setSeats(s.data);
        setAdmissions(a.data);
        setFees(f.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  const seatCols = [
    { title: 'Course', dataIndex: 'courseCode', render: (c) => <Tag color="blue">{c}</Tag> },
    { title: 'Name', dataIndex: 'courseName' },
    { title: 'Total', dataIndex: 'totalSeats' },
    { title: 'Filled', dataIndex: 'filledSeats' },
    { title: 'Available', dataIndex: 'availableSeats' },
    {
      title: 'Occupancy',
      render: (_, r) => (
        <Progress percent={Math.round((r.filledSeats / r.totalSeats) * 100)} size="small" style={{ width: 150 }} />
      ),
    },
  ];

  const admCols = [
    { title: 'Course', dataIndex: 'courseCode', render: (c) => <Tag color="blue">{c}</Tag> },
    { title: 'Name', dataIndex: 'courseName' },
    { title: 'Applications', dataIndex: 'applications' },
    { title: 'Admissions', dataIndex: 'admissions' },
  ];

  return (
    <div>
      <Title level={3}>Reports &amp; Analytics</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Total Fee Collected" value={fees.grandTotal} prefix="₹" />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Transactions" value={fees.transactionCount} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Payment Modes" value={Object.keys(fees.byMode).length} />
          </Card>
        </Col>
      </Row>

      <Card title="Seat Availability by Course" style={{ marginBottom: 16 }}>
        <Table rowKey="courseCode" dataSource={seats} columns={seatCols} pagination={false} />
      </Card>

      <Card title="Admission Count by Course" style={{ marginBottom: 16 }}>
        <Table rowKey="courseCode" dataSource={admissions} columns={admCols} pagination={false} />
      </Card>

      <Card title="Fee Collection by Payment Mode">
        <Row gutter={[16, 16]}>
          {Object.entries(fees.byMode).map(([mode, amount]) => (
            <Col xs={24} sm={8} key={mode}>
              <Card size="small">
                <Statistic title={mode} value={amount} prefix="₹" />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
