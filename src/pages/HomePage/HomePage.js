import { useState, useEffect } from 'react'
import HeaderHome from './HeaderHome/HeaderHome'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import examService from '../../service/examService'

import './HomePage.scss'

function HomePage() {
    const { t } = useTranslation()
    let navigate = useNavigate()
    const [listExam, setListExam] = useState([])

    let callAPI = async () => {
        let exam = await examService.getAllExam()
        if (exam && exam.errCode === 0) {
            setListExam([...exam.data])
        }
    }
    useEffect(() => {
        callAPI()
    }, [])

    let handleChooseExam = (item) => {
        navigate(`/verification/${item._id}`)
    }

    return (
        <>
            <div className="home-page-container">
                <HeaderHome />
                <div className="home-page-body">
                    <h2 className="title"> {t('home-page.exam-popular')}</h2>
                    <div className="list-exam">
                        {listExam &&
                            listExam.length > 0 &&
                            listExam.map((item) => {
                                return (
                                    <div className="exam-item" onClick={() => handleChooseExam(item)}>
                                        {' '}
                                        <div className="img-container">
                                            <img
                                                className="img"
                                                src={item.data.image}
                                                alt="Ảnh bị lỗi, vui lòng tải lại!"
                                            />
                                        </div>
                                        <div className="exam-body">
                                            <p className="exam-title">{item.data.title}</p>
                                            {/* <span className="quantity">Lượt thi {item.data.quantityJoin || 0}</span> */}
                                        </div>
                                        <div className="notify">
                                            <div className="quantity">
                                                <span>{item.data.quantityJoin || 0}</span>
                                                <span>Exams</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage
