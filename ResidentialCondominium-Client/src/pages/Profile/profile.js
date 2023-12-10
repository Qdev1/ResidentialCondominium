import {
    ScheduleOutlined,
    HomeOutlined, PhoneOutlined,
    SafetyOutlined,
    UserOutlined,
    FileOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Form, Input,
    Modal,
    Row,
    Spin,
    notification,
    Layout,
    Menu,
    BackTop
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import userApi from "../../apis/userApi";
import "./profile.css";
import { useHistory } from 'react-router-dom';

const { Header, Content, Footer } = Layout;


const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const history = useHistory();

    const { data, isLoading, errorMessage } = useOpenWeather({
        key: '03b81b9c18944e6495d890b189357388',
        lat: '16.060094749570567',
        lon: '108.2097695823264',
        lang: 'en',
        unit: 'metric',
    });
    const handleList = () => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch profile user:' + error);
            }
        })();
    }

    useEffect(() => {
        (async () => {
            handleList();
        })();
        window.scrollTo(0, 0);
    }, [])

    const handleFormSubmit = async (values) => {
        try {
            const formatData = {
                "email": values.email,
                "phone": values.phone,
                "username": values.username,
            };
            console.log(userData);
            await userApi.updateProfile(formatData, userData.id)
                .then(response => {
                    console.log(response);
                    if (response === '' || response === undefined) {
                        notification.error({
                            message: 'Thông báo',
                            description: 'Cập nhật tài khoản thất bại',
                        });
                    } else {
                        notification.success({
                            message: 'Thông báo',
                            description: 'Cập nhật tài khoản thành công',
                        });
                        setVisibleModal(false)
                    }
                });
            handleList();
        } catch (error) {
            throw error;
        }
    };

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
            case 'logout':
                localStorage.clear();
                history.push("/");
                window.location.reload(false);
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <Spin spinning={loading}>
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
                                <Menu.Item key="profile" icon={<UserOutlined />}>
                                    Profile
                                </Menu.Item>
                                <Menu.Item key="logout" icon={<LogoutOutlined />}>
                                    Logout
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
                                    <div>
                                        <div>
                                            <Row justify="center">
                                                <Col span="9" style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                                    <Card hoverable={true} className="profile-card" style={{ padding: 0, margin: 0 }}>
                                                        <Row justify="center">
                                                            <img src={userData?.image} style={{ width: 150, height: 150 }}></img>
                                                        </Row>
                                                        <Row justify="center">
                                                            <Col span="24">
                                                                <Row justify="center">
                                                                    <strong style={{ fontSize: 18 }}>{userData?.username}</strong>
                                                                </Row>
                                                                <Row justify="center">
                                                                    <p style={{ padding: 0, margin: 0, marginBottom: 5 }}>{userData?.email}</p>
                                                                </Row>
                                                                <Row justify="center">
                                                                    <p>{userData?.birthday}</p>
                                                                </Row>
                                                                <Divider style={{ padding: 0, margin: 0 }} ></Divider>
                                                                <Row justify="center" style={{ marginTop: 10 }}>
                                                                    <Col span="4">
                                                                        <Row justify="center">
                                                                            <p>{<UserOutlined />}</p>
                                                                            <p style={{ marginLeft: 5 }}>{userData?.role}</p>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col span="8">
                                                                        <Row justify="center">
                                                                            <p>{<SafetyOutlined />}</p>
                                                                            <p style={{ marginLeft: 5 }}>{userData?.status ? "Đang hoạt động" : "Đã chặn"}</p>
                                                                        </Row>
                                                                    </Col>
                                                                    <Col span="8">
                                                                        <Row justify="center">
                                                                            <p>{<PhoneOutlined />}</p>
                                                                            <p style={{ marginLeft: 5 }}>{userData?.phone}</p>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                            <Button type="primary" style={{ marginRight: 10 }} onClick={() => setVisibleModal(true)}>Cập nhật Profile</Button>

                                                        </Row>

                                                    </Card>
                                                </Col>

                                                <Col span="6" style={{ marginTop: 20 }}>
                                                    <ReactWeather
                                                        isLoading={isLoading}
                                                        errorMessage={errorMessage}
                                                        data={data}
                                                        lang="en"
                                                        locationLabel="Hà Nội"
                                                        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
                                                        showForecast
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>                                </div>
                            </div>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by CondoOperationsManagement</Footer>
                    </Layout>
                    <BackTop style={{ textAlign: 'right' }} />
                </Spin>



                <div>
                    <Modal
                        title="Cập nhật thông tin cá nhân"
                        visible={isVisibleModal}
                        onCancel={() => setVisibleModal(false)}
                        footer={null}
                    >
                        <Form
                            initialValues={{
                                username: userData?.username,
                                email: userData?.email,
                                phone: userData?.phone,
                            }}
                            onFinish={handleFormSubmit}
                        >
                            <Form.Item
                                label="Tên"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập username!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                            ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Số điện thoại" name="phone" rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại!',
                                },
                            ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </Spin>
        </div >
    )
}

export default Profile;