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
    DatePicker,
    Switch
} from 'antd';
import React, { useEffect, useState } from 'react';
import unauthorizedEntryApi from "../../../apis/unauthorizedEntryApi";
import "./unauthorizedEntry.css";
import userApi from '../../../apis/userApi';
import assetManagementApi from '../../../apis/assetManagementApi';
import dayjs from 'dayjs';
import moment from 'moment/moment';

const { Option } = Select;

const UnauthorizedEntry = () => {

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

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                userId: values.user_id,
                entryTime: values.entry_time.format('YYYY-MM-DD'),
                exitTime: values.exit_time.format('YYYY-MM-DD'),
                building: values.building,
                authorized: values.authorized,
                strangerName: values.stranger_name,
            };
            return unauthorizedEntryApi.createUnauthorizedEntry(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo ra vào thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo ra vào thành công',
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
                userId: values.user_id,
                entryTime: values.entry_time.format('YYYY-MM-DD'),
                exitTime: values.exit_time.format('YYYY-MM-DD'),
                building: values.building,
                authorized: values.authorized,
                strangerName: values.stranger_name,
            };
            return unauthorizedEntryApi.updateUnauthorizedEntry(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa ra vào thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa ra vào thành công',
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
            await unauthorizedEntryApi.listUnauthorizedEntries().then((res) => {
                setCategory(res.data);
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
            await unauthorizedEntryApi.deleteUnauthorizedEntry(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa ra vào thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa ra vào thành công',

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
                const response = await unauthorizedEntryApi.getDetailUnauthorizedEntry(id);
                setId(id);
                form2.setFieldsValue({
                    user_id: response.data.user_id,
                    entry_time: dayjs(response.data.entry_time),
                    exit_time: dayjs(response.data.exit_time),
                    building: response.data.building,
                    authorized: response.data.authorized,
                    stranger_name: response.data.stranger_name,
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
            const res = await unauthorizedEntryApi.searchUnauthorizedEntry(name);
            setCategory(res.data);
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
            title: 'Người ra vào',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Thời gian vào',
            dataIndex: 'entry_time',
            key: 'entry_time',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Thời gian ra',
            dataIndex: 'exit_time',
            key: 'exit_time',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Tòa nhà',
            dataIndex: 'building',
            key: 'building',
        },
        {
            title: 'Ủy quyền',
            dataIndex: 'authorized',
            key: 'authorized',
            render: (text, record) => (
                <span>{record.authorized ? 'Đã ủy quyền' : 'Chưa ủy quyền'}</span>
            ),
        },
        {
            title: 'Tên người lạ',
            dataIndex: 'stranger_name',
            key: 'stranger_name',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
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
                            {"Edit"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Are you sure to delete this entry?"
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
                </div>
            ),
        },
    ];
    


    useEffect(() => {
        (async () => {
            try {
                await unauthorizedEntryApi.listUnauthorizedEntries().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });

                await userApi.listUserByAdmin().then((res) => {
                    console.log(res);
                    setUserList(res.data);
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
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Quản lý ra vào</span>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo ra vào</Button>
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
                    title="Tạo ra vào mới"
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
                            label="Người ra vào"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người ra vào!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người ra vào">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="entry_time"
                            label="Entry Time"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thời gian vào!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Chọn thời gian vào" />
                        </Form.Item>

                        <Form.Item
                            name="exit_time"
                            label="Exit Time"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thời gian ra!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Chọn thời gian ra" />
                        </Form.Item>

                        <Form.Item
                            name="building"
                            label="Building"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tòa nhà!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tòa nhà" />
                        </Form.Item>

                        <Form.Item
                            name="authorized"
                            label="Authorized"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái ủy quyền!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="stranger_name"
                            label="Tên người lạ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên người lạ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên người lạ" />
                        </Form.Item>



                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa ra vào"
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
                            label="Người ra vào"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người ra vào!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người ra vào">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="entry_time"
                            label="Entry Time"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thời gian vào!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Chọn thời gian vào" />
                        </Form.Item>

                        <Form.Item
                            name="exit_time"
                            label="Exit Time"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập thời gian ra!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Chọn thời gian ra" />
                        </Form.Item>

                        <Form.Item
                            name="building"
                            label="Building"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tòa nhà!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tòa nhà" />
                        </Form.Item>

                        <Form.Item
                            name="authorized"
                            label="Authorized"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái ủy quyền!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Switch />
                        </Form.Item>

                        <Form.Item
                            name="stranger_name"
                            label="Tên người lạ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên người lạ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên người lạ" />
                        </Form.Item>


                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default UnauthorizedEntry;