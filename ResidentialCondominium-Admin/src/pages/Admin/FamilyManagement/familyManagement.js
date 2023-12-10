import {
    HomeOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import {
    BackTop, Breadcrumb,
    Form,
    Spin,
    Table
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userApi from "../../../apis/userApi";
import "./familyManagement.css";
import emergencyMaintenanceApi from '../../../apis/emergencyMaintenanceApi';

const FamilyManagement = () => {

    const [category, setCategory] = useState();
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

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'Tên vợ/chồng',
            dataIndex: 'spouse_name',
            key: 'spouse_name',
        },
        {
            title: 'Con cái',
            dataIndex: 'children',
            key: 'children',
        },
    ];

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getAllPersonalInfo();
                const data = JSON.stringify(response);

                console.log(JSON.parse(data));
                setCategory(JSON.parse(data));
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch category list:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        })();
    }, []);


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
                                <span>Quản lý hộ gia đình</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} childrenColumnName="antdChildren" pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default FamilyManagement;