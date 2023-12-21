import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Form, Input, notification } from 'antd';
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";
import "./register.css";

const { Search } = Input;

const RegisterCustomer = () => {

    const [delivery, setDelivery] = useState([]);
    let history = useHistory();

    const onFinish = async (values) => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var date = yyyy + "-" + mm + "-" + dd;

        try {
            const formatData = {
                "email": values.email,
                "username": values.username,
                "password": values.password,
                "phone": values.phoneNo,
                "role": "resident",
                "status": "noactived"
            }
            await axiosClient.post("http://localhost:3100/api/auth/register", formatData)
                .then(response => {
                    console.log(response);
                    if (response === "Email is exist") {
                        return notification["error"]({
                            message: "Thông báo",
                            description: "Email đã tồn tại",

                        });
                    }
                    if (response === undefined) {
                        notification["error"]({
                            message: "Thông báo",
                            description: "Đăng ký thất bại",

                        });
                    }
                    else {
                        notification["success"]({
                            message: "Thông báo",
                            description: "Đăng kí thành công",
                        });
                        setTimeout(function () {
                            history.push("/login");
                        }, 1000);
                    }
                }
                );
        } catch (error) {
            throw error;
        }
    }
    return (
        <div>
            <div className="imageBackground">
                <div id="wrapper">
                    <Card id="dialog" bordered={false} >
                        <Form
                            style={{ width: 400, marginBottom: 8 }}
                            name="normal_login"
                            className="loginform"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item style={{ marginBottom: 3 }}>

                                <Divider style={{ marginBottom: 5, fontSize: 19 }} orientation="center">Condo Operations Management System!</Divider>
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 16 }}>
                                <p className="text">Đăng Kí Tài Khoản cư dân</p>
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên hiển thị!',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="siteformitemicon" />} placeholder="Tên hiển thị" />
                            </Form.Item >

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu!',
                                    },
                                    { max: 20, message: 'Mật khẩu tối đa 20 ký tự' },
                                    { min: 6, message: 'Mật khẩu ít nhất 5 ký tự' },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="siteformitemicon" />}
                                    type="password"
                                    placeholder="Mật khẩu"
                                />
                            </Form.Item>

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Vui lòng nhập email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input prefix={<MailOutlined className="siteformitemicon" />} placeholder="e-mail!" />
                            </Form.Item >

                            <Form.Item
                                style={{ marginBottom: 20 }}
                                name="phoneNo"
                                rules={[
                                    {
                                        required: true,
                                        whitespace: true,
                                        message: 'Vui lòng nhập số điện thoại!',
                                    },
                                    {
                                        pattern: new RegExp(/^[0-9]{10,15}$/g),
                                        message: 'Số điện thoại không hợp lệ, vui lòng kiểm tra lại!',
                                    },
                                ]}
                            >
                                <Input prefix={<PhoneOutlined className="siteformitemicon" />} placeholder="Số điện thoại" />
                            </Form.Item >

                            <Form.Item style={{ marginBottom: 18 }}>
                                <Button className="loginformbutton" type="primary" htmlType="submit"  >
                                    Đăng Kí
                                </Button>
                            </Form.Item>
                            <div className="link-login">
                                Đã có tài khoản? <Link className="link" to="/login">Đăng nhập</Link>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default RegisterCustomer;
