import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import './ModalEditUser.scss'
import userService from '../../../service/userService'
import allCodeService from '../../../service/allCodeService'
import { toast } from 'react-toastify'

function ModalEditUser({ isOpenModal, handleCloseModalEdit, data, handleSubmitModalEdit }) {
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    const [currentUser, setCurrentUser] = useState()
    const [listGender, setListGender] = useState([])
    const [listRole, setListRole] = useState([])

    //init state
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('123456')

    //err state
    const [errEmail, setErrEmail] = useState('')
    const [errName, setErrName] = useState('')
    const [errPassword, setErrPassword] = useState('')

    const [errAddress, setErrAddress] = useState('')
    const [errGender, setErrGender] = useState('')

    let callAPI = async () => {
        let respon = await allCodeService.getAllCode('GENDER')
        let responRole = await allCodeService.getAllCode('ROLE')

        if (respon && respon.errCode === 0) {
            setListGender(respon.data)
        }

        if (responRole && responRole.errCode === 0) {
            setListRole(responRole.data)
        }
    }

    useEffect(() => {
        callAPI()
    }, [])

    useEffect(() => {
        setCurrentUser(data)
        setEmail(data.email)
        setName(data.name)

        setPassword(data.password)
    }, [data])

    //handle submit

    let handleValidate = () => {
        let isCheck = true
        let data = { email, name }

        //name
        if (!data.name) {
            isCheck = false
            setErrName('log-in.err-name')
        } else {
            setErrName('')
        }

        return {
            isCheck,
            data,
        }
    }

    let handleSubmit = async () => {
        let valid = handleValidate()

        if (valid.isCheck) {
            let respon = await userService.updateUserByEmail({
                email: currentUser.email,
                key: 'name',
                payload: name,
            })

            if (respon && respon.errCode === 0) {
                handleSubmitModalEdit()
                toast.success(t('modal.update-user-success'))
            } else {
                toast.success(t('modal.update-user-fail'))
            }
        }
    }

    return (
        <>
            <Modal centered size="xl" show={isOpenModal} onHide={handleCloseModalEdit} className="modal-container">
                <Modal.Header closeButton>
                    <Modal.Title>Thay đổi thông tin người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row modal-edit-container">
                        <div className="col-6  ">
                            <label>Email</label>
                            <input
                                value={email}
                                readOnly
                                className={errEmail.length > 0 ? 'form-control py-2 input-error' : 'form-control py-2'}
                                type="email"
                                placeholder="Địa chỉ email"
                            />
                            <span className="error">{errEmail}</span>
                        </div>
                        <div className="col-6 form-group">
                            <label>{t('log-in.name')}</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={() => setErrName('')}
                                className={errName.length > 0 ? 'form-control py-2 input-error' : 'form-control py-2'}
                                type="text"
                                placeholder="Tên"
                            />
                            <span className="error">{t(errName)}</span>
                        </div>

                        <div className="col-6 mt-5">
                            <label>{t('log-in.password')}</label>
                            <input
                                value={password}
                                readOnly
                                className={
                                    errPassword.length > 0 ? 'form-control py-2 input-error' : 'form-control py-2'
                                }
                                type="password"
                                placeholder="Mật khẩu"
                            />
                            <span className="error">{t(errPassword)}</span>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModalEdit}>
                        {t('modal.close')}
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {t('modal.confirm')}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalEditUser
