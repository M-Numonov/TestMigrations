import { mdiChartTimelineVariant } from '@mdi/js'
import Head from 'next/head'
import { uniqueId } from 'lodash';
import React, { ReactElement } from 'react'
import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import TableCustomers from '../../components/Customers/TableCustomers'
import BaseButton from '../../components/BaseButton'
import axios from "axios";

const CustomersTablesPage = () => {
  const [filterItems, setFilterItems] = React.useState([]);

  const [filters] = React.useState([{label: 'Name', title: 'name'},

          {label: 'Next Subscription Plan', title: 'next_subscription_plan'},
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

    const getCustomersCSV = async () => {
        const response = await axios({url: '/customers?filetype=csv', method: 'GET',responseType: 'blob'});
        const type = response.headers['content-type']
        const blob = new Blob([response.data], { type: type })
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = 'customersCSV.csv'
        link.click()
    };

  return (
    <>
      <Head>
        <title>{getPageTitle('Customers')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Customers Table" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox className="mb-6">
          <BaseButton className={'mr-3'} href={'/customers/customers-new'} color='info' label='New Item' />
          <BaseButton
              className={'mr-3'}
              color='info'
              label='Add Filter'
              onClick={addFilter}
          />
          <BaseButton color='info' label='Download CSV' onClick={getCustomersCSV} />
        </CardBox>
        <CardBox className="mb-6" hasTable>
          <TableCustomers
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
            />
        </CardBox>
      </SectionMain>
    </>
  )
}

CustomersTablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default CustomersTablesPage
