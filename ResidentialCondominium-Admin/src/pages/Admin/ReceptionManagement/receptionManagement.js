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
import receptionApi from "../../../apis/receptionApi";
import "./receptionManagement.css";
import dayjs from 'dayjs';
import moment from 'moment';
import userApi from '../../../apis/userApi';

const { Option } = Select;

const ReceptionManagement = () => {

    const [category, setCategory] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [residentList, setUserList] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                resident_id: values.resident_id,
                guest_name: values.guest_name,
                entry_date: values.entry_date.format("YYYY-MM-DD"),
                purpose: values.purpose,
                note: values.note,
            };
            return receptionApi.createReception(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo đặt lịch tiếp đón thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo đặt lịch tiếp đón thành công',
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
                resident_id: values.resident_id,
                guest_name: values.guest_name,
                entry_date: values.entry_date.format("YYYY-MM-DD"),
                purpose: values.purpose,
                note: values.note,
            }
            return receptionApi.updateReception(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa đặt lịch tiếp đón thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa đặt lịch tiếp đón thành công',
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
            await receptionApi.listReception().then((res) => {
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
            await receptionApi.deleteReception(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa đặt lịch tiếp đón thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa đặt lịch tiếp đón thành công',

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
                const response = await receptionApi.getDetailReception(id);
                setId(id);
                form2.setFieldsValue({
                    resident_id: response.data.resident_id,
                    guest_name: response.data.guest_name,
                    entry_date: dayjs(response.data.entry_date),
                    purpose: response.data.purpose,
                    note: response.data.note,
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
            const res = await receptionApi.searchReception(name);
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
            title: 'Tên cư dân',
            dataIndex: 'resident_username',
            key: 'resident_username',
        },
        {
            title: 'Tên Khách',
            dataIndex: 'guest_name',
            key: 'guest_name',
        },
        {
            title: 'Ngày Nhập',
            dataIndex: 'entry_date',
            key: 'entry_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Mục Đích',
            dataIndex: 'purpose',
            key: 'purpose',
        },
        {
            title: 'Ghi Chú',
            dataIndex: 'note',
            key: 'note',
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
                </div>
            ),
        },
    ];






    useEffect(() => {
        (async () => {
            try {
                await receptionApi.listReception().then((res) => {
                    console.log(res);
                    setCategory(res.data);
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
                                <span>Quản lý đặt lịch tiếp đón</span>
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
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo đặt lịch tiếp đón</Button>
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
                    title="Tạo đặt lịch tiếp đón mới"
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

                        <Form.Item
                            name="guest_name"
                            label="Tên Khách"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Tên Khách!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên Khách" />
                        </Form.Item>

                        <Form.Item
                            name="entry_date"
                            label="Ngày Nhập"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Ngày Nhập!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn Ngày Nhập" />
                        </Form.Item>

                        <Form.Item
                            name="purpose"
                            label="Mục Đích"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Mục Đích!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mục Đích" />
                        </Form.Item>

                        <Form.Item
                            name="note"
                            label="Ghi Chú"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Ghi Chú!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Ghi Chú" />
                        </Form.Item>



                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa đặt lịch tiếp đón"
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

                        <Form.Item
                            name="guest_name"
                            label="Tên Khách"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Tên Khách!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên Khách" />
                        </Form.Item>

                        <Form.Item
                            name="entry_date"
                            label="Ngày Nhập"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Ngày Nhập!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn Ngày Nhập" />
                        </Form.Item>

                        <Form.Item
                            name="purpose"
                            label="Mục Đích"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Mục Đích!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mục Đích" />
                        </Form.Item>

                        <Form.Item
                            name="note"
                            label="Ghi Chú"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập Ghi Chú!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Ghi Chú" />
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ReceptionManagement;