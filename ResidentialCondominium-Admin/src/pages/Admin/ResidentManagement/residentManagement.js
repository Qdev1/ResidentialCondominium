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
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Select,
    DatePicker
} from 'antd';
import React, { useEffect, useState } from 'react';
import complaintApi from "../../../apis/complaintApi";
import "./residentManagement.css";
import dayjs from 'dayjs';
import moment from 'moment';
import userApi from '../../../apis/userApi';

const { Option } = Select;

const ResidentManagement = () => {

    const [category, setCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [userList, setUserList] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                user_id: values.user_id,
                subject: values.subject,
                description: values.description,
                status: values.status,
                progress: values.progress,
                assigned_to: values.assigned_to,
            };
            return complaintApi.createComplaint(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khiếu nại thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo khiếu nại thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                user_id: values.user_id,
                subject: values.subject,
                description: values.description,
                status: values.status,
                progress: values.progress,
                assigned_to: values.assigned_to,
            }
            return complaintApi.updateComplaint(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khiếu nại thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa khiếu nại thành công',
                    });
                    handleCategoryList();
                    setOpenModalUpdate(false);
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

    const handleCategoryList = async () => {
        try {
            await complaintApi.listComplaints().then((res) => {
                setCategory(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await complaintApi.deleteComplaint(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khiếu nại thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa khiếu nại thành công',

                    });
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCategory = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await complaintApi.getDetailComplaint(id);
                setId(id);
                form2.setFieldsValue({
                    user_id: response.user_id,
                    subject: response.subject,
                    description: response.description,
                    status: response.status,
                    progress: response.progress,
                    assigned_to: response.assigned_to,
                });

                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await complaintApi.searchComplaint(name);
            setCategory(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Người khiếu nại',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Chủ đề',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Quá trình',
            dataIndex: 'progress',
            key: 'progress',
        },
        {
            title: 'Đảm nhiệm bởi',
            dataIndex: 'assigned_to_name',
            key: 'assigned_to_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditCategory(record.id)}
                        >
                            {"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Are you sure to delete this complaint?"
                                onConfirm={() => handleDeleteCategory(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                >
                                    {"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];





    useEffect(() => {
        (async () => {
            try {
                await complaintApi.listComplaints().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });

                await userApi.listUserByAdmin().then((res) => {
                    console.log(res);
                    setUserList(res.data);
                    setLoading(false);
                });


            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý khiếu nại</span>
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
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo khiếu nại</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <Modal
                    title="Tạo khiếu nại mới"
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
                            name="user_id"
                            label="Người khiếu nại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người khiếu nại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người khiếu nại">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="subject"
                            label="Subject"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập subject!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Subject" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trạng thái!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Status" />
                        </Form.Item>
                        <Form.Item
                            name="progress"
                            label="Progress"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiến độ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Progress" />
                        </Form.Item>

                        <Form.Item
                            name="assigned_to"
                            label="Người đảm nhiệm!"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người đảm nhiệm!!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người đảm nhiệm!">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa khiếu nại"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateCategory(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancel}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                       <Form.Item
                            name="user_id"
                            label="Người khiếu nại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người khiếu nại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người khiếu nại">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="subject"
                            label="Subject"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập subject!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Subject" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập trạng thái!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Status" />
                        </Form.Item>
                        <Form.Item
                            name="progress"
                            label="Progress"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tiến độ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Progress" />
                        </Form.Item>

                        <Form.Item
                            name="assigned_to"
                            label="Người đảm nhiệm!"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người đảm nhiệm!!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người đảm nhiệm!">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ResidentManagement;