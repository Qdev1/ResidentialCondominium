import {
    HomeOutlined,
    FileOutlined,
    ScheduleOutlined,
    CalendarOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {
    BackTop, Breadcrumb,
    Spin,
    Table,
    Layout,
    Menu
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import maintenancePlanningApi from "../../apis/maintenancePlansApi";
import "./maintenancePlanning.css";
import { useHistory } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const MaintenancePlanning = () => {

    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên tài sản',
            dataIndex: 'asset_name',
            key: 'asset_name',
        },
        {
            title: 'Mô tả kế hoạch',
            dataIndex: 'plan_description',
            key: 'plan_description',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
    ];

    const handleMenuClick = (key) => {
        switch (key) {
            case 'home':
                history.push('/');
                break;
            case 'maintenance':
                history.push('/maintenance-planning');
                break;
            case 'residence-event':
                history.push('/residence-event');
                break;
            case 'profile':
                history.push('/profile');
                break;
            case 'emergency':
                history.push('/emergency');
                break;
            case 'complaint-management':
                history.push('/complaint-management');
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        (async () => {
            try {
                await maintenancePlanningApi.getAllMaintenancePlans().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <Layout className="layout" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Header style={{ display: 'flex', alignItems: 'center' }}>
                    <Menu theme="dark" mode="horizontal" onClick={({ key }) => handleMenuClick(key)}>
                            <Menu.Item key="home" icon={<HomeOutlined />}>
                                Home
                            </Menu.Item>
                            <Menu.Item key="maintenance" icon={<FileOutlined />}>
                                Maintenance
                            </Menu.Item>
                            <Menu.Item key="residence-event" icon={<ScheduleOutlined />}>
                                Residence Event
                            </Menu.Item>
                            <Menu.Item key="emergency" icon={<ScheduleOutlined />}>
                                Emergency
                            </Menu.Item>
                            <Menu.Item key="complaint-management" icon={<CalendarOutlined />}>
                                Complaint
                            </Menu.Item>

                            <Menu.Item key="profile" icon={<TeamOutlined />}>
                                Profile
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '0 50px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Kế hoạch bảo trì</Breadcrumb.Item>
                        </Breadcrumb>
                        <div className="site-layout-content" >
                            <div style={{ marginTop: 30 }}>
                                <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                            </div>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by CondoOperationsManagement</Footer>
                </Layout>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default MaintenancePlanning;