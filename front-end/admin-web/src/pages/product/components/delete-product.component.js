import { Button, Col, Modal, Row } from 'antd'
import './delete-product.component.scss'
import { useTranslation } from 'react-i18next'

export default function DeleteProductComponent (props) {
  const {
    preventDeleteProduct,
    isModalVisible,
    titleModal,
    handleCancel,
    onDelete
  } = props
  const { t } = useTranslation()
  const pageData = {
    iGotItBtn: t('dialog.iGotItBtn'),
    ignore: t('button.ignore'),
    delete: t('button.delete'),
    deleteProductMessage: t('product.deleteProductMessage')
  }

  const formatDeleteMessage = (name) => {
    const mess = t(pageData.deleteProductMessage, { name })
    return mess
  }

  return (
    <>
      <Modal
        width={600}
        className="delete-confirm-modal"
        title={titleModal}
        closeIcon
        visible={isModalVisible}
        footer={(null, null)}
      >
        <Row>
          <Col span={24}>
            <p
              dangerouslySetInnerHTML={{
                __html: formatDeleteMessage(preventDeleteProduct?.productName)
              }}
            ></p>
          </Col>
        </Row>
        {preventDeleteProduct?.isPreventDelete === true
          ? (
          <Row className="btn-i-got-it">
            <Button type="primary" onClick={() => handleCancel()}>
              {pageData.iGotItBtn}
            </Button>
          </Row>
            )
          : (
          <Row className="modal-footer">
            <Button className="mr-2" onClick={() => handleCancel()}>
              {pageData.ignore}
            </Button>
            <Button danger onClick={() => onDelete(preventDeleteProduct?.productId)}>
              {pageData.delete}
            </Button>
          </Row>
            )}
      </Modal>
    </>
  )
}
