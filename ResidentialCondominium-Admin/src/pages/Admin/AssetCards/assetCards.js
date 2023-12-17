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
import accessCardApi from "../../../apis/accessCardApi";
import "./assetCards.css";
import dayjs from 'dayjs';
import moment from 'moment';
import userApi from '../../../apis/userApi';

const { Option } = Select;

const AssetCards = () => {

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
            const issueDate = values.issue_date.format("YYYY-MM-DD");
            const expirationDate = values.expiration_date.format("YYYY-MM-DD");

            if (expirationDate < issueDate) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Ngày hết hạn phải lớn hơn hoặc bằng ngày phát hành',
                });
                setLoading(false);
                return;
            }
            const categoryList = {
                residentId: values.resident_id,
                cardNumber: values.card_number,
                issueDate: values.issue_date.format("YYYY-MM-DD"),
                expirationDate: values.expiration_date.format("YYYY-MM-DD"),
            };
            return accessCardApi.createAccessCard(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo cấp thẻ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo cấp thẻ thành công',
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
            const issueDate = values.issue_date.format("YYYY-MM-DD");
            const expirationDate = values.expiration_date.format("YYYY-MM-DD");

            // Check if expiration date is greater than or equal to issue date
            if (expirationDate < issueDate) {
                notification["error"]({
                    message: `Thông báo`,
                    description: 'Ngày hết hạn phải lớn hơn hoặc bằng ngày phát hành',
                });
                setLoading(false);
                return;
            }
            const categoryList = {
                residentId: values.resident_id,
                cardNumber: values.card_number,
                issueDate: values.issue_date.format("YYYY-MM-DD"),
                expirationDate: values.expiration_date.format("YYYY-MM-DD"),
            };
            return accessCardApi.updateAccessCard(categoryList, id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa cấp thẻ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa cấp thẻ thành công',
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
            await accessCardApi.listAccessCard().then((res) => {
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
            await accessCardApi.deleteAccessCard(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa cấp thẻ thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa cấp thẻ thành công',

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
                const response = await accessCardApi.getDetailAccessCard(id);
                setId(id);
                form2.setFieldsValue({
                    resident_id: response.resident_id,
                    card_number: response.card_number,
                    issue_date: dayjs(response.issue_date),
                    expiration_date: dayjs(response.expiration_date),
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
            const res = await accessCardApi.searchAccessCard(name);
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
            title: 'Chủ thẻ',
            dataIndex: 'resident_id',
            key: 'resident_id',
        },
        {
            title: 'Số thẻ',
            dataIndex: 'card_number',
            key: 'card_number',
        },
        {
            title: 'Ngày cấp thẻ',
            dataIndex: 'issue_date',
            key: 'issue_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expiration_date',
            key: 'expiration_date',
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
                await accessCardApi.listAccessCard().then((res) => {
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
                                <span>Quản lý cấp thẻ</span>
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
                                            placeholder="Tìm kiếm theo số thẻ"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo cấp thẻ</Button>
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
                    title="Tạo cấp thẻ mới"
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
                            label="Người được cấp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập người được cấp!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Nhập người được cấp" />
                        </Form.Item>

                        <Form.Item
                            name="card_number"
                            label="số thẻ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số thẻ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Số thẻ" />
                        </Form.Item>

                        <Form.Item
                            name="issue_date"
                            label="Ngày phát hành"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày phát hành!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày phát hành" />
                        </Form.Item>

                        <Form.Item
                            name="expiration_date"
                            label="Ngày hết hạn"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày hết hạn!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày hết hạn" />
                        </Form.Item>


                    </Form>

                </Modal>

                <Modal
                    title="Chỉnh sửa cấp thẻ"
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
                            label="Người được cấp"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn người được cấp!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select placeholder="Chọn người được cấp">
                                {userList?.map(user => (
                                    <Option key={user.id} value={user.id}>
                                        {user.username}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="card_number"
                            label="Số thẻ"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số thẻ!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <InputNumber placeholder="Số thẻ" />
                        </Form.Item>

                        <Form.Item
                            name="issue_date"
                            label="Ngày phát hành"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày phát hành!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày phát hành" />
                        </Form.Item>

                        <Form.Item
                            name="expiration_date"
                            label="Ngày hết hạn"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập ngày hết hạn!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày hết hạn" />
                        </Form.Item>

                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default AssetCards;