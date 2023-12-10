import React, { useState, useEffect, useRef } from "react";
import styles from "./home.module.css";
import { Spin, BackTop, } from "antd";
import { useHistory } from "react-router-dom";
import userApi from "../../apis/userApi";

const Home = () => {
    const history = useHistory();
    const [userData, setUserData] = useState(null);


    const handleClick = (link) => {
        history.push(link);
    };

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                console.log(response);
                if(response != "Invalid Token"){
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
                            {userData ?
                                <div className={styles.project} onClick={() => handleClick("/login")}>{userData?.username}</div>
                                :
                                <div className={styles.project} onClick={() => handleClick("/login")}>Login</div>
                            }
                            <div className={styles.groupParent}>
                                <div className={styles.homeWrapper}>
                                    <div className={styles.home} onClick={() => handleClick("/home")}>Home</div>
                                </div>
                                <div className={styles.groupChild} />
                            </div>
                        </div>
                        <div className={styles.logo}>
                            <div className={styles.logo1}>COMS</div>
                        </div>
                    </div>
                    <div className={styles.headerContent}>
                        <div className={styles.buttons}>
                            <div className={styles.buttonDownloadApp}>
                                <div className={styles.buttonDownloadAppChild} />
                                <div className={styles.explore}>Explore</div>
                            </div>
                            <div className={styles.buttonDownloadApp1}>
                                <div className={styles.buttonDownloadAppItem} />
                                <div className={styles.contactUs}>Contact Us</div>
                            </div>
                        </div>
                        <div className={styles.heroText}>
                            our All-in-One Solution for Efficient Condo Operations
                        </div>
                        <div className={styles.heroHeading}>
                            <b className={styles.condoOperationsManagement}>
                                Condo Operations Management System
                            </b>
                        </div>
                        <div className={styles.stats}>
                            <img className={styles.decoratorIcon} alt="" src="/decorator.svg" />
                            <div className={styles.stats1}>
                                <div className={styles.stats2}>
                                    <div className={styles.projectsDone}>Projects Done</div>
                                    <div className={styles.div}>25,356</div>
                                </div>
                                <div className={styles.stats3}>
                                    <div className={styles.projectsDone}>Buildings Done</div>
                                    <div className={styles.div1}>15,200</div>
                                </div>
                                <div className={styles.stats4}>
                                    <div className={styles.projectsDone}>Total Employees</div>
                                    <div className={styles.div1}>350+</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.whyChooseUs}>
                    <div className={styles.sectionHeading}>
                        <div className={styles.whyChooseOur}>
                            Why Choose Our Condo Operations Management System
                        </div>
                        <div className={styles.heroTextParent}>
                            <div className={styles.heroText1}>
                                Are you looking for a better way to manage your condo operations?
                            </div>
                            <div className={styles.buttonDownloadApp2}>
                                <div className={styles.buttonDownloadAppChild} />
                                <div className={styles.explore}>Explore</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.sectionContent}>
                        <img className={styles.imageIcon} alt="" src="/image@2x.png" />
                        <div className={styles.points}>
                            <div className={styles.point1}>
                                <div className={styles.heroText2}>
                                    Our system is user-friendly, customizable and scalable. You can
                                    easily adjust the settings and features to suit your preferences
                                    and requirements
                                </div>
                                <div className={styles.rectangleParent}>
                                    <div className={styles.groupItem} />
                                    <div className={styles.div3}>01</div>
                                </div>
                            </div>
                            <div className={styles.point2}>
                                <div className={styles.heroText3}>
                                    Our system is comprehensive and integrated. It covers all
                                    aspects of condo operations, from accounting and billing to
                                    maintenance and security
                                </div>
                                <div className={styles.rectangleGroup}>
                                    <div className={styles.groupInner} />
                                    <div className={styles.div3}>02</div>
                                </div>
                            </div>
                            <div className={styles.point3}>
                                <div className={styles.heroText3}>
                                    Our system is cloud-based, which means you can access it from
                                    any device, anywhere, anytime. You don't need to install any
                                    software or hardware on your premises
                                </div>
                                <div className={styles.rectangleContainer}>
                                    <div className={styles.rectangleDiv} />
                                    <div className={styles.div3}>03</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.ourTeam}>
                    <div className={styles.sectionHeading1}>
                        <div className={styles.ourBestEngineers}>Our Best Engineers</div>
                    </div>
                    <img
                        className={styles.arrowButtonIcon}
                        alt=""
                        src="/arrow-button.svg"
                    />
                    <div className={styles.engineers}>
                        <div className={styles.engineer}>
                            <div className={styles.engineerChild} />
                            <div className={styles.chrisEvans}>Chris Evans</div>
                            <div className={styles.michiganTx}>Michigan, TX</div>
                            <div className={styles.div6}>989-653-2986</div>
                            <div className={styles.chrisevansconstcom}>
                                ChrisEvans@const.com
                            </div>
                            <img className={styles.engineerItem} alt="" src="/group-596.svg" />
                            <img className={styles.groupIcon} alt="" src="/group.svg" />
                            <img
                                className={styles.engineerInner}
                                alt=""
                                src="/ellipse-752@2x.png"
                            />
                        </div>
                        <div className={styles.engineer1}>
                            <div className={styles.engineerChild} />
                            <div className={styles.alisonKiara}>Alison Kiara</div>
                            <div className={styles.michiganTx}>Michigan, TX</div>
                            <div className={styles.div6}>989-653-2986</div>
                            <div className={styles.chrisevansconstcom}>
                                alisonkiara@const.com
                            </div>
                            <img className={styles.engineerItem} alt="" src="/group-596.svg" />
                            <img className={styles.groupIcon} alt="" src="/group.svg" />
                            <img
                                className={styles.engineerInner}
                                alt=""
                                src="/ellipse-7521@2x.png"
                            />
                        </div>
                        <div className={styles.engineer2}>
                            <div className={styles.engineerChild} />
                            <div className={styles.adamGates}>Adam Gates</div>
                            <div className={styles.michiganTx}>Michigan, TX</div>
                            <div className={styles.div6}>989-653-2986</div>
                            <div className={styles.adamgatesconstcom}>adamgates@const.com</div>
                            <img className={styles.engineerItem} alt="" src="/group-596.svg" />
                            <img className={styles.groupIcon} alt="" src="/group.svg" />
                            <img
                                className={styles.engineerInner}
                                alt=""
                                src="/ellipse-7522@2x.png"
                            />
                        </div>
                    </div>
                </div>
                <img className={styles.borderIcon} alt="" src="/border.svg" />
                <div className={styles.contactUs1}>
                    <div className={styles.mapParent}>
                        <img className={styles.mapIcon} alt="" src="/map.svg" />
                        <div className={styles.tag}>
                            <img className={styles.unionIcon} alt="" src="/union.svg" />
                            <img className={styles.tagChild} alt="" src="/ellipse-4@2x.png" />
                            <div className={styles.canada}>Canada</div>
                        </div>
                        <div className={styles.tag1}>
                            <img className={styles.unionIcon1} alt="" src="/union1.svg" />
                            <img className={styles.tagChild} alt="" src="/ellipse-41@2x.png" />
                            <div className={styles.grmany}>Grmany</div>
                        </div>
                        <div className={styles.tag2}>
                            <img className={styles.unionIcon} alt="" src="/union2.svg" />
                            <img className={styles.tagChild} alt="" src="/ellipse-42@2x.png" />
                            <div className={styles.australia}>Australia</div>
                        </div>
                        <div className={styles.tag3}>
                            <img className={styles.unionIcon} alt="" src="/union3.svg" />
                            <img className={styles.tagChild} alt="" src="/ellipse-43@2x.png" />
                            <div className={styles.brazil}>Brazil</div>
                        </div>
                        <div className={styles.tag4}>
                            <img className={styles.unionIcon} alt="" src="/union4.svg" />
                            <img className={styles.tagChild} alt="" src="/ellipse-44@2x.png" />
                            <div className={styles.pakistan}>Pakistan</div>
                        </div>
                    </div>
                    <div className={styles.contactUs2}>Contact Us</div>
                    <div className={styles.wereHereTo}>
                        We're here to assist you! Whether you have questions, need support, or
                        want to learn more about our Condo Operations Asset Management system,
                        our team is ready to help. Feel free to reach out to us through the
                        following contact
                    </div>
                    <div className={styles.contactForm}>
                        <div className={styles.forma23}>
                            <div className={styles.rectangle} />
                            <div className={styles.rectangle1} />
                        </div>
                        <div className={styles.forma24} />
                        <div className={styles.forma25} />
                        <div className={styles.forma26} />
                        <div className={styles.maya}>Maya</div>
                        <div className={styles.subject}>Subject</div>
                        <div className={styles.massage}>Massage</div>
                        <div className={styles.email}>Email</div>
                        <div className={styles.button2}>
                            <div className={styles.forma27}>
                                <div className={styles.rectangle2} />
                                <div className={styles.rectangle3} />
                            </div>
                            <div className={styles.sendMassage}>Send Massage</div>
                        </div>
                        <div className={styles.forma28} />
                        <div className={styles.text12}>
                            <div className={styles.name}>Name</div>
                        </div>
                    </div>
                </div>
                <img className={styles.borderIcon1} alt="" src="/border.svg" />
                <div className={styles.newsletter}>
                    <div className={styles.button}>
                        <div className={styles.fill} />
                        <img className={styles.icon} alt="" src="/icon.svg" />
                        <div className={styles.subscribe}>SUBSCRIBE</div>
                    </div>
                    <div className={styles.ageSoldSome}>
                        Age sold some full like rich new. Amounted repeated as believed in
                        confined juvenile.
                    </div>
                    <div className={styles.subscribeToOurContainer}>
                        <p className={styles.subscribeToOur}>Subscribe to our</p>
                        <p className={styles.subscribeToOur}>Newsletter</p>
                    </div>
                </div>
                <div className={styles.rectangle4} />
                <div className={styles.footer}>
                    <div className={styles.copyrightConstructioncomAl}>
                        Copyright CondoOperations, All rights reserved.
                    </div>
                    <div className={styles.shape} />
                    <div className={styles.footer1}>
                        <div className={styles.getInTouch}>
                            <div className={styles.enterYourMail}>
                                <div className={styles.enterYourMailChild} />
                                <div className={styles.enterYourMail1}>Enter your mail</div>
                                <img className={styles.groupIcon3} alt="" src="/group1.svg" />
                            </div>
                            <div className={styles.getInTouch1}>Get in touch</div>
                        </div>
                        <div className={styles.company}>
                            <div className={styles.getInTouch1}>Company</div>
                            <div className={styles.patnerships}>Patnerships</div>
                            <div className={styles.termsOfUse}>Terms of use</div>
                            <div className={styles.privacy}>Privacy</div>
                            <div className={styles.sitemap}>Sitemap</div>
                        </div>
                        <div className={styles.resources}>
                            <div className={styles.getInTouch1}>Resources</div>
                            <div className={styles.memberStories}>Member Stories</div>
                            <div className={styles.ourAgents}>Our Agents</div>
                            <div className={styles.freeTrial}>Free trial</div>
                            <div className={styles.video}>Video</div>
                        </div>
                        <div className={styles.footerLink}>
                            <img className={styles.socialIcon} alt="" src="/social-icon.svg" />
                            <div className={styles.youllFindYour}>
                                You’ll find your next Home loan valu you prefer.
                            </div>
                            <div className={styles.logo2}>
                                <div className={styles.logo1}>CONSTRUCTION</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.logos}>
                    <div className={styles.logosChild} />
                    <div className={styles.logos1}>
                        <div className={styles.logoParent}>
                            <img className={styles.logoIcon} alt="" src="/logo.svg" />
                            <img className={styles.logoIcon1} alt="" src="/logo1.svg" />
                            <img className={styles.logoIcon2} alt="" src="/logo2.svg" />
                            <img className={styles.logoIcon3} alt="" src="/logo3@2x.png" />
                            <img className={styles.logoIcon4} alt="" src="/logo4.svg" />
                        </div>
                    </div>
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </div>
        </div>

    );
};

export default Home;
