import { useEffect, useState } from 'react';
import { Card, Button, Spin, Descriptions, Divider, Typography, Space } from 'antd';
import { PrinterOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';

const { Title, Text } = Typography;

export default function InvoicePrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/invoices/${id}`).then((res) => setInv(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;
  if (!inv) return <div>Invoice not found</div>;

  return (
    <div>
      <Space className="no-print" style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
          Print Invoice
        </Button>
      </Space>

      <Card className="invoice-print-area">
        <div className="invoice-header">
          <Title level={3} style={{ margin: 0, color: '#1e3a8a' }}>BITS College</Title>
          <Text type="secondary">Admission Management System</Text>
          <Title level={4} style={{ marginTop: 12 }}>FEE RECEIPT / INVOICE</Title>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <Text strong>Invoice No: </Text>{inv.invoiceNumber}<br />
            <Text strong>Date: </Text>{inv.invoiceDate}
          </div>
          <div style={{ textAlign: 'right' }}>
            <Text strong>Roll Number: </Text>{inv.rollNumber}<br />
            <Text strong>Academic Year: </Text>{inv.academicYear}
          </div>
        </div>

        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Student Name">{inv.applicantName}</Descriptions.Item>
          <Descriptions.Item label="Course">{inv.courseName} ({inv.courseCode})</Descriptions.Item>
          <Descriptions.Item label="Fee Type">{inv.feeType}</Descriptions.Item>
          <Descriptions.Item label="Payment Mode">{inv.paymentMode}</Descriptions.Item>
          <Descriptions.Item label="Payment Date">{inv.paymentDate}</Descriptions.Item>
        </Descriptions>

        <Divider />
        <div style={{ textAlign: 'right' }}>
          <Title level={3} style={{ margin: 0 }}>Total Paid: ₹ {inv.totalAmount}</Title>
        </div>

        <Divider />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
          <Text type="secondary">This is a computer-generated receipt.</Text>
          <Text type="secondary">Authorised Signatory</Text>
        </div>
      </Card>
    </div>
  );
}
