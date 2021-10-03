const { ArgumentError } = require('rest-facade');
const utils = require('../utils');
const Auth0RestClient = require('../Auth0RestClient');
const RetryRestClient = require('../RetryRestClient');

/**
 * @class ClientsManager
 * Auth0 Clients Manager.
 *
 * {@link https://auth0.com/docs/api/v2#!/Clients Clients} represent
 * applications.
 * You can learn more about this in the
 * {@link https://auth0.com/docs/applications Applications} section of the
 * documentation.
 * @class
 * @memberof module:management
 * @param {object} options            The client options.
 * @param {string} options.baseUrl    The URL of the API.
 * @param {object} [options.headers]  Headers to be included in all requests.
 * @param {object} [options.retry]    Retry Policy Config
 */
const ClientsManager = function (options) {
  if (options === null || typeof options !== 'object') {
    throw new ArgumentError('Must provide client options');
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
    errorFormatter: { message: 'message', name: 'error' },
    headers: options.headers,
    query: { repeatParams: false },
  };

  /**
   * Provides an abstraction layer for consuming the
   * {@link https://auth0.com/docs/api/v2#!/Clients Auth0 Clients endpoint}.
   *
   * @type {external:RestClient}
   */
  const auth0RestClient = new Auth0RestClient(
    `${options.baseUrl}/clients/:client_id`,
    clientOptions,
    options.tokenProvider
  );
  this.resource = new RetryRestClient(auth0RestClient, options.retry);
};

/**
 * Create an Auth0 client.
 *
 * @function    create
 * @memberof  module:management.ClientsManager.prototype
 * @example
 * management.clients.create(data, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Client created.
 * });
 * @param   {object}    data     The client data object.
 * @param   {Function}  [cb]     Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(ClientsManager, 'create', 'resource.create');

/**
 * Get all Auth0 clients.
 *
 * @function    getAll
 * @memberof  module:management.ClientsManager.prototype
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
 * management.clients.getAll(params, function (err, clients) {
 *   console.log(clients.length);
 * });
 * @param   {object}    [params]          Clients parameters.
 * @param   {number}    [params.per_page] Number of results per page.
 * @param   {number}    [params.page]     Page number, zero indexed.
 * @param   {Function}  [cb]              Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(ClientsManager, 'getAll', 'resource.getAll');

/**
 * Get an Auth0 client.
 *
 * @function    get
 * @memberof  module:management.ClientsManager.prototype
 * @example
 * management.clients.get({ client_id: CLIENT_ID }, function (err, client) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(client);
 * });
 * @param   {object}    params            Client parameters.
 * @param   {string}    params.client_id  Application client ID.
 * @param   {Function}  [cb]              Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(ClientsManager, 'get', 'resource.get');

/**
 * Update an Auth0 client.
 *
 * @function    update
 * @memberof  module:management.ClientsManager.prototype
 * @example
 * var data = { name: 'newClientName' };
 * var params = { client_id: CLIENT_ID };
 *
 * management.clients.update(params, data, function (err, client) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   console.log(client.name);  // 'newClientName'
 * });
 * @param   {object}    params            Client parameters.
 * @param   {string}    params.client_id  Application client ID.
 * @param   {object}    data              Updated client data.
 * @param   {Function}  [cb]              Callback function.
 * @returns    {Promise|undefined}
 */
utils.wrapPropertyMethod(ClientsManager, 'update', 'resource.patch');

/**
 * Delete an Auth0 client.
 *
 * @function    delete
 * @memberof  module:management.ClientsManager.prototype
 * @example
 * management.clients.delete({ client_id: CLIENT_ID }, function (err) {
 *   if (err) {
 *     // Handle error.
 *   }
 *
 *   // Client deleted.
 * });
 * @param   {object}    params            Client parameters.
 * @param   {string}    params.client_id  Application client ID.
 * @param   {Function}  [cb]              Callback function.
 * @returns  {Promise|undefined}
 */
utils.wrapPropertyMethod(ClientsManager, 'delete', 'resource.delete');

module.exports = ClientsManager;
