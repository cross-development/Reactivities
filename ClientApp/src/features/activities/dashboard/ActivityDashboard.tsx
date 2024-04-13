import { FC, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Grid, Loader } from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';

import { useStore } from '../../../app/stores/store';
import { PagingParams } from '../../../app/models/pagination';
import ActivityList from './ActivityList';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

const ActivityDashboard: FC = observer(() => {
  const {
    activityStore: {
      loadActivities,
      setPagingParams,
      pagination,
      isInitialLoading,
      activityRegistry,
    },
  } = useStore();

  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = useCallback(async () => {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));

    await loadActivities();

    setLoadingNext(false);
  }, [loadActivities, pagination, setPagingParams]);

  useEffect(() => {
    if (activityRegistry.size <= 1) {
      loadActivities();
    }
  }, [activityRegistry.size, loadActivities]);

  return (
    <Grid>
      <Grid.Column width="10">
        {isInitialLoading && activityRegistry.size == 0 && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
            loadMore={handleGetNext}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>

      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>

      <Grid.Column width="10">
        <Loader />
      </Grid.Column>
    </Grid>
  );
});

ActivityDashboard.displayName = 'ActivityDashboard';

export default ActivityDashboard;
