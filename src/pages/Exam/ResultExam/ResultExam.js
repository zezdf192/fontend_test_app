import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import './ResultExam.scss'
import examService from '../../../service/examService'
import HeaderHome from '../../HomePage/HeaderHome/HeaderHome'
import ResultQuestionItem from './QuestionItem/ResultQuestionItem'

function ResultExam() {
    const { t } = useTranslation()
    const { examId } = useParams()
    const user = useSelector((state) => state.user)
    const language = useSelector((state) => state.app.language)

    const [myAnswer, setMyAnswer] = useState()
    const [listMyAnswer, setListMyAnswer] = useState([])
    const [examInfo, setExamInfo] = useState()
    const [typeAnswer, setTypeAnswer] = useState()
    const [listQuestions, setListQuestions] = useState([])
    //console.log(user.userInfo._id)

    let callAPI = async () => {
        let respon = await examService.getDetailExamById(examId)
        let responDoExam = await examService.getDetailDoExamById({ userID: user.userInfo._id, examID: examId })

        if (respon && respon.errCode === 0) {
            setExamInfo(respon.data.data)
            setTypeAnswer(respon.data.exam.data.typeAnswer)
            setListQuestions(respon.data.exam.data.questions)
        }

        //console.log(responDoExam)
        if (responDoExam && responDoExam.errCode === 0) {
            setMyAnswer(responDoExam && responDoExam.data)
            setListMyAnswer(
                responDoExam && responDoExam.data && responDoExam.data.data && responDoExam.data.data.answers,
            )
        }
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
                                <span className="detail-description">
                                    {myAnswer && myAnswer.data && myAnswer.data.currentScore}
                                </span>
                            </div>
                            <div className="col-12">
                                <span className="detail-title">{t('result.time')}</span>
                                <span>:</span>
                                <span className="detail-description">
                                    {myAnswer && myAnswer.data
                                        ? language === 'en'
                                            ? myAnswer.data.currentTimeEn
                                            : myAnswer.data.currentTimeVi
                                        : ''}
                                </span>
                            </div>
                            <div className="col-12">
                                <span className="detail-title">{t('result.number-attempts')} </span>
                                <span>:</span>
                                <span className="detail-description">
                                    {' '}
                                    {myAnswer && myAnswer.data && myAnswer.data.quantityJoin}
                                </span>
                            </div>
                            <div className="col-12">
                                <span className="detail-title">{t('result.number-correct')}</span>
                                <span>:</span>
                                <span className="detail-description">
                                    {myAnswer &&
                                        myAnswer.data &&
                                        `${myAnswer.data.currentQuantityAnswerTrue}/${myAnswer.data.answers.length}`}
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
                    <div></div>
                )}
            </div>
        </>
    )
}

export default ResultExam
