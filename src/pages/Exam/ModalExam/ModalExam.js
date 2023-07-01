import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import './ModalExam.scss'

function ModalExam({ type, isOpenModal, descriptionModal, handleCloseModal, handleSubmitModal }) {
    return (
        <>
            {type === 'time-out' ? (
                <Modal centered size="md" show={isOpenModal} className="modal-container-no-close">
                    <Modal.Header closeButton>
                        <Modal.Title>Thông báo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{descriptionModal}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleSubmitModal}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : (
                <Modal centered size="md" show={isOpenModal} onHide={handleCloseModal} className="modal-container">
                    <Modal.Header closeButton>
                        <Modal.Title>Thông báo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{descriptionModal}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={handleSubmitModal}>
                            Xác nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}

export default ModalExam
