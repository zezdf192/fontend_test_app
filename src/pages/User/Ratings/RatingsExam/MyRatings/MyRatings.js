import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import ButtonNotify from '../../../../../component/ButtonNotify/ButtonNotify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowDown91,
    faArrowDownAZ,
    faArrowUp19,
    faArrowUpAZ,
    faEye,
    faPlay,
} from '@fortawesome/free-solid-svg-icons'
import examService from '../../../../../service/examService'
import ModalDetailUser from '../../../../Admin/ModalDetailUser/ModalDetailUser'

function MyRatings({ listMyRating }) {
    const { examId } = useParams()
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    let navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const [listMyRatings, setListMyRatings] = useState([])
    const [iconSort, setIconSort] = useState(<FontAwesomeIcon className="icon-sort" icon={faArrowDownAZ} />)
    const [fieldSort, setFieldSort] = useState('nameExam')

    //action
    const [currentUser, setCurrentUser] = useState()
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')

    const [arrayTableTitles, setArrayTableTitles] = useState([
        {
            key: 'nameExam',
            status: 'up',
            value: 'ratings.name-exam',
        },
        {
            key: 'rank',
            status: 'up',
            value: 'ratings.current-ranking',
        },
        {
            key: 'maxScore',
            status: 'up',
            value: 'ratings.score',
        },
        {
            key: 'valueTimeDoExam',
            status: 'up',
            value: 'ratings.time',
        },
    ])

    useEffect(() => {
        setListMyRatings(listMyRating)
    }, [listMyRating])

    let handleSortByField = async (type, index) => {
        let copyArrayTableTitles = arrayTableTitles

        if (copyArrayTableTitles[index].status === 'up') {
            copyArrayTableTitles[index].status = 'down'
        } else {
            copyArrayTableTitles[index].status = 'up'
        }

        setFieldSort(type)
        setArrayTableTitles(copyArrayTableTitles)

        // let respon = await examService.sortMyRatingsByType({
        //     userID: user && user.userInfo && user.userInfo._id,
        //     type: type,
        //     typeSort: arrayTableTitles[index].status,
        // })

        // if (respon && respon.errCode === 0) {
        //     //setListMyRatings(respon.data)
        // }

        if (type === 'rank') {
            let copyArray = listMyRatings
            if (arrayTableTitles[index].status === 'up') {
                copyArray.sort((a, b) => a.rank - b.rank)
            } else {
                copyArray.sort((a, b) => b.rank - a.rank)
            }

            setListMyRatings(copyArray)
        } else if (type === 'nameExam') {
            let copyArray = listMyRatings
            if (arrayTableTitles[index].status === 'up') {
                copyArray.sort((a, b) => a.infor[type].localeCompare(b.infor[type]))
            } else {
                copyArray.sort((a, b) => b.infor[type].localeCompare(a.infor[type]))
            }

            setListMyRatings(copyArray)
        } else {
            let copyArray = listMyRatings
            if (arrayTableTitles[index].status === 'up') {
                copyArray.sort((a, b) => a.infor[type] - b.infor[type])
            } else {
                copyArray.sort((a, b) => b.infor[type] - a.infor[type])
            }

            setListMyRatings(copyArray)
        }
    }

    let handleDisPlayTypeSort = (type, typeSort) => {
        //console.log(type, typeSort)

        if (type === 'nameExam') {
            if (typeSort === 'up') {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowUpAZ} />)
            } else {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowDownAZ} />)
            }
        } else {
            if (typeSort === 'up') {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowUp19} />)
            } else {
                setIconSort(<FontAwesomeIcon className="icon-sort" icon={faArrowDown91} />)
            }
        }
    }
    // console.log(listMyRatings)

    let handleViewDetail = async (data) => {
        //console.log(data.infor.examID)
        setIsOpenModalDetail(true)

        let respon = await examService.getDetailExamById(data.infor.examID)

        if (respon && respon.errCode === 0) {
            setCurrentUser(respon.data)
        }
    }

    let handleCloseModalDetail = () => {
        setIsOpenModalDetail(false)
        setDescriptionModal('')
    }

    let handleStartDoExam = (data) => {
        navigate(`/verification/${data.infor.examID}`)
    }

    return (
        <>
            {listMyRatings && listMyRatings.length > 0 && (
                <div className="table-container">
                    <div className="table-head">
                        <table>
                            <thead>
                                <tr className="table-header">
                                    {arrayTableTitles &&
                                        arrayTableTitles.length > 0 &&
                                        arrayTableTitles.map((item, index) => {
                                            return (
                                                <th
                                                    key={index}
                                                    onClick={() => {
                                                        handleSortByField(item.key, index)
                                                        handleDisPlayTypeSort(item.key, item.status)
                                                    }}
                                                >
                                                    {t(item.value)}
                                                    {fieldSort === item.key && iconSort}
                                                </th>
                                            )
                                        })}

                                    <th className="px-5">{t('ratings.action')}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <div className="table-body">
                        <table>
                            <tbody>
                                {listMyRatings &&
                                    listMyRatings.length > 0 &&
                                    listMyRatings.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="px-5">{item.infor.nameExam}</td>
                                                <td>{item.rank}</td>
                                                <td>{item.infor.maxScore}</td>
                                                <td>{language === 'en' ? item.infor.timeEn : item.infor.timeVi}</td>
                                                {/* <td>{item.quantityJoin}</td> */}

                                                <td className="action">
                                                    <ButtonNotify
                                                        descrip={t('tippy.detail-exam')}
                                                        children={
                                                            <button
                                                                className="btn-view"
                                                                onClick={() => handleViewDetail(item)}
                                                            >
                                                                <FontAwesomeIcon icon={faEye} />
                                                            </button>
                                                        }
                                                    />

                                                    <ButtonNotify
                                                        descrip={t('tippy.start-exam')}
                                                        children={
                                                            <button
                                                                className="btn-view"
                                                                notifi="Tới bài thi"
                                                                onClick={() => handleStartDoExam(item)}
                                                            >
                                                                {' '}
                                                                <FontAwesomeIcon className="btn-edit" icon={faPlay} />
                                                            </button>
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {isOpenModalDetail && (
                <ModalDetailUser
                    data={currentUser}
                    isOpenModal={isOpenModalDetail}
                    handleCloseModalDetail={handleCloseModalDetail}
                    type="doExam"
                />
            )}
        </>
    )
}

export default MyRatings
