import { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Tag, Switch, message, Typography, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

const { Title } = Typography;
const { TextArea } = Input;

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    api.get('/courses').then((res) => setCourses(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const submit = async (values) => {
    try {
      if (editing) {
        await api.put(`/courses/${editing.courseId}`, values);
        message.success('Course updated');
      } else {
        await api.post('/courses', values);
        message.success('Course added');
      }
      setOpen(false);
      load();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Operation failed');
    }
  };

  const toggleActive = async (record) => {
    const action = record.isActive ? 'deactivate' : 'activate';
    await api.put(`/courses/${record.courseId}/${action}`);
    load();
  };

  const columns = [
    { title: 'Code', dataIndex: 'courseCode', render: (c) => <Tag color="blue">{c}</Tag> },
    { title: 'Course Name', dataIndex: 'courseName' },
    { title: 'Duration', dataIndex: 'durationYears', render: (d) => `${d} yr` },
    {
      title: 'Seats',
      render: (_, r) => (
        <div style={{ minWidth: 140 }}>
          <Progress
            percent={Math.round(((r.totalSeats - r.availableSeats) / r.totalSeats) * 100)}
            size="small"
            format={() => `${r.availableSeats}/${r.totalSeats}`}
          />
        </div>
      ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (active, r) => <Switch checked={!!active} onChange={() => toggleActive(r)} />,
    },
    {
      title: 'Action',
      render: (_, r) => (
        <Button size="small" onClick={() => openEdit(r)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Course Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add Course
        </Button>
      </div>

      <Table rowKey="courseId" loading={loading} dataSource={courses} columns={columns} />

      <Modal
        title={editing ? 'Edit Course' : 'Add Course'}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item name="courseName" label="Course Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="courseCode" label="Course Code (e.g. BCA)" rules={[{ required: true }]}>
            <Input disabled={!!editing} />
          </Form.Item>
          <Form.Item name="durationYears" label="Duration (years)" rules={[{ required: true }]}>
            <InputNumber min={1} max={6} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="totalSeats" label="Total Seats" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="eligibilityCriteria" label="Eligibility Criteria">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
