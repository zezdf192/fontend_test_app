import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import HeaderHome from '../HomePage/HeaderHome/HeaderHome'
import examService from '../../service/examService'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import { useTranslation } from 'react-i18next'

import './StartExam.scss'
import ExamQuestion from './ExamQuestion'
import Clock from './Clock'
import ListAnswer from './ListAnswer/ListAnswer'
import ModalExam from './ModalExam/ModalExam'
import { fetchLogOut } from '../../store/action/userAction'

function StartExam() {
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    const { examId, email, nameUser } = useParams()
    let navigate = useNavigate()
    const [exam, setExam] = useState()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [confirmOutside, setConfirmOutside] = useState(false)
    const [path, setPath] = useState('')

    const [examInfo, setExamInfo] = useState()

    const [questionActive, setQuestionActive] = useState(0)
    const [questionId, setQuestionId] = useState()
    //const [countdown, setCountdown] = useState('')
    const [timeDoExam, setTimeDoExam] = useState(0)
    const [listAnswerChoose, setListAnswerChoose] = useState()

    const [myAnswer, setMyAnswer] = useState([])

    //modal
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')
    const [typeModal, setTypeModal] = useState('submit')

    let callAPI = async () => {
        //let respon = await examService.getDetailExamById(examId)
        let respon = await examService.getDetailExamPrivateForVerify({
            examId,
            email,
            nameUser,
        })

        if (respon && respon.errCode === 0) {
            setExamInfo(respon.data.examRamdom)
            setQuestionId(respon.data.examRamdom.data.questions[0])
            setListAnswerChoose(new Array(respon.data.exam.data.questions.length).fill(null))
            let length = respon.data.exam.data.questions.length
            let arr = Array(length)
            setMyAnswer(arr)
        } else if (respon && respon.errCode === 1) {
            navigate('/404')
        }
    }

    let intervalRef = useRef()

    const decreaseNum = () => setTimeDoExam((prev) => prev + 1)

    useEffect(() => {
        intervalRef.current = setInterval(decreaseNum, 1000)

        return () => clearInterval(intervalRef.current)
    }, [])

    let changeQuestionActive = (index) => {
        setQuestionActive(index)
    }

    let getAnswerFromChildren = (data) => {
        //console.log('data', data)
        if (data) {
            // console.log(myAnswer)
            myAnswer[data.questionActive] = {
                questionId: data.questionId,
                answer: data.data,
            }
            setMyAnswer([...myAnswer])
        }
    }

    useEffect(() => {
        callAPI()
    }, [])

    let handleSubmitExam = (type) => {
        console.log('type', type)
        let isCheck = false
        if (myAnswer) {
            for (let i = 0; i < myAnswer.length; i++) {
                isCheck = true
                if (myAnswer[i] === undefined) {
                    isCheck = false
                    break
                }
            }
        } else {
            isCheck = false
        }
        //console.log(countdown)
        if (type === 'time-out') {
            setIsOpenModal(true)
            setTypeModal(type)
            setDescriptionModal(t('modal.out-time'))
        } else if (!isCheck) {
            setIsOpenModal(true)
            setTypeModal('submit')
            setDescriptionModal(t('modal.unanswered-questions'))
            return
        } else {
            setTypeModal('submit')
            setDescriptionModal(t('modal.submit-exam'))
            setIsOpenModal(true)
        }
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)
        setDescriptionModal('')
    }

    let getTimeFromClock = (time) => {
        //setCountdown(time)
    }

    // let handleCountDown = () => {
    //     let string = countdown.split('m')

    //     let time = `${examInfo.data.time - 1 - +string[0]} phút ${60 - +string[1].split(' ')[1].split('s')[0]} giây`

    //     return time
    // }

    let handleTimeDoExam = (languages) => {
        let time = timeDoExam / 60
        let sodu = timeDoExam % 60

        let result

        if (languages === 'en') {
            result = `${Math.floor(time)}m : ${sodu}s`
        } else {
            result = `${Math.floor(time)} phút ${sodu} giây`
        }

        //console.log('time', timeDoExam)

        return result
    }

    function taoChuoiNgauNhien(length) {
        let code = ''
        let string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        for (var i = 0; i < length; i++) {
            var viTriNgauNhien = Math.floor(Math.random() * string.length)
            code += string.charAt(viTriNgauNhien)
        }

        return code
    }

    let handleSubmitModal = async () => {
        let questionBE = examInfo.data.questions

        //console.log('text clock')
        //console.log(myAnswer)
        setIsOpenModal(false)

        let total = 0
        let quality = 0

        let answerTrue = []
        for (let i = 0; i < questionBE.length; i++) {
            for (let j = 0; j < questionBE[i].answers.length; j++) {
                if (questionBE[i].answers[j].isAnswerTrue) {
                    if (answerTrue.length > 0) {
                        answerTrue.push({
                            answerTrue: questionBE[i].answers[j].answerId,
                            questionId: questionBE[i].questionId,
                        })
                    } else {
                        answerTrue = [
                            {
                                answerTrue: questionBE[i].answers[j].answerId,
                                questionId: questionBE[i].questionId,
                            },
                        ]
                    }
                }
            }
        }

        let dem = 0
        for (let i = 0; i < answerTrue.length; i++) {
            for (let j = 0; j < myAnswer.length; j++) {
                if (myAnswer[j]) {
                    if (answerTrue[i].questionId === myAnswer[j].questionId.questionId) {
                        if (answerTrue[i].answerTrue === myAnswer[j].answer.answerId) {
                            dem++
                            quality++
                            total += +myAnswer[j].questionId.score
                        }
                        break
                    }
                }
            }
        }

        // if (dem !== 0) {
        //     let score = dem / answerTrue.length
        //     total += +questionBE[i].score * score
        //     quality++
        // }

        let newDate = new Date()
        newDate.setHours(23, 59, 59, 0)

        let data = {
            //userID: user.userInfo._id,
            timeEn: handleTimeDoExam('en'),
            currentTimeEn: handleTimeDoExam('en'),
            timeVi: handleTimeDoExam('vi'),
            currentTimeVi: handleTimeDoExam('vi'),
            answers: myAnswer,
            examID: examId,
            nameUser: nameUser,
            nameExam: examInfo.data.title,
            quantityQuestion: examInfo.data.questions.length,
            scoreExam: examInfo.data.score.valueNum,
            qualityAnswerTrue: quality,
            currentQuantityAnswerTrue: quality,
            quantityJoin: 1,
            maxScore: total,
            currentScore: total,
            valueTimeDoExam: Math.floor(timeDoExam),
            currentValueTimeDoExam: Math.floor(timeDoExam),
            //valueTimeDoExamGreatest: Math.floor(timeDoExam),
            dateDoExam: newDate,
            //dateDoExamLast: newDate,
            email: email,
            typeExam: examInfo.data.typeExam,
        }

        let codeCopy = taoChuoiNgauNhien(20)
        // examId, email, nameUser

        if (user & user.userInfo) {
            let respon = await examService.studentDoExam(data)
        } else if (email !== 'undefine' && nameUser !== 'undefine') {
            await examService.studentDoExam(data)
        }

        await examService.createCopyScoreBelongToUser({ examInfo, userAnswer: myAnswer, code: codeCopy, data })

        // if (respon && respon.errCode === 0) {
        //     console.log(respon.message)
        // }

        if (email !== 'undefine' && nameUser !== 'undefine') {
            navigate(`/result/${email}/${nameUser}/${examId}/${codeCopy}`)
        } else {
            navigate(`/result/undefine/undefine/${examId}/${codeCopy}`)
        }

        //console.log(data)
        setDescriptionModal('')
    }

    let changeQuestionId = (data) => {
        setQuestionId(data)
    }

    let changeListAnswerChoose = (index, questionActive) => {
        let newArray = listAnswerChoose

        newArray[questionActive] = index

        setListAnswerChoose([...newArray])
    }

    let submitOutside = (e) => {
        setDescriptionModal('')
        setIsOpenModal(false)

        if (path === '/login') {
            dispatch(fetchLogOut())
        }

        navigate(path)
    }

    let changeElement = (e, path) => {
        setPath(path)
        setTypeModal('outside')
        setDescriptionModal(t('modal.new-link'))
        setIsOpenModal(true)
        e.preventDefault()
    }

    return (
        <>
            <HeaderHome doExam={true} changeElement={changeElement} />

            <div className="start-exam-container">
                <div className="start-exam-body">
                    <h2 className="title">
                        {t('start-exam.exam')} {examInfo && examInfo.data && examInfo.data.title}
                    </h2>
                    <div className="start-exam-content">
                        <div className="content-left">
                            <ExamQuestion
                                myAnswer={myAnswer[questionActive]}
                                getAnswerFromChildren={getAnswerFromChildren}
                                questionActive={questionActive}
                                questionId={questionId}
                                changeListAnswerChoose={changeListAnswerChoose}
                                listAnswerChoose={listAnswerChoose}
                                examInfo={examInfo && examInfo.data && examInfo.data.questions[questionActive]}
                            />
                        </div>
                        <div className="content-right">
                            {examInfo && examInfo.data && examInfo.data.time && examInfo.data.time !== 0 ? (
                                <Clock
                                    handleSubmitExam={handleSubmitExam}
                                    examInfo={examInfo && examInfo.data && examInfo.data.time && examInfo.data.time}
                                />
                            ) : (
                                <div className="no-time"> {t('start-exam.unlimited')}</div>
                            )}

                            <ListAnswer
                                myAnswer={myAnswer}
                                getAnswerFromChildren={getAnswerFromChildren}
                                questionActive={questionActive}
                                changeQuestionActive={changeQuestionActive}
                                examInfo={examInfo && examInfo.data && examInfo.data.questions}
                                changeQuestionId={changeQuestionId}
                            />
                        </div>
                    </div>
                    <div className="action-submit">
                        <button onClick={handleSubmitExam} className="submit">
                            {t('start-exam.submit')}
                        </button>
                    </div>
                </div>
            </div>

            <ModalExam
                submitOutside={submitOutside}
                type={typeModal}
                handleSubmitModal={handleSubmitModal}
                isOpenModal={isOpenModal}
                descriptionModal={descriptionModal}
                handleCloseModal={handleCloseModal}
            />
        </>
    )
}

export default StartExam
