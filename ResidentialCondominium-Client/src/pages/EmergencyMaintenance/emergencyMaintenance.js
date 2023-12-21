import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    SettingOutlined,
    FileOutlined,
    ScheduleOutlined,
    TeamOutlined,
    CalendarOutlined,
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
    DatePicker,
    Layout,
    Menu
} from 'antd';
import React, { useEffect, useState } from 'react';
import emergencyMaintenanceApi from "../../apis/emergencyMaintenanceApi";
import "./emergencyMaintenance.css";
import dayjs from 'dayjs';
import moment from 'moment';
import userApi from '../../apis/userApi';
import assetManagementApi from '../../apis/assetManagementApi';
import { useHistory } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

const { Option } = Select;

const EmergencyMaintenance = () => {

    const [category, setCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [userList, setUserList] = useState();
    const [assetList, setAssetList] = useState();
    const [security, setSecurity] = useState();


    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                asset_id: values.asset_id,
                description: values.description,
                reported_by: userData.id,
            };
            return emergencyMaintenanceApi.createEmergencyMaintenance(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo vấn đề khẩn cấp thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo vấn đề khẩn cấp thành công',
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
                asset_id: values.asset_id,
                description: values.description,
                reported_by: values.reported_by,
                resolved_by: values.resolved_by,
                resolved_description: values.resolved_description,
            };
            return emergencyMaintenanceApi.updateEmergencyMaintenance(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa vấn đề khẩn cấp thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa vấn đề khẩn cấp thành công',
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
            await emergencyMaintenanceApi.listEmergencyMaintenance().then((res) => {
                const filteredComplaints = res.data.filter(emergency => emergency.reported_by === userData.id);

                setCategory(filteredComplaints);
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
            await emergencyMaintenanceApi.deleteEmergencyMaintenance(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa vấn đề khẩn cấp thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa vấn đề khẩn cấp thành công',

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
                const response = await emergencyMaintenanceApi.getDetailEmergencyMaintenance(id);
                setId(id);
                form2.setFieldsValue({
                    asset_id: response.data.asset_id,
                    description: response.data.description,
                    reported_by: response.data.reported_by,
                    resolved_by: response.data.resolved_by,
                    resolved_description: response.data.resolved_description,
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
            const res = await emergencyMaintenanceApi.searchEmergencyMaintenance(name);
            const filteredComplaints = res.data.filter(emergency => emergency.reported_by === userData.id);

            setCategory(filteredComplaints);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tài sản',
            dataIndex: 'asset_name',
            key: 'asset_name',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Người báo cáo',
            dataIndex: 'reported_by_name',
            key: 'reported_by_name',
        },
        {
            title: 'Ngày báo cáo',
            dataIndex: 'reported_at',
            key: 'reported_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Ngày giải quyết',
            dataIndex: 'resolved_at',
            key: 'resolved_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Mô tả giải quyết',
            dataIndex: 'resolved_description',
            key: 'resolved_description',
        },
        {
            title: 'Người giải quyết',
            dataIndex: 'resolved_by_name',
            key: 'resolved_by_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        {record.status === 'pending' && (

                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                                onClick={() => handleEditCategory(record.id)}
                            >
                                {"Chỉnh sửa"}
                            </Button>
                        )}
                        {record.status === 'pending' && (
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
                        )}
                    </Row>
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

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const createdById = response.user.id;

                await emergencyMaintenanceApi.listEmergencyMaintenance().then((res) => {
                    const filteredComplaints = res.data.filter(emergency => emergency.reported_by === createdById);

                    console.log(res);
                    setCategory(filteredComplaints);
                    setLoading(false);
                });

                await userApi.listUserByAdmin().then((res) => {
                    console.log(res);
                    setUserList(res.data);
                    setLoading(false);
                });

                await userApi.listUserByAdmin().then((res) => {
                    console.log(res);
                    const securityUsers = res.data.filter(user => user.role == 'isSecurity');
                    setSecurity(securityUsers);
                    setLoading(false);
                });

                await assetManagementApi.listAssetManagement().then((res) => {
                    console.log(res);
                    setAssetList(res.data);
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
                            <Breadcrumb.Item>Vấn đề khẩn cấp</Breadcrumb.Item>
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
                                                placeholder="Tìm kiếm theo mô tả"
                                                allowClear
                                                onChange={handleFilter}
                                                style={{ width: 300 }}
                                            />
                                        </Col>
                                        <Col span="6">
                                            <Row justify="end">
                                                <Space>
                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo vấn đề khẩn cấp</Button>
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

                <Modal
                    title="Tạo vấn đề khẩn cấp mới"
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
                            name="asset_id"
                            label="Tài sản"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn tài sản!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn tài sản">
                                {assetList?.map(asset => (
                                    <Option key={asset.id} value={asset.id}>
                                        {asset.name}
                                    </Option>
                                ))}
                            </Select>
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
                            name="reported_by"
                            label="Người báo cáo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người báo cáo!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người báo cáo">
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
                    title="Chỉnh sửa vấn đề khẩn cấp"
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
                            name="asset_id"
                            label="Tài sản"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn tài sản!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn tài sản">
                                {assetList?.map(asset => (
                                    <Option key={asset.id} value={asset.id}>
                                        {asset.name}
                                    </Option>
                                ))}
                            </Select>
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
                            name="reported_by"
                            label="Người báo cáo"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người báo cáo!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                            hidden
                        >
                            <Select placeholder="Chọn người báo cáo">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="resolved_by"
                            label="Giải quyết bởi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người giải quyết!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                            hidden
                        >
                            <Select placeholder="Chọn người giải quyết">
                                {security?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="resolved_description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chi tiết giải quyết!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                            hidden
                        >
                            <Input placeholder="Chi tiết giải quyết" />
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>

        </div >
    )
}

export default EmergencyMaintenance;