import { useEffect, useState } from 'react';
import { Card, Table, Tag, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const { Title } = Typography;

export default function Admissions() {
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/courses').then((res) => {
      const map = {};
      res.data.forEach((c) => (map[c.courseId] = c.courseCode));
      setCourses(map);
    });
    api.get('/admissions').then((res) => setRows(res.data)).finally(() => setLoading(false));
  }, []);

  const columns = [
    { title: 'Roll Number', dataIndex: 'rollNumber', render: (r) => <Tag color="blue">{r}</Tag> },
    { title: 'Course', dataIndex: 'courseId', render: (id) => courses[id] || id },
    { title: 'Academic Year', dataIndex: 'academicYear' },
    { title: 'Admission Date', dataIndex: 'admissionDate' },
    { title: 'Status', dataIndex: 'status', render: (s) => <Tag color="green">{s}</Tag> },
    {
      title: 'Action',
      render: (_, r) => (
        <Button type="link" onClick={() => navigate(`/admissions/${r.admissionId}`)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Title level={4}>Admissions</Title>
      <Table rowKey="admissionId" loading={loading} dataSource={rows} columns={columns} />
    </Card>
  );
}
