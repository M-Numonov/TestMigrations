import { mdiAccount, mdiChartTimelineVariant, mdiMail, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormFilePicker from '../../components/FormFilePicker'
import FormImagePicker from '../../components/FormImagePicker'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/subscription_plans/subscription_plansSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditSubscription_plans = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const notify = (type, msg) => toast( msg, {type, position: "bottom-center"});
  const initVals = {

      ['name']: '',

    trial_period: '',

    billing_cycle: '',

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { subscription_plans } = useAppSelector((state) => state.subscription_plans)

  const { subscription_plansId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: subscription_plansId }))
  }, [subscription_plansId])

  useEffect(() => {
    if (typeof subscription_plans === 'object') {
      setInitialValues(subscription_plans)
    }
  }, [subscription_plans])

  useEffect(() => {
      if (typeof subscription_plans === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (subscription_plans)[el])

          setInitialValues(newInitialVal);
      }
  }, [subscription_plans])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: subscription_plansId, data }))
    await router.push('/subscription_plans/subscription_plans-list')
    notify('success', 'Subscription_plans was updated!')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit subscription_plans')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title="Edit subscription_plans" main>
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="Name"
    >
        <Field
            name="name"
            placeholder="Your Name"
        />
    </FormField>

    <FormField
        label="Trial Period"
    >
        <Field
            type="number"
            name="trial_period"
            placeholder="Your Trial Period"
        />
    </FormField>

    <FormField label="Billing Cycle" labelFor="billing_cycle">
        <Field name="Billing Cycle" id="Billing Cycle" component="select">

            <option value="30">30</option>

            <option value="90">90</option>

            <option value="365">365</option>

        </Field>
    </FormField>

              <BaseDivider />

              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/subscription_plans/subscription_plans-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
      <ToastContainer />
    </>
  )
}

EditSubscription_plans.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default EditSubscription_plans
