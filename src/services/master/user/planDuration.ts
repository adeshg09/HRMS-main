/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to define the services related to plan duration for user module.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 21/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const getPlanDurationByIdRequest = (
  planDurationId: number
): Promise<any> => {
  return axiosInstance
    .get(
      `/user/master/planDuration/GetPlanDurationByIdUserModule/${planDurationId}`
    )
    .then((response) => response.data);
};

export const getPlanDurationsRequest = (): Promise<any> => {
  return axiosInstance
    .get('/user/master/planDuration/GetPlanDurationsUserModule')
    .then((response) => response.data);
};
