import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Modal, Form, Input, Button, Select, TimePicker } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Import CSS của DatePicker

import './ModalPrivate.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import examService from '../../../../service/examService'
const { Option } = Select

const ModalPrivate = ({ isOpenFilter, children, toggleShowModalCode }) => {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    const user = useSelector((state) => state.user)

    const [form] = Form.useForm()
    const [name, setName] = useState('')
    const [code, setCode] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (user.userInfo) {
            user.userInfo.name && setName(user.userInfo.name)
            user.userInfo.email && setEmail(user.userInfo.email)
        }
    }, [user])

    let callAPI = async (buildData) => {
        let respon = await examService.getExamPrivateByCode(buildData)
        console.log('respon.data', respon.data)
        if (respon && respon.errCode === 0) {
            toggleShowModalCode(false)
            navigate(`/verification/${email}/${name}/${respon.data._id}`)
        } else if (respon && respon.errCode === 1) {
            toast.error(t('toast.exam-code-not-exist'))
        } else {
            toast.error(t('toast.server-error'))
            toggleShowModalCode(false)
        }
    }

    const handleOk = async () => {
        const regex =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!name || !email || !code) {
            toast.error(t('toast.incomplete-input'))
            return
        } else if (!regex.test(email)) {
            toast.error(t('log-in.format-email'))
            return
        }
        form.validateFields().then((values) => {
            // Xử lý dữ liệu sau khi người dùng nhấp OK
            let buildData = {
                email: email,
                code: code,
                name: name,
            }
            callAPI(buildData)

            form.resetFields()
        })
    }

    const handleCancel = () => {
        toggleShowModalCode(false)
        form.resetFields()
    }

    const footer = (
        <>
            <Button key="cancel" onClick={handleCancel}>
                {t('filter.close')}
            </Button>
            <Button key="confirm" type="primary" onClick={handleOk}>
                {t('filter.confirm')}
            </Button>
        </>
    )

    return (
        <div className="filter-container">
            <span className="filter-button" onClick={() => toggleShowModalCode(true)}>
                {children}
            </span>
            <Modal
                className="modal-filter-container"
                title={t('filter.enter-data')}
                open={isOpenFilter}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={footer}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label={t('filter.enter-email')}>
                        <Input
                            placeholder={t('filter.email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                </Form>
                <Form form={form} layout="vertical">
                    <Form.Item label={t('filter.enter-name')}>
                        <Input placeholder={t('filter.name')} value={name} onChange={(e) => setName(e.target.value)} />
                    </Form.Item>
                </Form>
                <Form form={form} layout="vertical">
                    <Form.Item label={t('filter.exam-code')}>
                        <Input placeholder={t('filter.code')} value={code} onChange={(e) => setCode(e.target.value)} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ModalPrivate
