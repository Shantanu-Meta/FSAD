import { useState } from 'react';
import {
  Card, Input, Button, Descriptions, Tag, Form, Select, InputNumber, message, Typography, Divider, Space, Empty,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const { Title } = Typography;

export default function FeeCollection() {
  const [roll, setRoll] = useState('');
  const [admission, setAdmission] = useState(null);
  const [course, setCourse] = useState(null);
  const [fees, setFees] = useState([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const search = async () => {
    if (!roll.trim()) return;
    setSearching(true);
    setAdmission(null);
    try {
      const res = await api.get(`/admissions/roll/${roll.trim()}`);
      setAdmission(res.data);
      const [c, f] = await Promise.all([
        api.get(`/courses/${res.data.courseId}`),
        api.get(`/courses/${res.data.courseId}/fees`),
      ]);
      setCourse(c.data);
      setFees(f.data);
    } catch (e) {
      message.error(e?.response?.data?.message || 'No admission found for that roll number');
    } finally {
      setSearching(false);
    }
  };

  const onFeeSelect = (feeId) => {
    const fee = fees.find((f) => f.feeId === feeId);
    if (fee) form.setFieldValue('amountPaid', fee.amount);
  };

  const submit = async (values) => {
    setSubmitting(true);
    try {
      const res = await api.post('/payments', {
        admissionId: admission.admissionId,
        feeId: values.feeId,
        amountPaid: values.amountPaid,
        paymentMode: values.paymentMode,
      });
      message.success(`Payment recorded. Invoice ${res.data.invoice.invoiceNumber} generated.`);
      navigate(`/invoice/${res.data.invoice.invoiceId}`);
    } catch (e) {
      message.error(e?.response?.data?.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <Title level={4}>Fee Collection</Title>

      <Space.Compact style={{ width: '100%', maxWidth: 480 }}>
        <Input
          placeholder="Enter Roll Number (e.g. BCA-2026-001)"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          onPressEnter={search}
        />
        <Button type="primary" icon={<SearchOutlined />} loading={searching} onClick={search}>
          Search
        </Button>
      </Space.Compact>

      {!admission && !searching && (
        <Empty style={{ marginTop: 40 }} description="Search a roll number to begin fee collection" />
      )}

      {admission && (
        <>
          <Divider />
          <Descriptions bordered column={2} size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Roll Number"><Tag color="blue">{admission.rollNumber}</Tag></Descriptions.Item>
            <Descriptions.Item label="Course">
              {course ? `${course.courseCode} — ${course.courseName}` : admission.courseId}
            </Descriptions.Item>
            <Descriptions.Item label="Academic Year">{admission.academicYear}</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color="green">{admission.status}</Tag></Descriptions.Item>
          </Descriptions>

          <Form form={form} layout="vertical" onFinish={submit} style={{ maxWidth: 480 }}>
            <Form.Item name="feeId" label="Fee Head" rules={[{ required: true }]}>
              <Select
                placeholder="Select fee head"
                onChange={onFeeSelect}
                options={fees.map((f) => ({
                  value: f.feeId,
                  label: `${f.feeType} — ₹${f.amount} (${f.academicYear})`,
                }))}
              />
            </Form.Item>
            <Form.Item name="amountPaid" label="Amount" rules={[{ required: true }]}>
              <InputNumber min={1} style={{ width: '100%' }} prefix="₹" />
            </Form.Item>
            <Form.Item name="paymentMode" label="Payment Mode" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 'CASH', label: 'Cash' },
                  { value: 'CHEQUE', label: 'Cheque' },
                  { value: 'ONLINE', label: 'Online' },
                ]}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Record Payment &amp; Generate Invoice
            </Button>
          </Form>
        </>
      )}
    </Card>
  );
}
