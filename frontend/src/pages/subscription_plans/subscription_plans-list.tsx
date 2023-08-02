import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement } from 'react';
import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';
import TableSubscription_plans from '../../components/Subscription_plans/TableSubscription_plans';
import BaseButton from '../../components/BaseButton';
import axios from 'axios';

const Subscription_plansTablesPage = () => {
  const [filterItems, setFilterItems] = React.useState([]);

  const [filters] = React.useState([
    { label: 'Name', title: 'name' },
    { label: 'Trial Period', title: 'trial_period', number: 'true' },
  ]);

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: '',
      },
    };
    newItem.fields.selectedField = filters[0].title;
    setFilterItems([...filterItems, newItem]);
  };

  const getSubscription_plansCSV = async () => {
    const response = await axios({
      url: '/subscription_plans?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'subscription_plansCSV.csv';
    link.click();
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Subscription_plans')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Subscription_plans Table'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className='mb-6'>
          <BaseButton
            className={'mr-3'}
            href={'/subscription_plans/subscription_plans-new'}
            color='info'
            label='New Item'
          />
          <BaseButton
            className={'mr-3'}
            color='info'
            label='Add Filter'
            onClick={addFilter}
          />
          <BaseButton
            color='info'
            label='Download CSV'
            onClick={getSubscription_plansCSV}
          />
        </CardBox>
        <CardBox className='mb-6' hasTable>
          <TableSubscription_plans
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

Subscription_plansTablesPage.getLayout = function getLayout(
  page: ReactElement,
) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default Subscription_plansTablesPage;
