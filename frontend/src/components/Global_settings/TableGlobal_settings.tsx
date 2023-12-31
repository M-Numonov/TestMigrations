import { mdiEye, mdiTrashCan } from '@mdi/js';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import BaseButton from '../BaseButton';
import BaseButtons from '../BaseButtons';
import CardBoxModal from '../CardBoxModal';
import CardBox from '../CardBox';
import ImageField from '../ImageField';
import {
  fetch,
  deleteItem,
} from '../../stores/global_settings/global_settingsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import dataFormatter from '../../helpers/dataFormatter';
import { Field, Form, Formik } from 'formik';

const perPage = 5;

const TableSampleGlobal_settings = ({
  filterItems,
  setFilterItems,
  filters,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const notify = (type, msg) => toast(msg, { type, position: 'bottom-center' });

  const pagesList = [];
  const [id, setId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterRequest, setFilterRequest] = React.useState('');
  const { global_settings, loading, count } = useAppSelector(
    (state) => state.global_settings,
  );

  const numPages =
    Math.floor(count / perPage) === 0 ? 1 : Math.floor(count / perPage);
  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const loadData = async (limit, page, request) => {
    const query = `?page=${page}&limit=${limit}${request}`;
    dispatch(fetch({ limit, page, query }));
  };

  useEffect(() => {
    loadData(perPage, currentPage, filterRequest);
  }, [dispatch, currentPage]);

  const global_settingsPaginated = Array.from(
    Array(Math.floor(count / perPage) + 1),
    (_, index) => index,
  );

  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
    setIsModalTrashActive(false);
  };

  const handleDeleteModalAction = (e, id) => {
    e.stopPropagation();
    setId(id);
    setIsModalTrashActive(true);
  };
  const handleDeleteAction = async () => {
    if (id) {
      await dispatch(deleteItem(id));
      console.log('filterRequest', filterRequest);
      await loadData(perPage, 0, filterRequest);
      setIsModalTrashActive(false);
      notify('success', 'Global_settings was deleted!');
    }
  };

  const deleteFilter = (value) => {
    const newItems = filterItems.filter((item) => item.id !== value);
    console.log('newItems', newItems);
    if (newItems.length) {
      setFilterItems(newItems);
      loadData(perPage, 0, filterRequest);
    } else {
      dispatch(deleteItem(id));
      loadData(perPage, 0, '');
      setFilterItems(newItems);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let request = '&';
    filterItems.forEach((item) => {
      filters[
        filters.map((filter) => filter.title).indexOf(item.fields.selectedField)
      ].number
        ? (request += `${item.fields.selectedField}Range=${item.fields.filterValueFrom}&${item.fields.selectedField}Range=${item.fields.filterValueTo}&`)
        : (request += `${item.fields.selectedField}=${item.fields.filterValue}&`);
    });

    loadData(perPage, 0, request);
    setFilterRequest(request);
  };

  const handleChange = (id) => (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFilterItems(
      filterItems.map((item) =>
        item.id === id
          ? { id, fields: { ...item.fields, [name]: value } }
          : item,
      ),
    );
  };

  const handleReset = () => {
    setFilterItems([]);
    setFilterRequest('');
    loadData(perPage, 0, '');
  };

  const controlClasses =
    'w-full py-2 px-2 my-2 border-gray-700 rounded dark:placeholder-gray-400 ' +
    'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none bg-white ' +
    'dark:bg-slate-800 border';
  console.log('global_settings: ', global_settings);

  return (
    <>
      {filterItems && filterItems.length ? (
        <CardBox>
          <Formik
            initialValues={{
              checkboxes: ['lorem'],
              switches: ['lorem'],
              radio: 'lorem',
            }}
            onSubmit={() => null}
          >
            <Form>
              <>
                {global_settings &&
                  global_settings.map((filterItem) => {
                    return (
                      <>
                        <div className='flex mb-4'>
                          <div className='flex flex-col w-full mr-3'>
                            <div className='text-gray-500 font-bold'>
                              Filter
                            </div>
                            <Field
                              className={controlClasses}
                              name='selectedField'
                              id='selectedField'
                              component='select'
                              value={filterItem.fields.selectedField}
                              onChange={handleChange(filterItem.id)}
                            >
                              {filters.map((selectOption) => (
                                <option
                                  key={selectOption.title}
                                  value={`${selectOption.title}`}
                                >
                                  {selectOption.label}
                                </option>
                              ))}
                            </Field>
                          </div>
                          {filters.find(
                            (filter) =>
                              filter.title === filterItem.fields.selectedField,
                          ).number ? (
                            <div className='flex flex-row w-full mr-3'>
                              <div className='flex flex-col w-full mr-3'>
                                <div className='text-gray-500 font-bold'>
                                  From
                                </div>
                                <Field
                                  className={controlClasses}
                                  name='filterValueFrom'
                                  placeholder='From'
                                  id='filterValueFrom'
                                  onChange={handleChange(filterItem.id)}
                                />
                              </div>
                              <div className='flex flex-col w-full'>
                                <div className='text-gray-500 font-bold'>
                                  To
                                </div>
                                <Field
                                  className={controlClasses}
                                  name='filterValueTo'
                                  placeholder='to'
                                  id='filterValueTo'
                                  onChange={handleChange(filterItem.id)}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className='flex flex-col w-full mr-3'>
                              <div className='text-gray-500 font-bold'>
                                Contains
                              </div>
                              <Field
                                className={controlClasses}
                                name='filterValue'
                                placeholder='Contained'
                                id='filterValue'
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                          )}
                          <div className='flex flex-col'>
                            <div className='text-gray-500 font-bold'>
                              Action
                            </div>
                            <BaseButton
                              className='my-2'
                              type='reset'
                              color='danger'
                              label='Delete'
                              onClick={() => {
                                deleteFilter(filterItem.id);
                              }}
                            />
                          </div>
                        </div>
                      </>
                    );
                  })}
                <div className='flex'>
                  <BaseButton
                    className='my-2 mr-3'
                    color='success'
                    label='Apply'
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  />
                  <BaseButton
                    className='my-2'
                    color='info'
                    label='Cancel'
                    onClick={handleReset}
                  />
                </div>
              </>
            </Form>
          </Formik>
        </CardBox>
      ) : null}
      <CardBoxModal
        title='Please confirm'
        buttonColor='danger'
        buttonLabel={loading ? 'Deleting...' : 'Confirm'}
        isActive={isModalTrashActive}
        onConfirm={handleDeleteAction}
        onCancel={handleModalAction}
      >
        <p>Are you sure you want to delete this item?</p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Name</th>

            <th>Subscription Expiry Notification Days</th>

            <th>Billing Cycle Grace Period</th>

            <th>Actions</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {global_settings &&
            Array.isArray(global_settings) &&
            global_settings.map((item: any) => (
              <tr
                key={item.id}
                onClick={() => router.push(`/global_settings/${item.id}`)}
              >
                <td data-label='name'>{item.name}</td>

                <td data-label='subscription_expiry_notification_days'>
                  {item.subscription_expiry_notification_days}
                </td>

                <td data-label='billing_cycle_grace_period'>
                  {item.billing_cycle_grace_period}
                </td>

                <td className='before:hidden lg:w-1 whitespace-nowrap'>
                  <BaseButtons type='justify-start lg:justify-end' noWrap>
                    <BaseButton
                      color='info'
                      icon={mdiEye}
                      onClick={() => setIsModalInfoActive(true)}
                      small
                    />
                    <BaseButton
                      color='danger'
                      icon={mdiTrashCan}
                      onClick={(e) => handleDeleteModalAction(e, item.id)}
                      small
                    />
                  </BaseButtons>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className='p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800'>
        <div className='flex flex-col md:flex-row items-center justify-between py-3 md:py-0'>
          <BaseButtons>
            {global_settingsPaginated.map((page) => (
              <BaseButton
                key={page}
                active={page === currentPage}
                label={(page + 1).toString()}
                color={page === currentPage ? 'lightDark' : 'whiteDark'}
                small
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </BaseButtons>
          <small className='mt-6 md:mt-0'>
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default TableSampleGlobal_settings;
