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
    InputNumber
} from 'antd';
import React, { useEffect, useState } from 'react';
import contractManagementApi from "../../../apis/contractManagementApi";
import "./contractManagement.css";
import dayjs from 'dayjs';
import moment from 'moment';
import VendorManagementApi from '../../../apis/vendorManagementApi';
import uploadFileApi from '../../../apis/uploadFileApi';

const { Option } = Select;

const ContractManagement = () => {

    const [category, setCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const startDate = values.start_date;
            const endDate = values.end_date;
    
            // Kiểm tra ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu
            if (endDate.isBefore(startDate)) {
                notification.error({
                    message: 'Thông báo',
                    description: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
                });
                setLoading(false);
                return; 
            }

            const categoryList = {
                vendorId: values.vendor_id,
                title: values.title,
                startDate: values.start_date.format("YYYY-MM-DD"),
                endDate: values.end_date.format("YYYY-MM-DD"),
                description: values.description,
                value: values.value,
                fileUrl: file
            };
            return contractManagementApi.createContract(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo hợp đồng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo hợp đồng thành công',
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
            const startDate = values.start_date;
            const endDate = values.end_date;
    
            // Kiểm tra ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu
            if (endDate.isBefore(startDate)) {
                notification.error({
                    message: 'Thông báo',
                    description: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
                });
                setLoading(false);
                return; 
            }

            const categoryList = {
                vendorId: values.vendor_id,
                title: values.title,
                startDate: values.start_date.format("YYYY-MM-DD"),
                endDate: values.end_date.format("YYYY-MM-DD"),
                description: values.description,
                value: values.value,
                fileUrl: file
            }
            return contractManagementApi.updateContract(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa hợp đồng thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa hợp đồng thành công',
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
            await contractManagementApi.listContract().then((res) => {
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
            await contractManagementApi.deleteContract(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa hợp đồng thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa hợp đồng thành công',

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
                const response = await contractManagementApi.getDetailContract(id);
                setId(id);
                form2.setFieldsValue({
                    vendor_id: response.data.vendor_id,
                    title: response.data.title,
                    start_date: dayjs(response.data.start_date),
                    end_date: dayjs(response.data.end_date),
                    description: response.data.description,
                    value: response.data.value,
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
            const res = await contractManagementApi.searchContract(name);
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
            title: 'Nhà cung cấp',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
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
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'File đính kèm',
            dataIndex: 'file_url',
            key: 'file_url',
            render: (attachment) => (
                <a href={attachment} target="_blank" rel="noopener noreferrer">
                    {"Xem file"}
                </a>
            ),
        },
        {
            title: 'Giá trị',
            dataIndex: 'value',
            key: 'value',
            render: (text, record) => {
                // Định dạng số theo format tiền Việt Nam
                const formattedCost = Number(record.value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                return formattedCost;
            },
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
                                title="Bạn có chắc chắn xóa hợp đồng này?"
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

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }


    useEffect(() => {
        (async () => {
            try {
                await contractManagementApi.listContract().then((res) => {
                    console.log(res);
                    setCategory(res.data);
                    setLoading(false);
                });

                await VendorManagementApi.listVendors().then((res) => {
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
                                <span>Quản lý giấy tờ</span>
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
                                            placeholder="Tìm kiếm theo nhà cung cấp"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo hợp đồng</Button>
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
                    title="Tạo hợp đồng mới"
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
                        <Spin spinning={loading}>
                            <Form.Item
                                name="vendor_id"
                                label="Nhà cung cấp"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn nhà cung cấp!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn nhà cung cấp">
                                    {categoryList.map(category => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
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
                                name="start_date"
                                label="Ngày bắt đầu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày bắt đầu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày bắt đầu" />
                            </Form.Item>
                            <Form.Item
                                name="end_date"
                                label="Ngày kết thúc"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày kết thúc!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày kết thúc" />
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
                                name="value"
                                label="Giá trị"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá trị!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber
                                    placeholder="Giá trị"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Use dot as a thousand separator
                                    parser={(value) => value.replace(/\./g, '')} // Remove dots for parsing
                                />
                            </Form.Item>

                            <Form.Item
                                name="image"
                                label="Đính kèm"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng đính kèm!',
                                    },
                                ]}
                            >
                                <input
                                    type="file"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa hợp đồng"
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
                        <Spin spinning={loading}>
                            <Form.Item
                                name="vendor_id"
                                label="Nhà cung cấp"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn nhà cung cấp!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn nhà cung cấp">
                                    {categoryList.map(category => (
                                        <Option key={category.id} value={category.id}>
                                            {category.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
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
                                name="start_date"
                                label="Ngày bắt đầu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày bắt đầu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày bắt đầu" />
                            </Form.Item>
                            <Form.Item
                                name="end_date"
                                label="Ngày kết thúc"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập ngày kết thúc!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày kết thúc" />
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
                                name="value"
                                label="Giá trị"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giá trị!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber
                                    placeholder="Giá trị"
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Use dot as a thousand separator
                                    parser={(value) => value.replace(/\./g, '')} // Remove dots for parsing
                                />
                            </Form.Item>
                            <Form.Item
                                name="image"
                                label="Đính kèm"
                            >
                                <input
                                    type="file"
                                    onChange={handleChangeImage}
                                    id="avatar"
                                    name="file"
                                />
                            </Form.Item>
                        </Spin>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ContractManagement;