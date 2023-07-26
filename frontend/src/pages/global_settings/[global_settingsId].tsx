import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import {
  update,
  fetch,
} from '../../stores/global_settings/global_settingsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';

const EditGlobal_settings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const notify = (type, msg) => toast(msg, { type, position: 'bottom-center' });
  const initVals = {
    ['name']: '',

    subscription_expiry_notification_days: '',

    billing_cycle_grace_period: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { global_settings } = useAppSelector((state) => state.global_settings);

  const { global_settingsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: global_settingsId }));
  }, [global_settingsId]);

  useEffect(() => {
    if (typeof global_settings === 'object') {
      setInitialValues(global_settings);
    }
  }, [global_settings]);

  useEffect(() => {
    if (typeof global_settings === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = global_settings[el]),
      );

      setInitialValues(newInitialVal);
    }
  }, [global_settings]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: global_settingsId, data }));
    await router.push('/global_settings/global_settings-list');
    notify('success', 'Global_settings was updated!');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit global_settings')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Edit global_settings'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='Name'>
                <Field name='name' placeholder='Your Name' />
              </FormField>

              <FormField label='Subscription Expiry Notification Days'>
                <Field
                  type='number'
                  name='subscription_expiry_notification_days'
                  placeholder='Your Subscription Expiry Notification Days'
                />
              </FormField>

              <FormField label='Billing Cycle Grace Period'>
                <Field
                  type='number'
                  name='billing_cycle_grace_period'
                  placeholder='Your Billing Cycle Grace Period'
                />
              </FormField>

              <BaseDivider />

              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() =>
                    router.push('/global_settings/global_settings-list')
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
      <ToastContainer />
    </>
  );
};

EditGlobal_settings.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditGlobal_settings;
