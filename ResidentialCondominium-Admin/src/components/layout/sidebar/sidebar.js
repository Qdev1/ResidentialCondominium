import { DashboardOutlined, ShoppingOutlined, CommentOutlined, CloudSyncOutlined, AlertOutlined, FileOutlined, BarcodeOutlined, PicLeftOutlined, BorderLeftOutlined, UserOutlined, ContainerOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import "./sidebar.css";

const { Sider } = Layout;

function Sidebar() {

  const history = useHistory();
  const location = useLocation();

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />
    },
    {
      key: "asset-management",
      title: "Quản lý tài sản",
      link: "/asset-management",
      icon: <ContainerOutlined />
    },
    {
      key: "sales-management",
      title: "Quản lý mua bán tài sản",
      link: "/sales-management",
      icon: <BarcodeOutlined />
    },
    {
      key: "asset-list",
      title: "Danh mục tài sản",
      link: "/asset-list",
      icon: <ShoppingOutlined />
    },
    {
      key: "maintenance-planning",
      title: "Kế hoạch bảo trì",
      link: "/maintenance-planning",
      icon: <BorderLeftOutlined />
    },
    {
      key: "vendor-management",
      title: "Quản lý nhà cung cấp",
      link: "/vendor-management",
      icon: <PicLeftOutlined />
    },
    {
      key: "asset-history",
      title: "Lịch sử mua bán",
      link: "/asset-history",
      icon: <AlertOutlined />
    },
    {
      key: "asset-report",
      title: "Báo cáo tài sản",
      link: "/asset-report",
      icon: <FileOutlined />
    },
    {
      key: "maintenance-history",
      title: "Lịch sử bảo trì",
      link: "/maintenance-history",
      icon: <CloudSyncOutlined />
    },
    {
      key: "residence-event",
      title: "Quản lý sự kiện cư dân",
      link: "/residence-event",
      icon: <CommentOutlined />
    },
  ];



  const navigate = (link, key) => {
    history.push(link);
  }

  useEffect(() => {
  })

  return (
    <Sider
      className={'ant-layout-sider-trigger'}
      width={230}
      style={{
        position: "fixed",
        top: 60,
        height: '100%',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)"
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={location.pathname.split("/")}
        defaultOpenKeys={['account']}
        style={{ height: '100%', borderRight: 0, backgroundColor: "#FFFFFF" }}
        theme='light'
      >

        {
          menuSidebarAdmin.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        }

      </Menu>

    </Sider >
  );
}

export default Sidebar;