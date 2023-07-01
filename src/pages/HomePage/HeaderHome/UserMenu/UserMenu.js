import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import './UserMenu.scss'
import ImgAvatar from '../../../../component/ImgAvatar/ImgAvatar'
import { path } from '../../../../until/constant'
import { fetchLogOut } from '../../../../store/action/userAction'
import ModalNotify from '../../../../component/Modal/ModalNotify'
import { useState } from 'react'

function UserMenu() {
    const { t } = useTranslation()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app.language)
    const dispatch = useDispatch()
    let navigate = useNavigate()

    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')

    let handleSubmitModal = async () => {
        dispatch(fetchLogOut())
        navigate('/login')
    }

    let handleLogOut = () => {
        setIsOpenModal(true)
        setDescriptionModal('modal.log-out')
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)
        setDescriptionModal('')
    }

    return (
        <>
            <div className="user-menu-container">
                <div className="user-menu-header">
                    <ImgAvatar width="50px" alt="no-img" src={user && user.userInfo && user.userInfo.avatar} />
                    <div className="user-menu-title">
                        <span className="name">{user && user.userInfo && user.userInfo.name}</span>
                        <span className="email">{user && user.userInfo && user.userInfo.email}</span>
                    </div>
                </div>
                <div className="user-menu-body">
                    <div className="user-meu-item" style={{ marginTop: '12px' }}>
                        <Link to={`/settings/personal`}>{t('detail-user.setting')}</Link>
                    </div>
                    <div className="user-meu-item">
                        <Link to={path.myExam}>{t('detail-user.my-exam')}</Link>
                        <a href="/">{t('detail-user.favorite-exam')}</a>
                    </div>

                    <div className="user-meu-item" style={{ marginBottom: '0' }}>
                        <Link onClick={handleLogOut}>{t('detail-user.log-out')}</Link>
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

export default UserMenu
