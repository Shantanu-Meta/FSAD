import { useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import api from '../api/client';

const { Title } = Typography;

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const submit = async (values) => {
    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed successfully');
      form.resetFields();
    } catch (e) {
      message.error(e?.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 480 }}>
      <Title level={4}>Change Password</Title>
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item name="currentPassword" label="Current Password" rules={[{ required: true }]}>
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[{ required: true, min: 6, message: 'At least 6 characters' }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Confirm New Password"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Password
        </Button>
      </Form>
    </Card>
  );
}
