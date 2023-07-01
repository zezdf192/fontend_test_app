import { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Select from 'react-select'
import AdminNavigation from '../Admin/Navigation/AdminNavigation'

import QuestionItem from './QuestionItem/QuestionItem'

import allCodeService from '../../service/allCodeService'

import './CreateExam.scss'
import { toast } from 'react-toastify'
import ModalNotify from '../../component/Modal/ModalNotify'

import examService from '../../service/examService'
import HeaderHome from '../HomePage/HeaderHome/HeaderHome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import ButtonNotify from '../../component/ButtonNotify/ButtonNotify'

function CreateExam() {
    const { t } = useTranslation()
    const language = useSelector((state) => state.app.language)
    const user = useSelector((state) => state.user)

    //init state
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState('')
    const [currentIDQuestion, setCurrentIDQuestion] = useState('')

    const [typeAnswer, setTypeAnswer] = useState('PUBLIC')

    const [typeExam, setTypeExam] = useState('PUBLIC')
    const [scoreQuestion, setScoreQuestion] = useState([])
    const [typeModal, setTypeModal] = useState()

    const [fix, setFix] = useState('')
    const [isValidChildren, setIsValidChildren] = useState()

    const [isValid, setIsValid] = useState(false)

    const [isSubmit, setIsSubmit] = useState(false)
    const [data, setData] = useState({})
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [listQuestions, setListQuestions] = useState([
        {
            title: '',
            image: null,
            score: null,
            bottom: false,
            questionId: 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
            answers: [],
        },
    ])

    //error state
    const [errTitle, setErrTitle] = useState()
    const [errDescription, setErrDescription] = useState()
    const [error, setError] = useState('')

    //state selected
    const [selectedScore, setSelectedScore] = useState(null)
    const [selectedLimit, setSelectedLimit] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)

    //state list options
    const [listScore, setListScore] = useState([])
    const [listLimit, setListLimit] = useState([])
    const [listTime, setListTime] = useState([])

    //function change
    let handleChangeScore = (option) => {
        setSelectedScore(option)
    }

    let handleChangeLimit = (option) => {
        setSelectedLimit(option)
    }

    let handleChangeTime = (option) => {
        console.log(option)
        setSelectedTime(option)
    }

    //api
    let buildOption = (array, type) => {
        if (type === 'time') {
            let result =
                array &&
                array.length > 0 &&
                array.map((item) => {
                    return {
                        value: item.keyCode,
                        label: language === 'en' ? item.valueEn : item.valueVi,
                        labelVi: item.valueVi,
                        labelEn: item.valueEn,
                        valueNum: item.valueNum,
                    }
                })

            return result
        } else if (type === 'score') {
            let result =
                array &&
                array.length > 0 &&
                array.map((item) => {
                    return {
                        value: item.keyCode,
                        label: language === 'en' ? item.valueEn : item.valueVi,
                        labelVi: item.valueVi,
                        labelEn: item.valueEn,
                        valueNum: item.valueNum,
                    }
                })

            return result
        } else {
            let result =
                array &&
                array.length > 0 &&
                array.map((item) => {
                    return {
                        value: item.keyCode,
                        label: language === 'en' ? item.valueEn : item.valueVi,
                        labelVi: item.valueVi,
                        labelEn: item.valueEn,
                        valueNum: item.valueNum,
                    }
                })

            return result
        }
    }

    let callAPI = async () => {
        let responScore = await allCodeService.getAllCode('SCORE')
        let responLimit = await allCodeService.getAllCode('LIMIT')
        let responTime = await allCodeService.getAllCode('TIME')

        if (responScore && responScore.errCode === 0) {
            let score = buildOption(responScore.data, 'score')
            if (score && score.length > 0) {
                setSelectedScore(score[0])
                setListScore(score)
            }
        }

        if (responLimit && responLimit.errCode === 0) {
            let limit = buildOption(responLimit.data)
            if (limit && limit.length > 0) {
                setSelectedLimit(limit[0])
                setListLimit(limit)
            }
        }

        if (responTime && responTime.errCode === 0) {
            let time = buildOption(responTime.data, 'time')
            if (time && time.length > 0) {
                setSelectedTime(time[0])
                setListTime(time)
            }
        }

        let copySelectedScore = selectedScore
        let copySelectedLimit = selectedLimit
        let copySelectedTime = selectedTime

        copySelectedScore.label = language === 'en' ? copySelectedScore.labelEn : copySelectedScore.labelVi
        copySelectedLimit.label = language === 'en' ? copySelectedLimit.labelEn : copySelectedLimit.labelVi
        copySelectedTime.label = language === 'en' ? copySelectedTime.labelEn : copySelectedTime.labelVi

        setSelectedScore(copySelectedScore)
        setSelectedLimit(copySelectedLimit)
        setSelectedTime(copySelectedTime)
    }

    useEffect(() => {
        callAPI()
    }, [language])

    let buildScoreQuestion = () => {
        let array = []
        //console.log(selectedScore)

        //console.log(maxScore)
        if (selectedScore && selectedScore.valueNum) {
            let space = selectedScore.valueNum / 20

            for (let i = 1; i <= 10; i++) {
                let score = space * i

                array.push(score)
            }
        }

        return array
    }

    useEffect(() => {
        let array = buildScoreQuestion()
        setScoreQuestion([...array])
    }, [selectedScore])

    //handle children component

    let renderQuestion = () => {
        //console.log(listQuestions)
        return (
            listQuestions &&
            listQuestions.length > 0 &&
            listQuestions.map((item, index) => {
                return (
                    <QuestionItem
                        isValid={isValid}
                        maxScore={selectedScore && selectedScore.label}
                        listScoreQuestion={scoreQuestion}
                        dataParent={item}
                        isSubmit={isSubmit}
                        handleGetDataFromChild={handleGetDataFromChild}
                        deleteQuestion={deleteQuestion}
                        key={index}
                        handleClodeValid={handleClodeValid}
                        bottom={item.bottom}
                        stt={index + 1}
                        checkChildren={checkChildren}
                        fix={fix}
                    />
                )
            })
        )
    }

    let deleteQuestion = (id) => {
        setTypeModal('delete')
        setIsSubmit(true)
        renderQuestion()
        setIsOpenModal(true)
        setCurrentIDQuestion(id)
        setDescriptionModal(t('crud-exam.do-remove-question'))
    }

    let handleGetDataFromChild = (data) => {
        setIsSubmit(false)
        let array = data.listAnswer
        listQuestions[data.index].image = data.image
        listQuestions[data.index].answers = array
        listQuestions[data.index].score = data.score
        listQuestions[data.index].title = data.title
        setListQuestions([...listQuestions])
    }

    let handleClodeValid = () => {
        setIsValid(false)
    }

    let handleSaveExam = (bool) => {
        setIsValid(true)
        setIsSubmit(true)

        renderQuestion()

        let isCheck = true
        //console.log(typeof bool)
        if (typeof bool !== 'boolean') {
            isCheck = false
            setFix(Math.random())
        } else {
            if (bool === false) {
                //console.log(bool)
                isCheck = false
            }
        }

        if (title.length <= 0) {
            setErrTitle('crud-exam.error-title')
            isCheck = false
        } else {
            setErrTitle('')
        }

        if (description.length <= 0) {
            setErrDescription('crud-exam.error-description')
            isCheck = false
        } else {
            setErrDescription('')
        }

        let total = 0
        let errScoreTotal = false
        for (let i = 0; i < listQuestions.length; i++) {
            total += +listQuestions[i].score
        }

        if (total !== selectedScore.valueNum) {
            isCheck = false
            errScoreTotal = true
        }

        if (!isCheck) {
            if (!errScoreTotal) {
                setError('crud-exam.error-missing')
            } else {
                setError('crud-exam.error-total')
            }
        } else {
            setError('')
            setIsSubmit(false)
            setIsOpenModal(true)
            setDescriptionModal(t('crud-exam.do-save-exam'))
            setIsSubmit(true)
            renderQuestion()
            setTypeModal('submit')
        }

        //console.log(listQuestions)
    }

    let checkChildren = (bool) => {
        handleSaveExam(bool)
        setIsValidChildren(bool)
    }

    let handleCloseModal = () => {
        setIsOpenModal(false)

        setDescriptionModal('')
    }
    //console.log(listQuestions)
    let handleDeleteQuestion = async (id) => {
        if (listQuestions && listQuestions.length > 0) {
            let array = listQuestions
            let fix = array.filter((item) => item.id !== id)

            setListQuestions([...fix])

            toast.success(t('crud-exam.remove-success'))
            setIsOpenModal(false)
            setDescriptionModal('')
        }
    }

    function generateRandomString(length) {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return result
    }

    let handleFinnal = async () => {
        let newDate = new Date()
        newDate.setHours(23, 59, 59, 0)

        let data = {
            userID: user.userInfo._id,
            password: generateRandomString(6),
            title: title,
            score: selectedScore,
            description: description,
            time: selectedTime,
            limit: selectedLimit,
            typeExam: typeExam,
            typeAnswer: typeAnswer,
            questions: listQuestions,
            image: file,
            quantityJoin: 0,
            dateExam: newDate,
            dateExamUpdate: newDate,
        }
        let respon = await examService.createNewExam(data)
        if (respon && respon.errCode === 0) {
            toast.success(respon.message)
        }

        setIsOpenModal(false)
        setDescriptionModal('')
    }

    //imgae

    const handleDrop = (acceptedFiles) => {
        const imageFile = acceptedFiles[0]
        const reader = new FileReader()

        reader.readAsDataURL(imageFile)
        reader.onload = () => {
            setFile(reader.result)
        }
    }

    return (
        <>
            <HeaderHome />
            <div className="create-exam-container">
                <div className="create-exam-content">
                    <div className="header">
                        <h2 className="title">{t('crud-exam.add-exam')}</h2>
                    </div>

                    <div className="body">
                        <div className="content-top row">
                            <div className="form-group left">
                                <div className="row">
                                    <div className="col-12">
                                        <label>{t('crud-exam.title-exam')}</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            onKeyDown={() => setErrTitle('')}
                                            className="form-control"
                                        />
                                        <span className="error-message">{t(errTitle)}</span>
                                    </div>

                                    <div className="col-4 mt-5">
                                        <label>{t('crud-exam.maximum-score')}</label>
                                        <Select
                                            value={selectedScore}
                                            onChange={handleChangeScore}
                                            options={listScore}
                                            isSearchable
                                        />
                                    </div>
                                    <div className="col-4 mt-5">
                                        <label>{t('crud-exam.exam-duration')}</label>
                                        <Select
                                            value={selectedTime}
                                            onChange={handleChangeTime}
                                            options={listTime}
                                            isSearchable
                                        />
                                    </div>
                                    <div className="col-4 mt-5">
                                        <label>{t('crud-exam.maximum-test-entries')}</label>
                                        <Select
                                            value={selectedLimit}
                                            onChange={handleChangeLimit}
                                            options={listLimit}
                                            isSearchable
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group description">
                                <label>{t('crud-exam.description-exam')}</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onKeyDown={() => setErrDescription('')}
                                    rows="5"
                                    className="form-control"
                                ></textarea>
                                <span className="error-message">{t(errDescription)}</span>
                            </div>

                            <div className="col-12 type-exam">
                                <span className="title-type-exam">{t('crud-exam.type-exam')}</span>
                                <div className="type-item">
                                    <div>
                                        <input
                                            onChange={() => setTypeExam('PUBLIC')}
                                            checked={typeExam === 'PUBLIC'}
                                            type="radio"
                                            name="type-exam"
                                            value="PUBLIC"
                                        />
                                        <label>{t('crud-exam.public')}</label>
                                    </div>
                                    <span>{t('crud-exam.text-public')}</span>
                                </div>
                                <div className="type-item">
                                    <div>
                                        <input
                                            onChange={() => setTypeExam('PRIVATE')}
                                            checked={typeExam === 'PRIVATE'}
                                            type="radio"
                                            name="type-exam"
                                            value="PRIVATE"
                                        />
                                        <label>{t('crud-exam.private')}</label>
                                    </div>
                                    <span>{t('crud-exam.text-private')}</span>
                                </div>
                            </div>

                            <div className="col-12 type-exam">
                                <span className="title-type-exam">{t('crud-exam.finish')}</span>
                                <div className="type-item">
                                    <div>
                                        <input
                                            onChange={() => setTypeAnswer('PUBLIC')}
                                            checked={typeAnswer === 'PUBLIC'}
                                            type="radio"
                                            name="type-answer"
                                            value="PUBLIC"
                                        />
                                        <label>{t('crud-exam.show-answers')}</label>
                                    </div>
                                    <span>{t('crud-exam.text-show')}</span>
                                </div>
                                <div className="type-item">
                                    <div>
                                        <input
                                            onChange={() => setTypeAnswer('PRIVATE')}
                                            checked={typeAnswer === 'PRIVATE'}
                                            type="radio"
                                            name="type-answer"
                                            value="PRIVATE"
                                        />
                                        <label>{t('crud-exam.hide-answers')}</label>
                                    </div>
                                    <span>{t('crud-exam.text-hide')}</span>
                                </div>
                            </div>

                            <div className="img-body">
                                <span>{t('crud-exam.upload-img')}</span>
                                <div className="left-ct">
                                    <Dropzone onDrop={handleDrop}>
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <ButtonNotify
                                                    descrip={t('crud-exam.choose-img')}
                                                    children={
                                                        <FontAwesomeIcon className="btn-img" icon={faCloudArrowUp} />
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Dropzone>
                                    {file && <img className="img" src={file} alt={t('crud-exam.error-img')} />}
                                </div>
                            </div>
                        </div>

                        <div className="content-bottom">
                            <div className="question-container">
                                {renderQuestion()}

                                <div className="action">
                                    <span className="error-bottom">{t(error)}</span>
                                    <div>
                                        <button
                                            className="btn-add"
                                            onClick={() => {
                                                listQuestions.forEach((item) => (item.bottom = false))
                                                setListQuestions([
                                                    ...listQuestions,
                                                    {
                                                        title: '',
                                                        bottom: true,
                                                        image: null,
                                                        score: null,
                                                        questionId:
                                                            'id-' +
                                                            Math.random().toString(36).substr(2, 9) +
                                                            '-' +
                                                            Date.now(),
                                                        answers: [],
                                                    },
                                                ])
                                            }}
                                        >
                                            {t('crud-exam.add-question')}
                                        </button>
                                        <button className="btn-save" onClick={handleSaveExam}>
                                            {t('crud-exam.create-exam')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {isOpenModal && (
                    <ModalNotify
                        id={currentIDQuestion}
                        isOpenModal={isOpenModal}
                        descriptionModal={descriptionModal}
                        handleCloseModal={handleCloseModal}
                        handleDeleteQuestion={handleDeleteQuestion}
                        typeModal={typeModal}
                        handleFinnal={handleFinnal}
                    />
                )}
            </>
        </>
    )
}

export default CreateExam
