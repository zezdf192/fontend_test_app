import { useState, useEffect, useRef } from 'react'
import HeaderHome from './HeaderHome/HeaderHome'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import examService from '../../service/examService'

import './HomePage.scss'
import { useSelector, useDispatch } from 'react-redux'

import ReactPaginate from 'react-paginate'
import Tippy from '@tippyjs/react/headless'

import WrapperPoper from '../User/Ratings/WrapperPoper/WrapperPoper'
import ExamItem from '../User/Ratings/ExamItem/ExamItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { useDebounce } from '../../hooks'
import ModalPrivate from './HeaderHome/ModalPrivate/ModalPrivate'

function HomePage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user.userInfo)
    const [listExam, setListExam] = useState([])

    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(6)
    const [newListExam, setNewListExam] = useState([])

    const [valueSearch, setValueSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)

    //modal
    const [showModalCode, setShowModalCode] = useState(false)

    const [examInfor, setExamInfor] = useState({})

    const debounceValue = useDebounce(valueSearch, 500)

    const inputRef = useRef()

    const callAPI = async () => {
        const exam = await examService.getAllExam()
        if (exam && exam.errCode === 0) {
            setListExam([...exam.data])
        }
    }

    useEffect(() => {
        callAPI()
    }, [])

    const handleChooseExam = (item) => {
        if (user) {
            navigate(`/verification/${user.email}/${user.name}/${item._id}`)
        } else {
            navigate(`/verification/undefine/undefine/${item._id}`)
        }
    }

    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected)
        // Thực hiện các tác vụ cần thiết khi chuyển trang
    }

    useEffect(() => {
        const slicedData =
            listExam &&
            listExam.length > 0 &&
            listExam.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
        setNewListExam(slicedData)
    }, [listExam, currentPage])

    const handleChooseExamItem = async (data) => {
        const examID = data._id

        if (examID) {
            navigate(`/verification/${examID}`)
        }

        const respon = await examService.getDetailExamRatings(examID)

        if (respon && respon.errCode === 0) {
            if (respon.data === null) {
                setListExam([])
                setExamInfor({})
                toast.error(t('ratings.toast-no-data'))
            } else {
                setListExam(respon.data.users)
                setExamInfor(respon.data.data)
            }
        }

        setShowResult(false)
    }

    const handleClear = () => {
        inputRef.current.focus()
        if (valueSearch !== '') {
            setShowResult(true)
            setSearchResult([])
        }
        setValueSearch('')
    }

    const handleStartSearch = () => {
        inputRef.current.focus()
        setShowResult(true)
    }

    const handleChangeInput = (e) => {
        const searchValue = e.target.value

        if (!searchValue.startsWith(' ')) {
            setValueSearch(searchValue)
        }
    }

    const handleHideResult = () => {
        setShowResult(false)
    }

    useEffect(() => {
        if (!debounceValue.trim()) {
            setSearchResult([])
            return
        }

        const fetchApi = async () => {
            setLoading(true)

            const respon = await examService.getLessListExamRatings(debounceValue)

            if (respon && respon.errCode === 0) {
                setSearchResult(respon.data)
            }

            setLoading(false)
        }

        fetchApi()
    }, [debounceValue])

    let toggleShowModalCode = (boolean) => {
        setShowModalCode(boolean)
    }

    return (
        <>
            <div className="home-page-container">
                <HeaderHome />
                <div className="home-page-body">
                    <div className="home-page-header">
                        <h2 className="title"> {t('home-page.exam-popular')}</h2>
                        <div className="search-container">
                            <div className="search-body">
                                <Tippy
                                    render={(attrs) => (
                                        <div className="box" style={{ width: '560px' }} tabIndex="-1" {...attrs}>
                                            <WrapperPoper>
                                                {searchResult && searchResult.length > 0 ? (
                                                    searchResult.map((item, index) => (
                                                        <ExamItem
                                                            key={index}
                                                            handleChooseExamItem={() => handleChooseExamItem(item)}
                                                            data={item}
                                                        />
                                                    ))
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
                        </div>

                        <ModalPrivate
                            toggleShowModalCode={toggleShowModalCode}
                            isOpenFilter={showModalCode}
                            children={<button className="input-code">Code</button>}
                        />
                    </div>
                    <div className="list-exam">
                        {newListExam &&
                            newListExam.length > 0 &&
                            newListExam.map((item, index) => (
                                <div key={index} className="exam-item" onClick={() => handleChooseExam(item)}>
                                    <div className="img-container">
                                        <img
                                            className="img"
                                            src={item.data.image}
                                            alt="Ảnh bị lỗi, vui lòng tải lại!"
                                        />
                                    </div>
                                    <div className="exam-body">
                                        <p className="exam-title">{item.data.title}</p>
                                    </div>
                                    <div className="notify">
                                        <div className="quantity">
                                            <span>{item.data.quantityJoin || 0}</span>
                                            <span>Exams</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <ReactPaginate
                        previousLabel={currentPage === 0 ? null : t('admin.previous')}
                        nextLabel={
                            currentPage === Math.ceil(listExam.length / itemsPerPage) - 1 ? null : t('admin.next')
                        }
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(listExam.length / itemsPerPage)} // Tổng số trang
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                </div>
            </div>
        </>
    )
}

export default HomePage
