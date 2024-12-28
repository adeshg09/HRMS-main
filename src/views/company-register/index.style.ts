/**
 * @copyright @2022 Techechelons Infosolutions Pvt. Ltd. All rights reserved.
 * @description Page to create styles for sign in page and components.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 23/Nov/2022
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/**
 * Style object for sign in page and components
 *
 * @returns {object}
 */
export default {
  rootStyle: (theme: any) => ({
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3, 0),
    borderRadius: `${theme.shape.borderRadius}px`,
    boxShadow: theme.customShadows.z8
  }),
  formGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  boxSubtitleStyle: (theme: any) => ({
    color: theme.palette.text.secondary
  }),

  mainBox: {
    maxWidth: 800,
    margin: '16px auto 0'
  },
  actionItems: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1
  },
  addButton: {
    display: 'flex',
    marginTop: 'auto'
  },
  button: (theme: any) => ({
    margin: theme.spacing(1)
  }),
  mbottom: (theme: any) => ({
    marginBottom: theme.spacing(3)
  }),
  viewItemTitle: (theme: any) => ({
    // color: theme.palette.common.white
  }),

  viewItemBody: (theme: any) => ({
    // color: theme.palette.text.primary
  }),
  viewItemDescriptionBody: {
    '& p': { padding: 0, margin: 0 }
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical'
  },
  viewPopover: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100vh'
    // width: 'auto',
    // height: 'auto'
  },
  popoverView: {
    my: 1.5,
    px: 2.5,
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'column'
  },
  popoverMainBox: {
    overflowY: 'auto'
  },
  closePopover: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  formControlLabel: {
    marginLeft: 0
  },
  tableProfileAvatar: {
    m: 'auto'
  },
  tableFormControlLabel: {
    m: 0
  },
  textMultilineInputStyle: {
    padding: '13.5px 14px',
    // '.MuiInputBase-root': {
    //   padding: 0,
    //   '.MuiOutlinedInput-root': {
    //     padding: 0
    //   }
    // },
    // '& .MuiOutlinedInput-root': {
    //   padding: 0
    // },
    '.MuiOutlinedInput-input': {
      padding: 0
      // margin: '13.5px 0px 13.5px 14px'
      // margin: 0
    }
  }
};
