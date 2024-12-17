import { parse } from 'url';
import { NextApiRequest } from 'next';
import { pickNotEmpty } from '@common/utils';
import { getCookies } from './functions';

export type Oauth2CallbackHandlerOptions = {
  provider: string;
  backend: {
    domain: string;
    port: number;
    scheme: 'https' | 'http';
  };
};

type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type IssueProviderTokenFunc = (
  req: NextApiRequest,
  code: string,
  state: string,
) => Promise<{ accessToken: string; idToken?: string }>;

/**
 * This class is responsible for handling oauth2 redirect callback
 */
export class Oauth2CallbackHandler {
  /**
   * The options of Oauth2CallbackHandler
   */
  options: Oauth2CallbackHandlerOptions;

  /**
   * The function callback function is responsible for issuing a provider token
   */
  issueProviderToken?: IssueProviderTokenFunc;

  constructor(options: Oauth2CallbackHandlerOptions, providerTokenIssuer: IssueProviderTokenFunc) {
    this.options = options;
    this.issueProviderToken = providerTokenIssuer;
  }

  /**
   * Specify the callback function which are responsible for issuing a provider token
   * @param providerTokenIssuer - The callback function which are responsible for issuing a provider token
   */
  public useProviderTokenIssuer(providerTokenIssuer: IssueProviderTokenFunc) {
    this.issueProviderToken = providerTokenIssuer;
  }

  /**
   * Handle Oauth2 callback. Create signin or signup user.
   * @param req - IncomingMessage
   */
  public async execute(req: NextApiRequest): Promise<AccessTokenResponse> {
    const { accessToken, idToken } = await this.issueToken(req);

    return await this.getBackendAccessToken(accessToken, idToken);
  }

  /**
   * Handle Oauth2 callback. Connect service to existing account
   * @param req - IncomingMessage
   */
  public async connect(req: NextApiRequest): Promise<AccessTokenResponse> {
    const { accessToken } = await this.issueToken(req);

    return await this.connectServiceToAccount(req, accessToken);
  }

  private async issueToken(req: NextApiRequest): Promise<{ accessToken: string; idToken?: string }> {
    const queryParams = parse(req.url, true).query;

    if (!(this.issueProviderToken !== undefined)) {
      throw new Error('Unabled to handle callback request');
    }

    if (!(typeof queryParams.code === 'string' && typeof queryParams.state === 'string')) {
      throw new Error('Request parameters are invalid');
    }

    return this.issueProviderToken(req, queryParams.code, queryParams.state);
  }

  private async getBackendAccessToken(socialToken: string, idToken?: string): Promise<AccessTokenResponse> {
    const { backend } = this.options;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(
      pickNotEmpty({
        provider: this.options.provider,
        accessToken: socialToken,
        idToken,
      }),
    );

    const response = await fetch(`${backend.scheme}://${backend.domain}:${backend.port}/auth/social-token`, {
      method: 'POST',
      headers,
      body,
    });
    const responseBody = await response.json();

    if (!response.ok || !('access_token' in responseBody)) {
      throw new Error('Unabled to create access token');
    }

    return responseBody;
  }

  private async connectServiceToAccount(req: NextApiRequest, socialToken: string): Promise<AccessTokenResponse> {
    const { backend } = this.options;
    const cookie = getCookies(req);
    const token = cookie.get('token');
    const authorization = `Bearer ${token}`;
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      authorization: authorization,
    };
    const response = await fetch(`${backend.scheme}://${backend.domain}:${backend.port}/auth/social-token/connect`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        provider: this.options.provider,
        accessToken: socialToken,
      }),
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error('Unabled to create access token');
    }

    return responseBody;
  }
}
