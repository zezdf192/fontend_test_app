import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import './ResultExam.scss'
import examService from '../../../service/examService'
import HeaderHome from '../../HomePage/HeaderHome/HeaderHome'
import ResultQuestionItem from './QuestionItem/ResultQuestionItem'
import { path } from '../../../until/constant'

function ResultExam() {
    const { t } = useTranslation()
    const { copyScoreId, examId, email, nameUser } = useParams()
    const user = useSelector((state) => state.user)
    const language = useSelector((state) => state.app.language)

    const [myAnswer, setMyAnswer] = useState()
    const [listMyAnswer, setListMyAnswer] = useState([])
    const [examInfo, setExamInfo] = useState()
    const [typeAnswer, setTypeAnswer] = useState()
    const [typeExam, setTypeExam] = useState()
    const [listQuestions, setListQuestions] = useState([])
    //console.log(user.userInfo._id)

    let callAPI = async () => {
        let respon = await examService.getCopyScoreByCode(copyScoreId)
        // if (email !== 'undefine' && nameUser !== 'undefine') {
        //     let responDoExam = await examService.getDetailDoExamById({ email: email, examID: examId })
        //     if (responDoExam && responDoExam.errCode === 0) {
        //         //console.log(responDoExam)
        //         setMyAnswer(responDoExam.data)
        //     }
        // }

        if (respon && respon.errCode === 0) {
            //console.log(respon.data.examInfo)
            setExamInfo(respon.data.data)
            setTypeExam(respon.data.examInfo.data.typeExam)
            setTypeAnswer(respon.data.examInfo.data.typeAnswer)
            setListQuestions(respon.data.examInfo.data.questions)
            setListMyAnswer(respon.data.userAnswer)
        }

        //console.log(responDoExam)
    }

    useEffect(() => {
        callAPI()
    }, [])

    return (
        <>
            <HeaderHome />
            <div className="result-exam-container">
                <div
                    className={
                        typeAnswer && typeAnswer === 'PUBLIC' ? 'result-exam-header' : 'result-exam-header private'
                    }
                >
                    <h2 className="title">{t('result.exam-results')}</h2>
                    <div className="result-infor">
                        <div className={typeAnswer && typeAnswer === 'PUBLIC' ? 'row' : 'row private'}>
                            <div className="col-12">
                                <span className="detail-title">{t('result.exam-results')}</span>
                                <span>:</span>
                                <span className="detail-description">{examInfo && examInfo.currentScore}</span>
                            </div>
                            <div className="col-12">
                                <span className="detail-title">{t('result.time')}</span>
                                <span>:</span>
                                <span className="detail-description">
                                    {examInfo
                                        ? language === 'en'
                                            ? examInfo.currentTimeEn
                                            : examInfo.currentTimeVi
                                        : ''}
                                </span>
                            </div>
                            <div className="col-12">
                                <span className="detail-title">{t('result.number-attempts')} </span>
                                <span>:</span>
                                <span className="detail-description"> {examInfo && examInfo.quantityJoin}</span>
                            </div>
                            <div className="col-12">
                                <span className="detail-title">{t('result.number-correct')}</span>
                                <span>:</span>
                                <span className="detail-description">
                                    {examInfo && `${examInfo.currentQuantityAnswerTrue}/${examInfo.answers.length}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {typeAnswer && typeAnswer === 'PUBLIC' ? (
                    <div className="question-list">
                        <h2>Đáp án chi tiết của bài thi</h2>
                        {listQuestions &&
                            listQuestions.length > 0 &&
                            listQuestions.map((item, index) => {
                                return <ResultQuestionItem index={index} questionInfo={item} myAnswer={listMyAnswer} />
                            })}
                    </div>
                ) : (
                    <></>
                )}
                <div className="result-bottom">
                    {typeExam === 'PUBLIC' ? (
                        <Link
                            to={
                                user && user.userInfo
                                    ? `/verification/${user.userInfo.email}/${user.userInfo.name}/${examId}`
                                    : `/verification/undefine/undefine/${examId}`
                            }
                            className="button-btn"
                        >
                            {t('result.retake-exam')}
                        </Link>
                    ) : (
                        <></>
                    )}

                    <Link className="button-btn" to={path.home}>
                        {t('result.homepage')}
                    </Link>
                </div>
            </div>
        </>
    )
}

export default ResultExam
