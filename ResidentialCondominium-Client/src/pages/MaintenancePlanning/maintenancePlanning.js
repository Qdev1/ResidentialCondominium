import {
    CalendarOutlined,
    FileOutlined,
    HomeOutlined,
    ScheduleOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Input,
    Layout,
    Menu,
    Row,
    Space,
    Spin,
    Table
} from 'antd';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import maintenancePlanningApi from "../../apis/maintenancePlansApi";
import "./maintenancePlanning.css";

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

    const handleFilter = async (name) => {
        try {
            const res = await maintenancePlanningApi.searchMaintenancePlans(name);
            setCategory(res.data);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

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
                                Trang chủ
                            </Menu.Item>
                            <Menu.Item key="maintenance" icon={<FileOutlined />}>
                                Kế hoạch bảo trì
                            </Menu.Item>
                            <Menu.Item key="residence-event" icon={<ScheduleOutlined />}>
                                Sự kiện cư dân
                            </Menu.Item>
                            <Menu.Item key="emergency" icon={<ScheduleOutlined />}>
                                Vấn đề khẩn cấp
                            </Menu.Item>
                            <Menu.Item key="complaint-management" icon={<CalendarOutlined />}>
                                Khiếu nại
                            </Menu.Item>
                            <Menu.Item key="profile" icon={<TeamOutlined />}>
                                Trang cá nhân
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '0 50px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Kế hoạch bảo trì</Breadcrumb.Item>
                        </Breadcrumb>
                        <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo tên tài sản"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>
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