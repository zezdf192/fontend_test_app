import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
    faMagnifyingGlass,
    faSpinner,
    faCircleXmark,
    faArrowUpAZ,
    faArrowDownAZ,
    faArrowUp19,
    faEye,
    faArrowDown91,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react/headless'
import { useTranslation } from 'react-i18next'

import { useSelector, useDispatch } from 'react-redux'

import { useDebounce } from '../../../../hooks'
import { sideBarUser } from '../../../../component/RouteSideBar/routeSideBar'
import HeaderHome from '../../../HomePage/HeaderHome/HeaderHome'
import SideBar from '../../MyExam/SideBar/SideBar'
import WrapperPoper from '../WrapperPoper/WrapperPoper'
import searchIcon from '../../../../styles/icon/search.png'
import filter from '../../../../styles/icon/filter.png'
import examService from '../../../../service/examService'

import './RatingsExam.scss'
//import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import ExamItem from '../ExamItem/ExamItem'
import ButtonNotify from '../../../../component/ButtonNotify/ButtonNotify'
import ModalDetailUser from '../../../Admin/ModalDetailUser/ModalDetailUser'
import FilterExam from '../../../../component/Filter/FilterExam/FilterExam'
import FilterRatings from '../../../../component/Filter/FilterRatings/FilterRatings'
import { toast } from 'react-toastify'
import MyRatings from './MyRatings/MyRatings'
import ReactPaginate from 'react-paginate'

