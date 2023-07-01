import { useEffect, useState } from 'react'
import './ExamQuestion.scss'

function ExamQuestion({
    examInfo,
    questionActive,
    questionId,
    getAnswerFromChildren,
    myAnswer,
    changeListAnswerChoose,
    listAnswerChoose,
}) {
    const [exam, setExam] = useState()
    const [chooseAnswer, setChooseAnswer] = useState([])

    //xu ly khi chon nhieu cau tra loi
    const [listChooseAnswer, setListChooseAnswer] = useState([])
    useEffect(() => {
        setExam(examInfo)
    }, [examInfo])

    useEffect(() => {
        if (myAnswer) setChooseAnswer(myAnswer)
        else {
            setChooseAnswer([])
        }

        // if (myAnswer) setListChooseAnswer(myAnswer)
        // else {
        //     setListChooseAnswer([])
        // }
    }, [myAnswer])

    let handleChooseAnswer = (data, index) => {
        changeListAnswerChoose(index, questionActive)

        getAnswerFromChildren({
            questionActive,
            questionId,
            data,
        })
    }

    return (
        <div className="exam-question-container">
            <div className="exam-question-body">
                <div className="header">
                    <h2 className="title">
                        Câu hỏi số {questionActive + 1}:{' '}
                        <span style={{ marginLeft: '10px' }}> {examInfo && examInfo.title}</span>
                    </h2>
                    <span className="score">{examInfo && examInfo.score} điểm</span>
                </div>
                <div className="img">
                    <img src={examInfo && examInfo.image} alt=""></img>
                </div>
                <div className="list-answer">
                    {examInfo &&
                        examInfo.answers &&
                        examInfo.answers.length > 0 &&
                        examInfo.answers.map((item, index) => {
                            return (
                                <div
                                    onClick={() => handleChooseAnswer(examInfo.answers[index], index)}
                                    className={
                                        listAnswerChoose[questionActive] === index
                                            ? 'answer-item active'
                                            : 'answer-item'
                                    }
                                >
                                    <span>{item.keyAnswer}</span>
                                    {item.title}
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

export default ExamQuestion
