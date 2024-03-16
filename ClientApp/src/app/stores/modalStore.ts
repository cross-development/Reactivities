import { makeAutoObservable } from 'mobx';

interface Modal {
  open: boolean;
  body: JSX.Element | null;
}

class ModalStore {
  public modal: Modal = {
    open: false,
    body: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  public openModal = (content: JSX.Element): void => {
    this.modal.open = true;
    this.modal.body = content;
  };

  public closeModal = (): void => {
    this.modal.open = false;
    this.modal.body = null;
  };
}

export default ModalStore;
