import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import './Verification.scss'
import examService from '../../service/examService'

import HeaderHome from '../../pages/HomePage/HeaderHome/HeaderHome'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import userService from '../../service/userService'

function Verification() {
    const { examId, email, nameUser } = useParams()
    const user = useSelector((state) => state.user)
    const language = useSelector((state) => state.app.language)
    const { t } = useTranslation()

    const [exam, setExam] = useState()
    const [isLike, setIsLike] = useState()
    const [showLike, setShowLike] = useState(false)

    let navigate = useNavigate()

    let handleBackHome = () => {
        navigate('/')
    }

    let handleStartExam = () => {
        if (examId) {
            navigate(`/exam/${email}/${nameUser}/${examId}`)
        }
    }

    let callAPI = async () => {
        let respon = await examService.getDetailExamById(examId)
        // console.log('examId', examId)
        // let respon = await examService.getDetailExamPrivateForVerify({
        //     examId,
        //     email,
        //     nameUser,
        // })
        if (user.userInfo) {
            let responLike = await userService.getExamUserLike({ email: user.userInfo.email, examId: examId })
            if (responLike && responLike.errCode === 0) {
                setIsLike(responLike.data)
            }
        }

        if (respon && respon.errCode === 0) {
            setExam(respon.data.exam)
        }
    }

    useEffect(() => {
        if (exam && exam.data && exam.data.typeExam === 'PUBLIC') {
            setShowLike(true)
        } else {
            setShowLike(false)
        }
    }, [exam])

    useEffect(() => {
        callAPI()
    }, [])

    let handleLike = async () => {
        let respon = await userService.userLikeExam({ email: user.userInfo.email, examId: examId, isLike: !isLike })
        if (respon && respon.errCode === 0) {
            callAPI()
        }

        setIsLike(!isLike)
    }

    return (
        <>
            <HeaderHome />
            <div className="verification-container">
                <div className="verification-body">
                    <div className="verification-info">
                        <div className="verification-header">
                            <div className="verify-nav">
                                {exam && exam.data && exam.data.image ? (
                                    <img className="img-exam" src={exam && exam.data && exam.data.image} alt="" />
                                ) : (
                                    <></>
                                )}

                                <h2>{exam && exam.data && exam.data.title}</h2>
                            </div>
                            {showLike && user.userInfo ? (
                                <FontAwesomeIcon
                                    onClick={handleLike}
                                    className={isLike ? 'icon-star active' : 'icon-star'}
                                    icon={faStar}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                        <p>
                            {exam && exam.data && exam.data.time
                                ? language === 'en'
                                    ? ` ${t('verifi.time')} ${exam.data.time.labelEn}`
                                    : ` ${t('verifi.time')} ${exam.data.time.labelVi}`
                                : ''}
                        </p>
                        <p>
                            {t('verifi.number-questions')}

                            {exam && exam.data && exam.data.questions && exam.data.questions.length}
                        </p>
                        {showLike ? (
                            <p>
                                {t('verifi.like-count')}

                                {exam && exam.data && exam.data.quantityLike && exam.data.quantityLike.length}
                            </p>
                        ) : (
                            <></>
                        )}

                        <p>
                            {t('verifi.description')}

                            {exam && exam.data && exam.data.description && exam.data.description}
                        </p>
                        <span>{t('verifi.text')}</span>
                        <div className="action">
                            <button onClick={handleBackHome} className="btn-close-verify">
                                {t('verifi.back')}
                            </button>
                            <button onClick={handleStartExam} className="btn-next">
                                {t('verifi.start')}
                            </button>
                        </div>
                        {!user.userInfo ? <span className="note"> {t('verifi.note')}</span> : <></>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Verification
