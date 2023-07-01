import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import HeaderHome from '../HomePage/HeaderHome/HeaderHome'
import examService from '../../service/examService'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import './StartExam.scss'
import ExamQuestion from './ExamQuestion'
import Clock from './Clock'
import ListAnswer from './ListAnswer/ListAnswer'
import ModalExam from './ModalExam/ModalExam'

function StartExam() {
    const language = useSelector((state) => state.app.language)
    const { examId } = useParams()
    let navigate = useNavigate()
    const [exam, setExam] = useState()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

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
        let respon = await examService.getDetailExamById(examId)

        if (respon && respon.errCode === 0) {
            setExamInfo(respon.data.exam)
            setQuestionId(respon.data.exam.data.questions[0])
            setListAnswerChoose(new Array(respon.data.exam.data.questions.length).fill(null))
            let length = respon.data.exam.data.questions.length
            let arr = Array(length)
            setMyAnswer(arr)
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
        console.log(myAnswer)
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
            setTypeModal(type)
            setDescriptionModal('Bạn đã hết thời gian làm bài thi, bấm nút xác nhận để xem kết quả bài làm')
        } else if (!isCheck) {
            setIsOpenModal(true)
            setTypeModal('submit')
            setDescriptionModal('Vẫn còn câu hỏi bạn chưa chọn đáp án, bạn vẫn muốn nộp bài?')
            return
        } else {
            setTypeModal('submit')
            setDescriptionModal('Bạn có xác nhận nộp bài thi?')
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

    let handleSubmitModal = async () => {
        let questionBE = examInfo.data.questions

        // console.log(countdown)
        //console.log(examInfo.data)
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

        // console.log('answerTrue', answerTrue)
        // console.log('myAnswer', myAnswer)

        let dem = 0
        for (let i = 0; i < answerTrue.length; i++) {
            for (let j = 0; j < myAnswer.length; j++) {
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

        // if (dem !== 0) {
        //     let score = dem / answerTrue.length
        //     total += +questionBE[i].score * score
        //     quality++
        // }

        let newDate = new Date()
        newDate.setHours(23, 59, 59, 0)

        let data = {
            userID: user.userInfo._id,
            timeEn: handleTimeDoExam('en'),
            timeVi: handleTimeDoExam('vi'),
            answers: myAnswer,
            examID: examId,
            nameUser: user.userInfo.name,
            nameExam: examInfo.data.title,
            quantityQuestion: examInfo.data.questions.length,
            scoreExam: examInfo.data.score.valueNum,
            qualityAnswerTrue: quality,

            quantityJoin: 1,
            maxScore: total,
            valueTimeDoExam: Math.floor(timeDoExam),
            //valueTimeDoExamGreatest: Math.floor(timeDoExam),
            dateDoExam: newDate,
            //dateDoExamLast: newDate,
            email: user.userInfo.email,
        }

        let respon = await examService.studentDoExam(data)

        if (respon && respon.errCode === 0) {
            console.log(respon.message)
        }

        navigate(`/result/${examId}`)

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

    return (
        <>
            <HeaderHome />
            <div className="start-exam-container">
                <div className="start-exam-body">
                    <h2 className="title">Bài thi: {examInfo && examInfo.data && examInfo.data.title}</h2>
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
                                    getTimeFromClock={getTimeFromClock}
                                    handleSubmitExam={handleSubmitExam}
                                    examInfo={examInfo && examInfo.data && examInfo.data.time && examInfo.data.time}
                                />
                            ) : (
                                <div className="no-time">Không giới hạn thời gian</div>
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
                            Nộp bài
                        </button>
                        <button className="close">Thoát</button>
                    </div>
                </div>
            </div>
            <ModalExam
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
