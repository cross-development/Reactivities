import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal } from 'semantic-ui-react';

import { useStore } from '../../stores/store';

const ModalContainer: FC = observer(() => {
  const { modalStore } = useStore();

  return (
    <Modal
      size="mini"
      open={modalStore.modal.open}
      onClose={modalStore.closeModal}
    >
      <Modal.Content>{modalStore.modal.body}</Modal.Content>
    </Modal>
  );
});

ModalContainer.displayName = 'ModalContainer';

export default ModalContainer;
