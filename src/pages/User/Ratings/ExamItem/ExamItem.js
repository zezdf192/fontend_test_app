import './ExamItem.scss'
import { useSelector, useDispatch } from 'react-redux'

function ExamItem({ data, handleChooseExamItem }) {
    const language = useSelector((state) => state.app.language)
    return (
        <>
            <div className="exam-item-container" onClick={() => handleChooseExamItem(data)}>
                <div className="exam-item-body">
                    <img className="exam-img" src={data.data.image} alt="" />
                    <div className="exam-item-content">
                        <h3 className="exam-item-title">{data.data.title}</h3>
                        <span className="quantity-join">
                            {language === 'en'
                                ? `${data.data.quantityJoin} exams`
                                : `${data.data.quantityJoin} lượt thi`}{' '}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExamItem
