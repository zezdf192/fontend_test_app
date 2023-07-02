import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './LikeExamItem.scss'

function LikeExamItem({ data }) {
    let navigate = useNavigate()
    const [infoExam, setInfoExam] = useState()

    useEffect(() => {
        setInfoExam(data)
    }, [data])

    let hanldeClick = (examId) => {
        console.log(examId)
        navigate(`/verification/${examId._id}`)
    }

    return (
        <div className="like-exam-item">
            <img
                className="like-exam-img"
                onClick={() => hanldeClick(infoExam)}
                src={infoExam && infoExam.data && infoExam.data.image}
                alt=""
            />
            <div className="like-exam-text">
                <span className="title">{infoExam && infoExam.data && infoExam.data.title}</span>
                <span className="description">{infoExam && infoExam.data && infoExam.data.description}</span>
            </div>
        </div>
    )
}

export default LikeExamItem
