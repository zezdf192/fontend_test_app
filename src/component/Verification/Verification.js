import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import './Verification.scss'
import examService from '../../service/examService'

import HeaderHome from '../../pages/HomePage/HeaderHome/HeaderHome'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

function Verification() {
    const { examId } = useParams()
    const language = useSelector((state) => state.app.language)
    const { t } = useTranslation()

    const [exam, setExam] = useState()
    let navigate = useNavigate()

    let handleBackHome = () => {
        navigate('/')
    }

    let handleStartExam = () => {
        if (examId) {
            navigate(`/exam/${examId}`)
        }
    }

    let callAPI = async () => {
        let respon = await examService.getDetailExamById(examId)

        if (respon && respon.errCode === 0) {
            setExam(respon.data.exam)
        }
    }

    useEffect(() => {
        callAPI()
    }, [])

    return (
        <>
            <HeaderHome />
            <div className="verification-container">
                <div className="verification-body">
                    <div className="verification-info">
                        <h2>{exam && exam.data && exam.data.title}</h2>
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Verification
