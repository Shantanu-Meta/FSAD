import { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, Switch, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

const { Title } = Typography;

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => {
    setLoading(true);
    api.get('/users').then((res) => setUsers(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const createUser = async (values) => {
    try {
      await api.post('/users', values);
      message.success('User created');
      setOpen(false);
      form.resetFields();
      load();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Failed to create user');
    }
  };

  const toggleActive = async (record) => {
    const action = record.isActive ? 'deactivate' : 'activate';
    try {
      await api.put(`/users/${record.userId}/${action}`);
      message.success(`User ${action}d`);
      load();
    } catch (e) {
      message.error('Failed to update user');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'userId', width: 70 },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Full Name', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (r) => <Tag color={r === 'ADMIN' ? 'blue' : 'green'}>{r}</Tag>,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (active, record) => (
        <Switch
          checked={!!active}
          onChange={() => toggleActive(record)}
          disabled={record.role === 'ADMIN'}
        />
      ),
    },
  ];

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>User Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add New User
        </Button>
      </div>

      <Table rowKey="userId" loading={loading} dataSource={users} columns={columns} />

      <Modal
        title="Add New User"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form form={form} layout="vertical" onFinish={createUser} initialValues={{ role: 'CLERK' }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Temporary Password"
            rules={[{ required: true, min: 6, message: 'At least 6 characters' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="fullName" label="Full Name">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'CLERK', label: 'Clerk' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
