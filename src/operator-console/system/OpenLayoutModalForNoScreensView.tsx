import { Button, Modal } from 'antd'

import { i18n } from '../i18n'

export const OpenLayoutModalForNoScreensView = props => {
  // const operatorConsoleAsParent = props.operatorConsoleAsParent;
  const open = props.useStateOpen
  const setOpen = props.useStateSetOpen
  const setNewOrOpenLayoutOpen = props.useStateSetNewOrOpenLayoutOpen
  const noteNamesContent = props.useStateNoteNamesContent

  const handleOk = () => {
    setOpen(false)
  }
  const handleCancel = () => {
    setOpen(false)
    setNewOrOpenLayoutOpen(true)
  }

  console.log(
    'noteNamesContent.type?.displayName=' + noteNamesContent.type?.displayName,
  )

  let footer
  if (noteNamesContent.type?.displayName === 'Spin') {
    footer = []
  } else {
    footer = [
      <Button key='back' onClick={handleCancel}>
        {i18n.t('cancel')}
      </Button>,
    ]
  }

  return (
    <Modal
      {...props}
      open={open}
      title={i18n.t('selectLayout')}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={footer}
    >
      {noteNamesContent}
    </Modal>
  )
}
