import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Table,
    Row,
    Space,
    Spin,
    Select,
    notification,
    DatePicker
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userApi from "../../../apis/userApi";
import "./notification.css";
import dayjs from 'dayjs';
const { Option } = Select;

const Visitors = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [newsList, setNewsList] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "title": values.title,
                "content": values.content,
                "role": values.role,
            };
            return userApi.sendNotification(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo thông báo thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo thông báo thành công',
                    });
                    setOpenModalCreate(false);
                    handleList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
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

    const handleList = () => {
        (async () => {
            try {

                await userApi.listNotification().then((res) => {
                    console.log(res);
                    setNewsList(res);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }

    useEffect(() => {
        handleList();
    }, [])
    return (
        <div>
            <Spin spinning={false}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Gửi thông báo</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">

                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo thông báo</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={newsList} />
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Modal
                            title="Tạo thông báo mới"
                            visible={openModalCreate}
                            style={{ top: 100 }}
                            onOk={() => {
                                form
                                    .validateFields()
                                    .then((values) => {
                                        form.resetFields();
                                        handleOkUser(values);
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }}
                            onCancel={() => handleCancel("create")}
                            okText="Hoàn thành"
                            cancelText="Hủy"
                            width={600}
                        >
                            <Form
                                form={form}
                                name="eventCreate"
                                layout="vertical"
                                initialValues={{
                                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                                    prefix: '86',
                                }}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tiêu đề!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Tiêu đề" />
                                </Form.Item>
                                <Form.Item
                                    name="content"
                                    label="Nội dung"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập nội dung!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Nội dung" />
                                </Form.Item>
                                <Form.Item
                                    name="role"
                                    label="Vai trò"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập vai trò!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Select placeholder="Chọn vai trò">
                                        <Option value="resident">Cư dân</Option>
                                        <Option value="isReceptionist">Lễ tân</Option>
                                        <Option value="isSecurity">Bảo vệ</Option>
                                        <Option value="isAdmin">Admin</Option>
                                    </Select>
                                </Form.Item>

                            </Form>
                        </Modal>
                    </div>
                </div>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default Visitors;