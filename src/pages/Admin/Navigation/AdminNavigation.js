import { useState } from 'react'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { changeLanguage } from '../../../store/action/appAction'
import { NavLink } from 'react-router-dom'
import './AdminNavigation.scss'
import { fetchLogOut } from '../../../store/action/userAction'
import ModalNotify from '../../../component/Modal/ModalNotify'

function AdminNavigation() {
    const { t } = useTranslation()
    const app = useSelector((state) => state.app.language)
    const dispatch = useDispatch()
    let navigate = useNavigate()

    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')

    let handleChangeLanguage = (newLanguage) => {
        dispatch(changeLanguage(newLanguage))
    }

    let handleLogOut = () => {
        setIsOpenModal(true)
        setDescriptionModal('modal.log-out')
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let handleSubmitModal = async () => {
        dispatch(fetchLogOut())
        navigate('/login')
    }

    return (
        <>
            <div className="navigation-container">
                <div className="nav-body">
                    <div className="content-left">
                        <h2 className="title">ExamApp</h2>
                    </div>
                    <div className="content-right">
                        <div className="navigate">
                            <NavLink to="/admin/manageUser" className="item">
                                {t('admin.manage-user')}
                            </NavLink>
                            <NavLink to="/admin/manageExam" className="item">
                                {t('admin.manage-exam')}
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
                            <button onClick={handleLogOut} className="item">
                                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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

export default AdminNavigation
