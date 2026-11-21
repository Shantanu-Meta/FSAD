import { useEffect, useState } from 'react';
import {
  Card, Descriptions, Tag, Button, Space, Modal, Input, message, Typography, Spin, Result,
} from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';

const { Title } = Typography;
const { TextArea } = Input;
const STATUS_COLORS = { PENDING: 'orange', APPROVED: 'green', REJECTED: 'red' };

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null); // 'approve' | 'reject'
  const [remarks, setRemarks] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get(`/applications/${id}`)
      .then((res) => {
        setApp(res.data);
        return api.get(`/courses/${res.data.courseId}`);
      })
      .then((res) => setCourse(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const confirm = async () => {
    setBusy(true);
    try {
      if (action === 'approve') {
        const res = await api.put(`/applications/${id}/approve`, { remarks });
        message.success(`Approved. Roll number: ${res.data.rollNumber}`);
      } else {
        await api.put(`/applications/${id}/reject`, { remarks });
        message.success('Application rejected');
      }
      setAction(null);
      setRemarks('');
      load();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Operation failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 80 }} />;
  if (!app) return <Result status="404" title="Application not found" />;

  const isPending = app.status === 'PENDING';

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Application #{app.applicationId} <Tag color={STATUS_COLORS[app.status]}>{app.status}</Tag>
        </Title>
        <Button onClick={() => navigate('/applications')}>Back to List</Button>
      </div>

      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Applicant Name">{app.applicantName}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">{app.dateOfBirth}</Descriptions.Item>
        <Descriptions.Item label="Gender">{app.gender}</Descriptions.Item>
        <Descriptions.Item label="Phone">{app.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{app.email}</Descriptions.Item>
        <Descriptions.Item label="Course">
          {course ? `${course.courseCode} — ${course.courseName}` : app.courseId}
        </Descriptions.Item>
        <Descriptions.Item label="Eligibility (course)" span={2}>
          {course?.eligibilityCriteria}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>{app.address}</Descriptions.Item>
        <Descriptions.Item label="Academic Record" span={2}>{app.academicRecord}</Descriptions.Item>
        {app.remarks && (
          <Descriptions.Item label="Review Remarks" span={2}>{app.remarks}</Descriptions.Item>
        )}
      </Descriptions>

      {isPending ? (
        <Space style={{ marginTop: 24 }}>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => setAction('approve')}>
            Approve
          </Button>
          <Button danger icon={<CloseCircleOutlined />} onClick={() => setAction('reject')}>
            Reject
          </Button>
        </Space>
      ) : (
        <div style={{ marginTop: 24 }}>
          <Tag color={STATUS_COLORS[app.status]}>
            Decision is final — status changes are irreversible
          </Tag>
        </div>
      )}

      <Modal
        title={action === 'approve' ? 'Approve Application' : 'Reject Application'}
        open={!!action}
        onCancel={() => setAction(null)}
        onOk={confirm}
        confirmLoading={busy}
        okText={action === 'approve' ? 'Approve' : 'Reject'}
        okButtonProps={{ danger: action === 'reject' }}
      >
        <p>
          {action === 'approve'
            ? 'Approving will auto-create an admission with a generated roll number. This is irreversible.'
            : 'Rejecting is irreversible. Please provide remarks.'}
        </p>
        <TextArea
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks"
        />
      </Modal>
    </Card>
  );
}
