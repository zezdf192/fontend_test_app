import { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { sideBarUser } from '../../../component/RouteSideBar/routeSideBar'
import userService from '../../../service/userService'
import HeaderHome from '../../HomePage/HeaderHome/HeaderHome'
import SideBar from '../MyExam/SideBar/SideBar'
import LikeExamItem from './LikeExamItem/LikeExamItem'
import { path } from '../../../until/constant'

import './MyLoveExam.scss'

function MyLoveExam() {
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    let navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const [listLikeExam, setListLikeExam] = useState([])

    useEffect(() => {
        const callAPI = async () => {
            let respon = await userService.getAllExamUserLike({ email: user.userInfo.email })

            if (respon && respon.errCode === 0) {
                setListLikeExam(respon.data)
            }
        }

        callAPI()
    }, [])

    return (
        <>
            <HeaderHome />
            <div className="like-exam-container">
                <SideBar data={sideBarUser} />
                <div className="content">
                    <div className="sub-content">
                        <h2>{t('favorite.introduction')}</h2>
                        <span>{t('favorite.feature')}</span>
                    </div>
                    <div className={listLikeExam && listLikeExam.length > 0 ? 'list-exam-body' : 'list-exam-body none'}>
                        <h2>{t('favorite.favorite-exams')}</h2>
                        {listLikeExam && listLikeExam.length > 0 ? (
                            listLikeExam.map((item) => {
                                return <LikeExamItem data={item} />
                            })
                        ) : (
                            <div className="no-data">
                                <span className="top">{t('favorite.no-exam')}</span>
                                <span className="link">
                                    {t('favorite.view-more')}
                                    <Link to={path.home}>{t('favorite.here')}</Link>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyLoveExam
