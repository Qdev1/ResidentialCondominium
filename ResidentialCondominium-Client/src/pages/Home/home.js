import React, { useState, useEffect, useRef } from "react";
import styles from "./home.module.css";
import { Spin, BackTop, } from "antd";
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";

const Home = () => {
    const history = useHistory();
    const [userData, setUserData] = useState(null);

    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdown = (value) => {
        setShowDropdown(value);
    };

    const handleClick = (link) => {
        history.push(link);
    };

    const handleLogout = () => {
        localStorage.clear();
        history.push("/");
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                if (response != "Invalid Token") {
                    setUserData(response.user);
                }
            } catch (error) {
                console.log('Failed to fetch profile user:' + error);
            }
        })();
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.design}>
                <img className={styles.designChild} alt="" src="/vector-11.svg" />
                <div className={styles.header}>
                    <img className={styles.heroImageIcon} alt="" src="/hero-image@2x.png" />
                    <div className={styles.navBar}>
                        <div className={styles.navContent}>
                            <div className={styles.aboutUs} onClick={() => handleClick("/residence-event")}>Residence</div>
                            <div className={styles.services} onClick={() => handleClick("/maintenance-planning")}>Maintenance</div>
                            {userData ? (
                                <div className={styles.project} onMouseEnter={() => handleDropdown(true)} onMouseLeave={() => handleDropdown(false)}>
                                    {userData?.username}
                                    {showDropdown && (
                                        <div className={styles.dropdown}>
                                            <div onClick={() => handleClick("/profile")}>Trang cá nhân</div>
                                            <div onClick={() => handleLogout()}>Logout</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.project} onClick={() => handleClick("/login")}>Login</div>
                            )}
                            <div className={styles.groupParent}>
                                <div className={styles.homeWrapper}>
                                    <div className={styles.home} onClick={() => handleClick("/home")}>Home</div>
                                </div>
                                <div className={styles.groupChild} />
                            </div>
                        </div>
                        <div className={styles.logo}>
                            <div className={styles.logo1}>
                                <img style={{ height: 120 }} className="logo" alt="" src="https://i.ibb.co/k56rLRV/393165597-368988352388994-6454052415328874638-n.png" />
                            </div>
                        </div>
                    </div>
                    <div className={styles.headerContent}>
                        <div className={styles.heroText}>
                            our All-in-One Solution for Efficient Condo Operations
                        </div>
                        <div className={styles.heroHeading}>
                            <b className={styles.condoOperationsManagement}>
                                Condo Operations Management System
                            </b>
                        </div>
                    </div>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </div>
        </div>

    );
};

export default Home;
