import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import OutsideClickHandler from 'react-outside-click-handler'
import { Link, useNavigate } from 'react-router-dom'

import './MobieMenu.scss'
import ImgAvatar from '../ImgAvatar/ImgAvatar'
import { path } from '../../until/constant'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowRightFromBracket,
    faArrowUpFromBracket,
    faBookOpen,
    faEarthAmerica,
    faFlag,
    faGear,
    faHeart,
    faHome,
    faPencil,
} from '@fortawesome/free-solid-svg-icons'
import { changeLanguage } from '../../store/action/appAction'
import ModalNotify from '../Modal/ModalNotify'
import { fetchLogOut } from '../../store/action/userAction'

function MobieMenu({ showMenuMobie = false, togglehMenuMobie = () => {}, listMenu = [] }) {
    const { t } = useTranslation()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app.language)
    let navigate = useNavigate()
    const dispatch = useDispatch()

    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')

    let handleLogOut = (e) => {
        setIsOpenModal(true)
        setDescriptionModal('modal.log-out')
    }

    let handleChangeLanguage = (newLanguage) => {
        dispatch(changeLanguage(newLanguage))
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let handleSubmitModal = async () => {
        dispatch(fetchLogOut())
        navigate('/login')
    }

    let renderListMenu = () => {
        return listMenu.map((list) => {
            return (
                <div className="mobie-item" style={{ marginTop: '12px' }}>
                    {list.map((item) => {
                        return (
                            <div className="description">
                                {item.icon}
                                <Link className="link" to={item.to}>
                                    {t(item.text)}
                                </Link>
                            </div>
                        )
                    })}
                </div>
            )
        })
    }

    return (
        <>
            {showMenuMobie ? (
                <div className="mobie-modal">
                    <OutsideClickHandler
                        onOutsideClick={() => {
                            togglehMenuMobie(false)
                        }}
                    >
                        <div className="mobie-body">
                            <div className="mobie-navbar">
                                <div className="mobie-header">
                                    {user.isLoggedIn ? (
                                        <>
                                            <ImgAvatar
                                                style={{ width: '80px', height: '80px' }}
                                                alt="no-img"
                                                src={user && user.userInfo && user.userInfo.avatar}
                                            />
                                            <div className="mobie-title">
                                                <span className="name">
                                                    {user && user.userInfo && user.userInfo.name}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {user.isLoggedIn ? (
                                    <>
                                        <div className="mobie-bottom">
                                            {renderListMenu()}

                                            {/* <div className="mobie-item" style={{ marginTop: '12px' }}>
                                                <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faHome} />
                                                    <Link className="link" to={`/`}>
                                                        {t('result.homepage')}
                                                    </Link>
                                                </div>
                                            </div> */}

                                            {/* <div className="mobie-item">
                                                <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faBookOpen} />
                                                    <Link className="link" to={path.myExam}>
                                                        {t('detail-user.my-exam')}
                                                    </Link>
                                                </div>

                                                <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faHeart} />
                                                    <Link className="link" to={path.myLoveExam}>
                                                        {t('detail-user.favorite-exam')}
                                                    </Link>
                                                </div>

                                                <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faPencil} />
                                                    <Link className="link" to={path.myDoExam}>
                                                        {t('home-page.exam-participated')}
                                                    </Link>
                                                </div>
                                            </div> */}

                                            {/* <div className="mobie-item" style={{ marginTop: '12px' }}>
                                                <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faFlag} />
                                                    <Link className="link" to={`/ratings/examId`}>
                                                        {t('ratings.ratings')}
                                                    </Link>
                                                </div>
                                            </div> */}

                                            <div className="mobie-item" style={{ marginTop: '12px' }}>
                                                {/* <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faGear} />
                                                    <Link className="link" to={path.setting}>
                                                        {t('detail-user.setting')}
                                                    </Link>
                                                </div> */}

                                                <div className="description-language">
                                                    <div className="left">
                                                        <FontAwesomeIcon className="icon" icon={faEarthAmerica} />
                                                        <span className="link"> {t('home-page.language')}</span>
                                                    </div>
                                                    <div className="right">
                                                        <span
                                                            className={app === 'en' ? 'language active' : 'language'}
                                                            onClick={() => handleChangeLanguage('en')}
                                                        >
                                                            EN
                                                        </span>
                                                        <span
                                                            className={app === 'vi' ? 'language active' : 'language'}
                                                            onClick={() => handleChangeLanguage('vi')}
                                                        >
                                                            VN
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mobie-item" style={{ marginBottom: '0' }}>
                                                <div className="description">
                                                    <>
                                                        <FontAwesomeIcon
                                                            className="icon"
                                                            icon={faArrowRightFromBracket}
                                                        />
                                                        <Link className="link" onClick={handleLogOut}>
                                                            {t('detail-user.log-out')}
                                                        </Link>
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mobie-bottom">
                                            <div className="mobie-item" style={{ marginBottom: '0' }}>
                                                <div className="description">
                                                    <>
                                                        <FontAwesomeIcon
                                                            className="icon"
                                                            icon={faArrowRightFromBracket}
                                                        />
                                                        <Link className="link" to={path.login}>
                                                            {t('log-in.login')}
                                                        </Link>
                                                    </>
                                                </div>
                                            </div>
                                            <div className="mobie-item" style={{ marginTop: '12px' }}>
                                                <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faHome} />
                                                    <Link className="link" to={`/`}>
                                                        {t('result.homepage')}
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="mobie-item" style={{ marginTop: '12px' }}>
                                                <div className="description">
                                                    <FontAwesomeIcon className="icon" icon={faGear} />
                                                    <Link className="link" to={`/settings/personal`}>
                                                        {t('detail-user.setting')}
                                                    </Link>
                                                </div>

                                                <div className="description-language">
                                                    <div className="left">
                                                        <FontAwesomeIcon className="icon" icon={faGear} />
                                                        <span className="link"> {t('home-page.language')}</span>
                                                    </div>
                                                    <div className="right">
                                                        <span
                                                            className={app === 'en' ? 'language active' : 'language'}
                                                            onClick={() => handleChangeLanguage('en')}
                                                        >
                                                            EN
                                                        </span>
                                                        <span
                                                            className={app === 'vi' ? 'language active' : 'language'}
                                                            onClick={() => handleChangeLanguage('vi')}
                                                        >
                                                            VN
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </OutsideClickHandler>
                </div>
            ) : (
                <></>
            )}
            {isOpenModal && (
                <ModalNotify
                    typeModal="user"
                    isOpenModal={isOpenModal}
                    descriptionModal={descriptionModal}
                    handleCloseModal={handleCloseModal}
                    handleSubmitModal={handleSubmitModal}
                />
            )}
        </>
    )
}

export default MobieMenu
