import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Tippy from '@tippyjs/react/headless'

import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import { changeLanguage } from '../../../store/action/appAction'
import examService from '../../../service/examService'

import './HeaderHome.scss'
import { fetchLogOut } from '../../../store/action/userAction'
import ModalNotify from '../../../component/Modal/ModalNotify'
import ImgAvatar from '../../../component/ImgAvatar/ImgAvatar'
import ButtonNotify from '../../../component/ButtonNotify/ButtonNotify'
import WrapperPoper from '../../User/Ratings/WrapperPoper/WrapperPoper'
import UserMenu from './UserMenu/UserMenu'

function HeaderHome() {
    const { t } = useTranslation()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app.language)
    const dispatch = useDispatch()
    let navigate = useNavigate()

    const [isShowUserInfo, setIsShowUserInfo] = useState(false)

    let handleChangeLanguage = (newLanguage) => {
        dispatch(changeLanguage(newLanguage))
    }

    let handleToLogin = () => {
        navigate('/login')
    }

    let onClickAvatar = () => {
        setIsShowUserInfo(true)
        //navigate(`/detail/${user.userInfo._id}`)

        //console.log(user.userInfo)
    }

    let handleHideResult = () => {
        setIsShowUserInfo(false)
    }

    return (
        <>
            <div className="headerhome-container">
                <div className="nav-body">
                    <div className="content-left">
                        <Link to="/" className="title">
                            ExamApp
                        </Link>
                    </div>
                    <div className="content-right">
                        <div className="navigate">
                            {/* <NavLink to="/admin/manageUser" className="item">
                            Quản lý người dùng
                        </NavLink> */}
                            <NavLink to="/myExam" className="item">
                                {t('home-page.your-exam')}
                            </NavLink>

                            <div className="language">
                                <span
                                    className={app === 'en' ? 'active' : ''}
                                    onClick={() => handleChangeLanguage('en')}
                                >
                                    EN
                                </span>
                                <span
                                    className={app === 'vi' ? 'active' : ''}
                                    onClick={() => handleChangeLanguage('vi')}
                                >
                                    VN
                                </span>
                            </div>
                            {/* <div className="welcome">
                                {t('home-page.hello', { name: user && user.userInfo && user.userInfo.name })}{' '}
                            </div> */}
                            {user.isLoggedIn ? (
                                <>
                                    <Tippy
                                        render={(attrs) => (
                                            <div className="box" style={{ minWidth: '230px' }} tabIndex="-1" {...attrs}>
                                                <WrapperPoper>
                                                    <UserMenu />
                                                </WrapperPoper>
                                            </div>
                                        )}
                                        visible={isShowUserInfo}
                                        interactive
                                        placement="bottom-start"
                                        onClickOutside={handleHideResult}
                                        className="tippy-custom"
                                    >
                                        <div className="avatar-user">
                                            <ImgAvatar
                                                onClick={onClickAvatar}
                                                alt="no-img"
                                                src={user && user.userInfo && user.userInfo.avatar}
                                            />
                                        </div>
                                    </Tippy>

                                    {/* <button onClick={handleLogOut} className="item">
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                    </button> */}
                                </>
                            ) : (
                                <button onClick={handleToLogin} className="item">
                                    {t('log-in.login')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderHome
