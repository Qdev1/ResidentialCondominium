import { FileDoneOutlined, ExportOutlined, AppstoreOutlined, FolderOpenOutlined, FileTextOutlined, CarryOutOutlined, CalendarOutlined, BookOutlined, BlockOutlined, DashboardOutlined, ShoppingOutlined, CommentOutlined, CloudSyncOutlined, AlertOutlined, FileOutlined, BarcodeOutlined, PicLeftOutlined, BorderLeftOutlined, UserOutlined, ContainerOutlined } from '@ant-design/icons';
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
    {
      key: "residence-rules",
      title: "Quy định cư dân",
      link: "/residence-rules",
      icon: <FileDoneOutlined />
    },
    {
      key: "customer-enrollment",
      title: "Ghi danh khách hàng",
      link: "/customer-enrollment",
      icon: <ExportOutlined />
    },
    {
      key: "room-management",
      title: "Quản lý phòng",
      link: "/room-management",
      icon: <AppstoreOutlined />
    },
    {
      key: "contracts-management",
      title: "Quản lý giầy tờ",
      link: "/contracts-management",
      icon: <CarryOutOutlined />
    },
    {
      key: "complaint-management",
      title: "Quản lý kiểu nại",
      link: "/complaint-management",
      icon: <CalendarOutlined />
    },
    {
      key: "access-card",
      title: "Quản lý cấp thẻ",
      link: "/access-card",
      icon: <BookOutlined />
    },
    {
      key: "reception-management",
      title: "Quản lý đặt lịch",
      link: "/reception-management",
      icon: <BlockOutlined />
    },
    {
      key: "unauthorized-entry",
      title: "Kiểm tra ra vào",
      link: "/unauthorized-entry",
      icon: <FileTextOutlined />
    },
    {
      key: "emergency",
      title: "Vấn đề khẩn cấp",
      link: "/emergency",
      icon: <FolderOpenOutlined />
    },
    {
      key: "visitors",
      title: "Quản lý khách hàng",
      link: "/visitors",
      icon: <FolderOpenOutlined />
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
        height: 'calc(100% - 60px)',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)",
        overflowY: 'auto'
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