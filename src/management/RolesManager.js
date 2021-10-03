const { ArgumentError } = require('rest-facade');
const utils = require('../utils');
const Auth0RestClient = require('../Auth0RestClient');
const RetryRestClient = require('../RetryRestClient');

/**
 * Simple facade for consuming a REST API endpoint.
 *
 * @external RestClient
 * @see https://github.com/ngonzalvez/rest-facade
 */

/**
 * @class RolesManager
 * The role class provides a simple abstraction for performing CRUD operations
 * on Auth0 RolesManager.
 * @class
 * @memberof module:management
 * @param {object} options            The client options.
 * @param {string} options.baseUrl    The URL of the API.
 * @param {object} [options.headers]  Headers to be included in all requests.
 * @param {object} [options.retry]    Retry Policy Config
 */
const RolesManager = function (options) {
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide manager options');
  }

  if (options.baseUrl === null || options.baseUrl === undefined) {
    throw new ArgumentError('Must provide a base URL for the API');
  }

  if ('string' !== typeof options.baseUrl || options.baseUrl.length === 0) {
    throw new ArgumentError('The provided base URL is invalid');
  }

  /**
   * Options object for the Rest Client instance.
   *
   * @type {object}
   */
  const clientOptions = {
    headers: options.headers,
    query: { repeatParams: false },
  };

  /**
   * Provides an abstraction layer for performing CRUD operations on
   * {@link https://auth0.com/docs/api/v2#!/RolesManager Auth0 RolesManagers}.
   *
   * @type {external:RestClient}
   */
  const auth0RestClient = new Auth0RestClient(
    `${options.baseUrl}/roles/:id`,
    clientOptions,
    options.tokenProvider
  );
  this.resource = new RetryRestClient(auth0RestClient, options.retry);

  const permissionsInRoleClient = new Auth0RestClient(
    `${options.baseUrl}/roles/:id/permissions`,
    clientOptions,
    options.tokenProvider
  );
  this.permissions = new RetryRestClient(permissionsInRoleClient, options.retry);

  const usersInRoleClient = new Auth0RestClient(
    `${options.baseUrl}/roles/:id/users`,
    clientOptions,
    options.tokenProvider
  );
  this.users = new RetryRestClient(usersInRoleClient, options.retry);
};

/**
 * Create a new role.
 *
 * @function    create
 * @memberof  module:management.RolesManager.prototype
 * @example
 * management.roles.create(data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Role created.
 * });
 * @param   {object}    data     Role data object.
 * @param   {Function}  [cb]     Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(RolesManager, 'create', 'resource.create');

/**
 * Get all roles.
 *
 * @function    getAll
 * @memberof  module:management.RolesManager.prototype
 * @example <caption>
 *   This method takes an optional object as first argument that may be used to
 *   specify pagination settings. If pagination options are not present,
 *   the first page of a limited number of results will be returned.
 * </caption>
 *
 * // Pagination settings.
 * var params = {
 *   per_page: 10,
 *   page: 0
 * };
 *
 * management.roles.getAll(params, function (err, roles) {
 *   console.log(roles.length);
 * });
 * @param   {object}    [params]          Roles parameters.
 * @param   {number}    [params.per_page] Number of results per page.
 * @param   {number}    [params.page]     Page number, zero indexed.
 * @param   {Function}  [cb]              Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(RolesManager, 'getAll', 'resource.getAll');

/**
 * Get an Auth0 role.
 *
 * @function    get
 * @memberof  module:management.RolesManager.prototype
 * @example
 * management.roles.get({ id: ROLE_ID }, function (err, role) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(role);
 * });
 * @param   {object}    params        Role parameters.
 * @param   {string}    params.id     Role ID.
 * @param   {Function}  [cb]          Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(RolesManager, 'get', 'resource.get');

/**
 * Update an existing role.
 *
 * @function    update
 * @memberof  module:management.RolesManager.prototype
 * @example
 * var data = { name: 'New name' };
 * var params = { id: ROLE_ID };
 *
 * // Using auth0 instance.
 * management.updateRole(params, data, function (err, role) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(role.name);  // 'New name'
 * });
 *
 * // Using the roles manager directly.
 * management.roles.update(params, data, function (err, role) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(role.name);  // 'New name'
 * });
 * @param   {object}    params        Role parameters.
 * @param   {string}    params.id     Role ID.
 * @param   {object}    data          Updated role data.
 * @param   {Function}  [cb]          Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(RolesManager, 'update', 'resource.patch');

/**
 * Delete an existing role.
 *
 * @function    delete
 * @memberof  module:management.RolesManager.prototype
 * @example
 * management.roles.delete({ id: ROLE_ID }, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Role deleted.
 * });
 * @param   {object}    params        Role parameters.
 * @param   {string}    params.id     Role ID.
 * @param   {Function}  [cb]          Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(RolesManager, 'delete', 'resource.delete');

/**
 * Get Permissions in a Role
 *
 * @function    getPermissionsInRole
 * @memberof  module:management.RolesManager.prototype
 * @param params
 * @param callback
 * @example
 * var params = {id : 'ROLE_ID'}
 * @example <caption>
 *   This method takes a first argument as the roleId and returns the permissions within that role
 * </caption>
 *
 * management.roles.getPermissions( {id : 'ROLE_ID'}, function (err, permissions) {
 *   console.log(permissions);
 * });
 * @param   {string}    [email]           Email address of user(s) to find
 * @param   {Function}  [cb]              Callback function.
 * @returns  {Promise|undefined}
 */
