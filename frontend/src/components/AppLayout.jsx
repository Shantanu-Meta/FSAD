import { Layout, Menu, Dropdown, Avatar, Typography, Space } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  DollarOutlined,
  FileTextOutlined,
  FileAddOutlined,
  CreditCardOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// Role-aware navigation (UI Design §2).
const ADMIN_MENU = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/users', icon: <TeamOutlined />, label: 'User Management' },
  { key: '/courses', icon: <BookOutlined />, label: 'Course Management' },
  { key: '/fees', icon: <DollarOutlined />, label: 'Fee Structure' },
  { key: '/applications', icon: <FileTextOutlined />, label: 'Application Review' },
  { key: '/admissions', icon: <UserOutlined />, label: 'Admissions' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
];

const CLERK_MENU = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/applications/new', icon: <FileAddOutlined />, label: 'New Application' },
  { key: '/fee-collection', icon: <CreditCardOutlined />, label: 'Fee Collection' },
  { key: '/admissions', icon: <UserOutlined />, label: 'Admissions' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = user?.role === 'ADMIN' ? ADMIN_MENU : CLERK_MENU;

  const userMenu = {
    items: [
      { key: 'change-password', icon: <LockOutlined />, label: 'Change Password' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout' },
    ],
    onClick: async ({ key }) => {
      if (key === 'logout') {
        await logout();
        navigate('/login');
      } else if (key === 'change-password') {
        navigate('/change-password');
      }
    },
  };

  // Highlight the best-matching menu key.
  const selectedKey =
    items
      .map((i) => i.key)
      .filter((k) => location.pathname === k || location.pathname.startsWith(k + '/'))
      .sort((a, b) => b.length - a.length)[0] || location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" theme="dark">
        <div
          style={{
            height: 56,
            margin: 16,
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1.2,
            textAlign: 'center',
          }}
        >
          Admission System
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            paddingInline: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Text strong style={{ fontSize: 16, color: '#1e3a8a' }}>
            College Admission Management System
          </Text>
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#1e3a8a' }} icon={<UserOutlined />} />
              <span>
                {user?.fullName || user?.username}{' '}
                <Text type="secondary">({user?.role})</Text>
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
