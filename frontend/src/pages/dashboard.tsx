import {
  mdiChartTimelineVariant,
} from '@mdi/js'
import Head from 'next/head'
import React from 'react'
import axios from 'axios';
import type { ReactElement } from 'react'
import LayoutAuthenticated from '../layouts/Authenticated'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import { mdiInformation } from '@mdi/js';
import BaseIcon from "../components/BaseIcon";
import { getPageTitle } from '../config'
import Link from "next/link";

const Dashboard = () => {

    const [users, setUsers] = React.useState('Loading...');
    const [subscription_plans, setSubscription_plans] = React.useState('Loading...');
    const [transactions, setTransactions] = React.useState('Loading...');

    async function loadData() {
        const fns = [setUsers,setSubscription_plans,setTransactions,];

        const responseUsers = await axios.get(`/users/count`);
        const responseSubscription_plans = await axios.get(`/subscription_plans/count`);
        const responseTransactions = await axios.get(`/transactions/count`);
        Promise.all([responseUsers,responseSubscription_plans,responseTransactions,])
          .then((res) => res.map((el) => el.data))
          .then((data) => data.forEach((el, i) => fns[i](el.count)));
    }

  React.useEffect(() => {
      loadData().then();
  }, []);
  return (
    <>
      <Head>
        <title>{getPageTitle('Dashboard')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Overview" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6'>

            <Link href={'/users/users-list'} className='mr-3'>
              <div
                  className="rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6"
              >
                  <div className="flex justify-between align-center">
                      <div>
                          <div className="text-lg leading-tight text-gray-500 dark:text-gray-400">
                            Users
                          </div>
                          <div className="text-3xl leading-tight font-semibold">
                            {users}
                          </div>
                      </div>
                      <div>
                          <BaseIcon
                              className="text-blue-500"
                              w="w-16"
                              h="h-16"
                              size={48}
                              path={mdiInformation}
                          />
                      </div>
                  </div>
              </div>
            </Link>

            <Link href={'/subscription_plans/subscription_plans-list'} className='mr-3'>
              <div
                  className="rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6"
              >
                  <div className="flex justify-between align-center">
                      <div>
                          <div className="text-lg leading-tight text-gray-500 dark:text-gray-400">
                            Subscription_plans
                          </div>
                          <div className="text-3xl leading-tight font-semibold">
                            {subscription_plans}
                          </div>
                      </div>
                      <div>
                          <BaseIcon
                              className="text-blue-500"
                              w="w-16"
                              h="h-16"
                              size={48}
                              path={mdiInformation}
                          />
                      </div>
                  </div>
              </div>
            </Link>

            <Link href={'/transactions/transactions-list'} className='mr-3'>
              <div
                  className="rounded dark:bg-gray-900/70 bg-white border border-pavitra-400 p-6"
              >
                  <div className="flex justify-between align-center">
                      <div>
                          <div className="text-lg leading-tight text-gray-500 dark:text-gray-400">
                            Transactions
                          </div>
                          <div className="text-3xl leading-tight font-semibold">
                            {transactions}
                          </div>
                      </div>
                      <div>
                          <BaseIcon
                              className="text-blue-500"
                              w="w-16"
                              h="h-16"
                              size={48}
                              path={mdiInformation}
                          />
                      </div>
                  </div>
              </div>
            </Link>

        </div>
      </SectionMain>
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default Dashboard
