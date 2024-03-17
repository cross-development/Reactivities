import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';

import { IChatComment } from '../models/comment';
import { store } from './store';

class CommentStore {
  public comments: IChatComment[] = [];
  public hubConnection: HubConnection | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public createHubConnection = (activityId: string): void => {
    if (store.activityStore.selectedActivity) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`http://localhost:5000/chat?activityId=${activityId}`, {
          accessTokenFactory: () => store.userStore.user?.token ?? '',
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection
        .start()
        .catch(error => console.log('Error establishing the connection', error));

      this.hubConnection.on('LoadComments', (comments: IChatComment[]) => {
        runInAction(() => {
          comments.forEach(comment => {
            comment.createdAt = new Date(comment.createdAt + 'Z');
          });

          this.comments = comments;
        });
      });

      this.hubConnection.on('ReceiveComment', (comment: IChatComment) => {
        runInAction(() => {
          comment.createdAt = new Date(comment.createdAt);

          this.comments.unshift(comment);
        });
      });
    }
  };

  public stopHubConnection = (): void => {
    this.hubConnection?.stop().catch(error => console.log('Error stopping connection', error));
  };

  public clearComments = (): void => {
    this.comments = [];
    this.stopHubConnection();
  };

  public addComment = async (values: { body: string; activityId?: string }): Promise<void> => {
    values.activityId = store.activityStore.selectedActivity?.id;

    try {
      await this.hubConnection?.invoke('SendComment', values);
    } catch (error) {
      console.log('error', error);
    }
  };
}

export default CommentStore;
