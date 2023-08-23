const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CustomersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customers = await db.customers.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        current_period_starts: data.current_period_starts || null,
        current_period_ends: data.current_period_ends || null,
        addressAsProfile: data.addressAsProfile || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await customers.setNext_subscription_plan(
      data.next_subscription_plan || null,
      {
        transaction,
      },
    );

    return customers;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customers = await db.customers.findByPk(id, {
      transaction,
    });

    await customers.update(
      {
        name: data.name || null,
        current_period_starts: data.current_period_starts || null,
        current_period_ends: data.current_period_ends || null,
        addressAsProfile: data.addressAsProfile || false,

        updatedById: currentUser.id,
      },
      { transaction },
    );

    await customers.setNext_subscription_plan(
      data.next_subscription_plan || null,
      {
        transaction,
      },
    );

    return customers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customers = await db.customers.findByPk(id, options);

    await customers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await customers.destroy({
      transaction,
    });

    return customers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const customers = await db.customers.findOne({ where }, { transaction });

    if (!customers) {
      return customers;
    }

    const output = customers.get({ plain: true });

    output.next_subscription_plan = await customers.getNext_subscription_plan({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.subscription_plans,
        as: 'next_subscription_plan',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('customers', 'name', filter.name),
        };
      }

      if (filter.current_period_startsRange) {
        const [start, end] = filter.current_period_startsRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            current_period_starts: {
              ...where.current_period_starts,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            current_period_starts: {
              ...where.current_period_starts,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.current_period_endsRange) {
        const [start, end] = filter.current_period_endsRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            current_period_ends: {
              ...where.current_period_ends,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            current_period_ends: {
              ...where.current_period_ends,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.addressAsProfile) {
        where = {
          ...where,
          addressAsProfile: filter.addressAsProfile,
        };
      }

      if (filter.next_subscription_plan) {
        var listItems = filter.next_subscription_plan.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          next_subscription_planId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.customers.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.customers.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('customers', 'name', query),
        ],
      };
    }

    const records = await db.customers.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
