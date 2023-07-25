import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableGlobal_settings from '../../components/Global_settings/TableGlobal_settings'
import BaseButton from '../../components/BaseButton'
import axios from "axios";

const Global_settingsTablesPage = () => {
  const [filterItems, setFilterItems] = React.useState([]);

  const [filters] = React.useState([{label: 'Name', title: 'name'},
          {label: 'Subscription Expiry Notification Days', title: 'subscription_expiry_notification_days', number: 'true'},{label: 'Billing Cycle Grace Period', title: 'billing_cycle_grace_period', number: 'true'},

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

    const getGlobal_settingsCSV = async () => {
        const response = await axios({url: '/global_settings?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'global_settingsCSV.csv'
        link.click()
    };

  return (
    <>
      <Head>
        <title>{getPageTitle('Global_settings')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Global_settings Table" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className="mb-6">
          <BaseButton className={'mr-3'} href={'/global_settings/global_settings-new'} color='info' label='New Item' />
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Add Filter'
              onClick={addFilter}
          />
          <BaseButton color='info' label='Download CSV' onClick={getGlobal_settingsCSV} />
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableGlobal_settings
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
            />
        </CardBox>
      </SectionMain>
    </>
  )
}

Global_settingsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default Global_settingsTablesPage
