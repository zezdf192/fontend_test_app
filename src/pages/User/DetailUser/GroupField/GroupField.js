import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import examService from '../../../../service/examService'
import userService from '../../../../service/userService'
import './GroupField.scss'
import { fetchUpdateUser } from '../../../../store/action/userAction'

import ImgChange from './ImgChange/ImgChange'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { Link } from 'react-router-dom'
import { path } from '../../../../until/constant'

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
    const [currentPassword, setCurrentPassword] = useState()
    const [password, setPassword] = useState()
    const [oldPassword, setOldPassword] = useState()
    const [repeatPassword, setRepeatPassword] = useState()

    const [file, setFile] = useState(null)
    const [currentFile, setCurrentFile] = useState(null)

    //state manage show password
    // const [isOldPassword, setIsOldPassword] = useState(false)
    // const [isNewPassWord, setIsNewPassWord] = useState(false)
    // const [isRepeatPassword, setIsRepeatPassword] = useState(false)

    const nameRef = useRef()
    const oldPasswordRef = useRef()

    useEffect(() => {
        setName(user.userInfo.name)
        user.userInfo.avatar ? setFile(user.userInfo.avatar) : setFile(null)
        user.userInfo.avatar ? setCurrentFile(user.userInfo.avatar) : setCurrentFile(null)
        if (!user.userInfo.password) {
            setCurrentPassword(null)
        } else {
            setCurrentPassword(user.userInfo.password)
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

    //avatar
    let handleEditAvatar = () => {
        //console.log(123)
        setIsEditAvatar(true)
    }

    let handleCancleAvatar = () => {
        setIsEditAvatar(false)
        setFile(null)
    }

    let handleSaveAvatar = async () => {
        setIsEditAvatar(false)
        //console.log(file)
        if (file !== currentFile) {
            let res = await userService.updateUserByEmail({ email: user.userInfo.email, payload: file, key: 'avatar' })

            if (res && res.errCode === 0) {
                let data = { ...user.userInfo, avatar: file }

                toast.success(t('toast.update-success'))
                dispatch(fetchUpdateUser(data))
            } else {
                toast.error(t('toast.update-fail'))
            }
        }
    }

    let handleChangeFile = (data) => {
        setFile(data)
    }

    let handleCanclePassword = () => {
        setOldPassword('')
        setPassword('')
        setRepeatPassword('')
        setIsEditPassword(false)
    }

    let handleSavePassword = async () => {
        if (!oldPassword || !password || !repeatPassword) {
            toast.error(t('toast.incomplete-input'))
        } else if (password.length < 6) {
            toast.error(t('toast.err-password-long'))
        } else if (password !== repeatPassword) {
            toast.error(t('toast.not-correct'))
        } else {
            let res = await userService.editPassword({
                email: user.userInfo.email,
                oldPassword,
                password,
            })

            if (res && res.errCode === 0) {
                toast.success(t('toast.update-success'))
                setIsEditPassword(false)
            } else if (res && res.errCode === 3) {
                toast.error(t('toast.incorrect-password'))
            } else {
                toast.error(t('toast.update-fail'))
            }
        }
    }

    // let hanldeShowPassword = () => {
    //     oldPasswordRef.current.type = 'text'
    //     setIsOldPassword(false)
    // }

    // let hanldeHidePassword = () => {
    //     oldPasswordRef.current.type = 'password'
    //     setIsOldPassword(true)
    // }

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
                                    maxLength="50"
                                    placeholder={t('detail-user.add-name')}
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
                            <div className="description">
                                <span> {t('detail-user.image')}</span>
                                <ImgChange
                                    handleEditAvatar={handleEditAvatar}
                                    isEditAvatar={isEditAvatar}
                                    handleChangeFile={handleChangeFile}
                                    file={file}
                                />
                            </div>
                        </div>
                        <div className="content-left">
                            {isEditAvatar ? (
                                <>
                                    <button onClick={handleSaveAvatar} className="design active">
                                        {t('detail-user.save')}
                                    </button>
                                    <button onClick={handleCancleAvatar} className="design">
                                        {t('detail-user.cancel')}
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEditAvatar} className="design">
                                    {t('detail-user.edit')}
                                </button>
                            )}
                        </div>
                    </div>
                    {currentPassword !== null ? (
                        <div className="group-field-item">
                            <div className="content-right">
                                <div className="infor-container">
                                    <span className="sub-title">{t('detail-user.password')}</span>
                                    {isEditPassword ? (
                                        <>
                                            <div className="input-passwort-container">
                                                <input
                                                    ref={oldPasswordRef}
                                                    type="password"
                                                    maxLength="50"
                                                    placeholder={t('detail-user.old-password')}
                                                    className="input-password"
                                                    value={oldPassword}
                                                    onChange={(e) => setOldPassword(e.target.value)}
                                                />
                                                {/* {isOldPassword ? (
                                                    <FontAwesomeIcon onClick={hanldeShowPassword} icon={faEye} />
                                                ) : (
                                                    <FontAwesomeIcon onClick={hanldeHidePassword} icon={faEyeSlash} />
                                                )} */}
                                            </div>
                                            <div className="input-passwort-container">
                                                <input
                                                    type="password"
                                                    maxLength="50"
                                                    placeholder={t('detail-user.new-password')}
                                                    className="input-password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="input-passwort-container">
                                                <input
                                                    type="password"
                                                    maxLength="50"
                                                    placeholder={t('detail-user.confirm-password')}
                                                    className="input-password"
                                                    value={repeatPassword}
                                                    onChange={(e) => setRepeatPassword(e.target.value)}
                                                />
                                            </div>
                                            <Link to={path.forgotPassword} className="forgot-password">
                                                {t('detail-user.forgot-password')}
                                            </Link>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                            <div className="content-left">
                                {isEditPassword ? (
                                    <>
                                        <button onClick={handleSavePassword} className="design active">
                                            {t('detail-user.save')}
                                        </button>
                                        <button onClick={handleCanclePassword} className="design">
                                            {t('detail-user.cancel')}
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditPassword(true)} className="design">
                                        {t('detail-user.edit')}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}

                    <div className="group-field-item">
                        <div className="content-right">
                            <div className="infor-container">
                                <span className="sub-title">{t('detail-user.email')}</span>
                                <input
                                    type="text"
                                    name="full-name"
                                    maxLength="50"
                                    placeholder="Thêm tên của bạn"
                                    className="input-change"
                                    value={user.userInfo.email}
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
