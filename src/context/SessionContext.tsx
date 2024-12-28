/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the session context.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 22/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import React from 'react';

/* Relative Imports */
import { PAGE_ROOT } from 'routes/paths';
import {
  getAccessToken,
  isValidToken,
  removeAccessToken,
  setAccessToken
} from 'helper/authHelper';
import { getProfileRequest } from 'services/account';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used for session state.
 *
 * @interface ISessionState
 * @property {boolean} isAuthenticated - is authenticated for session state.
 * @property {string|null} authToken - authToken for session state.
 * @property {any|null} user - user for session state.
 * @property {string|null} primaryAccessRole - primaryAccessRole for session state.
 * @property {boolean} isPageLoaded - is Page Loaded for session state.
 * @property {func} LoginUser - login user function for session state.
 * @property {func} LogoutUser - logout user function for session state.
 * @property {func} updateProfilePicture - set profile picture function of user for session state.
 */
export interface ISessionState {
  isAuthenticated: boolean;
  authToken: string | null;
  user: any | null;
  primaryAccessRole: string | null;
  isPageLoaded: boolean | null;
  LoginUser: (token: string, rememberMe: boolean) => void;
  LogoutUser: () => void;
  updateProfilePicture: (profilephoto: string) => void;
}

/**
 * Interface used to define session provider.
 *
 * @interface ISessionProps
 * @property {node} children - contains data or component.
 */
export interface ISessionProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/* Initial State */
const initialState: ISessionState = {
  isAuthenticated: false,
  authToken: null,
  isPageLoaded: true,
  user: null,
  primaryAccessRole: null,
  LoginUser: async () => {},
  LogoutUser: () => {},
  updateProfilePicture: () => {}
};

/* Create Context */
const SessionContext = React.createContext<ISessionState>(initialState);

// ----------------------------------------------------------------------

class Session extends React.Component<ISessionProps, ISessionState> {
  /* Constructor */
  constructor(props: ISessionProps) {
    super(props);

    const accessToken: any = getAccessToken();
    const user = isValidToken(accessToken);

    this.state = {
      isAuthenticated: Boolean(accessToken && user),
      authToken: accessToken,
      user: null,
      primaryAccessRole: null,
      isPageLoaded: true,
      LoginUser: async (token, rememberMe) => {
        localStorage.setItem('updateDialogBox', 'open');
        setAccessToken(token, rememberMe);
        this.setState((prevState) => ({
          ...prevState,
          isAuthenticated: true,
          authToken: token
        }));
        await this.getUserProfile();
      },
      LogoutUser: () => {
        localStorage.removeItem('updateDialogBox');
        removeAccessToken();
        URL.revokeObjectURL(this.state.user.profile_photo);
        this.setState((prevState) => ({
          ...prevState,
          isAuthenticated: false,
          authToken: null,
          user: null,
          primaryAccessRole: null
        }));
        window.location.href = PAGE_ROOT.signIn.absolutePath;
      },
      updateProfilePicture: (profilePicture) => {
        this.setState((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            profile_photo: profilePicture
          }
        }));
      }
    };
  }

  componentDidMount(): void {
    if (this.state.authToken) {
      this.getUserProfile();
    } else {
      this.setState((prevState) => ({
        ...prevState,
        isPageLoaded: false
      }));
    }
  }

  async getUserProfile(): Promise<void> {
    try {
      const response: any = await getProfileRequest(this.state.authToken || '');
      if (response?.status.response_code === 200 && response?.user) {
        const rolesArray = response.user.profile.roles;
        let primaryRole = '';
        if (rolesArray.some((x: any) => x.name.toLowerCase() === 'admin')) {
          primaryRole = 'admin';
        } else if (
          rolesArray.some(
            (x: any) => x.name.toLowerCase() === 'content manager'
          )
        ) {
          primaryRole = 'contentManager';
        } else {
          primaryRole = 'user';
        }
        this.setState((prevState) => ({
          ...prevState,
          user: response.user,
          primaryAccessRole: primaryRole,
          isPageLoaded: false
        }));
      }
    } catch (error) {
      this.state.LogoutUser();
      this.setState((prevState) => ({
        ...prevState,
        isPageLoaded: false
      }));
    }
  }

  /* Output */
  render(): JSX.Element {
    return (
      <SessionContext.Provider value={this.state}>
        {!this.state.isPageLoaded && this.props.children}
      </SessionContext.Provider>
    );
  }
}

export default SessionContext;
export const SessionProvider = Session;
export const SessionConsumer = SessionContext.Consumer;
