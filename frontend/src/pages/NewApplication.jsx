import { useEffect, useState } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, message, Typography, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const { Title } = Typography;
const { TextArea } = Input;

export default function NewApplication() {
  const [courses, setCourses] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then((res) => setCourses(res.data.filter((c) => c.isActive)));
  }, []);

  const submit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
      };
      await api.post('/applications', payload);
      message.success('Application submitted for review (status: PENDING)');
      form.resetFields();
      navigate('/dashboard');
    } catch (e) {
      message.error(e?.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <Title level={4}>New Student Application</Title>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="applicantName" label="Applicant Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="gender" label="Gender">
              <Select
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="phone" label="Phone">
              <Input maxLength={15} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="courseId" label="Course" rules={[{ required: true }]}>
              <Select
                placeholder="Select course"
                options={courses.map((c) => ({ value: c.courseId, label: `${c.courseCode} — ${c.courseName}` }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="address" label="Address">
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="academicRecord" label="Academic Record / Previous Qualification">
              <TextArea rows={3} placeholder="e.g. 10+2 PCM 78%" />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Submit Application
        </Button>
      </Form>
    </Card>
  );
}
