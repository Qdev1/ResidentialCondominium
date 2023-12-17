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
    DatePicker,
    InputNumber,
    Select
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import maintenanceHistoryApi from "../../../apis/maintenanceHistoryApi";
import "./maintenanceHistory.css";
import assetManagementApi from '../../../apis/assetManagementApi';
import maintenancePlansApi from '../../../apis/maintenancePlansApi';

const { Option } = Select;

const MaintenanceHistory = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "asset_id": values.assetId || 1,
                "plan_id": values.plan_id,
                "description": values.description,
                "date": values.date.format("YYYY-MM-DD"),
                "cost": values.cost,
            };


            return maintenanceHistoryApi.createMaintenanceHistory(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo lịch sử bảo trì thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo lịch sử bảo trì thành công',
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
                "asset_id": values.asset_id || 1,
                "plan_id": values.plan_id,
                "description": values.description,
                "date": values.date.format("YYYY-MM-DD"),
                "cost": values.cost,
            };
            return maintenanceHistoryApi.updateMaintenanceHistory(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa lịch sử bảo trì thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa lịch sử bảo trì thành công',
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
            await maintenanceHistoryApi.getAllMaintenanceRecords().then((res) => {
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
            await maintenanceHistoryApi.deleteMaintenanceHistory(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa lịch sử bảo trì thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa lịch sử bảo trì thành công',

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
                const response = await maintenanceHistoryApi.getDetailMaintenanceHistory(id);
                setId(id);
                form2.setFieldsValue({
                    description: response.description,
                    date: moment(response.date),
                    cost: response.cost,
                    plan_id: response.plan_id
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
            const res = await maintenanceHistoryApi.searchMaintenanceHistory(name);
            setCategory(res.data);
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
            title: 'Tên kế hoạch bảo trì',
            dataIndex: 'plan_description',
            key: 'plan_description',
        },
        {
            title: 'Chi phí',
            dataIndex: 'cost',
            key: 'cost',
            render: (text, record) => {
                // Định dạng số theo format tiền Việt Nam
                const formattedCost = Number(record.cost).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                return formattedCost;
            },
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
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
                            {"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 10 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa lịch sử bảo trì này?"
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

    const [categoryList, setCategoryList] = useState([]);


    useEffect(() => {
        (async () => {
            try {
                await maintenanceHistoryApi.getAllMaintenanceRecords().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });

                await maintenancePlansApi.getAllMaintenancePlans().then((res) => {
                    console.log(res);
                    setCategoryList(res.data);
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
                                <span>Lịch sử bảo trì</span>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo lịch sử bảo trì</Button>
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
                    title="Tạo lịch sử bảo trì mới"
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
                        name="maintenanceHistoryCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="plan_id"
                            label="Kế hoạch bảo trì"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn kế hoạch bảo trì!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn kế hoạch bảo trì">
                                {categoryList.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.plan_description}
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
                            name="date"
                            label="Ngày bảo trì"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày bảo trì!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item
                            name="cost"
                            label="Chi phí"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chi phí!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber
                                placeholder="Chi phí"
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Use dot as a thousand separator
                                parser={(value) => value.replace(/\./g, '')} // Remove dots for parsing
                            />
                        </Form.Item>
                    </Form>
                </Modal>



                <Modal
                    title="Chỉnh sửa lịch sử bảo trì"
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
                            name="plan_id"
                            label="Kế hoạch bảo trì"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn kế hoạch bảo trì!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn kế hoạch bảo trì">
                                {categoryList.map(category => (
                                    <Option key={category.id} value={category.id}>
                                        {category.plan_description}
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
                            name="date"
                            label="Ngày bảo trì"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày bảo trì!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker format="YYYY-MM-DD" />
                        </Form.Item>
                        <Form.Item
                            name="cost"
                            label="Chi phí"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập chi phí!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber
                                placeholder="Chi phí"
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Use dot as a thousand separator
                                parser={(value) => value.replace(/\./g, '')} // Remove dots for parsing
                            />
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default MaintenanceHistory;