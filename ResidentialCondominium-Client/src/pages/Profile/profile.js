import {
    FormOutlined,
    HomeOutlined,
    CalendarOutlined,
    FileOutlined,
    ScheduleOutlined,
    TeamOutlined,
    SettingOutlined,
    FileProtectOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Form, Input,
    Layout,
    Modal,
    Row,
    Spin,
    notification,
    Menu
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import { useHistory } from 'react-router-dom';
import uploadFileApi from '../../apis/uploadFileApi';
import userApi from "../../apis/userApi";
import "./profile.css";

const { Header, Content, Footer } = Layout;


const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [file, setUploadFile] = useState();

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
                "image": file,
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

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

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
            case 'residence-rules':
                history.push('/residence-rules');
                break;
            case 'change-password':
                history.push('/change-password');
                break;
            default:
                break;
        }
    };

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
                            <Menu.Item key="residence-rules" icon={<FileProtectOutlined />}>
                               Nội quy tòa nhà
                            </Menu.Item>
                            <Menu.Item key="profile" icon={<TeamOutlined />}>
                                Trang cá nhân
                            </Menu.Item>
                            <Menu.Item key="change-password" icon={<SettingOutlined />}>
                                Thay đổi mật khẩu
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '0 50px' }}>
                        <div style={{ marginTop: 20, marginLeft: 24 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="">
                                    <HomeOutlined />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <FormOutlined />
                                    <span>Trang cá nhân</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                        <div>
                            <div>
                                <Row justify="center">
                                    <Col span="9" style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                                        <Card hoverable={true} className="profile-card" style={{ padding: 0, margin: 0 }}>
                                            <Row justify="center">
                                                <img
                                                    src={userData?.image}
                                                    style={{
                                                        width: 150,
                                                        height: 150,
                                                        borderRadius: '50%',
                                                    }}
                                                />
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
                                                        <p style={{ padding: 0, margin: 0, marginBottom: 0 }}>{userData?.birthday}</p>
                                                    </Row>
                                                    <Row justify="center">
                                                        <p style={{ padding: 0, margin: 0, marginBottom: 5 }}>{userData?.phone}</p>
                                                    </Row>
                                                    <Divider style={{ padding: 0, margin: 0 }} ></Divider>
                                                </Col>
                                                <Button type="primary" style={{ marginTop: 15 }} onClick={() => setVisibleModal(true)}>Cập nhật Profile</Button>

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
                        </div>
                    </Content>
                </Layout>

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
                            style={{ padding: '24px', maxWidth: '500px', margin: 'auto', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                        >
                            <Spin spinning={loading}>
                                <Form.Item
                                    label="Tên"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập username!',
                                        },
                                    ]}
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập email!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email không hợp lệ!',
                                        },
                                    ]}
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại!',
                                        },
                                        {
                                            pattern: /^[0-9]{10}$/,
                                            message: "Số điện thoại phải có 10 chữ số và chỉ chứa số",
                                        },
                                    ]}
                                    style={{ marginBottom: '16px' }}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item
                                    name="image"
                                    label="Chọn ảnh"
                                    style={{ marginBottom: '16px' }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChangeImage}
                                        id="avatar"
                                        name="file"
                                    />
                                </Form.Item>
                                <Form.Item style={{ marginTop: '16px' }}>
                                    <Button type="primary" htmlType="submit" style={{ width: '100%', backgroundColor: '#1890ff', borderColor: '#1890ff' }}>
                                        Cập nhật
                                    </Button>
                                </Form.Item>
                            </Spin>
                        </Form>
                    </Modal>
                </div>

            </Spin>
        </div >
    )
}

export default Profile;