const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TransactionsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const transactions = await db.transactions.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        amount: data.amount || null,
        quantity: data.quantity || null,
        receipt_url: data.receipt_url || null,
        subscription_plan_name: data.subscription_plan_name || null,
        subscription_plan_status: data.subscription_plan_status || null,
        subscription_plan_type: data.subscription_plan_type || null,
        subscription_plan_activation_date:
          data.subscription_plan_activation_date || null,
        subscription_plan_expiry_date:
          data.subscription_plan_expiry_date || null,
        customer_name: data.customer_name || null,
        customer_company_name: data.customer_company_name || null,
        customer_email: data.customer_email || null,
        customer_phone_number: data.customer_phone_number || null,
        customer_country: data.customer_country || null,
        customer_city: data.customer_city || null,
        customer_address: data.customer_address || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await transactions.setSubscriptionPlan(data.subscriptionPlan || null, {
      transaction,
    });

    return transactions;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const transactions = await db.transactions.findByPk(id, {
      transaction,
    });

    await transactions.update(
      {
        name: data.name || null,
        amount: data.amount || null,
        quantity: data.quantity || null,
        receipt_url: data.receipt_url || null,
        subscription_plan_name: data.subscription_plan_name || null,
        subscription_plan_status: data.subscription_plan_status || null,
        subscription_plan_type: data.subscription_plan_type || null,
        subscription_plan_activation_date:
          data.subscription_plan_activation_date || null,
        subscription_plan_expiry_date:
          data.subscription_plan_expiry_date || null,
        customer_name: data.customer_name || null,
        customer_company_name: data.customer_company_name || null,
        customer_email: data.customer_email || null,
        customer_phone_number: data.customer_phone_number || null,
        customer_country: data.customer_country || null,
        customer_city: data.customer_city || null,
        customer_address: data.customer_address || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await transactions.setSubscriptionPlan(data.subscriptionPlan || null, {
      transaction,
    });

    return transactions;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const transactions = await db.transactions.findByPk(id, options);

    await transactions.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await transactions.destroy({
      transaction,
    });

    return transactions;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const transactions = await db.transactions.findOne(
      { where },
      { transaction },
    );

    if (!transactions) {
      return transactions;
    }

    const output = transactions.get({ plain: true });

    output.subscriptionPlan = await transactions.getSubscriptionPlan({
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
        as: 'subscriptionPlan',
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
          [Op.and]: Utils.ilike('transactions', 'name', filter.name),
        };
      }

      if (filter.amount) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('transactions', 'amount', filter.amount),
        };
      }

      if (filter.receipt_url) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'receipt_url',
            filter.receipt_url,
          ),
        };
      }

      if (filter.subscription_plan_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'subscription_plan_name',
            filter.subscription_plan_name,
          ),
        };
      }

      if (filter.subscription_plan_status) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'subscription_plan_status',
            filter.subscription_plan_status,
          ),
        };
      }

      if (filter.subscription_plan_type) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'subscription_plan_type',
            filter.subscription_plan_type,
          ),
        };
      }

      if (filter.subscription_plan_activation_date) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'subscription_plan_activation_date',
            filter.subscription_plan_activation_date,
          ),
        };
      }

      if (filter.subscription_plan_expiry_date) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'subscription_plan_expiry_date',
            filter.subscription_plan_expiry_date,
          ),
        };
      }

      if (filter.customer_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'customer_name',
            filter.customer_name,
          ),
        };
      }

      if (filter.customer_company_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'customer_company_name',
            filter.customer_company_name,
          ),
        };
      }

      if (filter.customer_email) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'customer_email',
            filter.customer_email,
          ),
        };
      }

      if (filter.customer_phone_number) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'customer_phone_number',
            filter.customer_phone_number,
          ),
        };
      }

      if (filter.customer_country) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'customer_country',
            filter.customer_country,
          ),
        };
      }

      if (filter.customer_city) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'customer_city',
            filter.customer_city,
          ),
        };
      }

      if (filter.customer_address) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'transactions',
            'customer_address',
            filter.customer_address,
          ),
        };
      }

      if (filter.quantityRange) {
        const [start, end] = filter.quantityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            quantity: {
              ...where.quantity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            quantity: {
              ...where.quantity,
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

      if (filter.subscriptionPlan) {
        var listItems = filter.subscriptionPlan.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          subscriptionPlanId: { [Op.or]: listItems },
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
          count: await db.transactions.count({
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
      : await db.transactions.findAndCountAll({
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
          Utils.ilike('transactions', 'name', query),
        ],
      };
    }

    const records = await db.transactions.findAll({
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