RolesManager.prototype.getPermissions = function (params, callback) {
  return this.permissions.getAll(params, callback);
};

/**
 * Add permissions in a role
 *
 * @function    addPermissions
 * @memberof  module:management.RolesManager.prototype
 * @example
 * var params =  { id :'ROLE_ID'};
 * var data = { "permissions" : [{"permission_name" :"do:something" ,"resource_server_identifier" :"test123" }]};
 *
 * management.roles.addPermissions(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // permissions added.
 * });
 * @param   {string}    params.id                ID of the Role.
 * @param   {object}    data                permissions data
 * @param   {string}    data.permissions    Array of permissions
 * @param   {string}    data.permissions.permission_name  Name of a permission
 * @param   {string}    data.permissions.resource_server_identifier  Identifier for a resource
 * @param   {Function}  [cb]                  Callback function.
 * @returns  {Promise|undefined}
 */

RolesManager.prototype.addPermissions = function (params, data, cb) {
  data = data || {};
  params = params || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The roleId passed in params cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The role Id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.permissions.create(params, data, cb);
  }

  return this.permissions.create(params, data);
};

/**
 * Remove permissions from a role
 *
 * @function    removePermissions
 * @memberof  module:management.RolesManager.prototype
 * @example
 * var params =  { id :'ROLE_ID'};
 * var data = { "permissions" : [{"permission_name" :"do:something" ,"resource_server_identifier" :"test123" }]};
 *
 * management.roles.removePermissions(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // permissions added.
 * });
 * @param   {string}    params.id                ID of the Role.
 * @param   {object}    data                permissions data
 * @param   {string}    data.permissions    Array of permissions
 * @param   {string}    data.permissions.permission_name  Name of a permission
 * @param   {string}    data.permissions.resource_server_identifier  Identifier for a resource
 * @param   {Function}  [cb]                  Callback function.
 * @returns  {Promise|undefined}
 */

RolesManager.prototype.removePermissions = function (params, data, cb) {
  data = data || {};
  params = params || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The roleId passed in params cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The role Id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.permissions.delete(params, data, cb);
  }

  return this.permissions.delete(params, data);
};

/**
 * Get Users in a Role
 *
 * @function    getUsers
 * @memberof  module:management.RolesManager.prototype
 * @example
 * var params = {
 *   roleId: 'ROLE_ID',
 *   per_page: 50,
 * @param params
 * @param callback
 *   page: 0
 * };
 * @example <caption>
 *   This method takes a roleId and returns all users within that role. Supports offset (page, per_page) and checkpoint pagination (from, take). You must use checkpoint pagination to retrieve beyond the first 1000 records.
 * </caption>
 *
 * management.roles.getUsers(params, function (err, users) {
 *   console.log(users);
 * });
 * @param   {string}    [roleId]          Id of the role
 * @param   {number}    [params.per_page] Number of results per page.
 * @param   {number}    [params.page]     Page number, zero indexed.
 * @param   {string}    [params.from]     For checkpoint pagination, the Id from which to start selection from.
 * @param   {number}    [params.take]     For checkpoint pagination, the number of entries to retrieve. Default 50.
 * @param   {Function}  [cb]              Callback function.
 * @returns  {Promise|undefined}
 */
RolesManager.prototype.getUsers = function (params, callback) {
  return this.users.getAll(params, callback);
};

/**
 * Assign users to a role
 *
 * @function    assignUsers
 * @memberof  module:management.RolesManager.prototype
 * @example
 * var params =  { id :'ROLE_ID'};
 * var data = { "users" : ["userId1","userId2"]};
 *
 * management.roles.assignUsers(params, data, function (err, user) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // permissions added.
 * });
 * @param   {string}    params.id                ID of the Role.
 * @param   {object}    data                permissions data
 * @param   {string}    data.permissions    Array of permissions
 * @param   {string}    data.permissions.permission_name  Name of a permission
 * @param   {string}    data.permissions.resource_server_identifier  Identifier for a resource
 * @param   {Function}  [cb]                  Callback function.
 * @returns  {Promise|undefined}
 */

RolesManager.prototype.assignUsers = function (params, data, cb) {
  data = data || {};
  params = params || {};

  // Require a user ID.
  if (!params.id) {
    throw new ArgumentError('The roleId passed in params cannot be null or undefined');
  }
  if (typeof params.id !== 'string') {
    throw new ArgumentError('The role Id has to be a string');
  }

  if (cb && cb instanceof Function) {
    return this.permissions.create(params, data, cb);
  }

  return this.users.create(params, data);
};

module.exports = RolesManager;
