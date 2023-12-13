import React, { Suspense, lazy } from "react";
import { Layout } from 'antd';
import { withRouter } from "react-router";
import Footer from '../components/layout/footer/footer';
import Header from '../components/layout/header/header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import NotFound from '../components/notFound/notFound';
import Sidebar from '../components/layout/sidebar/sidebar';
import LoadingScreen from '../components/loading/loadingScreen';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const { Content } = Layout;

const Login = lazy(() => {
    return Promise.all([
        import('../pages/Login/login'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AccountManagement = lazy(() => {
    return Promise.all([
        import('../pages/AccountManagement/accountManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ChangePassword = lazy(() => {
    return Promise.all([
        import('../pages/ChangePassword/changePassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Profile = lazy(() => {
    return Promise.all([
        import('../pages/Profile/profile'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetCategory = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetCategory/assetCategory'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetManagement/assetManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const VendorManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/VendorManagement/vendorManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const MaintenancePlanning = lazy(() => {
    return Promise.all([
        import('../pages/Admin/MaintenancePlanning/maintenancePlanning'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


// const SalesManagement = lazy(() => {
//     return Promise.all([
//         import('../pages/Admin/SalesManagement/assetManagement'),
//         new Promise(resolve => setTimeout(resolve, 0))
//     ])
//         .then(([moduleExports]) => moduleExports);
// });

const AssetHistory = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetHistory/assetHistory'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetReport = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetReport/assetReport'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const MaintenanceHistory = lazy(() => {
    return Promise.all([
        import('../pages/Admin/MaintenanceHistory/maintenanceHistory'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RecordResidentEvents = lazy(() => {
    return Promise.all([
        import('../pages/Admin/Residents/RecordResidentEvents/recordResidentEvents'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RecordResidentEventsDetails = lazy(() => {
    return Promise.all([
        import('../pages/Admin/Residents/RecordResidentEventsDetails/recordResidentEventsDetails'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ResetPassword = lazy(() => {
    return Promise.all([
        import('../pages/ResetPassword/resetPassword'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ResidenceRules = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ResidenceRules/residenceRules'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const CustomerEnrollment = lazy(() => {
    return Promise.all([
        import('../pages/Admin/CustomerEnrollment/customerEnrollment'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const RoomManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/RoomManagement/roomManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ContractManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ContractManagement/contractManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ComplaintManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ComplaintManagement/complaintManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const AssetCards = lazy(() => {
    return Promise.all([
        import('../pages/Admin/AssetCards/assetCards'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const ReceptionManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/ReceptionManagement/receptionManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const UnauthorizedEntry = lazy(() => {
    return Promise.all([
        import('../pages/Admin/UnauthorizedEntry/unauthorizedEntry'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const EmergencyMaintenance = lazy(() => {
    return Promise.all([
        import('../pages/Admin/EmergencyMaintenance/emergencyMaintenance'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const Visitors = lazy(() => {
    return Promise.all([
        import('../pages/Admin/Visitors/visitors'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const Notification = lazy(() => {
    return Promise.all([
        import('../pages/Admin/Notification/notification'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const MaintenanceFunds = lazy(() => {
    return Promise.all([
        import('../pages/Admin/MaintenanceFunds/maintenanceFunds'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const FamilyManagement = lazy(() => {
    return Promise.all([
        import('../pages/Admin/FamilyManagement/familyManagement'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});


const DashBoard = lazy(() => {
    return Promise.all([
        import('../pages/DashBoard/dashBoard'),
        new Promise(resolve => setTimeout(resolve, 0))
    ])
        .then(([moduleExports]) => moduleExports);
});

const RouterURL = withRouter(({ location }) => {


    const LoginContainer = () => (
        <div>
            <PublicRoute exact path="/">
                <Suspense fallback={<LoadingScreen />}>
                    <Login />
                </Suspense>
            </PublicRoute>
            <PublicRoute exact path="/login">
                <Login />
            </PublicRoute>
            <PublicRoute exact path="/reset-password/:id">
                <ResetPassword />
            </PublicRoute>

        </div>
    )

    const DefaultContainer = () => (
        <PrivateRoute>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />
                <Layout >
                    <Header />
                    <Content style={{ marginLeft: 230, width: 'calc(100% - 230px)', marginTop: 55 }}>
                        <PrivateRoute exact path="/account-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AccountManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/profile">
                            <Suspense fallback={<LoadingScreen />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/change-password/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <ChangePassword />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/asset-list">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetCategory />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/asset-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/maintenance-planning">
                            <Suspense fallback={<LoadingScreen />}>
                                <MaintenancePlanning />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/vendor-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <VendorManagement />
                            </Suspense>
                        </PrivateRoute>

                        {/* <PrivateRoute exact path="/sales-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <SalesManagement />
                            </Suspense>
                        </PrivateRoute> */}

                        <PrivateRoute exact path="/asset-history">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetHistory />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/maintenance-history">
                            <Suspense fallback={<LoadingScreen />}>
                                <MaintenanceHistory />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/asset-report">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetReport />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/residence-event">
                            <Suspense fallback={<LoadingScreen />}>
                                <RecordResidentEvents />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/residence-event-details/:id">
                            <Suspense fallback={<LoadingScreen />}>
                                <RecordResidentEventsDetails />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/residence-rules">
                            <Suspense fallback={<LoadingScreen />}>
                                <ResidenceRules />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/customer-enrollment">
                            <Suspense fallback={<LoadingScreen />}>
                                <CustomerEnrollment />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/room-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <RoomManagement />
                            </Suspense>
                        </PrivateRoute>

                        
                        <PrivateRoute exact path="/contracts-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ContractManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/complaint-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ComplaintManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/reception-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <ReceptionManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/access-card">
                            <Suspense fallback={<LoadingScreen />}>
                                <AssetCards />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/unauthorized-entry">
                            <Suspense fallback={<LoadingScreen />}>
                                <UnauthorizedEntry />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/emergency">
                            <Suspense fallback={<LoadingScreen />}>
                                <EmergencyMaintenance />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/visitors">
                            <Suspense fallback={<LoadingScreen />}>
                                <Visitors />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/notifications">
                            <Suspense fallback={<LoadingScreen />}>
                                <Notification />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/maintenance-funds">
                            <Suspense fallback={<LoadingScreen />}>
                                <MaintenanceFunds />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/family-management">
                            <Suspense fallback={<LoadingScreen />}>
                                <FamilyManagement />
                            </Suspense>
                        </PrivateRoute>

                        <PrivateRoute exact path="/dash-board">
                            <Suspense fallback={<LoadingScreen />}>
                                <DashBoard />
                            </Suspense>
                        </PrivateRoute>
                        
                        <PrivateRoute exact path="/notfound">
                            <NotFound />
                        </PrivateRoute>
                    </Content>
                    <Footer />
                </Layout>
            </Layout>
        </PrivateRoute >
    )

    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/login">
                        <LoginContainer />
                    </Route>

                    <Route exact path="/reset-password/:id">
                        <LoginContainer />
                    </Route>
                    
                    <Route exact path="/profile">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/change-password/:id">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/account-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-list">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/maintenance-planning">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/vendor-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/sales-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-history">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/maintenance-history">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/asset-report">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-event">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-event-details/:id">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/residence-rules">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/customer-enrollment">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/room-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/contracts-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/complaint-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/reception-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/access-card">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/unauthorized-entry">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/emergency">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/visitors">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/notifications">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/maintenance-funds">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/family-management">
                        <DefaultContainer />
                    </Route>

                    <Route exact path="/dash-board">
                        <DefaultContainer />
                    </Route>
                    
                    
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
})

export default RouterURL;
