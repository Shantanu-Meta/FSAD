import { useEffect, useState } from 'react';
import {
  Card, Select, Table, Button, Modal, Form, Input, InputNumber, message, Typography, Space, Popconfirm, Tabs, Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

const { Title } = Typography;

export default function FeeStructure() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    api.get('/courses').then((res) => {
      setCourses(res.data);
      if (res.data.length) setCourseId(res.data[0].courseId);
    });
  }, []);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>Fee Structure &amp; Subjects</Title>
        <Select
          style={{ width: 320 }}
          value={courseId}
          onChange={setCourseId}
          placeholder="Select course"
          options={courses.map((c) => ({ value: c.courseId, label: `${c.courseCode} — ${c.courseName}` }))}
        />
      </div>

      {courseId && (
        <Tabs
          items={[
            { key: 'fees', label: 'Fee Heads', children: <Fees courseId={courseId} /> },
            { key: 'subjects', label: 'Subjects', children: <Subjects courseId={courseId} /> },
          ]}
        />
      )}
    </Card>
  );
}

function Fees({ courseId }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    api.get(`/courses/${courseId}/fees`).then((res) => setFees(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, [courseId]);

  const add = async (values) => {
    await api.post(`/courses/${courseId}/fees`, values);
    message.success('Fee head added');
    setOpen(false);
    form.resetFields();
    load();
  };

  const remove = async (feeId) => {
    await api.delete(`/courses/fees/${feeId}`);
    message.success('Removed');
    load();
  };

  const columns = [
    { title: 'Fee Type', dataIndex: 'feeType' },
    { title: 'Amount', dataIndex: 'amount', render: (a) => `₹ ${a}` },
    { title: 'Academic Year', dataIndex: 'academicYear' },
    {
      title: 'Action',
      render: (_, r) => (
        <Popconfirm title="Delete this fee head?" onConfirm={() => remove(r.feeId)}>
          <Button size="small" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Add Fee Head</Button>
      </Space>
      <Table rowKey="feeId" loading={loading} dataSource={fees} columns={columns} pagination={false} />

      <Modal title="Add Fee Head" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={add} initialValues={{ academicYear: '2024-25' }}>
          <Form.Item name="feeType" label="Fee Type (Tuition, Hostel, Exam...)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
          </Form.Item>
          <Form.Item name="academicYear" label="Academic Year" rules={[{ required: true }]}>
            <Input placeholder="2024-25" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function Subjects({ courseId }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    api.get(`/courses/${courseId}/subjects`).then((res) => setSubjects(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, [courseId]);

  const add = async (values) => {
    try {
      await api.post(`/courses/${courseId}/subjects`, values);
      message.success('Subject added');
      setOpen(false);
      form.resetFields();
      load();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Failed');
    }
  };

  const remove = async (subjectId) => {
    await api.delete(`/courses/subjects/${subjectId}`);
    load();
  };

  const columns = [
    { title: 'Code', dataIndex: 'subjectCode', render: (c) => <Tag>{c}</Tag> },
    { title: 'Subject', dataIndex: 'subjectName' },
    { title: 'Semester', dataIndex: 'semester' },
    {
      title: 'Action',
      render: (_, r) => (
        <Popconfirm title="Delete this subject?" onConfirm={() => remove(r.subjectId)}>
          <Button size="small" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Add Subject</Button>
      </Space>
      <Table rowKey="subjectId" loading={loading} dataSource={subjects} columns={columns} pagination={false} />

      <Modal title="Add Subject" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={add}>
          <Form.Item name="subjectName" label="Subject Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="subjectCode" label="Subject Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="semester" label="Semester" rules={[{ required: true }]}>
            <InputNumber min={1} max={12} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
