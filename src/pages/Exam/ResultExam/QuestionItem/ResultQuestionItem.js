import { useEffect, useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './ResultQuestionItem.scss'

function ResultQuestionItem({ index, questionInfo, myAnswer }) {
    const [listAnswer, setListAnswer] = useState([])
    //console.log(myAnswer)
    //console.log(questionInfo)
    useEffect(() => {
        setListAnswer(questionInfo.answers)
    }, [questionInfo])

    let handleNullAnswer = (item, i) => {
        if (item.isAnswerTrue) {
            return 'answer-item correct'
        }
        if (myAnswer[index] !== null) {
            //console.log(myAnswer[index][0])

            if (myAnswer[index] && myAnswer[index][0] === i) {
                return 'answer-item false'
            } else {
                return 'answer-item'
            }
        } else {
            return 'answer-item'
        }
    }

    let renderAnswer = () => {
        return (
            listAnswer &&
            listAnswer.length > 0 &&
            listAnswer.map((item, i) => {
                return (
                    <>
                        <div key={i} className={handleNullAnswer(item, i)}>
                            <label>{item.keyAnswer}</label>

                            <span>{item.title}</span>
                        </div>
                    </>
                )
            })
        )
    }

    return (
        <div className="result-question-item-container">
            <div className="question-item-body">
                <div className="header">
                    <div className="title-question">
                        <div>
                            <span className="title-answer">Câu hỏi số {index + 1}: </span>
                            <h2>{questionInfo.title}</h2>
                        </div>
                        <p>{`${questionInfo.score} điểm`}</p>
                    </div>
                </div>
                <div className="content">
                    <img src={questionInfo && questionInfo.image}></img>
                    <div className="list-answer">
                        <div className="row">
                            <div className="col-12">{renderAnswer()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResultQuestionItem
