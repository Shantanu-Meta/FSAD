import { useEffect, useState } from 'react';
import { Card, Table, Tag, Segmented, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const { Title } = Typography;

const STATUS_COLORS = { PENDING: 'orange', APPROVED: 'green', REJECTED: 'red' };

export default function ApplicationList() {
  const [apps, setApps] = useState([]);
  const [courses, setCourses] = useState({});
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then((res) => {
      const map = {};
      res.data.forEach((c) => (map[c.courseId] = c.courseCode));
      setCourses(map);
    });
  }, []);

  const load = (s) => {
    setLoading(true);
    const url = s === 'ALL' ? '/applications' : `/applications?status=${s}`;
    api.get(url).then((res) => setApps(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => load(status), [status]);

  const columns = [
    { title: 'ID', dataIndex: 'applicationId', width: 70 },
    { title: 'Applicant', dataIndex: 'applicantName' },
    { title: 'Course', dataIndex: 'courseId', render: (id) => <Tag color="blue">{courses[id] || id}</Tag> },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s) => <Tag color={STATUS_COLORS[s]}>{s}</Tag>,
    },
    {
      title: 'Action',
      render: (_, r) => (
        <Button type="link" onClick={() => navigate(`/applications/${r.applicationId}`)}>
          View / Review
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Application Review</Title>
        <Segmented
          value={status}
          onChange={setStatus}
          options={['ALL', 'PENDING', 'APPROVED', 'REJECTED']}
        />
      </div>
      <Table
        rowKey="applicationId"
        loading={loading}
        dataSource={apps}
        columns={columns}
        onRow={(r) => ({ onClick: () => navigate(`/applications/${r.applicationId}`), style: { cursor: 'pointer' } })}
      />
    </Card>
  );
}
