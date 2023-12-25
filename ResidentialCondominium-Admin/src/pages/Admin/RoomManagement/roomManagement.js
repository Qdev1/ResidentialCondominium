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
    InputNumber
} from 'antd';
import React, { useEffect, useState } from 'react';
import roomManagementApi from "../../../apis/roomManagementApi";
import "./roomManagement.css";
import userApi from '../../../apis/userApi';

const { Option } = Select;

const RoomManagement = () => {

    const [category, setCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();

    const [id, setId] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                name: values.name,
                type: values.type,
                area: values.area,
                capacity: values.capacity,
                status: values.status,
                description: values.description,
            };
            return roomManagementApi.createRoomManagement(categoryList).then(response => {
                if (response.message === "Room name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên phòng đã tồn tại.',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo phòng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo phòng thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleOkUser2 = async (values) => {
        console.log(values);
        
        setLoading(true);
        try {
            const categoryList = {
                userId: values.resident_id,
                roomId: roomId,
            };
            return roomManagementApi.addResidentToRoom(categoryList).then(response => {
                if (response.message === "Room or user not found") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Phòng hoặc người dùng không tồn tại',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Thêm người thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo người thành công',
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
                name: values.name,
                type: values.type,
                area: values.area,
                capacity: values.capacity,
                status: values.status,
                description: values.description,
            }
            return roomManagementApi.updateRoomManagement(categoryList, id).then(response => {
                if (response.message === "Room name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên phòng đã tồn tại.',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa phòng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa phòng thành công',
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
            await roomManagementApi.listRoomManagement().then((res) => {
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
            await roomManagementApi.deleteRoomManagement(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa phòng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa phòng thành công',

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
                const response = await roomManagementApi.getDetailRoomManagement(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.data.name,
                    type: response.data.type,
                    area: response.data.area,
                    capacity: response.data.capacity,
                    status: response.data.status,
                    description: response.data.description,
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
            const res = await roomManagementApi.searchRoomManagement(name);
            setCategory(res.data);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const [openModalAddResident, setOpenModalAddResident] = useState(false);
    const [roomId, setRoomId] = useState(false);

    const showAddResidentModal = (id) => {
        setRoomId(id);
        setOpenModalAddResident(true);
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Diện tích',
            dataIndex: 'area',
            key: 'area',
            render: (text) => <div>{text}m2</div>,

        },
        {
            title: 'Sức chứa',
            dataIndex: 'capacity',
            key: 'capacity',
            render: (text) => <div>{text} người</div>,

        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Chủ hộ',
            dataIndex: 'residents',
            key: 'residents',
            render: (text, record) => (
                <div>
                    {text && text.length > 0 ? (
                        `${text[0].username} - ${text[0].email}`
                    ) : (
                        'Chưa có chủ phòng'
                    )}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row style={{display: 'flex', flexDirection: 'column'}}>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 150, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditCategory(record.id)}
                        >
                            {"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginTop: 6 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa phòng này?"
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
                        <div style={{ marginTop: 6 }}>
                            {record.residents && record.residents.length > 0 ? (
                                <Button
                                    size="small"
                                    icon={<PlusOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30, display: 'none' }}
                                    onClick={() => showAddResidentModal(record.id)}
                                >
                                    {"Thêm cư dân"}
                                </Button>
                            ) : (
                                <Button
                                    size="small"
                                    icon={<PlusOutlined />}
                                    style={{ width: 150, borderRadius: 15, height: 30 }}
                                    onClick={() => showAddResidentModal(record.id)}
                                >
                                    {"Thêm cư dân"}
                                </Button>
                            )}
                        </div>
                    </Row>
                </div>
            ),
        },
        
        
    ];

    const roomTypes = ['Căn hộ thông thường', 'Căn hộ studio', 'Shophouse', 'Căn hộ Duplex', ' Căn hộ Sky Villa'];

    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleFilter2 = async (status) => {
        try {
            console.log(status);

            if (status) {
                await roomManagementApi.listRoomManagement().then((res) => {
                    // Tiến hành lọc theo category_name
                    const filteredByCategoryName = res.data.filter(item => item.status
                        .toLowerCase() === status.toLowerCase());

                    // Cập nhật danh sách tài sản
                    setCategory(filteredByCategoryName);
                });
            } else {
                await roomManagementApi.listRoomManagement().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });
            }


        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                await roomManagementApi.listRoomManagement().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });

                await userApi.listUserByAdmin().then((res) => {
                    const residentsList = res.data.filter(user => user.role === 'resident');
                    setUserList(residentsList);
                    setLoading(false);
                });

            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])

    const handleCancelAddResident = () => {
        setOpenModalAddResident(false);
    };

    const [residentList, setUserList] = useState();


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
                                <span>Quản lý phòng</span>
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
                                            placeholder="Tìm kiếm theo tên"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Select
                                                    placeholder="Lọc theo danh mục"
                                                    style={{ width: 150, marginRight: 10 }}
                                                    onChange={(value) => {
                                                        setSelectedCategory(value);
                                                        handleFilter2(value);
                                                    }}
                                                    value={selectedCategory}
                                                >
                                                    <Option value="">Tất cả danh mục</Option>
                                                    <Option value="Đã sử dụng">Đã sử dụng</Option>
                                                    <Option value="Phòng trống">Phòng trống</Option>
                                                </Select>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo phòng</Button>
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
                    title="Thêm cư dân"
                    visible={openModalAddResident}
                    style={{ top: 100 }}
                    onOk={() => {
                        form3
                            .validateFields()
                            .then((values) => {
                                form3.resetFields();
                                handleOkUser2(values);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={handleCancelAddResident}
                    okText="Hoàn thành"
                    cancelText="Hủy"
                    width={600}
                >
                    <Form
                        form={form3}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="resident_id"
                            label="Cư dân"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn cư dân!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn cư dân">
                                {residentList?.map(resident => (
                                    <Option key={resident.id} value={resident.id}>
                                        {resident.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>

                <Modal
                    title="Tạo phòng mới"
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
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Loại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn loại phòng!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn loại phòng">
                                {roomTypes.map((type, index) => (
                                    <Select.Option key={index} value={type}>
                                        {type}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="area"
                            label="Diện tích (m2)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập diện tích!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber
                                placeholder="Diện tích (m2)"
                            />
                        </Form.Item>
                        <Form.Item
                            name="capacity"
                            label="Sức chứa (người)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập sức chứa!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Sức chứa" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value="Đã sử dụng">Đã sử dụng</Select.Option>
                                <Select.Option value="Phòng trống">Phòng trống</Select.Option>
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

                    </Form>
                </Modal>

                <Modal
                    title="Chỉnh sửa phòng"
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
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Loại"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập loại!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Loại" />
                        </Form.Item>
                        <Form.Item
                            name="area"
                            label="Diện tích (m2)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập diện tích!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber
                                placeholder="Diện tích (m2)"
                            />
                        </Form.Item>
                        <Form.Item
                            name="capacity"
                            label="Sức chứa (người)"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập sức chứa!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Sức chứa" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn trạng thái!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Select.Option value="Đã sử dụng">Đã sử dụng</Select.Option>
                                <Select.Option value="Phòng trống">Phòng trống</Select.Option>
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


                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default RoomManagement;