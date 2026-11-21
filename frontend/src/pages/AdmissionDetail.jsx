import { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Table, Typography, Spin, Button, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const { Title } = Typography;

export default function AdmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [admission, setAdmission] = useState(null);
  const [course, setCourse] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admissions/${id}`)
      .then((res) => {
        setAdmission(res.data);
        api.get(`/courses/${res.data.courseId}`).then((c) => setCourse(c.data));
        return api.get(`/payments/admission/${res.data.admissionId}`);
      })
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;

  const paymentCols = [
    { title: 'Payment ID', dataIndex: 'paymentId' },
    { title: 'Amount', dataIndex: 'amountPaid', render: (a) => `₹ ${a}` },
    { title: 'Mode', dataIndex: 'paymentMode', render: (m) => <Tag>{m}</Tag> },
    { title: 'Date', dataIndex: 'paymentDate' },
    { title: 'Status', dataIndex: 'paymentStatus', render: (s) => <Tag color="green">{s}</Tag> },
    {
      title: 'Invoice',
      render: (_, r) => (
        <Button
          type="link"
          onClick={async () => {
            const res = await api.get(`/invoices/payment/${r.paymentId}`);
            navigate(`/invoice/${res.data.invoiceId}`);
          }}
        >
          View Invoice
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Admission Details</Title>
        <Space>
          {user?.role === 'CLERK' && (
            <Button type="primary" onClick={() => navigate('/fee-collection')}>
              Collect Fees
            </Button>
          )}
          <Button onClick={() => navigate('/admissions')}>Back</Button>
        </Space>
      </div>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Roll Number"><Tag color="blue">{admission.rollNumber}</Tag></Descriptions.Item>
        <Descriptions.Item label="Status"><Tag color="green">{admission.status}</Tag></Descriptions.Item>
        <Descriptions.Item label="Course">
          {course ? `${course.courseCode} — ${course.courseName}` : admission.courseId}
        </Descriptions.Item>
        <Descriptions.Item label="Academic Year">{admission.academicYear}</Descriptions.Item>
        <Descriptions.Item label="Admission Date">{admission.admissionDate}</Descriptions.Item>
        <Descriptions.Item label="Application ID">{admission.applicationId}</Descriptions.Item>
      </Descriptions>

      <Title level={5} style={{ marginTop: 24 }}>Payment History</Title>
      <Table rowKey="paymentId" dataSource={payments} columns={paymentCols} pagination={false} />
    </Card>
  );
}
