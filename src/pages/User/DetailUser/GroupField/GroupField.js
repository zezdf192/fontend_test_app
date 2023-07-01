import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import examService from '../../../../service/examService'
import userService from '../../../../service/userService'
import './GroupField.scss'
import { fetchUpdateUser } from '../../../../store/action/userAction'

function GroupField() {
    const { t } = useTranslation()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app.language)
    const dispatch = useDispatch()
    // let navigate = useNavigate()

    const [isEditName, setIsEditName] = useState(false)
    const [isEditPassword, setIsEditPassword] = useState(false)
    const [isEditAvatar, setIsEditAvatar] = useState(false)

    const [name, setName] = useState()
    const [password, setPassword] = useState()

    const nameRef = useRef()

    useEffect(() => {
        setName(user.userInfo.name)
        if (!user.userInfo.password) {
            setPassword(null)
        } else {
            setPassword(user.userInfo.password)
        }
    }, [])

    //console.log(user.userInfo)

    let handleEditName = () => {
        setIsEditName(true)
        if (nameRef.current) {
            nameRef.current.disabled = false
            nameRef.current.style.caretColor = 'black'
            nameRef.current.focus()
        }
    }

    let handleCancleName = () => {
        setIsEditName(false)
        setName(user.userInfo.name)
        if (nameRef.current) {
            nameRef.current.disabled = true
            nameRef.current.style.caretColor = 'transparent'
            //nameRef.current.focus()
        }
    }

    let handleSaveName = async () => {
        setIsEditName(false)
        let res = await userService.updateUserByEmail({ email: user.userInfo.email, payload: name, key: 'name' })

        if (res && res.errCode === 0) {
            let data = { ...user.userInfo, name: name }

            toast.success(t('toast.update-success'))
            dispatch(fetchUpdateUser(data))
        } else {
            toast.error(t('toast.update-fail'))
        }

        if (nameRef.current) {
            nameRef.current.disabled = true
            nameRef.current.style.caretColor = 'transparent'
        }
    }

    return (
        <>
            <div className="group-field-container">
                <div className="group-field-header">
                    <h2 className="title">{t('detail-user.personal-information')}</h2>
                </div>
                <div className="group-field-body">
                    <div className="group-field-item">
                        <div className="content-right">
                            <div className="infor-container">
                                <span className="sub-title">{t('detail-user.full-name')}</span>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    maxlength="50"
                                    placeholder="Thêm tên của bạn"
                                    className="input-change"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disable
                                />
                            </div>
                            <div className="description">{t('detail-user.des-full-name')}</div>
                        </div>

                        <div className="content-left">
                            {isEditName ? (
                                <>
                                    <button onClick={handleSaveName} className="design active">
                                        {t('detail-user.save')}
                                    </button>
                                    <button onClick={handleCancleName} className="design">
                                        {t('detail-user.cancel')}
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEditName} className="design">
                                    {t('detail-user.edit')}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="group-field-item">
                        <div className="content-right">
                            <div className="infor-container">
                                <span className="sub-title">{t('detail-user.avatar')}</span>
                            </div>
                            <div className="description">{t('detail-user.image')}</div>
                        </div>
                        <div className="content-left">
                            <button className="design"> {t('detail-user.edit')}</button>
                        </div>
                    </div>

                    <div className="group-field-item">
                        <div className="content-right">
                            <div className="infor-container">
                                <span className="sub-title">{t('detail-user.password')}</span>
                            </div>
                        </div>
                        <div className="content-left">
                            <button className="design"> {t('detail-user.edit')}</button>
                        </div>
                    </div>

                    <div className="group-field-item">
                        <div className="content-right">
                            <div className="infor-container">
                                <span className="sub-title">{t('detail-user.email')}</span>
                                <input
                                    type="text"
                                    name="full-name"
                                    maxlength="50"
                                    placeholder="Thêm tên của bạn"
                                    className="input-change"
                                    value="asdll;of"
                                    disable
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GroupField
