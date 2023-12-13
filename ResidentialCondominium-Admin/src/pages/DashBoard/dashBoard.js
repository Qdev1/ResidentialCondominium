import {
    ContactsTwoTone,
    DashboardOutlined,
    EnvironmentTwoTone,
    FolderOpenTwoTone,
    HddTwoTone,
    HomeOutlined,
    NotificationTwoTone,
    ShopTwoTone,
    ShoppingTwoTone
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Modal,
    Row,
    Spin,
    Tag,
    Typography
} from 'antd';
import React, { useEffect, useState } from 'react';
import dashBoardApi from "../../apis/dashBoardApi";
import "./dashBoard.css";


const DashBoard = () => {
    const [order, setOrder] = useState([]);
    const [statisticList, setStatisticList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotalList] = useState();
    const [data, setData] = useState(null);


    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text.username}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'user',
            key: 'user',
            render: (text, record) => <a>{text.email}</a>,
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'orderTotal',
            key: 'orderTotal',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: 'billing',
            key: 'billing',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (slugs) => (
                <span>
                    <Tag color="geekblue" key={slugs}>
                        {slugs?.toUpperCase()}
                    </Tag>
                </span>
            ),
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                await dashBoardApi.getAssetStatistics().then((res) => {
                    console.log(res);
                    setTotalList(res)
                    setStatisticList(res);
                    setData(res.data.data);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])
    return (
        <div>
            <Spin spinning={false}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Row gutter={12} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.userCount}</div>
                                        <div className='title_total'>Số thành viên</div>
                                    </div>
                                    <div>
                                        <ContactsTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>

                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.roomCount}</div>
                                        <div className='title_total'>Số phòng</div>
                                    </div>
                                    <div>
                                        <ShopTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>
                                            {parseFloat(statisticList?.totalAssetsValue).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            })}
                                        </div>
                                        <div className='title_total'>Tổng giá trị tài sản</div>
                                    </div>
                                    <div>
                                        <HddTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>

                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.contractCount}</div>
                                        <div className='title_total'>Số hợp đồng</div>
                                    </div>
                                    <div>
                                        <ShoppingTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>

                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={12} style={{ marginTop: 20 }}>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.eventHistoryCount}</div>
                                        <div className='title_total'>Lịch sử sự kiện</div>
                                    </div>
                                    <div>
                                        <NotificationTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.customerCount}</div>
                                        <div className='title_total'>Số khách hàng</div>
                                    </div>
                                    <div>
                                        <FolderOpenTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{statisticList?.meetingParticipantsCount}</div>
                                        <div className='title_total'>Số người tham gia cuộc họp</div>
                                    </div>
                                    <div>
                                        <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default DashBoard;