function RatingsExam() {
    const { examId } = useParams()
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    let navigate = useNavigate()
    const user = useSelector((state) => state.user)

    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [newListExam, setNewListExam] = useState([])

    const [valueSearch, setValueSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)

    //my ratings
    const [showFilter, setShowFilter] = useState(true)
    const [isMyRatings, setIsMyRatings] = useState(false)

    const [listMyRatings, setListMyRatings] = useState([])

    //Modal
    const [currentUser, setCurrentUser] = useState()
    const [isOpenModalDetail, setIsOpenModalDetail] = useState(false)

    //filter
    const [isOpenFilter, setIsOpenFilter] = useState(false)

    // state user
    const [examInfor, setExamInfor] = useState({})
    const [listUserDoExam, setListUserDoExam] = useState([])
    const [arrayTableTitles, setArrayTableTitles] = useState([
        {
            value: 'ratings.username',
        },
        {
            value: 'ratings.score',
        },
        {
            value: 'ratings.time',
        },
        {
            value: 'ratings.number-participations',
        },
    ])

    const debounceValue = useDebounce(valueSearch, 500)

    let inputRef = useRef()

    useEffect(() => {
        if (examId !== 'examId') {
            async function callAPI() {
                let respon = await examService.getDetailExamRatings(examId)

                if (respon && respon.errCode === 0) {
                    if (respon.data === null) {
                        toast.error(t('ratings.toast-no-data'))
                    } else {
                        setListUserDoExam(respon.data.users)
                        setExamInfor(respon.data.data)
                    }
                    //console.log(respon.data.users)
                }
            }

            callAPI()
        }
    }, [])

    useEffect(() => {
        if (!debounceValue.trim()) {
            setSearchResult([])
            return
        }

        let fetchApi = async () => {
            setLoading(true)

            const respon = await examService.getLessListExamRatings(debounceValue)

            if (respon && respon.errCode === 0) {
                setSearchResult(respon.data)
            }

            setLoading(false)
        }

        fetchApi()
    }, [debounceValue])

    let handleChangeInput = (e) => {
        let searchValue = e.target.value

        if (!searchValue.startsWith(' ')) {
            setValueSearch(searchValue)
        }
    }

    let handleHideResult = () => {
        setShowResult(false)
    }

    let handleClear = () => {
        inputRef.current.focus()
        if (valueSearch !== '') {
            setShowResult(true)
            setSearchResult([])
        }
        setValueSearch('')
    }

    let handleChooseExamItem = async (data) => {
        let examID = data._id
        if (examID) {
            navigate(`/ratings/${examID}`)
        }

        //let request = examId === 'examId' ? examID : examId
        //console.log(request)

        let respon = await examService.getDetailExamRatings(examID)

        if (respon && respon.errCode === 0) {
            if (respon.data === null) {
                setListUserDoExam([])
                setExamInfor({})
                toast.error(t('ratings.toast-no-data'))
            } else {
                setListUserDoExam(respon.data.users)
                setExamInfor(respon.data.data)
            }
            //console.log(respon.data.users)
        }
        setIsMyRatings(false)
        setShowFilter(true)
        setShowResult(false)
    }

    let handleStartSearch = () => {
        inputRef.current.focus()
        setShowResult(true)
    }

    //Action

    let handleViewDetail = (data) => {
        setIsOpenModalDetail(true)
        setCurrentUser(data)
    }

    let handleCloseModalDetail = () => {
        setIsOpenModalDetail(false)
    }

    //filter
    const showModalFilter = (boonlean) => {
        setIsOpenFilter(boonlean)
    }

    let updateListDoExam = (data) => {
        setListUserDoExam(data)
    }

    //my ratings

    let handleToMyRatings = async () => {
        let respon = await examService.getAllDoExamRatings(user.userInfo.email)

        if (respon && respon.errCode === 0) {
            let copyData = respon.data
            let copyListMyRatings = []
            //let listIndexRatings = []

            for (let i = 0; i < copyData.length; i++) {
                for (let j = 0; j < copyData[i].users.length; j++) {
                    if (copyData[i].users[j].userID === user.userInfo._id) {
                        copyListMyRatings.push({
                            infor: copyData[i].users[j],
                            exam: copyData[i].data,
                            rank: j + 1,
                        })

                        break
                    }
                }
            }

            setListMyRatings([...copyListMyRatings])
            setIsMyRatings(true)
            setShowFilter(false)

            // console.log(listIndexRatings)
        }
    }

    let handlePageChange = (selectedPage) => {
        //console.log(selectedPage)
        setCurrentPage(selectedPage.selected)
        // Thực hiện các tác vụ cần thiết khi chuyển trang
    }

    useEffect(() => {
        let slicedData =
            listUserDoExam &&
            listUserDoExam.length > 0 &&
            listUserDoExam.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        setNewListExam(slicedData)
    }, [listUserDoExam, currentPage])

    return (
        <>
            <HeaderHome />
            <div className="ratings-container">
                <SideBar ratings data={sideBarUser} />
                <div className="ratings-body">
                    <div className="header">
                        <h2 className="title">{t('ratings.ratings')}</h2>
                    </div>
                    <div className="content">
                        <div className="search-container">
                            <div className="search-body">
                                <Tippy
                                    render={(attrs) => (
                                        <div className="box" style={{ width: '560px' }} tabIndex="-1" {...attrs}>
                                            <WrapperPoper>
                                                {searchResult && searchResult.length > 0 ? (
                                                    searchResult.map((item, index) => {
                                                        return (
                                                            <ExamItem
                                                                key={index}
                                                                handleChooseExamItem={() => handleChooseExamItem(item)}
                                                                data={item}
                                                            />
                                                        )
                                                    })
                                                ) : (
                                                    <div className="no-data">{t('ratings.check-again')}</div>
                                                )}
                                            </WrapperPoper>
                                        </div>
                                    )}
                                    visible={showResult}
                                    interactive
                                    placement="bottom-start"
                                    onClickOutside={handleHideResult}
                                >
                                    <div className="search">
                                        <input
                                            ref={inputRef}
                                            value={valueSearch}
                                            onChange={handleChangeInput}
                                            className="input-search"
                                            placeholder={t('ratings.search-title')}
                                            onFocus={() => setShowResult(true)}
                                        />

                                        {loading ? (
                                            <button className="spiner-btn input-btn">
                                                <FontAwesomeIcon icon={faSpinner} />
                                            </button>
                                        ) : valueSearch !== '' ? (
                                            <button className="close-btn input-btn" onClick={handleClear}>
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            </button>
                                        ) : (
                                            ''
                                        )}

                                        <button className="search-btn input-btn" onClick={handleStartSearch}>
                                            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
                                        </button>
                                    </div>
                                </Tippy>
                            </div>

                            {showFilter && (
                                <FilterRatings
                                    isMyRatings={isMyRatings}
                                    examID={examId}
                                    isOpenFilter={isOpenFilter}
                                    updateListDoExam={updateListDoExam}
                                    showModal={showModalFilter}
                                    children={
                                        <div className="filter-body">
                                            <span>{t('ratings.filter-data')}</span>
                                            {/* <img className="filter-img" src={filter} alt="" /> */}
                                        </div>
                                    }
                                />
                            )}

                            <span
                                className={isMyRatings ? 'my-ratings active' : 'my-ratings'}
                                onClick={handleToMyRatings}
                            >
                                {t('ratings.participating-exam')}
                            </span>
                        </div>
                        <div className="user-container">
                            {isMyRatings ? (
                                <MyRatings listMyRating={listMyRatings} />
                            ) : listUserDoExam && listUserDoExam.length > 0 ? (
                                <div className="table-container">
                                    <div className="table-head">
                                        <table>
                                            <thead>
                                                <tr className="table-header">
                                                    <th className="px-5">STT</th>
                                                    {arrayTableTitles &&
                                                        arrayTableTitles.length > 0 &&
                                                        arrayTableTitles.map((item, index) => {
                                                            return <th key={index}>{t(item.value)}</th>
                                                        })}

                                                    <th>{t('ratings.action')}</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    <div className="table-body">
                                        <table>
                                            <tbody>
                                                {newListExam &&
                                                    newListExam.length > 0 &&
                                                    newListExam.map((item, index) => {
                                                        return (
                                                            <tr
                                                                className={
                                                                    item.email === user.userInfo.email ? 'my-exam' : ''
                                                                }
                                                                key={index}
                                                            >
                                                                <td className="px-5">{index + 1}</td>
                                                                <td>{item.nameUser}</td>
                                                                <td>{item.maxScore}</td>
                                                                <td>{language === 'en' ? item.timeEn : item.timeVi}</td>
                                                                <td>{item.quantityJoin}</td>

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
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <ReactPaginate
                                        previousLabel={currentPage === 0 ? null : t('admin.previous')}
                                        nextLabel={
                                            currentPage === Math.ceil(listUserDoExam.length / itemsPerPage) - 1
                                                ? null
                                                : t('admin.next')
                                        }
                                        breakLabel={'...'}
                                        breakClassName={'break-me'}
                                        pageCount={Math.ceil(listUserDoExam.length / itemsPerPage)} // Tổng số trang
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        onPageChange={handlePageChange}
                                        containerClassName={'pagination'}
                                        activeClassName={'active'}
                                    />
                                </div>
                            ) : (
                                <div className="list-user-img"></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isOpenModalDetail && (
                <ModalDetailUser
                    data={currentUser}
                    isOpenModal={isOpenModalDetail}
                    handleCloseModalDetail={handleCloseModalDetail}
                    type="userDoExam"
                />
            )}
        </>
    )
}

export default RatingsExam
