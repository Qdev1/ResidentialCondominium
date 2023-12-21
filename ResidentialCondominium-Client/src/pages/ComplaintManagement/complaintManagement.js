import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    StarOutlined,
    FileOutlined,
    ScheduleOutlined,
    TeamOutlined,
    CalendarOutlined,
    SettingOutlined,
    FileProtectOutlined
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
    Layout,
    Menu,
    Rate
} from 'antd';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import complaintApi from "../../apis/complaintApi";
import "./complaintManagement.css";
import userApi from '../../apis/userApi';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

const ComplaintManagement = () => {

    const [category, setCategory] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [userList, setUserList] = useState();
    const [progress, setProgress] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                created_by: userData.id,
                user_id: userData.id,
                subject: values.subject,
                description: values.description,
                status: values.status || "pending",
                progress: values.progress || 0,
                assigned_to: values.assigned_to || "",
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
                user_id: userData.id,
                subject: values.subject,
                description: values.description,
                status: values.status,
                progress: values.progress || progress,
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

            if (userData.role == "isAdmin") {
                await complaintApi.listComplaints().then((res) => {
                    setCategory(res);
                    setLoading(false);
                });
            } else {
                await complaintApi.listComplaints().then((res) => {
                    console.log(res);

                    // Filter complaints based on the created_by field
                    const filteredComplaints = res.filter(complaint => complaint.created_by === userData.id);

                    setCategory(filteredComplaints);
                    setLoading(false);
                });
            }
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
                setProgress(response.progress);
                if (response.status != "pending") {
                    setIsDisabled(true);
                }
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
            const filteredComplaints = res.filter(complaint => complaint.created_by === userData.id);

            setCategory(filteredComplaints);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const [ratingModalVisible, setRatingModalVisible] = useState(false);
    const [rating, setRating] = useState(0);

    const handleRatingModal = (categoryId) => {
        // Hiển thị modal đánh giá khi người dùng bấm vào nút "Đánh giá"
        setId(categoryId)
        setRatingModalVisible(true);
    };

    const handleRatingChange = (value) => {
        // Lưu giá trị đánh giá khi người dùng thay đổi số sao
        setRating(value);
    };

    const handleRatingSubmit = async () => {
        setLoading(true);
        try {
            const response = await complaintApi.getDetailComplaint(id);
            const categoryList = {
                user_id: response.user_id,
                subject: response.subject,
                description: response.description,
                status: response.status,
                progress: rating,
                assigned_to: response.assigned_to,
            }
            return complaintApi.updateComplaint(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Đánh giá khiếu nại thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Đánh giá khiếu nại thành công',
                    });
                    handleCategoryList();
                    setRatingModalVisible(false);
                }
            })

        } catch (error) {
            throw error;
        }
    };

    const handleRatingCancel = () => {
        setRatingModalVisible(false);
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Chủ hộ khiếu nại',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Email',
            dataIndex: 'user_email',
            key: 'user_email',
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
            title: 'Đánh giá',
            dataIndex: 'progress',
            key: 'progress',
        },
        {
            title: 'Đảm nhiệm bởi',
            dataIndex: 'assigned_to',
            key: 'assigned_to',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    {userData.role !== 'isAdmin' && record.status === 'pending' && (
                        <Row>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                                onClick={() => handleEditCategory(record.id)}
                            >
                                {"Edit"}
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
                                        {"Delete"}
                                    </Button>
                                </Popconfirm>
                            </div>
                        </Row>
                    )}

                    {record.status === 'Đã xong' && record.progress === 0 && (
                        <Button
                            size="small"
                            icon={<StarOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleRatingModal(record.id)}
                        >
                            {"Đánh giá"}
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const history = useHistory();


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

    const handleFilter2 = async (name) => {
        try {
            let res;
            console.log(name)
            // Fetch all complaints
            const allComplaints = await complaintApi.listComplaints();

            // Perform filtering based on the selected role
            if (name != "all") {
                res = allComplaints.filter(complaint => complaint.user_role == name);
            } else {
                // If the role is not 'resident', filter only by subject
                res = allComplaints;
            }

            setCategory(res);
        } catch (error) {
            console.log('Filtering complaints error:', error);
        }
    }

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                await userApi.listUserByAdmin().then((res) => {
                    console.log(res);
                    setUserList(res.data);
                    setLoading(false);
                });

                const createdById = response.user.id;

                if (response.user.role == "isAdmin") {
                    await complaintApi.listComplaints().then((res) => {
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await complaintApi.listComplaints().then((res) => {
                        console.log(res);

                        // Filter complaints based on the created_by field
                        const filteredComplaints = res.filter(complaint => complaint.created_by === createdById);

                        setCategory(filteredComplaints);
                        setLoading(false);
                    });
                }



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
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>Khiếu nại</Breadcrumb.Item>
                        </Breadcrumb>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo chủ đề"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                {
                                                    userData.role == "isAdmin" ?

                                                        <Select
                                                            style={{ width: 120, marginRight: 10 }}
                                                            onChange={(value) => {
                                                                handleFilter2(value);
                                                            }}
                                                        >
                                                            <Option value="all">Toàn bộ</Option>
                                                            <Option value="resident">Cư đân</Option>
                                                            <Option value="isReceptionist">Lễ tân</Option>
                                                            <Option value="isAdmin">Admin</Option>

                                                        </Select>
                                                        : null}
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo khiếu nại</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
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
                        name="subject"
                        label="Chủ đề"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập chủ đề!',
                            },
                        ]}
                        style={{ marginBottom: 10 }}
                    >
                        <Input placeholder="Chủ đề" />
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
                        name="subject"
                        label="Chủ đề"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập chủ đề!',
                            },
                        ]}
                        style={{ marginBottom: 10 }}
                    >
                        <Input placeholder="Chủ đề" disabled={isDisabled} />
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
                        <Input placeholder="Mô tả" disabled={isDisabled} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Đánh giá"
                visible={ratingModalVisible}
                onOk={handleRatingSubmit}
                onCancel={handleRatingCancel}
            >
                <p>Chọn số sao:</p>
                <Rate allowHalf onChange={handleRatingChange} value={rating} />
            </Modal>


            <BackTop style={{ textAlign: 'right' }} />
        </div >
    )
}

export default ComplaintManagement;