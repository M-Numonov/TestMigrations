import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableTransactions from '../../components/Transactions/TableTransactions'
import BaseButton from '../../components/BaseButton'
import axios from "axios";

const TransactionsTablesPage = () => {
  const [filterItems, setFilterItems] = React.useState([]);

  const [filters] = React.useState([{label: 'Name', title: 'name'},

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

    const getTransactionsCSV = async () => {
        const response = await axios({url: '/transactions?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'transactionsCSV.csv'
        link.click()
    };

  return (
    <>
      <Head>
        <title>{getPageTitle('Transactions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Transactions Table" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className="mb-6">
          <BaseButton className={'mr-3'} href={'/transactions/transactions-new'} color='info' label='New Item' />
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Add Filter'
              onClick={addFilter}
          />
          <BaseButton color='info' label='Download CSV' onClick={getTransactionsCSV} />
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableTransactions
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
            />
        </CardBox>
      </SectionMain>
    </>
  )
}

TransactionsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default TransactionsTablesPage
