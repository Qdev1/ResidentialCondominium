import {
    FormOutlined,
    HomeOutlined, PhoneOutlined,
    SafetyOutlined,
    UserOutlined
} from '@ant-design/icons';
import {
    Breadcrumb,
    Card,
    Col,
    Divider,
    Row,
    Spin,
    notification,
    Form, Input,
    Button, Modal
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReactWeather, { useOpenWeather } from 'react-open-weather';
import { useHistory } from 'react-router-dom';
import userApi from "../../apis/userApi";
import "./profile.css";
import uploadFileApi from '../../apis/uploadFileApi';


const Profile = () => {

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [isVisibleModal, setVisibleModal] = useState(false);
    const [file, setUploadFile] = useState();

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

    return (
        <div>
            <Spin spinning={loading}>
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
                </div>

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
                                <Form.Item
                                    name="image"
                                    label="Chọn ảnh"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ảnh!',
                                        },
                                    ]}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChangeImage}
                                        id="avatar"
                                        name="file"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
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